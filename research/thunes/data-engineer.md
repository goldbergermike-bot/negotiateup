---
company: thunes
company_display: Thunes
role: data-engineer
role_display: Data Engineer
role_type: standard
last_updated: 2026-02-23
data_quality: high
salary_data_quarter: 2025-Q4
next_review_due: 2026-05-23
compensation:
  - region: ":singapore: Singapore (SGD)"
    base_low: 115000
    base_high: 170000
    stock_low: 55000
    stock_high: 110000
    bonus_pct: null
    total_comp_low: 170000
    total_comp_high: 280000
    currency: SGD
  - region: ":gb: London (GBP)"
    base_low: 68000
    base_high: 108000
    stock_low: 35000
    stock_high: 65000
    bonus_pct: null
    total_comp_low: 103000
    total_comp_high: 173000
    currency: GBP
  - region: ":us: New York (USD)"
    base_low: 130000
    base_high: 190000
    stock_low: 60000
    stock_high: 125000
    bonus_pct: null
    total_comp_low: 190000
    total_comp_high: 315000
    currency: USD
level_mapping:
  internal: null
data_sources:
  - Levels.fyi
  - Glassdoor
negotiation_dna_summary: "This guide decodes Thunes' Interoperability mandate, translating the Feb 2026 Swift Direct Global Network link into a data engineering compensation framework spanning Singapore, London, and New York markets."
---
### Data Engineer — Thunes Salary Negotiation Guide

**Negotiation DNA**: This guide decodes Thunes' Interoperability mandate, translating the Feb 2026 Swift Direct Global Network link into a data engineering compensation framework spanning Singapore, London, and New York markets.

---

#### Compensation Benchmarks (2025-2026)

| Region | Base Salary | Options (4yr) | Total Comp |
|--------|-------------|--------------|------------|
| :singapore: Singapore (SGD) | S$115,000 – S$170,000 | S$55,000 – S$110,000 | S$170,000 – S$280,000 |
| :gb: London (GBP) | £68,000 – £108,000 | £35,000 – £65,000 | £103,000 – £173,000 |
| :us: New York (USD) | $130,000 – $190,000 | $60,000 – $125,000 | $190,000 – $315,000 |

**Negotiation DNA**: Data Engineers at Thunes build the pipelines that capture, transform, and deliver transaction data from a cross-border payment network spanning 130+ countries and 4B+ mobile wallets. This is not typical data engineering — every pipeline must handle real-time payment events from heterogeneous sources including bank transfer APIs, mobile money platforms (M-Pesa, GCash, bKash), digital wallets, and legacy SWIFT messaging. Thunes is the critical interoperability layer between old-world SWIFT and new-world instant payments, and the Data Engineer is the one who makes both worlds speak the same data language. The data must be reconciled, normalized, and made available for settlement, compliance reporting, fraud detection, and partner analytics — all in real time.

---

#### Level Mapping & Internal Benchmarking

| Thunes Level | Equivalent at TerraPay | Equivalent at Nium | Equivalent at Wise |
|-------------|----------------------|--------------------|--------------------|
| Data Engineer | Data Engineer | Data Engineer | Data Engineer |
| Senior DE | Senior DE | Senior DE | Senior Data Engineer |

Thunes Data Engineers work with more diverse data sources than peers at Wise or Nium. A single pipeline may need to ingest SWIFT MT messages, mobile money webhook events, and REST API responses — each with different schemas, reliability guarantees, and latency characteristics. This heterogeneity premium should factor into compensation expectations.

---

#### :link: Thunes Interoperability & Standards-Bearer Lever

The **Swift Direct Global Network link (Feb 2026)** creates a step-change in data engineering complexity. By connecting to Swift's infrastructure, Thunes adds SWIFT's ISO 20022 messaging data to its pipeline — a structured but fundamentally different data format from Thunes' native API events.

As a **Standards-Bearer** Data Engineer, you are building the data layer of the legacy-to-real-time bridge:
- Ingesting and transforming ISO 20022 structured messages alongside real-time API event streams
- Building reconciliation pipelines that match SWIFT settlement data with real-time payment confirmations
- Creating unified data models that normalize transactions across both legacy and modern protocols
- Ensuring data quality and completeness across the critical interoperability layer between old-world SWIFT and new-world instant payments

The interoperability mandate means building data pipelines that unify two fundamentally different data paradigms: batch-oriented SWIFT messaging and event-driven real-time payments. This dual-paradigm data engineering is the Standards-Bearer premium. Real-time settlement across 130+ countries and 4B+ mobile wallets generates data at a scale and diversity that demands world-class data engineering.

---

#### Global Levers

**Lever 1: Cross-Protocol Data Pipeline Expertise**
> "The Swift Direct Global Network link requires building data pipelines that ingest ISO 20022 structured messages and translate them into Thunes' event-driven data model. This is cross-protocol data engineering at the intersection of legacy banking systems and modern streaming architectures. This specialized pipeline work commands a premium over standard data engineering roles."

**Lever 2: Real-Time Financial Data at Scale**
> "Building real-time data pipelines for financial transactions across 130+ countries requires expertise in exactly-once processing, data consistency guarantees, and regulatory-grade audit trails. My experience with financial data pipelines directly addresses Thunes' most critical data infrastructure needs."

**Lever 3: Data Quality as Revenue Enabler**
> "At Thunes, data quality directly impacts settlement accuracy, compliance reporting, and partner analytics. Poor data quality means failed reconciliations, regulatory fines, and partner churn. My work in building reliable data infrastructure directly protects and grows revenue."

**Lever 4: Pre-IPO Data Infrastructure**
> "Data infrastructure quality — pipeline reliability, data freshness, reconciliation accuracy — is a core due diligence item for payments company valuations. The pipelines I build now will be scrutinized in any IPO readiness assessment. I would like an options package that reflects this foundational contribution."

---

> **Negotiate Up Strategy**: In Singapore, start at S$165,000 base with S$100,000 in options (4yr vesting) and accept no lower than S$130,000 base with S$65,000 in options. In London, start at £105,000 base with £60,000 in options and accept no lower than £78,000 base with £40,000 in options. In New York, start at $185,000 base with $115,000 in options and accept no lower than $145,000 base with $70,000 in options. Lead with the cross-protocol data pipeline argument — you are building the data layer that makes the SWIFT-to-real-time bridge actually work.

---

#### Evidence & Sources
- Thunes company profile, data infrastructure requirements, and network data (thunes.com)
- Swift Direct Global Network data integration specifications (Feb 2026)
- Glassdoor and Levels.fyi Data Engineer compensation data for Singapore, London, NYC fintech (2025)
- Wise, Nium, and TerraPay data engineering team compensation benchmarks
- ISO 20022 data format specifications and migration requirements
- Real-time payment data infrastructure best practices (Kafka, Flink, Spark Streaming benchmarks)
