#!/usr/bin/env python3
"""
generate_prompts_phase2.py — Phase 2
Writes fully self-contained PROMPT.md into each of the 30 phase-2 project folders.
Usage: python3 phase-2/scripts/generate_prompts_phase2.py
"""

import os, sys

ROOT_DIR     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# PHASE2_DIR   = os.path.join(ROOT_DIR, "phase-2")
PROJECTS_DIR = os.path.join(ROOT_DIR, "projects")

# ─────────────────────────────────────────────────────────────
# PROBLEM STATEMENTS
# ─────────────────────────────────────────────────────────────
PROBLEMS = {
    "digital": {
        "title": "Digital Asset Protection — Protecting the Integrity of Digital Sports Media",
        "statement": """Sports organizations generate massive volumes of high-value digital media that rapidly
scatter across global platforms, making it nearly impossible to track. This vast visibility gap
leaves proprietary content highly vulnerable to widespread digital misappropriation, unauthorized
redistribution, and intellectual property violations.

Objective: Develop a scalable, innovative solution to identify, track, and flag unauthorized use
or misappropriation of official sports media across the internet. Enable organizations to
proactively authenticate their digital assets and detect anomalies in content propagation
in near real-time.""",
        "domain": "digital sports media, copyright protection, IP rights management",
    },
    "crisis": {
        "title": "Rapid Crisis Response — Accelerated Emergency Response in Hospitality",
        "statement": """Hospitality venues face unpredictable, high-stakes emergencies that demand instantaneous,
coordinated reactions to protect lives and property. During a crisis, critical information is
often siloed, fracturing communication between distressed guests, on-site staff, and first responders.

Objective: Design a robust solution to instantly detect, report, and synchronize crisis response
efforts across a decentralized hospitality ecosystem. Eliminate fragmented communication by
creating a highly reliable bridge between distressed individuals, active personnel,
and emergency services.""",
        "domain": "hospitality emergency management, crisis coordination, safety systems",
    },
    "supply": {
        "title": "Smart Supply Chains — Resilient Logistics and Dynamic Supply Chain Optimization",
        "statement": """Modern global supply chains manage millions of concurrent shipments across highly complex
and inherently volatile transportation networks. Critical transit disruptions ranging from sudden
weather events to hidden operational bottlenecks are chronically identified only after delivery
timelines are already compromised.

Objective: Design a scalable system capable of continuously analyzing multifaceted transit data
to preemptively detect and flag potential supply chain disruptions. Formulate dynamic mechanisms
that instantly execute or recommend highly optimized route adjustments before localized
bottlenecks cascade into broader delays.""",
        "domain": "logistics, supply chain management, route optimization, disruption detection",
    },
    "bias": {
        "title": "Unbiased AI Decision — Ensuring Fairness and Detecting Bias in Automated Decisions",
        "statement": """Computer programs now make life-changing decisions about who gets a job, a bank loan,
or even medical care. However, if these programs learn from flawed or unfair historical data,
they will repeat and amplify those exact same discriminatory mistakes.

Objective: Build a clear, accessible solution to thoroughly inspect data sets and software models
for hidden unfairness or discrimination. Provide organizations with an easy way to measure, flag,
and fix harmful bias before their systems impact real people.""",
        "domain": "AI fairness, bias detection, algorithmic accountability, ethics",
    },
    "volunteer": {
        "title": "Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact",
        "statement": """Local social groups and NGOs collect a lot of important information about community needs
through paper surveys and field reports. However, this valuable data is often scattered across
different places, making it hard to see the biggest problems clearly.

Objective: Design a powerful system that gathers scattered community information to clearly show
the most urgent local needs. Build a smart way to quickly match and connect available volunteers
with the specific tasks and areas where they are needed most.""",
        "domain": "NGO operations, volunteer management, community needs assessment, social impact",
    },
}

# ─────────────────────────────────────────────────────────────
# TOOLS — 6 per problem, new ideas + new Gemini functions
# ─────────────────────────────────────────────────────────────
TOOLS = {
    "digital": [
        {
            "num": 1, "name": "WatermarkIQ",
            "tagline": "Generate invisible watermark signatures for any digital asset",
            "user_input": "Asset title, creator name, organization, asset type, creation date",
            "user_output": "A unique steganographic text signature, encoded ownership string, and embedding instructions",
            "gemini_role": "Generate a unique cryptographic-style ownership signature string and invisible watermark text for the asset. Include encoding instructions.",
            "gemini_prompt": "You are a digital watermarking AI. Generate a unique ownership signature for this asset: create a steganographic text string, an encoded ownership token, and step-by-step instructions for embedding it invisibly into the asset. Make the signature unique and traceable.",
            "ui": "brutalism",
            "color": "electric yellow and black — raw power meets digital fingerprinting",
        },
        {
            "num": 2, "name": "CloneCourt",
            "tagline": "Build a legal case summary against a content thief in seconds",
            "user_input": "Your asset description, original publish date, infringing URL, type of infringement, evidence available",
            "user_output": "A structured legal case summary with evidence chain, legal basis, estimated damages, and recommended actions",
            "gemini_role": "Draft a compelling, evidence-based legal case summary against the content thief. Include legal basis, evidence chain, estimated damages, and step-by-step recommended legal actions.",
            "gemini_prompt": "You are an IP litigation AI. Build a legal case summary for this content theft incident. Include: case title, legal basis (DMCA/copyright law), evidence chain (what they have vs what they need), estimated damages range, and 5 recommended legal actions in priority order. Be precise and actionable.",
            "ui": "neomorphism",
            "color": "soft grey and deep blue — legal authority meets soft digital precision",
        },
        {
            "num": 3, "name": "AssetVault",
            "tagline": "Describe your media library — get a theft vulnerability ranking",
            "user_input": "List of asset types in your library, their platforms, access levels, and commercial value",
            "user_output": "A prioritized vulnerability ranking of each asset type with theft risk score and protection recommendations",
            "gemini_role": "Analyze the media library description and rank each asset type by theft vulnerability. Score each on a risk matrix and provide specific protection recommendations per asset type.",
            "gemini_prompt": "You are a digital asset security analyst. Analyze this media library and rank each asset type by theft vulnerability (1-10 score). For each: explain why it's at risk, which platforms expose it most, and give 2 specific protection actions. Output as a prioritized ranked list.",
            "ui": "aurora",
            "color": "deep space navy with teal and purple aurora gradients",
        },
        {
            "num": 4, "name": "PlatformSpy",
            "tagline": "Input any platform name — get its content theft risk profile",
            "user_input": "Platform name, content type you publish there, your account size/reach",
            "user_output": "Platform risk profile: IP enforcement rating, common theft vectors on this platform, your personal exposure level, and defensive tactics",
            "gemini_role": "Generate a detailed IP theft risk profile for the specified platform. Cover enforcement reputation, common theft vectors, algorithmic exposure risks, and platform-specific defensive tactics.",
            "gemini_prompt": "You are a platform IP risk analyst. For this platform, generate a risk profile covering: IP enforcement reputation (A-F grade with reasoning), top 3 content theft vectors specific to this platform, exposure risk for this account size, and 4 platform-specific defensive tactics. Be specific to this platform's actual policies and culture.",
            "ui": "terminal",
            "color": "black background, bright green terminal text — hacker intelligence aesthetic",
        },
        {
            "num": 5, "name": "ReverseTrace",
            "tagline": "Describe suspicious content — trace it back to its likely original source",
            "user_input": "Description of suspicious content: what it shows, where you found it, any visible metadata, quality/format details",
            "user_output": "Origin likelihood analysis: probable original source, distribution path hypothesis, authenticity signals, and verification steps",
            "gemini_role": "Reason forensically about the content description to hypothesize its likely original source, distribution path, and authenticity signals. Provide a structured origin analysis.",
            "gemini_prompt": "You are a digital forensics AI. Analyze this suspicious content description and provide: most likely original source (with confidence %), hypothetical distribution path, authenticity signals present or missing, 3 specific verification steps to confirm origin. Be forensic and methodical.",
            "ui": "paper",
            "color": "cream white and ink black — investigative journalism editorial aesthetic",
        },
        {
            "num": 6, "name": "LicenseGen",
            "tagline": "Input your asset details — get a custom license agreement generated instantly",
            "user_input": "Asset type, permitted uses, prohibited uses, attribution requirements, commercial terms, territory",
            "user_output": "A complete, structured content license agreement ready to attach to your asset",
            "gemini_role": "Draft a complete, legally-structured content license agreement based on the specified terms. Use standard IP licensing language adapted to the asset type and usage requirements.",
            "gemini_prompt": "You are an IP licensing AI. Draft a complete content license agreement for this asset with these sections: Grant of License, Permitted Uses, Prohibited Uses, Attribution Requirements, Commercial Terms, Territory, Term and Termination, Warranties, Governing Law. Use precise legal language appropriate for digital media licensing.",
            "ui": "claymorphism",
            "color": "soft lavender and mint — approachable legal meets playful digital",
        },
    ],
    "crisis": [
        {
            "num": 1, "name": "PanicTranslate",
            "tagline": "Convert a panicked guest message into a calm structured emergency report",
            "user_input": "The raw panicked message or call transcript from a distressed guest",
            "user_output": "Extracted facts: incident type, location, people affected, severity, immediate needs — plus a calm re-statement for responders",
            "gemini_role": "Extract structured emergency facts from chaotic, emotional input. Identify incident type, location, affected parties, severity level, and immediate needs. Restate calmly for responders.",
            "gemini_prompt": "You are an emergency triage AI. Extract structured facts from this panicked message: (1) Incident Type, (2) Location, (3) Number of People Affected, (4) Severity 1-5, (5) Immediate Needs, (6) Caller Status. Then write a calm 2-sentence responder briefing. Ignore emotional noise, focus only on actionable facts.",
            "ui": "brutalism",
            "color": "urgent red and stark white — emergency rawness meets clarity",
        },
        {
            "num": 2, "name": "StaffPulse",
            "tagline": "Staff check-in during a crisis — get a live team status synthesis",
            "user_input": "Multiple staff status updates in plain text (name, location, status, what they see)",
            "user_output": "Synthesized team situation map: who is where, what each zone status is, gaps in coverage, and recommended redeployment",
            "gemini_role": "Synthesize multiple staff check-in messages into a coherent team situation map. Identify coverage gaps, hot zones, and recommend redeployment priorities.",
            "gemini_prompt": "You are a crisis coordination AI. Synthesize these staff check-in updates into: (1) Team Status Map (name, location, status for each), (2) Zone Coverage Assessment (which areas are covered/uncovered), (3) Top 3 Coverage Gaps, (4) Redeployment Recommendations. Be tactical and concise.",
            "ui": "neomorphism",
            "color": "warm grey and amber — operational calm meets urgency signals",
        },
        {
            "num": 3, "name": "GuestSOS",
            "tagline": "Guest describes emergency — get immediate calm guidance in plain language",
            "user_input": "Emergency type, guest location in venue, number of people, any immediate dangers visible",
            "user_output": "Step-by-step immediate safety instructions written for a panicked non-expert, plus what NOT to do",
            "gemini_role": "Generate clear, numbered, panic-reducing immediate safety instructions for a distressed venue guest. Use simple language. Include critical don'ts. End with reassurance.",
            "gemini_prompt": "You are a guest safety AI for a hospitality venue. A guest is in distress. Give them: (1) 5 immediate actions numbered simply, (2) 3 things NOT to do, (3) one reassuring closing sentence. Use the simplest possible language. No jargon. Write as if texting someone who is panicking.",
            "ui": "aurora",
            "color": "calming deep blue and soft white aurora — safety and reassurance",
        },
        {
            "num": 4, "name": "CrisisScript",
            "tagline": "Generate public announcement scripts for any emergency type instantly",
            "user_input": "Emergency type, venue name, current status, audience (guests/staff/media), tone needed",
            "user_output": "Three announcement scripts: PA system announcement, staff briefing script, and social media statement",
            "gemini_role": "Draft three distinct crisis communication scripts: a PA announcement, a staff briefing, and a social media statement. Each calibrated for its audience and channel.",
            "gemini_prompt": "You are a crisis communications scriptwriter. For this emergency, write 3 scripts: (1) PA System Announcement (calm, clear, 3 sentences max), (2) Staff Briefing Script (tactical, role-specific, 5 bullet points), (3) Social Media Statement (transparent, reassuring, under 280 chars). Each must be appropriate for its audience.",
            "ui": "terminal",
            "color": "dark charcoal and cyan — broadcast systems meet digital command",
        },
        {
            "num": 5, "name": "PostMortemPro",
            "tagline": "After a crisis — auto-generate a complete incident post-mortem report",
            "user_input": "What happened, timeline, what went well, what failed, teams involved, outcome",
            "user_output": "Structured post-mortem: executive summary, timeline, root causes, what worked, what failed, prevention plan",
            "gemini_role": "Produce a structured hospitality incident post-mortem report. Extract root causes, identify systemic issues, document what worked, and generate a concrete prevention plan.",
            "gemini_prompt": "You are a hospitality incident analyst. Write a post-mortem report with these sections: Executive Summary (2 sentences), Incident Timeline, Root Cause Analysis (5-Why format), What Worked Well, What Failed, 5-Item Prevention Plan ordered by priority. Be constructive and specific.",
            "ui": "paper",
            "color": "off-white and dark ink — formal reporting meets editorial clarity",
        },
        {
            "num": 6, "name": "HazardMap",
            "tagline": "Describe your venue layout — identify hidden hazard zones automatically",
            "user_input": "Venue type, number of floors, key areas (lobby, kitchen, pool, event hall etc), occupancy, any known hazards",
            "user_output": "A hazard zone analysis: risk-ranked areas, specific hazard types per zone, mitigation recommendations, and emergency access notes",
            "gemini_role": "Analyze the venue layout description and identify high-risk hazard zones. Rank zones by risk level, specify hazard types, and recommend targeted mitigations.",
            "gemini_prompt": "You are a venue safety AI. Analyze this venue layout and identify hazard zones. For each zone: risk level (HIGH/MEDIUM/LOW), specific hazard types, why it's risky, and 2 mitigation actions. Then list top 3 emergency access recommendations for first responders. Be spatial and specific.",
            "ui": "claymorphism",
            "color": "soft coral and sky blue — safety awareness meets approachable design",
        },
    ],
    "supply": [
        {
            "num": 1, "name": "WeatherShield",
            "tagline": "Input your route and forecast — predict weather-based delay risk",
            "user_input": "Origin, destination, transport mode, departure date, any known weather conditions",
            "user_output": "Weather delay risk score, specific weather threats per route segment, impact on ETA, and weather-proofing recommendations",
            "gemini_role": "Correlate the route details with weather risk patterns. Score weather-based delay probability, identify specific threat types per segment, and recommend weather-proofing actions.",
            "gemini_prompt": "You are a logistics weather risk AI. Analyze this route for weather-based delay risk: overall risk score (0-100%), specific weather threats per segment (rain/snow/fog/wind/storm), estimated ETA impact in hours, and 3 weather-proofing recommendations. Base reasoning on typical seasonal patterns for the region and transport mode.",
            "ui": "brutalism",
            "color": "stormy grey and electric blue — weather power meets logistics precision",
        },
        {
            "num": 2, "name": "VendorScore",
            "tagline": "Describe a vendor relationship — get a full reliability scorecard",
            "user_input": "Vendor type, how long you've worked together, recent issues, delivery performance, communication quality, financial stability signals",
            "user_output": "A vendor reliability scorecard: scores across 5 dimensions, overall grade, risk flags, and relationship recommendations",
            "gemini_role": "Evaluate the vendor relationship across reliability dimensions: delivery performance, communication, financial stability, flexibility, and risk concentration. Output a scored card with grade and recommendations.",
            "gemini_prompt": "You are a vendor assessment AI. Score this vendor across 5 dimensions (each 1-10): Delivery Reliability, Communication Quality, Financial Stability, Flexibility/Responsiveness, Risk Concentration. Give overall grade (A-F), top 2 risk flags, and 3 relationship recommendations. Justify each score briefly.",
            "ui": "neomorphism",
            "color": "soft white and forest green — trust and reliability in physical form",
        },
        {
            "num": 3, "name": "ShipmentNarrator",
            "tagline": "Paste raw tracking data — get a plain-language shipment story",
            "user_input": "Raw shipment tracking log or status updates (any format)",
            "user_output": "A plain-language narrative of exactly what happened to the shipment, where delays occurred, why, and what to expect next",
            "gemini_role": "Translate raw logistics tracking data into a clear, chronological plain-language narrative. Identify delays, explain causes, and predict next steps.",
            "gemini_prompt": "You are a logistics translator AI. Convert this raw tracking data into a plain-language shipment story covering: what happened chronologically, where and why delays occurred, current status explained simply, and what to expect next. Write for a non-technical business owner. Be specific about times and locations.",
            "ui": "aurora",
            "color": "deep teal and golden aurora — data transformation meets clarity",
        },
        {
            "num": 4, "name": "CostLeakFinder",
            "tagline": "Describe your supply chain — find hidden cost inefficiencies instantly",
            "user_input": "Supply chain description: stages, vendors, transport modes, storage, current pain points",
            "user_output": "A cost leak analysis: identified inefficiency points, estimated waste per issue, priority ranking, and cost-saving actions",
            "gemini_role": "Analyze the supply chain description for hidden cost inefficiencies. Identify waste points, estimate financial impact, and prescribe targeted cost-saving interventions.",
            "gemini_prompt": "You are a supply chain cost optimization AI. Analyze this supply chain for cost leaks: identify top 5 inefficiency points, estimate waste magnitude for each (low/medium/high $), rank by savings potential, and prescribe 1 specific fix per issue. Focus on non-obvious inefficiencies beyond the stated pain points.",
            "ui": "terminal",
            "color": "dark green terminal on black — cost intelligence meets hacker precision",
        },
        {
            "num": 5, "name": "ContractClause",
            "tagline": "Generate protective contract clauses for supply chain disruption scenarios",
            "user_input": "Contract type, disruption scenario to protect against, your role (buyer/seller), jurisdiction, risk tolerance",
            "user_output": "3-5 ready-to-insert contract clauses covering force majeure, SLA protection, penalty limits, and dispute resolution for the scenario",
            "gemini_role": "Draft precise, legally-structured contract clauses that protect against the specified supply chain disruption scenario. Cover force majeure, SLA, penalties, and dispute resolution.",
            "gemini_prompt": "You are a supply chain contract AI. Draft 4 protective contract clauses for this disruption scenario: (1) Force Majeure definition and triggers, (2) SLA modification rights, (3) Liability and penalty caps, (4) Dispute resolution mechanism. Use standard commercial contract language. Make each clause ready to insert into a contract.",
            "ui": "paper",
            "color": "legal cream and dark navy — contract authority meets editorial structure",
        },
        {
            "num": 6, "name": "DemandSignal",
            "tagline": "Input market signals — get a near-term demand shift prediction",
            "user_input": "Industry/product type, recent market signals (news, trends, competitor moves, seasonal factors), current inventory level",
            "user_output": "Demand shift prediction: direction (up/down/stable), magnitude estimate, confidence level, leading indicators to watch, and inventory recommendation",
            "gemini_role": "Analyze qualitative market signals to forecast near-term demand shifts. Provide directional prediction with confidence level, explain the signal logic, and recommend inventory actions.",
            "gemini_prompt": "You are a demand forecasting AI. Analyze these market signals and predict near-term demand: direction (increase/decrease/stable), magnitude (%, low/medium/high confidence), top 3 signals driving the prediction, 2 counter-signals to watch, and specific inventory recommendation (build/hold/reduce by how much). Explain your signal logic clearly.",
            "ui": "claymorphism",
            "color": "soft orange and light blue — market energy meets approachable prediction",
        },
    ],
    "bias": [
        {
            "num": 1, "name": "PromptBias",
            "tagline": "Paste any AI prompt — detect bias baked into the prompt itself",
            "user_input": "An AI system prompt or user prompt to analyze",
            "user_output": "Bias analysis of the prompt: bias types found, affected groups, severity rating, and rewritten bias-reduced version",
            "gemini_role": "Analyze the AI prompt for embedded bias in framing, assumptions, loaded language, and exclusionary defaults. Identify bias types, affected groups, severity, and rewrite the prompt to reduce bias.",
            "gemini_prompt": "You are a prompt bias auditor. Analyze this AI prompt for: (1) Bias types present (framing/assumption/exclusion/stereotype), (2) Which groups are disadvantaged by the bias, (3) Severity rating HIGH/MEDIUM/LOW for each, (4) A rewritten bias-reduced version of the prompt. Be specific about which exact words or phrases carry bias.",
            "ui": "brutalism",
            "color": "bold purple and white — raw truth meets analytical power",
        },
        {
            "num": 2, "name": "HiringLens",
            "tagline": "Paste a job description — find discriminatory language and get a rewrite",
            "user_input": "The full job description text",
            "user_output": "Flagged discriminatory phrases, which groups each disadvantages, severity rating, and a fully rewritten inclusive version",
            "gemini_role": "Scan the job description for discriminatory language patterns. Flag each problematic phrase, explain the discrimination mechanism, and produce a fully rewritten inclusive version.",
            "gemini_prompt": "You are an inclusive hiring AI. Scan this job description and: (1) Flag every discriminatory phrase (highlight exact text), (2) Explain which groups each phrase disadvantages and how, (3) Rate each as HIGH/MEDIUM/LOW severity, (4) Rewrite the entire JD in inclusive language. Reference EEOC guidelines where relevant.",
            "ui": "neomorphism",
            "color": "soft blue and white — professional fairness meets gentle precision",
        },
        {
            "num": 3, "name": "ModelCard",
            "tagline": "Describe your AI model — auto-generate a bias-aware model card",
            "user_input": "Model purpose, training data description, intended users, known limitations, deployment context",
            "user_output": "A complete model card with fairness section: intended use, limitations, bias risks, recommended mitigations, and evaluation checklist",
            "gemini_role": "Generate a comprehensive, bias-aware model card. Include standard model card sections plus a detailed fairness and bias risk section with specific mitigation recommendations.",
            "gemini_prompt": "You are an AI documentation specialist. Generate a model card with these sections: Model Description, Intended Use, Out-of-Scope Uses, Training Data Summary, Evaluation Results (placeholder), Ethical Considerations, Bias and Fairness Risks (list specific risks for this model type), Recommended Mitigations, and a 10-item Pre-Deployment Fairness Checklist. Be specific to this model's domain.",
            "ui": "aurora",
            "color": "deep indigo and violet aurora — AI documentation meets ethical clarity",
        },
        {
            "num": 4, "name": "CounterfactualAI",
            "tagline": "Input an automated decision — generate counterfactual fairness test cases",
            "user_input": "The decision made, key input factors used, the demographic context, decision domain",
            "user_output": "5 counterfactual test scenarios that isolate demographic variables — each showing what SHOULD happen in a fair system",
            "gemini_role": "Generate counterfactual fairness test cases by systematically varying demographic attributes while holding other factors constant. Each test case reveals whether the system would treat similar people differently.",
            "gemini_prompt": "You are a counterfactual fairness testing AI. Given this decision and its inputs, generate 5 counterfactual test cases. For each: change ONE demographic attribute (race/gender/age/location), keep all else identical, state the expected fair outcome, and flag if a biased system would likely give a different result. Format as testable scenarios with pass/fail criteria.",
            "ui": "terminal",
            "color": "black and matrix green — systematic testing meets hacker rigor",
        },
        {
            "num": 5, "name": "BiasTranslator",
            "tagline": "Explain any AI bias concept in plain language for non-technical stakeholders",
            "user_input": "The bias concept or technical term to explain (e.g. demographic parity, disparate impact, proxy discrimination)",
            "user_output": "A plain-language explanation, a real-world analogy, a concrete example, and why it matters to the organization",
            "gemini_role": "Translate technical AI bias concepts into clear, jargon-free language for business stakeholders. Use relatable analogies and concrete examples. Connect to organizational impact.",
            "gemini_prompt": "You are an AI ethics translator for non-technical audiences. Explain this bias concept with: (1) One-sentence plain definition, (2) A real-world analogy that makes it intuitive, (3) A concrete example in a business context, (4) Why it matters legally and reputationally, (5) One simple thing the organization can do about it. Use zero technical jargon.",
            "ui": "paper",
            "color": "warm white and charcoal — educational clarity meets editorial trust",
        },
        {
            "num": 6, "name": "RedTeamAI",
            "tagline": "Describe your AI system — generate adversarial bias attack scenarios",
            "user_input": "AI system purpose, input types it accepts, decisions it makes, user population",
            "user_output": "10 adversarial bias attack scenarios: each with attack method, target vulnerability, expected biased output, and detection strategy",
            "gemini_role": "Generate adversarial red-team scenarios designed to expose bias vulnerabilities in the AI system. Each scenario should be a concrete, executable test that could reveal discriminatory behavior.",
            "gemini_prompt": "You are an AI red-team specialist. Generate 10 adversarial bias test scenarios for this AI system. For each scenario: attack name, specific input to submit, which bias vulnerability it targets, what a biased system would likely output, and how to detect if the system failed the test. Make scenarios concrete and executable by a QA tester.",
            "ui": "claymorphism",
            "color": "soft red and light grey — adversarial testing meets approachable safety",
        },
    ],
    "volunteer": [
        {
            "num": 1, "name": "GrantWriter",
            "tagline": "Describe your NGO need — auto-draft a compelling grant application paragraph",
            "user_input": "Organization name, program description, target population, impact goal, funding amount needed, grant type",
            "user_output": "A polished grant application paragraph with problem statement, proposed solution, expected impact, and budget justification",
            "gemini_role": "Draft a compelling, funder-ready grant application paragraph. Use proven grant writing structure: problem statement, solution, impact, and budget rationale.",
            "gemini_prompt": "You are an expert grant writer for NGOs. Draft a compelling grant application paragraph covering: (1) Problem Statement (specific, data-referenced), (2) Proposed Solution (clear and feasible), (3) Expected Impact (quantified outcomes), (4) Budget Justification (why this amount). Make it emotionally compelling yet evidence-based. Aim for foundation grant standards.",
            "ui": "brutalism",
            "color": "forest green and cream — community strength meets bold advocacy",
        },
        {
            "num": 2, "name": "VolunteerBio",
            "tagline": "Volunteer fills in their details — get a compelling impact bio generated",
            "user_input": "Volunteer name, skills, hours contributed, tasks completed, communities served, personal motivation",
            "user_output": "A personal impact bio suitable for NGO website, donor reports, and volunteer recognition",
            "gemini_role": "Craft a compelling, human-centered volunteer impact bio. Highlight concrete contributions, personal motivation, and community impact in an inspiring narrative format.",
            "gemini_prompt": "You are an NGO storytelling AI. Write a compelling volunteer impact bio (150-200 words) covering: who they are, what they did (specific tasks and hours), who they helped (concrete community impact), and what drives them. Make it inspiring for donor reports and volunteer recruitment. Use first-person voice.",
            "ui": "neomorphism",
            "color": "warm peach and soft brown — human warmth meets professional recognition",
        },
        {
            "num": 3, "name": "CommunityPulse",
            "tagline": "Paste community social media posts — extract hidden needs for NGO action",
            "user_input": "Raw social media posts, forum comments, or community messages from a target area",
            "user_output": "Extracted community needs: ranked list with urgency scores, sentiment analysis, population segments affected, and NGO action recommendations",
            "gemini_role": "Perform social listening analysis on community posts. Extract unmet needs, rank by urgency, identify affected segments, and translate signals into actionable NGO interventions.",
            "gemini_prompt": "You are a community intelligence AI for NGOs. Analyze these social media posts and extract: (1) Top 5 unmet needs ranked by urgency (1-10 score), (2) Sentiment per need (frustrated/scared/resigned/hopeful), (3) Population segments most affected, (4) Hidden needs not stated explicitly but implied, (5) 3 specific NGO interventions recommended. Quote specific posts as evidence.",
            "ui": "aurora",
            "color": "community blue and warm orange aurora — social listening meets action",
        },
        {
            "num": 4, "name": "TaskNarrator",
            "tagline": "Completed task details — generate a donor-motivating impact story",
            "user_input": "Task completed, volunteer details, beneficiaries helped, resources used, outcomes achieved, location",
            "user_output": "A compelling donor-facing impact story with headline, narrative, key metrics, and a call to action",
            "gemini_role": "Transform dry task completion data into an emotionally compelling donor-facing impact story. Create narrative arc, humanize the numbers, and include a motivating call to action.",
            "gemini_prompt": "You are a nonprofit storytelling AI. Transform this task data into a donor impact story with: (1) Compelling headline, (2) Human narrative (who helped who, what changed), (3) Key impact metrics made emotional (not just numbers), (4) Quote from the experience (fabricate plausibly), (5) Call to action for continued support. Make donors feel the difference their money made.",
            "ui": "terminal",
            "color": "dark bg and warm amber text — impact data meets human narrative",
        },
        {
            "num": 5, "name": "SkillGapFinder",
            "tagline": "Describe your NGO projects — find the volunteer skill gaps holding you back",
            "user_input": "Current NGO projects, current volunteer skills available, project challenges faced, upcoming initiatives",
            "user_output": "Skill gap analysis: missing skills ranked by criticality, impact of each gap, recruitment brief for each missing skill, and interim workarounds",
            "gemini_role": "Analyze the gap between NGO project needs and available volunteer skills. Rank gaps by criticality, quantify impact, and generate targeted recruitment briefs for each missing skill.",
            "gemini_prompt": "You are an NGO talent strategy AI. Analyze this skill gap and provide: (1) Top 5 missing skills ranked by criticality to mission, (2) Impact of each gap on project outcomes, (3) A 3-sentence volunteer recruitment brief for each missing skill, (4) An interim workaround for each gap while recruiting. Make recruitment briefs compelling for potential volunteers.",
            "ui": "paper",
            "color": "warm ivory and deep teal — organizational clarity meets editorial structure",
        },
        {
            "num": 6, "name": "EventPlanner",
            "tagline": "Describe a community need — generate a complete volunteer event plan",
            "user_input": "Community need to address, available volunteers, budget, location/area, timeframe, any constraints",
            "user_output": "A complete volunteer event plan: event concept, schedule, role assignments, materials list, communication plan, and success metrics",
            "gemini_role": "Generate a comprehensive, ready-to-execute volunteer event plan tailored to the community need and available resources. Include all operational details needed to run the event.",
            "gemini_prompt": "You are a volunteer event planning AI. Create a complete event plan covering: (1) Event Concept and Name, (2) Full Day Schedule (hour by hour), (3) Volunteer Role Assignments (role name, responsibilities, count needed), (4) Materials and Resources List, (5) Pre-Event Communication Plan (what to send, when), (6) Success Metrics (how to measure impact). Make it ready to execute immediately.",
            "ui": "claymorphism",
            "color": "cheerful yellow and soft green — community celebration meets organized action",
        },
    ],
}

# ─────────────────────────────────────────────────────────────
# UI STYLE BRIEFS
# ─────────────────────────────────────────────────────────────
UI_STYLES = {
    "brutalism": """
BRUTALISM UI STYLE
━━━━━━━━━━━━━━━━━
Core concept: Raw, intentional ugliness that commands attention. Thick borders, offset
box shadows, loud typography, high contrast. Nothing is subtle. Everything is intentional.

Visual language:
- White or pale yellow background
- Thick solid black borders (3-5px) on ALL elements
- Offset box-shadows: 4-8px solid black (e.g. box-shadow: 6px 6px 0 black)
- Bold/black font weight (800-900) for all headings
- Uppercase text for labels and buttons
- Primary accent: one loud color (yellow, red, or lime green)
- Buttons are rectangles with thick border + offset shadow, no border-radius
- Hover: shadow reduces to 2px (feels like pressing)
- Input fields: thick bordered, no rounded corners

Layout: Asymmetric, intentional grid breaks, oversized elements, visible structure.
Fonts: Impact, Space Grotesk, or any extra-bold geometric sans-serif.
DO NOT: use rounded corners, use subtle shadows, use gradients, use thin fonts.
""",
    "neomorphism": """
NEOMORPHISM UI STYLE
━━━━━━━━━━━━━━━━━━━
Core concept: Soft extruded 3D elements that appear pressed from the same material as
the background. Everything is the same color family. Depth through dual shadows only.

Visual language:
- Background: a mid-tone flat color (e.g. #e0e5ec or soft warm grey)
- Elements use TWO shadows: light shadow top-left, dark shadow bottom-right
  e.g. box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(0,0,0,0.15)
- Inset version for pressed/active states:
  box-shadow: inset -3px -3px 7px #ffffff, inset 3px 3px 7px rgba(0,0,0,0.15)
- One accent color (soft blue, green, or purple) for active states only
- Minimal text — clean, medium weight
- Icons are monoline, same color family
- NO harsh borders, NO gradients, NO bright colors

Layout: Centered, spacious, generous padding. Elements float softly.
Fonts: Clean rounded sans-serif (Nunito, Poppins). Medium weights.
DO NOT: use multiple colors, use hard borders, use flat shadows, use dark backgrounds.
""",
    "aurora": """
AURORA UI STYLE
━━━━━━━━━━━━━━
Core concept: Dark background with flowing, ethereal gradient overlays inspired by the
northern lights. Deep, immersive, and premium feeling.

Visual language:
- Very dark background (#050810 or #0a0a1a)
- 2-4 large blurred gradient orbs (position: absolute, blur: 100-150px, opacity: 0.4-0.6)
  Colors: teal (#00d4aa), purple (#7c3aed), blue (#2563eb), pink (#db2777)
- Cards: dark semi-transparent (rgba(255,255,255,0.05)) with subtle border
- Text: white primary, light grey secondary
- Accent elements have gradient text or gradient borders
- Animated subtle movement on orbs (CSS keyframe, slow 8-12s)
- Input fields: dark glass style

Layout: Full-width sections, centered content, floating cards over the aurora background.
Fonts: Modern, elegant. Inter, Plus Jakarta Sans, or similar.
DO NOT: use light backgrounds, use flat colors, skip the gradient orbs.
""",
    "terminal": """
TERMINAL / HACKER UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: Command-line interface aesthetic. Monospace everything. Green on black.
Feels like you're in a 90s hacker movie but functional and modern.

Visual language:
- Background: pure black (#000000) or very dark green-black (#0a0f0a)
- Primary text: bright green (#00ff41 or #39ff14)
- Secondary text: dim green (#008f11)
- Accent: white or bright cyan for highlights
- Font: monospace ONLY (Courier New, Fira Code, JetBrains Mono)
- Borders: 1px solid green, sometimes dashed
- Buttons look like CLI commands: [> EXECUTE] or [$ SUBMIT]
- Input fields look like terminal prompts: "> _"
- Fake loading/typing animations using CSS
- Scanline effect optional (CSS repeating-gradient overlay)

Layout: Left-aligned, terminal-window style, fake window chrome optional.
Fonts: ONLY monospace. No exceptions.
DO NOT: use colors other than green/black/white/cyan, use rounded corners, use sans-serif.
""",
    "paper": """
PAPER / EDITORIAL UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: A well-designed newspaper or magazine layout. Serif fonts, structured
columns, clear typographic hierarchy. Serious, trustworthy, readable.

Visual language:
- Background: off-white/cream (#fafaf7 or #f5f0e8)
- Text: near-black (#1a1a1a) primary, dark grey secondary
- Accent: one ink color (dark red, dark blue, or forest green)
- Serif fonts for headings and body content
- Clear typographic hierarchy: massive headline → subhead → body → caption
- Thin rule lines (1px) to separate sections (like newspaper columns)
- Minimal decoration — content IS the design
- Pull quotes styled large and italic
- Date/byline style metadata
- Results displayed as formatted article sections

Layout: Column-based, justified or left-aligned text, editorial structure.
Fonts: Playfair Display or Lora for headings, Source Serif or Georgia for body.
DO NOT: use sans-serif for content, use gradients, use rounded cards, use bright colors.
""",
    "claymorphism": """
CLAYMORPHISM UI STYLE
━━━━━━━━━━━━━━━━━━━━
Core concept: Soft, inflated, 3D-looking shapes that appear molded from clay. Pastel
colors, thick shadows, rounded everything. Playful and modern.

Visual language:
- Light pastel background (soft lavender, mint, peach, or sky blue)
- Cards appear inflated: border-radius 20-30px, strong drop shadow
  box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08)
- Elements have a "puffy" quality — generous padding, large border-radius
- Color palette: soft pastels with one punchy accent
- Inner elements also rounded and colorful
- Buttons are pill-shaped or very rounded rectangles
- Slight gradient on card backgrounds (same hue, slightly lighter top)
- Icons are filled, colorful, rounded style

Layout: Centered, card-based, generous whitespace. Feels like a mobile app.
Fonts: Rounded sans-serif (Nunito, Varela Round, Fredoka One for display).
DO NOT: use sharp corners, use dark backgrounds, use thin elements, use flat shadows.
""",
}

# ─────────────────────────────────────────────────────────────
# PROMPT TEMPLATE
# ─────────────────────────────────────────────────────────────
PROMPT_TEMPLATE = """# AGENT PROMPT — {slug}
# Tool: {tool_name} | UI: {ui_name}
# Deployment domain: {deploy_name}
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **{tool_name}**

---

## PROBLEM CONTEXT
{problem_statement}

---

## THIS TOOL
**Name:** {tool_name}
**Tagline:** {tool_tagline}
**Domain:** {domain}

**User inputs:** {user_input}
**User sees:** {user_output}
**Gemini's role:** {gemini_role}

---

## UI STYLE
{ui_style_brief}

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${{KEY}}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{{ "prompt": "assembled user input" }}`
- Route returns: `{{ "result": "gemini response text" }}`

Gemini system prompt to use in route.ts:
"{gemini_prompt}"

Append the user's actual input to this prompt when calling Gemini.

---

## TECH CONSTRAINTS
- Next.js 16, App Router (`app/` directory), TypeScript (.tsx)
- Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only
- NO extra npm packages beyond: next, react, react-dom, lucide-react, tailwindcss
- Build: `next build --no-turbo`
- Node: 24.x
- Add `'use client'` to app/page.tsx
- Gemini call is server-side only in route.ts
- Page fetches `/api/generate` client-side

---

## FUNCTIONAL REQUIREMENTS
1. Page title and prominent heading = **{tool_name}**
2. Tagline shown below title: "{tool_tagline}"
3. Input form matching the UI style — all required fields visible
4. Submit button triggers loading state
5. Gemini response displayed with clear visual hierarchy (not raw text)
6. Parse response into sections where possible
7. Handle errors gracefully with user-friendly message
8. Fully responsive — mobile and desktop

---

## OUTPUT FORMAT — MANDATORY
No text outside these delimiters. No markdown fences inside blocks.

--- FILE: app/page.tsx ---
[complete code]
--- FILE: app/api/generate/route.ts ---
[complete code]
--- FILE: app/globals.css ---
[complete CSS with @tailwind directives + all custom styles + Google Font @import]
--- END ---

---

## QUALITY BAR
- UI must be immediately recognizable as {ui_name}
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: {color_hint}
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **{tool_name}** must be prominent in the UI
"""

# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
def main():
    print("\n=== HACKATHON FACTORY PHASE 2 — GENERATE PROMPTS ===\n")

    if not os.path.isdir(PROJECTS_DIR):
        print(f"ERROR: projects dir not found: {PROJECTS_DIR}")
        print("Run scaffold_phase2.ps1 first")
        sys.exit(1)

    total = 0
    for problem_slug, tools in TOOLS.items():
        problem_data = PROBLEMS[problem_slug]
        for tool in tools:
            num      = tool["num"]
            slug     = f"{problem_slug}-{num}"
            proj_dir = os.path.join(PROJECTS_DIR, slug)
            deploy   = f"{tool['name'].lower().replace(' ', '-')}-sc"
            ui_key   = tool["ui"]
            ui_data  = UI_STYLES[ui_key]

            if not os.path.isdir(proj_dir):
                print(f"  SKIP (folder missing): {slug}")
                continue

            prompt = PROMPT_TEMPLATE.format(
                slug             = slug,
                tool_name        = tool["name"],
                ui_name          = ui_key.capitalize(),
                deploy_name      = deploy,
                problem_statement= problem_data["statement"].strip(),
                tool_tagline     = tool["tagline"],
                domain           = problem_data["domain"],
                user_input       = tool["user_input"],
                user_output      = tool["user_output"],
                gemini_role      = tool["gemini_role"],
                ui_style_brief   = ui_data.strip(),
                gemini_prompt    = tool["gemini_prompt"],
                color_hint       = tool["color"],
            )

            with open(os.path.join(proj_dir, "PROMPT.md"), "w", encoding="utf-8") as f:
                f.write(prompt)

            print(f"  OK: {slug}/PROMPT.md ({tool['name']} | {ui_key})")
            total += 1

    print(f"\nDone. {total}/30 PROMPT.md files written.")
    print("Next: run each project's PROMPT.md through agentic Claude")

if __name__ == "__main__":
    main()