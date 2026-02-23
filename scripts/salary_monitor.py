#!/usr/bin/env python3
from __future__ import annotations  # Python 3.9 compat for type hints

"""
SalaryPrep — Salary Data Staleness Monitor
============================================
Checks 300+ companies for updated salary data across public sources.
Flags companies as STALE (newer date found) or NEEDS_UPDATE (content changed >10%).
Outputs stale_companies.csv so you only spend AI tokens on companies that actually changed.

Usage:
    pip install playwright beautifulsoup4 requests
    playwright install chromium
    python salary_monitor.py                          # Run full scan
    python salary_monitor.py --companies google,amazon # Scan specific companies
    python salary_monitor.py --generate-csv           # Generate companies.csv from research/
    python salary_monitor.py --dry-run                # Show what would be checked without fetching

Data Sources (checked in order, first hit wins):
    1. levels.fyi  — Tech company salary data (JS-rendered, needs Playwright)
    2. h1bdata.info — H1B visa salary filings (static HTML, BeautifulSoup)
    3. glassdoor.com — Salary estimates (JS-rendered, Playwright)
    4. comparably.com — Salary data (static, BeautifulSoup)

No AI tokens used. Zero Anthropic API calls. Pure web scraping + diffing.
"""

import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
from datetime import datetime, timedelta
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import quote

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
RESEARCH_DIR = PROJECT_ROOT / "research"
COMPANIES_CSV = SCRIPT_DIR / "companies.csv"
TRACKING_DB = SCRIPT_DIR / "tracking_db.json"
OUTPUT_CSV = SCRIPT_DIR / "stale_companies.csv"

# How old data can be before it's considered "worth checking" (days)
CHECK_INTERVAL_DAYS = 14

# Content change threshold (0-1). If page content differs by more than this, flag it.
# Stored in a list so it can be overridden by CLI args without `global`.
_CONFIG = {"content_change_threshold": 0.10}  # 10%

# Max concurrent pages for Playwright
MAX_CONCURRENT = 5

# Request timeout (seconds)
TIMEOUT = 30

# User agent for requests
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)

# ---------------------------------------------------------------------------
# Data Source Definitions
# ---------------------------------------------------------------------------

# Each source defines how to construct URLs, extract dates, and extract salary text.
# "renderer" is either "playwright" (JS-rendered) or "bs4" (static HTML).

SOURCES = {
    "levels_fyi": {
        "name": "Levels.fyi",
        "url_template": "https://www.levels.fyi/companies/{slug}/salaries",
        "renderer": "playwright",
        "date_patterns": [
            r"Updated\s+(\w+\s+\d{1,2},?\s+\d{4})",
            r"Last\s+updated:?\s*(\w+\s+\d{1,2},?\s+\d{4})",
            r"(\d{4}-\d{2}-\d{2})",
        ],
        "content_selector": "main, [class*='salary'], [class*='compensation'], [class*='total-comp']",
        "slug_transform": "lowercase_hyphen",  # google, meta, amazon
    },
    "h1bdata": {
        "name": "H1B Data",
        "url_template": "https://h1bdata.info/index.php?em={slug}&job=&city=&year=2025",
        "renderer": "bs4",
        "date_patterns": [
            r"Case\s+Certified.*?(\d{2}/\d{2}/\d{4})",
            r"(\d{4}-\d{2}-\d{2})",
            r"Certified Date.*?(\d{2}/\d{2}/\d{4})",
        ],
        "content_selector": "table, .results",
        "slug_transform": "title_case_plus",  # Google, Meta, Amazon
    },
    "comparably": {
        "name": "Comparably",
        "url_template": "https://www.comparably.com/companies/{slug}/salaries",
        "renderer": "bs4",
        "date_patterns": [
            r"Updated\s+(\w+\s+\d{1,2},?\s+\d{4})",
            r"as of\s+(\w+\s+\d{4})",
        ],
        "content_selector": ".salary-data, .compensation, main",
        "slug_transform": "lowercase_hyphen",
    },
    "glassdoor": {
        "name": "Glassdoor",
        "url_template": "https://www.glassdoor.com/Salary/{slug}-Salaries-E{eid}.htm",
        "renderer": "playwright",
        "date_patterns": [
            r"Updated\s+(\w+\s+\d{1,2},?\s+\d{4})",
            r"Last\s+updated\s+(\w+\s+\d{4})",
        ],
        "content_selector": "[class*='salary'], [class*='compensation'], main",
        "slug_transform": "title_case",
        # Glassdoor needs employer IDs — skip if not in CSV
        "requires_eid": True,
    },
}

# Default sources to check (in order). Glassdoor excluded by default (needs EIDs).
DEFAULT_SOURCES = ["levels_fyi", "h1bdata", "comparably"]


# ---------------------------------------------------------------------------
# Slug Transforms
# ---------------------------------------------------------------------------

def slug_lowercase_hyphen(company_name: str) -> str:
    """google, jp-morgan-chase, meta"""
    return re.sub(r"[^a-z0-9]+", "-", company_name.lower()).strip("-")


def slug_title_case(company_name: str) -> str:
    """Google, JP Morgan Chase"""
    return company_name.replace("-", " ").title()


def slug_title_case_plus(company_name: str) -> str:
    """Google+LLC, JP+Morgan+Chase — for URL query params"""
    return quote(company_name.replace("-", " ").title())


SLUG_TRANSFORMS = {
    "lowercase_hyphen": slug_lowercase_hyphen,
    "title_case": slug_title_case,
    "title_case_plus": slug_title_case_plus,
}


# ---------------------------------------------------------------------------
# Tracking Database
# ---------------------------------------------------------------------------

def load_tracking_db() -> dict:
    """Load the tracking database (JSON file storing last_checked dates and content hashes)."""
    if TRACKING_DB.exists():
        with open(TRACKING_DB) as f:
            return json.load(f)
    return {}


def save_tracking_db(db: dict):
    """Save the tracking database."""
    with open(TRACKING_DB, "w") as f:
        json.dump(db, f, indent=2, default=str)


# ---------------------------------------------------------------------------
# CSV Generation (from research/ directory)
# ---------------------------------------------------------------------------

def generate_companies_csv():
    """Generate companies.csv from the research/ directory structure."""
    if not RESEARCH_DIR.exists():
        print(f"ERROR: Research directory not found at {RESEARCH_DIR}")
        sys.exit(1)

    companies = []
    for company_dir in sorted(RESEARCH_DIR.iterdir()):
        if company_dir.is_dir() and not company_dir.name.startswith("."):
            slug = company_dir.name
            # Convert slug to display name
            display_name = slug.replace("-", " ").title()
            # Count roles
            roles = [f.stem for f in company_dir.glob("*.md")]
            role_count = len(roles)

            # Build default source URLs
            levels_url = f"https://www.levels.fyi/companies/{slug}/salaries"
            h1b_url = f"https://h1bdata.info/index.php?em={quote(display_name)}&job=&city=&year=2025"

            companies.append({
                "slug": slug,
                "name": display_name,
                "role_count": role_count,
                "levels_fyi_url": levels_url,
                "h1b_url": h1b_url,
                "glassdoor_eid": "",  # User fills in manually if desired
                "custom_url": "",
            })

    with open(COMPANIES_CSV, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "slug", "name", "role_count", "levels_fyi_url",
            "h1b_url", "glassdoor_eid", "custom_url",
        ])
        writer.writeheader()
        writer.writerows(companies)

    print(f"Generated {COMPANIES_CSV} with {len(companies)} companies.")
    return companies


# ---------------------------------------------------------------------------
# Content Fetching — BeautifulSoup (static HTML)
# ---------------------------------------------------------------------------

def fetch_with_bs4(url: str, content_selector: str) -> dict:
    """Fetch a static page with requests + BeautifulSoup. Returns page text and raw HTML."""
    import requests
    from bs4 import BeautifulSoup

    try:
        resp = requests.get(
            url,
            headers={"User-Agent": USER_AGENT},
            timeout=TIMEOUT,
            allow_redirects=True,
        )
        if resp.status_code == 404:
            return {"status": "not_found", "text": "", "html": ""}
        if resp.status_code == 403:
            return {"status": "blocked", "text": "", "html": ""}
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        # Extract text from the content selector
        text_parts = []
        for selector in content_selector.split(","):
            selector = selector.strip()
            for el in soup.select(selector):
                text_parts.append(el.get_text(separator=" ", strip=True))

        # Fallback: get body text if no selector matched
        if not text_parts:
            body = soup.find("body")
            if body:
                text_parts.append(body.get_text(separator=" ", strip=True))

        combined_text = "\n".join(text_parts)
        return {
            "status": "ok",
            "text": combined_text,
            "html": resp.text,
        }

    except requests.exceptions.Timeout:
        return {"status": "timeout", "text": "", "html": ""}
    except requests.exceptions.ConnectionError:
        return {"status": "connection_error", "text": "", "html": ""}
    except Exception as e:
        return {"status": f"error: {e}", "text": "", "html": ""}


# ---------------------------------------------------------------------------
# Content Fetching — Playwright (JS-rendered)
# ---------------------------------------------------------------------------

def fetch_with_playwright_batch(urls_and_selectors: list[tuple[str, str, str]]) -> dict:
    """
    Fetch multiple JS-rendered pages with Playwright.
    Input: list of (key, url, content_selector) tuples.
    Returns: dict of key -> {status, text, html}
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("WARNING: Playwright not installed. Skipping JS-rendered sources.")
        print("  Install with: pip install playwright && playwright install chromium")
        return {key: {"status": "playwright_missing", "text": "", "html": ""}
                for key, _, _ in urls_and_selectors}

    results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1280, "height": 800},
        )

        for key, url, content_selector in urls_and_selectors:
            page = None
            try:
                page = context.new_page()
                page.goto(url, timeout=TIMEOUT * 1000, wait_until="networkidle")

                # Wait a bit for dynamic content
                page.wait_for_timeout(2000)

                # Extract text from selectors
                text_parts = []
                for selector in content_selector.split(","):
                    selector = selector.strip()
                    elements = page.query_selector_all(selector)
                    for el in elements:
                        txt = el.inner_text()
                        if txt:
                            text_parts.append(txt.strip())

                # Fallback
                if not text_parts:
                    text_parts.append(page.inner_text("body") or "")

                html = page.content()
                combined_text = "\n".join(text_parts)

                results[key] = {
                    "status": "ok",
                    "text": combined_text,
                    "html": html,
                }

            except Exception as e:
                err_str = str(e)
                if "404" in err_str or "not found" in err_str.lower():
                    results[key] = {"status": "not_found", "text": "", "html": ""}
                elif "timeout" in err_str.lower():
                    results[key] = {"status": "timeout", "text": "", "html": ""}
                else:
                    results[key] = {"status": f"error: {err_str[:100]}", "text": "", "html": ""}
            finally:
                if page:
                    page.close()

            # Rate limiting between pages
            time.sleep(1)

        browser.close()

    return results


# ---------------------------------------------------------------------------
# Date Extraction
# ---------------------------------------------------------------------------

DATE_FORMATS = [
    "%B %d, %Y",    # February 12, 2026
    "%B %d %Y",     # February 12 2026
    "%b %d, %Y",    # Feb 12, 2026
    "%b %d %Y",     # Feb 12 2026
    "%Y-%m-%d",     # 2026-02-12
    "%m/%d/%Y",     # 02/12/2026
    "%B %Y",        # February 2026
    "%b %Y",        # Feb 2026
]


def extract_date(text: str, patterns: list[str]) -> datetime | None:
    """Try to extract a date from text using the given regex patterns."""
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            match_clean = match.strip().rstrip(",")
            for fmt in DATE_FORMATS:
                try:
                    return datetime.strptime(match_clean, fmt)
                except ValueError:
                    continue
    return None


# ---------------------------------------------------------------------------
# Content Hashing & Diffing
# ---------------------------------------------------------------------------

def normalize_text(text: str) -> str:
    """Normalize text for comparison — strip whitespace, lowercase, remove noise."""
    # Remove common noise: navigation, footers, ads
    noise_patterns = [
        r"cookie[s]?\s+policy.*",
        r"privacy\s+policy.*",
        r"terms\s+of\s+(service|use).*",
        r"sign\s+(up|in).*",
        r"copyright\s+\d{4}.*",
        r"\b(advertisement|sponsored)\b.*",
    ]
    cleaned = text.lower()
    for pat in noise_patterns:
        cleaned = re.sub(pat, "", cleaned, flags=re.IGNORECASE)

    # Collapse whitespace
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def content_hash(text: str) -> str:
    """SHA256 hash of normalized text."""
    return hashlib.sha256(normalize_text(text).encode()).hexdigest()


def content_similarity(old_text: str, new_text: str) -> float:
    """
    Returns similarity ratio (0.0 to 1.0) between old and new text.
    1.0 = identical, 0.0 = completely different.
    """
    old_norm = normalize_text(old_text)
    new_norm = normalize_text(new_text)

    if not old_norm or not new_norm:
        return 0.0

    # For very long texts, compare chunks to avoid O(n^2) on huge pages
    if len(old_norm) > 10000 or len(new_norm) > 10000:
        # Compare first 5000 and last 5000 chars
        sim1 = SequenceMatcher(None, old_norm[:5000], new_norm[:5000]).ratio()
        sim2 = SequenceMatcher(None, old_norm[-5000:], new_norm[-5000:]).ratio()
        return (sim1 + sim2) / 2

    return SequenceMatcher(None, old_norm, new_norm).ratio()


def extract_salary_numbers(text: str) -> list[int]:
    """Extract salary-like numbers from text (e.g., $150,000 or 159,000 or $150K)."""
    numbers = []

    # Match $XXX,XXX or $XXX,XXX,XXX
    for match in re.finditer(r"\$\s*([\d,]+)", text):
        try:
            num = int(match.group(1).replace(",", ""))
            if 20000 < num < 2000000:  # Reasonable salary range
                numbers.append(num)
        except ValueError:
            pass

    # Match $XXXK
    for match in re.finditer(r"\$\s*(\d+)[Kk]", text):
        try:
            num = int(match.group(1)) * 1000
            if 20000 < num < 2000000:
                numbers.append(num)
        except ValueError:
            pass

    # Match plain numbers like 159,000 (common in H1B data tables)
    # Only if we haven't found any $ amounts yet
    if not numbers:
        for match in re.finditer(r"\b(\d{2,3},\d{3})\b", text):
            try:
                num = int(match.group(1).replace(",", ""))
                if 30000 < num < 1000000:  # Salary range for plain numbers
                    numbers.append(num)
            except ValueError:
                pass

    return sorted(set(numbers))


# ---------------------------------------------------------------------------
# Main Monitor Logic
# ---------------------------------------------------------------------------

def check_company(
    company: dict,
    db_entry: dict,
    sources: list[str],
    playwright_batch: list,
) -> dict:
    """
    Check a single company across sources. Returns a result dict.
    db_entry is a mutable dict (db[slug]) — writes to it persist in the tracking DB.
    For Playwright sources, appends to playwright_batch for later batch processing.
    For BS4 sources, fetches immediately.
    """
    slug = company["slug"]
    name = company["name"]

    result = {
        "slug": slug,
        "name": name,
        "status": "current",  # Will be updated if stale
        "reasons": [],
        "sources_checked": [],
        "date_found": None,
        "content_change_pct": 0,
        "salary_numbers_changed": False,
        "old_salary_numbers": [],
        "new_salary_numbers": [],
    }

    for source_key in sources:
        source = SOURCES[source_key]

        # Skip glassdoor if no EID
        if source.get("requires_eid") and not company.get("glassdoor_eid"):
            continue

        # Build URL
        transform_fn = SLUG_TRANSFORMS[source["slug_transform"]]
        url_slug = transform_fn(slug)

        url = source["url_template"].format(
            slug=url_slug,
            eid=company.get("glassdoor_eid", ""),
        )

        # Check if we should skip (checked recently)
        last_checked_key = f"{source_key}_last_checked"
        last_checked_str = db_entry.get(last_checked_key)
        if last_checked_str:
            try:
                last_checked = datetime.fromisoformat(last_checked_str)
                if datetime.now() - last_checked < timedelta(days=CHECK_INTERVAL_DAYS):
                    result["sources_checked"].append(f"{source['name']} (skipped: recent)")
                    continue
            except (ValueError, TypeError):
                pass

        if source["renderer"] == "playwright":
            # Queue for batch processing
            batch_key = f"{slug}|{source_key}"
            playwright_batch.append((batch_key, url, source["content_selector"]))
            result["sources_checked"].append(f"{source['name']} (queued)")
        else:
            # Fetch with BS4 immediately
            fetch_result = fetch_with_bs4(url, source["content_selector"])
            result["sources_checked"].append(
                f"{source['name']} ({fetch_result['status']})"
            )

            if fetch_result["status"] == "ok" and fetch_result["text"]:
                analyze_content(
                    result, db_entry, source_key, source,
                    fetch_result["text"], slug
                )

    return result


def analyze_content(
    result: dict,
    db_entry: dict,
    source_key: str,
    source: dict,
    new_text: str,
    slug: str,
):
    """Analyze fetched content for date changes and content diffs."""

    # 1. Check for date
    page_date = extract_date(new_text, source["date_patterns"])
    if page_date:
        result["date_found"] = page_date.isoformat()

        # Compare with our last_checked
        last_checked_str = db_entry.get(f"{source_key}_last_checked")
        if last_checked_str:
            try:
                last_checked = datetime.fromisoformat(last_checked_str)
                if page_date > last_checked:
                    result["status"] = "STALE"
                    result["reasons"].append(
                        f"Newer date on {source['name']}: "
                        f"{page_date.strftime('%Y-%m-%d')} > {last_checked.strftime('%Y-%m-%d')}"
                    )
            except (ValueError, TypeError):
                pass

    # 2. Check content change
    old_hash = db_entry.get(f"{source_key}_content_hash", "")
    new_hash = content_hash(new_text)

    if old_hash and old_hash != new_hash:
        old_text = db_entry.get(f"{source_key}_content_preview", "")
        if old_text:
            similarity = content_similarity(old_text, new_text)
            change_pct = 1.0 - similarity
            result["content_change_pct"] = max(
                result["content_change_pct"], round(change_pct * 100, 1)
            )

            if change_pct > _CONFIG["content_change_threshold"]:
                if result["status"] != "STALE":
                    result["status"] = "NEEDS_UPDATE"
                result["reasons"].append(
                    f"Content changed {change_pct:.0%} on {source['name']}"
                )

    # 3. Check salary numbers specifically
    old_salaries = db_entry.get(f"{source_key}_salary_numbers", [])
    new_salaries = extract_salary_numbers(new_text)
    if old_salaries and new_salaries and set(old_salaries) != set(new_salaries):
        result["salary_numbers_changed"] = True
        result["old_salary_numbers"] = old_salaries
        result["new_salary_numbers"] = new_salaries
        if result["status"] == "current":
            result["status"] = "NEEDS_UPDATE"
        result["reasons"].append(
            f"Salary numbers changed on {source['name']}: "
            f"{len(new_salaries)} values found vs {len(old_salaries)} previously"
        )

    # Update tracking DB entry (will be saved later)
    db_entry[f"{source_key}_last_checked"] = datetime.now().isoformat()
    db_entry[f"{source_key}_content_hash"] = new_hash
    # Store first 5000 chars for future diff comparison
    db_entry[f"{source_key}_content_preview"] = new_text[:5000]
    db_entry[f"{source_key}_salary_numbers"] = new_salaries[:50]  # Cap at 50


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def write_stale_csv(results: list[dict]):
    """Write stale_companies.csv with only the flagged companies."""
    stale = [r for r in results if r["status"] in ("STALE", "NEEDS_UPDATE")]

    if not stale:
        print("\nNo stale companies found. All data appears current.")
        # Write empty CSV with headers
        with open(OUTPUT_CSV, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                "slug", "name", "status", "reasons",
                "content_change_pct", "salary_numbers_changed",
                "date_found", "sources_checked",
            ])
        return

    # Sort: STALE first, then NEEDS_UPDATE, then by content change %
    stale.sort(key=lambda r: (
        0 if r["status"] == "STALE" else 1,
        -r["content_change_pct"],
    ))

    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "slug", "name", "status", "reasons",
            "content_change_pct", "salary_numbers_changed",
            "date_found", "sources_checked",
        ])
        for r in stale:
            writer.writerow([
                r["slug"],
                r["name"],
                r["status"],
                " | ".join(r["reasons"]),
                f"{r['content_change_pct']}%",
                r["salary_numbers_changed"],
                r["date_found"] or "",
                " | ".join(r["sources_checked"]),
            ])

    print(f"\nWrote {len(stale)} stale companies to {OUTPUT_CSV}")


def print_summary(results: list[dict]):
    """Print a summary of the scan results."""
    total = len(results)
    stale = sum(1 for r in results if r["status"] == "STALE")
    needs_update = sum(1 for r in results if r["status"] == "NEEDS_UPDATE")
    current = sum(1 for r in results if r["status"] == "current")
    errors = sum(1 for r in results if "error" in str(r.get("sources_checked", [])).lower())

    print("\n" + "=" * 60)
    print("SALARY DATA MONITOR — SCAN RESULTS")
    print("=" * 60)
    print(f"  Total companies scanned:  {total}")
    print(f"  STALE (newer date found): {stale}")
    print(f"  NEEDS_UPDATE (>10% diff): {needs_update}")
    print(f"  Current (no changes):     {current}")
    if errors:
        print(f"  Errors/timeouts:          {errors}")
    print(f"\n  Output: {OUTPUT_CSV}")
    print("=" * 60)

    if stale + needs_update > 0:
        print(f"\n  >> {stale + needs_update} companies need attention.")
        print(f"  >> Estimated AI cost to update: ~${(stale + needs_update) * 0.15:.2f}")
        print(f"     (vs ~${total * 0.15:.2f} to update all {total})")
        print(f"  >> Savings: ~{((total - stale - needs_update) / total) * 100:.0f}%\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Monitor 300+ companies for salary data changes"
    )
    parser.add_argument(
        "--generate-csv",
        action="store_true",
        help="Generate companies.csv from the research/ directory",
    )
    parser.add_argument(
        "--companies",
        type=str,
        help="Comma-separated list of company slugs to check (default: all)",
    )
    parser.add_argument(
        "--sources",
        type=str,
        default=",".join(DEFAULT_SOURCES),
        help=f"Comma-separated sources to check (default: {','.join(DEFAULT_SOURCES)})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be checked without fetching",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Ignore CHECK_INTERVAL_DAYS and re-check everything",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=_CONFIG["content_change_threshold"] * 100,
        help=f"Content change threshold %% (default: {_CONFIG['content_change_threshold'] * 100}%%)",
    )

    args = parser.parse_args()

    # Override threshold from CLI
    _CONFIG["content_change_threshold"] = args.threshold / 100

    # Generate CSV mode
    if args.generate_csv:
        generate_companies_csv()
        return

    # Load or generate companies list
    if not COMPANIES_CSV.exists():
        print(f"Companies CSV not found. Generating from {RESEARCH_DIR}...")
        generate_companies_csv()

    # Read companies
    with open(COMPANIES_CSV) as f:
        reader = csv.DictReader(f)
        companies = list(reader)

    # Filter if --companies specified
    if args.companies:
        filter_slugs = set(s.strip() for s in args.companies.split(","))
        companies = [c for c in companies if c["slug"] in filter_slugs]
        if not companies:
            print(f"ERROR: No matching companies found for: {args.companies}")
            sys.exit(1)

    sources = [s.strip() for s in args.sources.split(",")]
    print(f"Scanning {len(companies)} companies across {len(sources)} sources...")
    print(f"Sources: {', '.join(SOURCES[s]['name'] for s in sources if s in SOURCES)}")

    if args.dry_run:
        print("\n[DRY RUN] Would check these companies:")
        for c in companies:
            print(f"  - {c['name']} ({c['slug']})")
        print(f"\nTotal: {len(companies)} companies x {len(sources)} sources")
        return

    # Load tracking database
    db = load_tracking_db()

    if args.force:
        # Clear all last_checked dates to force re-check
        for slug_data in db.values():
            for key in list(slug_data.keys()):
                if key.endswith("_last_checked"):
                    del slug_data[key]

    # Process companies
    results = []
    playwright_batch = []  # (key, url, selector) tuples for batch Playwright fetching

    print(f"\nPhase 1: Checking static sources (BS4)...")
    for i, company in enumerate(companies):
        slug = company["slug"]
        if slug not in db:
            db[slug] = {}

        result = check_company(company, db[slug], sources, playwright_batch)
        results.append(result)

        # Progress indicator
        if (i + 1) % 25 == 0:
            print(f"  Checked {i + 1}/{len(companies)} companies...")

        # Rate limiting for BS4 requests
        time.sleep(0.5)

    # Phase 2: Batch process Playwright URLs
    if playwright_batch:
        print(f"\nPhase 2: Fetching {len(playwright_batch)} JS-rendered pages (Playwright)...")
        pw_results = fetch_with_playwright_batch(playwright_batch)

        # Process Playwright results
        for batch_key, fetch_result in pw_results.items():
            slug, source_key = batch_key.split("|", 1)
            source = SOURCES[source_key]

            # Find the result dict for this company
            result = next((r for r in results if r["slug"] == slug), None)
            if not result:
                continue

            # Update source status
            for i, src in enumerate(result["sources_checked"]):
                if "(queued)" in src:
                    result["sources_checked"][i] = (
                        f"{source['name']} ({fetch_result['status']})"
                    )
                    break

            if fetch_result["status"] == "ok" and fetch_result["text"]:
                analyze_content(
                    result, db[slug], source_key, source,
                    fetch_result["text"], slug,
                )

    # Save tracking database
    save_tracking_db(db)

    # Write output
    write_stale_csv(results)
    print_summary(results)


if __name__ == "__main__":
    main()
