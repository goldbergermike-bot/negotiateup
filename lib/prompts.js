// ============================================
// SalaryPrep — AI Prompt Templates
// ============================================
// Now supports injecting verified research data from our company database.
// When research is available, strict guardrails prevent hallucinated numbers.

/**
 * Build the research data block and accuracy instructions.
 * This is the core anti-hallucination mechanism.
 */
function buildResearchBlock(research) {
  if (!research) {
    return {
      researchSection: '',
      accuracyRules: `## DATA ACCURACY RULES
You do NOT have access to verified compensation data for this specific company and role.
Therefore you MUST follow these rules:
- For any salary ranges, percentiles, or compensation figures you provide, explicitly label them as "Estimated based on general market data"
- Do NOT present estimated figures as if they are verified or precise
- Use phrases like "Based on market trends for similar companies..." or "Typical ranges for this tier of company..."
- Do NOT invent specific vesting schedules, bonus structures, or signing bonus ranges — say "Verify with your recruiter" if you are not certain
- Do NOT fabricate company-specific negotiation tactics or policies — keep advice general
- Be transparent: include a note that this playbook uses general market intelligence rather than company-specific verified data`,
    };
  }

  // Extract content — support both old format (string) and new format (object with metadata)
  const content = typeof research.content === 'string' ? research.content : research.content;
  const metadata = research.metadata || null;

  // Data freshness check (when frontmatter metadata is available)
  let freshnessNote = '';
  if (metadata?.last_updated) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(metadata.last_updated)) / (1000 * 60 * 60 * 24)
    );
    const quarter = metadata.salary_data_quarter || 'unknown quarter';
    if (daysSinceUpdate > 180) {
      freshnessNote = `\n**DATA FRESHNESS WARNING:** This data was last verified ${daysSinceUpdate} days ago. Some figures may have shifted. Label any salary ranges as "verified as of ${quarter}" and recommend the user verify current ranges with their recruiter.\n`;
    } else if (daysSinceUpdate > 90) {
      freshnessNote = `\n**Note:** Data last verified ${daysSinceUpdate} days ago (${quarter}). Figures are current but approaching review cycle.\n`;
    }
  }

  // Data quality check (when frontmatter metadata is available)
  let qualityNote = '';
  if (metadata?.data_quality === 'low') {
    qualityNote = `\n**DATA CONFIDENCE NOTE:** Our data for this company/role is based on limited sources. Present salary ranges with the qualifier "Based on limited available data" and recommend the user cross-reference with Levels.fyi and Glassdoor for this specific company.\n`;
  } else if (metadata?.data_quality === 'medium') {
    qualityNote = `\n**DATA CONFIDENCE:** Moderate — based on 2-3 verified sources. Figures are directionally accurate but may not capture the latest adjustments.\n`;
  }

  return {
    researchSection: `## VERIFIED COMPANY INTELLIGENCE DATABASE
**Source:** SalaryPrep Research Database (${research.company} / ${research.role})
**Match confidence:** ${research.companyConfidence}
${metadata?.last_updated ? `**Data last verified:** ${metadata.last_updated}` : ''}
${metadata?.data_quality ? `**Data quality:** ${metadata.data_quality}` : ''}
${freshnessNote}${qualityNote}
THE FOLLOWING DATA IS VERIFIED AND RESEARCHED. Use it as your PRIMARY source for all compensation figures, ranges, vesting schedules, negotiation strategies, and company-specific advice.

--- BEGIN VERIFIED DATA ---
${content}
--- END VERIFIED DATA ---`,

    accuracyRules: `## DATA ACCURACY RULES — CRITICAL
You have been provided VERIFIED company intelligence above. You MUST follow these rules strictly:

1. **USE ONLY the verified data** for compensation ranges, percentile figures, vesting schedules, signing bonus ranges, and level mappings. Do NOT substitute your own estimates when the verified data provides specific numbers.
2. **Quote ranges directly** from the verified data. When the data says "$140K-$180K", use exactly "$140K-$180K" — do not round, adjust, or "update" these figures.
3. **Do NOT invent data points** that are not in the verified database. If the verified data does not cover a specific comp component (e.g., relocation), say "Not covered in our data — verify with your recruiter" rather than guessing.
4. **Cite the source** when referencing verified data: "According to our research on [Company] compensation..."
5. **Clearly separate** verified facts from your analytical recommendations. Your strategic advice (what to counter with, scripts, timing) should BUILD ON the verified data but is clearly your recommendation.
6. **Level matching:** If the verified data includes level mappings, use them exactly. Do not invent additional level equivalencies.
7. **Vesting schedules:** If the verified data specifies a vesting schedule (e.g., Amazon's 5/15/40/40), present it exactly as documented. Do NOT default to "standard 4-year vest with 1-year cliff" when the company has a unique schedule.
8. **Negotiation strategies:** Incorporate the specific negotiation strategies and levers from the verified data. These are tailored to this company's actual practices.
9. **When the client's specific level/location is not in the data:** State which levels/locations ARE covered and extrapolate conservatively, labeling it: "Your specific [level/location] is not in our data. The closest match is [X], which shows [Y]. Your range may differ."
10. **Include a Data Confidence note** in the playbook: If data quality is high, say "This playbook is powered by verified compensation data for [Role] at [Company]." If medium/low, add appropriate caveats.`,
  };
}

export function getOfferPrompt(data, research) {
  const { researchSection, accuracyRules } = buildResearchBlock(research);

  return `You are an elite salary negotiation coach. Generate a comprehensive, personalized negotiation playbook.

${accuracyRules}

## CLIENT INFO
- Name: ${data.fullName}
- Experience: ${data.yearsExperience} years
- Current Salary: ${data.currentSalary || 'Not provided'}

## THE OFFER
- Company: ${data.companyName}
- Title: ${data.jobTitle}
- Location: ${data.location}
- Base Salary: ${data.offeredSalary}
- Equity/RSUs: ${data.offeredEquity || 'Not specified'}
- Bonus: ${data.offeredBonus || 'Not specified'}
- Signing Bonus: ${data.offeredSigningBonus || 'Not specified'}
- Other Details: ${data.additionalOfferDetails || 'None'}

## SITUATION
- Competing Offers: ${data.hasCompetingOffers}
${data.competingOfferDetails ? `- Details: ${data.competingOfferDetails}` : ''}
- Deadline: ${data.deadline || 'Not specified'}
- Biggest Concern: ${data.biggestConcern || 'Not specified'}

${data.resumeText ? `## RESUME\n${data.resumeText}` : ''}
${data.offerLetterText ? `## OFFER LETTER\n${data.offerLetterText}` : ''}
${data.jobListingText ? `## JOB LISTING\n${data.jobListingText}` : ''}

${researchSection}

## GENERATE THESE SECTIONS (be specific, use actual numbers, make scripts word-for-word ready):

### SECTION 1: EXECUTIVE SUMMARY
3-4 sentence overview of situation, opportunity, and recommended strategy.${research ? ' Reference specific data points from the verified intelligence.' : ''}

### SECTION 2: MARKET SALARY ANALYSIS
${research ? `Using the VERIFIED compensation data provided above:
- Present the exact ranges from our database for this role, level, and location
- Show where the client's offer falls within these verified ranges
- Calculate the specific gap between their offer and the market median/75th percentile
- Include total comp breakdown (base + equity + bonus + signing) using verified figures
- If the client's level or location is not exactly covered, state which data points you ARE using and note the extrapolation` : `- Market range (25th/50th/75th/90th percentile) for base salary for this role, company tier, location, experience
- Total comp estimates including equity and bonus
- How their offer compares to market
- Key factors affecting their market value
- NOTE: Label all figures as estimates based on general market data`}

### SECTION 3: YOUR LEVERAGE POINTS
- Strongest negotiating cards from their resume and situation
- What makes them specifically valuable to this employer
- Hidden leverage they may not realize
${research ? '- Leverage points informed by the company-specific negotiation intelligence provided above' : ''}

### SECTION 4: RECOMMENDED COUNTER-OFFER NUMBERS
Provide SPECIFIC numbers:
- Counter for base salary (with reasoning${research ? ' anchored to verified market data' : ''})
- Counter for equity, signing bonus, annual bonus
- "Stretch" target (best case)
- "Floor" target (walk-away point)
- Total comp comparison: current offer vs recommended counter
${research ? '- All counter-offer numbers MUST be grounded in the verified ranges. Do not recommend counters that exceed the documented top of band unless there is clear justification from competing offers or exceptional qualifications.' : ''}

### SECTION 5: NEGOTIATION SCRIPTS

**Script A: Initial Response (buying time)**
Exact words to acknowledge the offer and buy negotiation time.

**Script B: Counter-Offer Phone Call**
Complete script: opening, presenting the counter, justifying each ask, handling silence.
${research ? 'Incorporate company-specific negotiation strategies from the verified data into the script.' : ''}

**Script C: Counter-Offer Email**
Ready-to-send email template for written counter.

**Script D: Handling Pushback**
Word-for-word responses for:
- "This is our best offer"
- "The budget is set"
- "We can revisit after 6 months"
- "Other candidates accepted at this level"
- Any pushback specific to their concern: "${data.biggestConcern || 'general'}"

### SECTION 6: COMPANY INTELLIGENCE
${research ? `Using the VERIFIED company intelligence database provided above, present:
- Compensation structure and philosophy (from verified data)
- Specific negotiation levers that work at this company (from verified data)
- Vesting schedule details (if covered in verified data)
- Level mapping to peer companies (if covered in verified data)
- Company-specific tactics and strategies (from verified data)
Do NOT add company claims that are not supported by the verified database.` : `About ${data.companyName}:
- Compensation philosophy
- Which levers are typically flexible (base, equity, bonus, signing, PTO, remote)
- How they handle negotiations
- Opportunities specific to this company
NOTE: This section is based on general market knowledge. Verify details with your recruiter.`}

### SECTION 7: NEGOTIATION TIMELINE
Day-by-day plan:
- Day 1: Immediate actions
- Day 2-3: Preparation
- Day 3-4: Making the counter
- Day 5+: Follow-up and closing strategy

### SECTION 8: BEYOND BASE SALARY
If base is firm, negotiate: equity acceleration, signing bonus, bonus guarantee, start date, remote work, professional development budget, title upgrade, 6-month review, extra PTO.
${research ? 'Prioritize the alternative levers that the verified data identifies as most flexible at this company.' : ''}

Be direct, confident, specific. Every recommendation tied to THIS person's situation.`;
}


export function getRaisePrompt(data, research) {
  const { researchSection, accuracyRules } = buildResearchBlock(research);

  return `You are an elite salary negotiation coach specializing in raise negotiations. Generate a comprehensive, personalized playbook.

${accuracyRules}

## CLIENT INFO
- Name: ${data.fullName}
- Company: ${data.companyName}
- Title: ${data.jobTitle}
- Department: ${data.department || 'Not specified'}
- Location: ${data.location}
- Current Salary: ${data.currentSalary}
- Target Salary: ${data.targetSalary || 'Needs recommendation'}
- Time in Role: ${data.timeInRole}
- Time at Company: ${data.timeAtCompany || 'Not specified'}
- Last Raise: ${data.lastRaise || 'Not specified'}
- Manager Relationship: ${data.managerRelationship || 'Not specified'}
- Company Health: ${data.companyFinancialHealth || 'Not specified'}

## THE CASE
- Accomplishments: ${data.recentAccomplishments}
- Additional Responsibilities: ${data.additionalResponsibilities || 'Not specified'}
- Previous Attempts: ${data.previousNegotiationAttempts || 'None'}
- Biggest Concern: ${data.biggestConcern || 'Not specified'}

${data.resumeText ? `## RESUME\n${data.resumeText}` : ''}

${researchSection}

## GENERATE THESE SECTIONS:

### SECTION 1: EXECUTIVE SUMMARY
Assessment of situation strength, case quality, and recommended strategy in 3-4 sentences.${research ? ' Ground your assessment in the verified compensation data.' : ''}

### SECTION 2: MARKET COMPENSATION REPORT
${research ? `Using the VERIFIED compensation data provided above:
- Present the exact salary/comp ranges from our database for this role at this company
- Show where the client's current ${data.currentSalary} falls within verified ranges
- Calculate the precise gap (in dollars and percentage) between current comp and market median/75th percentile
- If the data includes level-specific ranges, identify the most likely level and use those figures
- Include total comp context (equity, bonus) if covered in verified data
- If the client's exact situation is not covered, clearly state which data you are using and label any extrapolation` : `- Market range (25th/50th/75th/90th percentile) for ${data.jobTitle} at ${data.companyName}-tier companies in ${data.location}
- Where their current ${data.currentSalary} falls vs market
- The specific gap (in dollars and percentage)
- Industry factors affecting comp
- NOTE: Label all figures as estimates based on general market data`}

### SECTION 3: YOUR BUSINESS CASE DOCUMENT
A polished, professional one-page document to share with their manager:
- Professional header (name, title, date)
- Summary of contributions and measurable impact
- Market data supporting the request${research ? ' (cite verified ranges from our database)' : ' (note: based on general market estimates)'}
- Specific ask (dollar amount)
- Forward-looking commitment statement

### SECTION 4: RECOMMENDED SALARY TARGET
- Specific number to ask for (not a range)
- Reasoning based on market + performance${research ? ' — anchor reasoning to verified data' : ''}
- "Stretch" target
- Minimum acceptable
${data.targetSalary ? `- Evaluate their target of ${data.targetSalary} — is it too high, too low, or right?${research ? ' Compare against verified ranges.' : ''}` : `- Recommend a specific target with justification${research ? ' grounded in verified data' : ''}`}
${research ? '- Counter numbers MUST fall within or be justifiably near the verified ranges. Do not recommend targets that exceed documented top of band without clear justification.' : ''}

### SECTION 5: CONVERSATION SCRIPTS

**Script A: Setting Up the Meeting**
Exact words to request time with manager for this conversation (email or in-person).

**Script B: The Main Conversation**
Complete script:
- Opening (first 2-3 sentences — critical)
- Presenting the business case
- Stating the specific ask
- Handling immediate response
- Closing regardless of answer
${research ? 'Weave in company-specific data points from the verified intelligence to strengthen the ask.' : ''}

**Script C: Follow-Up Email**
Professional email summarizing discussion and next steps.

### SECTION 6: OBJECTION HANDLING
Word-for-word responses for:
- "The budget is tight right now"
- "Let's revisit at your next review"
- "You just got promoted / still new in role"
- "We need to keep things equitable across the team"
- "I need to check with HR / my manager"
- "I appreciate your work but this isn't the right time"
${data.biggestConcern ? `- Specific response for their concern: "${data.biggestConcern}"` : ''}
${data.previousNegotiationAttempts ? `- How to reframe given previous attempt: "${data.previousNegotiationAttempts}"` : ''}

### SECTION 7: TIMING & APPROACH STRATEGY
- Best time to have this conversation (considering review cycles, company health, project milestones)
- Whether to approach manager, skip-level, or HR
- How to factor in their ${data.managerRelationship || 'neutral'} manager relationship
- How to set up the conversation for maximum receptivity
${research ? '- Factor in any company-specific timing insights from the verified data (review cycles, promotion windows, etc.)' : ''}

### SECTION 8: PLAN B — IF THEY SAY NO
- Alternative wins to negotiate: title change, remote days, equity/bonus, professional development, extra PTO
${research ? '- Prioritize alternatives that the verified data identifies as flexible levers at this company' : ''}
- Specific timeline for re-asking (30/60/90 day plan)
- How to document accomplishments going forward
- When to start considering external opportunities
- How to turn "no" into "not yet" with a concrete path forward

Be direct, confident, specific. Every recommendation tied to THIS person's situation. Factor in their manager relationship and company health.`;
}
