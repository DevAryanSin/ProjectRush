#!/usr/bin/env python3
"""
generate_prompts.py — Phase 3
Writes a fully self-contained PROMPT.md into each of the 30 project folders.
Agentic Claude reads this file and outputs all website code in one shot.

Usage: python3 scripts/generate_prompts.py
"""

import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_DIR = os.path.join(ROOT_DIR, "projects")

# ─────────────────────────────────────────────────────────────
# PROBLEM STATEMENTS (full text)
# ─────────────────────────────────────────────────────────────
PROBLEMS = {
    "p1-digital-asset": {
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
        "color_hint": "deep navy and electric gold — sports prestige meets digital security",
    },
    "p2-crisis-response": {
        "title": "Rapid Crisis Response — Accelerated Emergency Response and Crisis Coordination in Hospitality",
        "statement": """Hospitality venues face unpredictable, high-stakes emergencies that demand instantaneous,
coordinated reactions to protect lives and property. During a crisis, critical information is
often siloed, fracturing communication between distressed guests, on-site staff, and first
responders.

Objective: Design a robust solution to instantly detect, report, and synchronize crisis response
efforts across a decentralized hospitality ecosystem. Eliminate fragmented communication by
creating a highly reliable bridge between distressed individuals, active personnel,
and emergency services.""",
        "domain": "hospitality emergency management, crisis coordination, safety systems",
        "color_hint": "urgent red and cool white — emergency alertness with calm authority",
    },
    "p3-supply-chain": {
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
        "color_hint": "industrial teal and amber — logistics precision meets real-time intelligence",
    },
    "p4-unbiased-ai": {
        "title": "Unbiased AI Decision — Ensuring Fairness and Detecting Bias in Automated Decisions",
        "statement": """Computer programs now make life-changing decisions about who gets a job, a bank loan,
or even medical care. However, if these programs learn from flawed or unfair historical data,
they will repeat and amplify those exact same discriminatory mistakes.

Objective: Build a clear, accessible solution to thoroughly inspect data sets and software models
for hidden unfairness or discrimination. Provide organizations with an easy way to measure, flag,
and fix harmful bias before their systems impact real people.""",
        "domain": "AI fairness, bias detection, algorithmic accountability, ethics",
        "color_hint": "deep purple and clean white — analytical precision meets human ethics",
    },
    "p5-volunteer-coord": {
        "title": "Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact",
        "statement": """Local social groups and NGOs collect a lot of important information about community needs
through paper surveys and field reports. However, this valuable data is often scattered across
different places, making it hard to see the biggest problems clearly.

Objective: Design a powerful system that gathers scattered community information to clearly show
the most urgent local needs. Build a smart way to quickly match and connect available volunteers
with the specific tasks and areas where they are needed most.""",
        "domain": "NGO operations, volunteer management, community needs assessment, social impact",
        "color_hint": "warm green and earthy orange — community warmth meets organized action",
    },
}

# ─────────────────────────────────────────────────────────────
# TOOL IDEAS per problem (6 per problem)
# ─────────────────────────────────────────────────────────────
TOOLS = {
    "p1-digital-asset": [
        {
            "slug": "s1-bento",
            "name": "ScanGuard",
            "tagline": "Paste a URL or content snippet — detect if sports media is stolen or misappropriated",
            "user_input": "A URL or text description of the content to analyze",
            "user_output": "A theft risk verdict (High/Medium/Low), confidence score, reasoning breakdown, and recommended action",
            "gemini_role": "Analyze the content description or URL context provided. Reason about indicators of unauthorized redistribution (missing attribution, suspicious platform patterns, content anomalies). Return a structured risk verdict with detailed reasoning.",
            "gemini_prompt_hint": "You are a digital IP protection AI. Analyze the following content for signs of unauthorized sports media use. Provide: risk level (HIGH/MEDIUM/LOW), confidence percentage, top 3 red flags found, and recommended action. Be specific and actionable.",
        },
        {
            "slug": "s2-glassmorphism",
            "name": "PropagationMap",
            "tagline": "Describe a media asset — understand how it has likely spread across platforms",
            "user_input": "Asset name, type (video/image/article), original publish date, original platform",
            "user_output": "A propagation risk summary: likely spread channels, high-risk platforms, anomaly signals, and a timeline narrative",
            "gemini_role": "Based on the asset description, simulate and explain how this type of sports media typically propagates across the internet. Identify which platforms are highest risk for unauthorized redistribution and flag anomaly patterns.",
            "gemini_prompt_hint": "You are a content propagation analyst for sports media. Given this asset description, explain its likely spread pattern across social media, streaming sites, and news aggregators. Identify top 3 high-risk redistribution channels and any anomaly signals to watch.",
        },
        {
            "slug": "s3-flat",
            "name": "DMCA Forge",
            "tagline": "Fill in asset details — get a ready-to-send DMCA takedown notice drafted instantly",
            "user_input": "Rights holder name, asset description, original URL, infringing URL, date of infringement",
            "user_output": "A complete, formatted DMCA takedown notice ready to send to the platform",
            "gemini_role": "Draft a formal, legally-structured DMCA takedown notice using the provided details. Use standard legal language. Make it specific, professional, and actionable.",
            "gemini_prompt_hint": "Draft a formal DMCA Section 512(c) takedown notice using these details. Include: identification of copyrighted work, location of infringing material, statement of good faith belief, accuracy statement, and signature block. Use professional legal language.",
        },
        {
            "slug": "s4-minimalism",
            "name": "AuthentiProof",
            "tagline": "Describe your asset's metadata — get an authenticity confidence score",
            "user_input": "Asset title, creator, creation date, file format, platform first published on, any watermark/signature details",
            "user_output": "An authenticity score (0-100%), originality signals found, red flags if any, and a verification summary",
            "gemini_role": "Analyze the metadata signals provided for the digital asset. Reason about originality markers, platform consistency, temporal logic, and creator attribution. Output an authenticity confidence score with detailed reasoning.",
            "gemini_prompt_hint": "You are a digital asset authentication specialist. Analyze these asset metadata signals and provide: authenticity score (0-100%), list of positive originality signals, list of suspicious anomalies, and a one-paragraph verification summary. Be precise.",
        },
        {
            "slug": "s5-normal",
            "name": "TamperLens",
            "tagline": "Describe a media file's properties — detect signs of tampering or cloning",
            "user_input": "File type, resolution, file size, encoding details, any visible watermarks, platform source",
            "user_output": "Tampering indicators found, clone likelihood score, manipulation type (if detected), and recommended next steps",
            "gemini_role": "Analyze the file property description for tampering signals. Look for encoding inconsistencies, resolution mismatches, watermark removal signs, metadata anomalies. Return specific tampering indicators with severity ratings.",
            "gemini_prompt_hint": "You are a forensic media analyst. Analyze these file properties for signs of tampering, cloning, or unauthorized modification. List specific tampering indicators found, rate each as HIGH/MEDIUM/LOW severity, give an overall clone likelihood score, and recommend verification steps.",
        },
        {
            "slug": "s6-glassui",
            "name": "RightsDesk",
            "tagline": "Register your digital assets and ask natural language questions about your rights",
            "user_input": "Asset details to register OR a natural language question about rights/licensing",
            "user_output": "Rights status, licensing options, recommended actions, or answers to rights questions",
            "gemini_role": "Act as a digital rights advisor. Answer natural language questions about sports media rights, licensing, ownership, and protection strategies. When given asset details, provide a rights assessment and protection recommendations.",
            "gemini_prompt_hint": "You are a sports media rights advisor. Answer this rights question or analyze this asset registration clearly and practically. Cover: ownership status, applicable protections, licensing options, and top 3 recommended actions. Use plain language alongside precise legal terms.",
        },
    ],
    "p2-crisis-response": [
        {
            "slug": "s1-bento",
            "name": "AlertBridge",
            "tagline": "Submit a crisis report — instantly generate a structured alert for all responders",
            "user_input": "Crisis type, location within venue, number of people affected, severity (1-5), brief description",
            "user_output": "A structured emergency alert with role-specific summaries for security, medical, management, and guest comms",
            "gemini_role": "Convert raw crisis input into a calm, structured multi-channel emergency alert. Generate separate brief summaries for each responder role. Prioritize clarity and actionability under pressure.",
            "gemini_prompt_hint": "You are a crisis communications AI for a hospitality venue. Convert this incident report into a structured emergency alert with 4 separate role-specific summaries: (1) Security Team, (2) Medical Response, (3) Management, (4) Guest Communication. Each should be 2-3 sentences, clear and action-focused.",
        },
        {
            "slug": "s2-glassmorphism",
            "name": "CrisisSync",
            "tagline": "Input your ongoing situation — get a live coordination checklist for every team",
            "user_input": "Venue type, crisis type, current status, teams available, time elapsed since incident",
            "user_output": "A prioritized coordination checklist with role assignments, time-sensitive actions, and escalation triggers",
            "gemini_role": "Generate a dynamic, role-specific coordination checklist for the crisis scenario. Include immediate actions (0-5 min), short-term actions (5-30 min), and escalation triggers. Assign responsibilities clearly.",
            "gemini_prompt_hint": "You are a hospitality crisis coordinator AI. For this situation, generate a dynamic coordination checklist organized by: IMMEDIATE (0-5 min), SHORT-TERM (5-30 min), and ESCALATION TRIGGERS. Assign each action to a specific role. Flag time-critical items with urgency markers.",
        },
        {
            "slug": "s3-flat",
            "name": "EvacuGuide",
            "tagline": "Enter your venue details and crisis type — get step-by-step evacuation instructions",
            "user_input": "Venue type (hotel/restaurant/event hall), number of floors, estimated occupancy, crisis type (fire/flood/security threat/medical mass casualty)",
            "user_output": "A complete evacuation plan with routes, assembly points, staff responsibilities, and guest communication scripts",
            "gemini_role": "Generate a detailed, venue-specific evacuation plan. Include primary and secondary routes, staff role assignments, guest communication scripts, and special needs considerations.",
            "gemini_prompt_hint": "You are an emergency evacuation planning AI for hospitality venues. Generate a complete evacuation plan for this venue and crisis type. Include: primary and backup evacuation routes, staff role assignments, guest announcement scripts (calm, clear language), special needs guest protocol, and assembly point management.",
        },
        {
            "slug": "s4-minimalism",
            "name": "FirstContact",
            "tagline": "Describe your emergency — get immediate calm guidance while help is on the way",
            "user_input": "Type of emergency, your location, number of people with you, any immediate dangers",
            "user_output": "Step-by-step immediate safety instructions, what to do RIGHT NOW, what NOT to do, and reassurance that help is coming",
            "gemini_role": "Act as a calm, authoritative emergency first-response guide for a distressed guest. Provide clear, numbered immediate safety steps. Use simple, panic-reducing language. Confirm help is being dispatched.",
            "gemini_prompt_hint": "You are a calm emergency response AI helping a distressed hotel or venue guest. Provide: (1) 3-5 immediate safety steps in simple numbered language, (2) 2-3 things NOT to do, (3) a reassuring closing statement confirming help is on the way. Keep language simple, clear, and calming. No jargon.",
        },
        {
            "slug": "s5-normal",
            "name": "IncidentLog",
            "tagline": "Describe what happened in plain language — get a formatted official incident report",
            "user_input": "A plain-language description of the incident: what happened, when, where, who was involved",
            "user_output": "A formatted official incident report with timestamp, categorization, narrative, parties involved, actions taken, and follow-up required",
            "gemini_role": "Transform messy plain-language field notes into a structured, professional incident report following hospitality industry standards. Extract key facts, fill standard report fields, and flag any missing critical information.",
            "gemini_prompt_hint": "You are an incident documentation AI for hospitality operations. Convert this plain-language incident description into a formal incident report with these sections: Incident Reference, Date/Time, Location, Incident Type, Parties Involved, Narrative Description, Immediate Actions Taken, Follow-Up Required, Reporting Officer. Note any missing information that should be obtained.",
        },
        {
            "slug": "s6-glassui",
            "name": "ResponderBrief",
            "tagline": "Input crisis type and venue — generate a complete first responder handoff brief",
            "user_input": "Venue name, venue type, crisis type, current status, number of casualties/affected persons, access point details",
            "user_output": "A concise, structured situational brief formatted for incoming emergency services: EMS, fire, police",
            "gemini_role": "Generate a clear, professional situational brief formatted specifically for incoming first responders. Prioritize facts over narrative. Include building layout context, current status, known hazards, and command contact.",
            "gemini_prompt_hint": "Generate a first responder situational brief (SBAR format: Situation, Background, Assessment, Recommendation) for incoming emergency services at a hospitality venue. Include: venue access points, current situation status, known hazards, estimated casualties, on-site command contact. Be factual, concise, and use emergency services terminology.",
        },
    ],
    "p3-supply-chain": [
        {
            "slug": "s1-bento",
            "name": "DisruptRadar",
            "tagline": "Input your shipment route — get a disruption risk score before it happens",
            "user_input": "Origin city, destination city, cargo type, departure date, transport mode (air/sea/rail/road)",
            "user_output": "Disruption probability score (0-100%), top risk factors, severity breakdown by category, and recommended mitigation",
            "gemini_role": "Analyze the route details and assess disruption probability. Consider weather patterns, geopolitical factors, seasonal demand, infrastructure reliability, and historical disruption data for that route type. Return a scored risk assessment.",
            "gemini_prompt_hint": "You are a supply chain disruption analyst AI. Analyze this shipment route and provide: overall disruption risk score (0-100%), top 3 risk factors with individual scores, risk categories (weather/geopolitical/infrastructure/demand), and 2-3 specific mitigation recommendations. Be data-driven and specific.",
        },
        {
            "slug": "s2-glassmorphism",
            "name": "RouteRethink",
            "tagline": "Describe a blocked or delayed route — get 3 optimized alternative routes instantly",
            "user_input": "Blocked route details, cargo specifications, urgency level, budget flexibility (low/medium/high)",
            "user_output": "Three alternative route options with cost estimate, time estimate, risk rating, and trade-off summary for each",
            "gemini_role": "Generate three distinct alternative routing options for the disrupted shipment. For each, provide estimated time impact, cost delta, risk rating, and clear trade-off explanation. Rank by recommended priority.",
            "gemini_prompt_hint": "You are a logistics optimization AI. The primary route is disrupted. Generate exactly 3 alternative routing options. For each option provide: route description, estimated time vs original, estimated cost delta (%), risk rating (1-5), key trade-offs, and best-for scenario. Rank them 1st/2nd/3rd choice with justification.",
        },
        {
            "slug": "s3-flat",
            "name": "BottleneckBot",
            "tagline": "Describe your delay or paste transit data — pinpoint exactly where the chain is breaking",
            "user_input": "Shipment description, expected vs actual timeline, last known location, any known issues",
            "user_output": "Root cause diagnosis, bottleneck location, cascade risk assessment, and targeted fix recommendations",
            "gemini_role": "Diagnose the supply chain bottleneck from the description. Identify root cause, primary and secondary failure points, cascade risk to downstream shipments, and prescribe targeted interventions.",
            "gemini_prompt_hint": "You are a supply chain diagnostics AI. Analyze this delay description and provide: root cause diagnosis (primary and contributing factors), bottleneck location in the chain, cascade risk to downstream operations (HIGH/MEDIUM/LOW), and 3 targeted fix recommendations ordered by impact. Be specific, not generic.",
        },
        {
            "slug": "s4-minimalism",
            "name": "ETA Shield",
            "tagline": "Input your shipment details and disruption event — get a revised ETA and impact summary",
            "user_input": "Original ETA, disruption type, disruption severity (1-5), current location, cargo criticality",
            "user_output": "Revised ETA range, delay impact assessment, downstream effects, and stakeholder communication draft",
            "gemini_role": "Recalculate delivery timeline based on disruption details. Assess downstream impact on dependent shipments or operations. Draft a concise stakeholder update communication.",
            "gemini_prompt_hint": "You are a logistics ETA recalculation AI. Given this disruption, provide: revised ETA (best case / likely / worst case), delay breakdown by cause, downstream impact on operations, and a draft stakeholder update email (3 sentences: what happened, new ETA, what's being done). Be realistic and specific.",
        },
        {
            "slug": "s5-normal",
            "name": "SupplierPulse",
            "tagline": "Describe a supplier situation — assess how risky it is to depend on them",
            "user_input": "Supplier name/type, what they supply, how long you've worked with them, any recent issues, alternative suppliers available",
            "user_output": "Supplier dependency risk score, vulnerability factors, single-source risk rating, and diversification recommendations",
            "gemini_role": "Evaluate the supplier relationship for concentration risk, reliability signals, and strategic vulnerability. Recommend diversification strategies with specific action steps.",
            "gemini_prompt_hint": "You are a supplier risk assessment AI. Evaluate this supplier relationship and provide: dependency risk score (0-100%), top 3 vulnerability factors, single-source risk rating (CRITICAL/HIGH/MEDIUM/LOW), and a 3-step diversification action plan. Include specific types of alternative suppliers to seek.",
        },
        {
            "slug": "s6-glassui",
            "name": "CargoDebrief",
            "tagline": "After a delay, describe what happened — get a full post-mortem and prevention plan",
            "user_input": "What happened, timeline of events, root cause (if known), business impact, teams involved",
            "user_output": "Structured post-mortem report with timeline, root cause analysis, lessons learned, and a prioritized prevention checklist",
            "gemini_role": "Conduct a supply chain post-mortem analysis. Extract root causes, identify systemic weaknesses, distill lessons, and generate a concrete prevention checklist ordered by impact.",
            "gemini_prompt_hint": "You are a supply chain post-mortem analyst. Analyze this incident and produce: structured timeline of failure, root cause analysis (5-Why format), 3 systemic weaknesses identified, key lessons learned, and a prioritized prevention checklist (5 items, ordered by impact). Be forensic and constructive.",
        },
    ],
    "p4-unbiased-ai": [
        {
            "slug": "s1-bento",
            "name": "BiasScope",
            "tagline": "Paste a dataset description or model output — get a bias risk assessment instantly",
            "user_input": "Dataset description OR model output sample, use case (hiring/lending/medical/other), target population",
            "user_output": "Bias risk rating, bias type identification, affected demographic groups, severity scores, and recommended audits",
            "gemini_role": "Analyze the dataset or model output for bias risk vectors. Identify bias types (historical, representation, measurement, aggregation), affected groups, and severity. Return a structured risk assessment.",
            "gemini_prompt_hint": "You are an AI bias risk analyst. Analyze this dataset description or model output for bias. Provide: overall bias risk rating (HIGH/MEDIUM/LOW), types of bias detected (historical/representation/measurement/aggregation), demographic groups most at risk, severity score for each bias type (1-5), and top 3 recommended audit actions. Be specific and cite evidence from the input.",
        },
        {
            "slug": "s2-glassmorphism",
            "name": "FairnessAudit",
            "tagline": "Describe your ML model and training data — receive a comprehensive fairness audit report",
            "user_input": "Model purpose, training data sources, input features used, output decision type, deployment context",
            "user_output": "A fairness audit report covering disparate impact risk, protected attributes exposure, fairness metrics to measure, and remediation priorities",
            "gemini_role": "Conduct a fairness audit based on the model description. Identify disparate impact risks, proxy discrimination through features, fairness metrics applicable to this use case, and prioritized remediation steps.",
            "gemini_prompt_hint": "You are an AI fairness auditor. Conduct a fairness audit of this ML model. Your report should cover: (1) Disparate impact risk assessment per protected group, (2) Proxy discrimination risks in listed features, (3) Recommended fairness metrics for this use case (e.g., equalized odds, demographic parity), (4) Top 5 remediation priorities ordered by urgency. Reference real AI fairness standards where applicable.",
        },
        {
            "slug": "s3-flat",
            "name": "DataMirror",
            "tagline": "Input your dataset columns and sample values — detect discriminatory proxies hiding in your data",
            "user_input": "Dataset column names, sample values for each column, intended use case",
            "user_output": "A list of discriminatory proxy features detected, what protected attribute each proxies for, risk level, and suggested transformations",
            "gemini_role": "Analyze the dataset features for proxy discrimination — features that correlate with protected attributes (race, gender, age, etc.) even when those attributes aren't directly present. Flag each with risk level and suggest data transformations.",
            "gemini_prompt_hint": "You are a data discrimination detection AI. Analyze these dataset features for proxy discrimination. For each suspicious feature, explain: what protected attribute it likely proxies (e.g., zip code → race, name → gender), the proxy mechanism, risk level (HIGH/MEDIUM/LOW), and a specific transformation or mitigation to reduce the proxy effect. Be precise with examples.",
        },
        {
            "slug": "s4-minimalism",
            "name": "DecisionTrace",
            "tagline": "Paste an automated decision output — get a plain-language explanation anyone can understand",
            "user_input": "The automated decision made (approved/denied/scored), the stated reason or factors, the decision domain (loan/job/medical)",
            "user_output": "A plain-language explanation of why the decision was made, what factors drove it, what could change the outcome, and your rights",
            "gemini_role": "Translate an opaque algorithmic decision into clear, accountable, human-readable language. Explain the decision logic, key driving factors, what would change the outcome, and what rights the affected person has.",
            "gemini_prompt_hint": "You are an algorithmic decision explainability AI. A person received this automated decision. Explain it in plain language covering: (1) Why this decision was likely made (key factors), (2) What factor had the biggest impact, (3) What could realistically change the outcome, (4) What rights this person has to appeal or request review. Use simple language a non-technical person would understand. Avoid jargon.",
        },
        {
            "slug": "s5-normal",
            "name": "FixItFlow",
            "tagline": "Describe a biased model outcome — get a step-by-step debiasing action plan",
            "user_input": "The biased outcome observed, which groups were disadvantaged, model type, available interventions (data/model/post-processing)",
            "user_output": "A prioritized debiasing action plan with specific techniques, implementation steps, and expected impact for each intervention",
            "gemini_role": "Prescribe a concrete debiasing action plan tailored to the bias type and available interventions. Order steps by impact and feasibility. Include specific techniques (reweighting, resampling, adversarial debiasing, calibration, etc.).",
            "gemini_prompt_hint": "You are an AI debiasing specialist. Given this biased outcome, create a concrete action plan with exactly 5 steps ordered by impact. For each step: name the technique (e.g., reweighting, resampling, threshold adjustment), explain how to implement it specifically for this case, estimate effort (Low/Medium/High), and expected bias reduction. Be technical but actionable.",
        },
        {
            "slug": "s6-glassui",
            "name": "EthicsCheck",
            "tagline": "Describe your AI system — get an ethics compliance checklist mapped to real standards",
            "user_input": "AI system purpose, data used, decisions it makes, affected populations, deployment scale",
            "user_output": "An ethics compliance checklist covering EU AI Act, IEEE standards, and fairness principles — with pass/fail/needs-review status for each item",
            "gemini_role": "Generate a context-aware AI ethics compliance checklist. Map requirements to real standards (EU AI Act, IEEE 7010, NIST AI RMF). Assess each item based on the system description provided.",
            "gemini_prompt_hint": "You are an AI ethics compliance auditor. For this AI system, generate a compliance checklist covering: EU AI Act requirements, NIST AI Risk Management Framework, and IEEE 7010 Wellbeing standard. For each checklist item: state the requirement, reference the standard, and give a status (LIKELY COMPLIANT / NEEDS REVIEW / LIKELY NON-COMPLIANT) based on the system description. Flag the top 3 highest-risk compliance gaps.",
        },
    ],
    "p5-volunteer-coord": [
        {
            "slug": "s1-bento",
            "name": "NeedMapper",
            "tagline": "Paste community survey data or field notes — extract and rank the most urgent needs",
            "user_input": "Raw community survey responses, field report text, or any unstructured community data",
            "user_output": "Top 10 ranked community needs, urgency scores, affected population estimates, geographic clustering, and priority categories",
            "gemini_role": "Extract, categorize, and rank community needs from unstructured text. Identify urgency signals, frequency of mention, severity indicators, and population affected. Output a structured, ranked needs assessment.",
            "gemini_prompt_hint": "You are a community needs analysis AI for NGOs. Analyze this raw community data and extract: top 10 urgent needs ranked by severity, urgency score for each (1-10), estimated affected population, need category (health/food/shelter/safety/education/livelihood), and key quotes or signals that indicate urgency. Format as a clear prioritized list.",
        },
        {
            "slug": "s2-glassmorphism",
            "name": "VolunteerMatch",
            "tagline": "Describe a volunteer and a community need — get a match score and detailed reasoning",
            "user_input": "Volunteer skills, availability (hours/week), location, languages spoken, experience — AND a community task description",
            "user_output": "Match score (0-100%), fit reasoning, skill alignment breakdown, potential gaps, and onboarding recommendations",
            "gemini_role": "Intelligently match volunteer profile to task requirements. Score the match across multiple dimensions (skills, availability, location, language, experience). Identify gaps and suggest how they can be bridged.",
            "gemini_prompt_hint": "You are a volunteer-task matching AI. Analyze this volunteer profile against this community task. Provide: overall match score (0-100%), skill alignment breakdown (score each relevant skill 1-5), availability fit assessment, location compatibility, language match, experience relevance, top 2 gaps and how to address them, and a 2-sentence onboarding recommendation. Be specific.",
        },
        {
            "slug": "s3-flat",
            "name": "TaskForge",
            "tagline": "Describe a community problem — auto-generate a complete volunteer task breakdown",
            "user_input": "Community problem description, available volunteer count, timeframe, geographic area, resources available",
            "user_output": "A structured volunteer task breakdown with specific assignable tasks, time estimates, skill requirements, and coordination notes",
            "gemini_role": "Decompose a vague community problem into specific, assignable, time-boxed volunteer tasks. Each task should have a clear output, required skills, time estimate, and dependencies.",
            "gemini_prompt_hint": "You are a volunteer task planning AI for NGOs. Decompose this community problem into exactly 6-8 specific volunteer tasks. For each task: task name, clear deliverable, required skills (max 3), time estimate (hours), volunteer count needed, dependencies on other tasks, and success criteria. Make tasks specific enough to assign immediately. Output as a structured task list.",
        },
        {
            "slug": "s4-minimalism",
            "name": "ImpactPulse",
            "tagline": "Input completed volunteer activity — generate a compelling impact summary report",
            "user_input": "Volunteer hours logged, tasks completed, number of volunteers, community members served, geographic area, time period",
            "user_output": "An impact narrative report with key metrics, human stories context, efficiency analysis, and stakeholder-ready summary",
            "gemini_role": "Transform raw volunteer activity data into a meaningful, human-centered impact narrative. Calculate efficiency metrics, contextualize numbers, and craft a compelling story for donors and stakeholders.",
            "gemini_prompt_hint": "You are an NGO impact reporting AI. Transform this volunteer activity data into a compelling impact report. Include: headline impact metric, narrative summary (3 sentences), key metrics with context (e.g., '120 meals delivered = 40 families fed for 3 days'), volunteer efficiency score, and a 1-sentence stakeholder quote-ready summary. Make numbers feel human and meaningful.",
        },
        {
            "slug": "s5-normal",
            "name": "FieldDebrief",
            "tagline": "Submit your field report in plain language — get it structured for NGO records automatically",
            "user_input": "A plain-language field report: what you saw, what you did, who you helped, any issues encountered",
            "user_output": "A structured NGO field report with date, location, activities, beneficiaries reached, issues flagged, and follow-up needed",
            "gemini_role": "Convert conversational volunteer field notes into structured, searchable NGO documentation. Extract key facts, fill standard report fields, flag urgent issues, and identify follow-up requirements.",
            "gemini_prompt_hint": "You are a field documentation AI for NGOs. Convert this volunteer field report into a structured record with these sections: Date/Location, Volunteer Name (if mentioned), Activities Completed, Beneficiaries Reached (count + description), Resources Used, Issues Encountered (flag urgent ones), Follow-Up Required, and Overall Field Status (GREEN/YELLOW/RED). Note any critical information that is missing.",
        },
        {
            "slug": "s6-glassui",
            "name": "UrgencyRank",
            "tagline": "Input multiple community needs — get them ranked by urgency and resource priority",
            "user_input": "A list of community needs (can be freeform text), available volunteer count, available budget, timeframe",
            "user_output": "A prioritized ranking of needs with urgency scores, resource allocation recommendations, and a deployment strategy",
            "gemini_role": "Reason across competing community needs to produce a prioritized allocation recommendation. Consider urgency, impact, resource efficiency, and feasibility. Output a deployment strategy with specific resource assignments.",
            "gemini_prompt_hint": "You are a resource allocation AI for NGO operations. Given these community needs and available resources, produce: ranked priority list (1 = most urgent) with urgency score (1-10) for each, reasoning for each ranking, recommended volunteer allocation per need (hours and headcount), budget allocation suggestion (%), and a 1-week deployment strategy. Justify trade-offs explicitly.",
        },
    ],
}

# ─────────────────────────────────────────────────────────────
# UI STYLE BRIEFS
# ─────────────────────────────────────────────────────────────
UI_STYLES = {
    "s1-bento": {
        "name": "Bento Box Grid",
        "brief": """
BENTO BOX GRID UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━
Core concept: The entire page is a grid of distinct rectangular cards (the "bento boxes").
Each card has a clear purpose and contains self-contained content. The grid is asymmetric —
cards vary in size (1×1, 2×1, 1×2, 2×2 units) creating visual hierarchy.

Visual language:
- Dark background (near-black #0a0a0a or deep navy) with colored card backgrounds
- Cards have subtle borders and slight rounded corners (8-12px)
- Each card has its own accent color or subtle gradient
- Typography is bold and large for headers inside cards
- Dense but organized — lots of information visible at once
- Card hover states with subtle glow or border highlight
- Numbers and stats get their own dedicated large-number cards

Layout rules:
- Use CSS Grid with auto-placement
- Main interaction card should be 2×2 or span full width
- Result cards populate the grid dynamically
- Mobile: stack to single column

Colors: Use the problem's color hint as your palette base.
Fonts: Choose a distinctive geometric sans-serif for headers, clean mono for data.
DO NOT: use white backgrounds, use equal-sized cards, use standard list layouts.
""",
    },
    "s2-glassmorphism": {
        "name": "Glassmorphism",
        "brief": """
GLASSMORPHISM UI STYLE
━━━━━━━━━━━━━━━━━━━━━━
Core concept: Frosted glass cards floating over a rich gradient or blurred background.
Everything feels translucent, layered, and ethereal. Depth is created through blur and opacity.

Visual language:
- Rich gradient background (deep, saturated — not flat)
- Cards use: backdrop-filter: blur(12-20px), background: rgba(255,255,255,0.08-0.15)
- Subtle white border: border: 1px solid rgba(255,255,255,0.18)
- Box shadows: 0 8px 32px rgba(0,0,0,0.3)
- Text is white or very light on dark glass panels
- Floating orbs or gradient blobs in background as atmosphere
- Input fields are glass-style with white placeholder text
- Buttons have gradient fills or glass variants

Layout rules:
- Centered card layout, max-width 680px for main panel
- Multiple layered glass panels for result sections
- Background has 2-3 large blurred color orbs (position: absolute, blur: 80-120px)
- Smooth CSS animations on load (fade + translateY)

Colors: Pick 2-3 saturated colors for background orbs. White for text.
Fonts: Choose an elegant, slightly rounded sans-serif. Light weights for body.
DO NOT: use white/light backgrounds, use solid opaque cards, skip the blur effect.
""",
    },
    "s3-flat": {
        "name": "Flat Design",
        "brief": """
FLAT DESIGN UI STYLE
━━━━━━━━━━━━━━━━━━━
Core concept: Zero depth. No shadows, no gradients, no skeuomorphism. Pure color blocks,
sharp edges, and bold typography. Every element is defined by color contrast alone.

Visual language:
- Bright, saturated flat colors (pick a bold primary + 2-3 complementary colors)
- No box-shadows, no gradients, no blur effects
- Sharp 0px or minimal (4px max) border radius
- Bold, large typography — font weight 700-900 for headers
- Flat icons (use lucide-react, strokeWidth 1.5-2)
- Color blocks define sections — alternating background colors
- Buttons are solid color rectangles with no effects
- Flat illustration-style decorative elements using CSS shapes

Layout rules:
- Clear section-based layout with color-defined zones
- Full-width colored header section
- Content in a clean grid below
- Results displayed as flat colored cards/tags
- Strong color contrast for all text (WCAG AA minimum)

Colors: Choose a bold palette — one dominant color, one action color, neutral base.
Fonts: Choose a bold geometric or humanist sans-serif. Avoid thin weights.
DO NOT: add shadows, add gradients, add blur, use rounded pill shapes.
""",
    },
    "s4-minimalism": {
        "name": "Minimalism",
        "brief": """
MINIMALIST UI STYLE
━━━━━━━━━━━━━━━━━━
Core concept: Maximum reduction. Only what is absolutely necessary exists on the page.
Whitespace is the primary design element. One or two accent colors maximum.
Every element has clear purpose — nothing decorative.

Visual language:
- White or very light grey background (#fafafa or #f5f5f5)
- One strong accent color (used sparingly — only for key actions and highlights)
- Typography-first: beautiful, considered type hierarchy does all the heavy lifting
- Generous padding and margin — content breathes
- Fine hairline borders (1px, light grey) instead of backgrounds to define sections
- No icons unless absolutely necessary; if used, they are monoline and small
- Inputs are borderless or have only a bottom border
- Results displayed as clean typographic lists or simple data lines

Layout rules:
- Single centered column, max-width 560-640px
- Large hero text at top stating purpose
- Simple form below
- Results as clean typographic output
- Significant empty space between sections

Colors: Off-white background, near-black text, ONE accent color.
Fonts: Choose a premium, distinctive typeface. Large sizes, tight leading.
DO NOT: add decorative elements, use multiple colors, add shadows or effects.
""",
    },
    "s5-normal": {
        "name": "Normal / Professional",
        "brief": """
NORMAL / PROFESSIONAL UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: A clean, professional web application UI. Familiar patterns but executed
with care and quality. Looks like a real SaaS product a professional would trust.

Visual language:
- White main background with light grey (#f8f9fa) sidebars or sections
- Primary brand color for CTAs and highlights
- Subtle shadows (0 1px 3px rgba(0,0,0,0.1)) to define card depth
- Consistent 4px border radius on cards and inputs
- Professional typography — clean, readable, appropriate size hierarchy
- Header/nav bar with logo area and possibly nav links
- Status indicators (badges, colored dots) for results
- Progress or loading states that feel polished

Layout rules:
- App-style layout with optional sidebar or top nav
- Main content area with card-based sections
- Form in a contained card with clear label/input pairs
- Results in separate card below or beside input
- Footer with minimal info

Colors: Professional palette — trust-inspiring. Blue/teal/green tones work well.
Fonts: Clean, legible sans-serif. System-font stack or a reliable Google Font.
DO NOT: look like a landing page, use heavy gradients, look like a portfolio site.
""",
    },
    "s6-glassui": {
        "name": "Glass UI",
        "brief": """
GLASS UI STYLE
━━━━━━━━━━━━━━
Core concept: Similar to glassmorphism but more structured and UI-focused. Glass cards
within a defined application layout. More opaque than pure glassmorphism — feels like
a premium dark-mode application, not an ethereal design concept.

Visual language:
- Dark base background (#0d1117 or similar very dark color)
- Cards use: background: rgba(255,255,255,0.05-0.08), backdrop-filter: blur(8px)
- More defined borders: border: 1px solid rgba(255,255,255,0.1)
- Colored glow accents on focus/hover (box-shadow with color)
- Neon-adjacent accent colors against dark background
- Input fields dark glass with colored focus ring glow
- Buttons with gradient or subtle glow effect
- Icons and text in white/light grey

Layout rules:
- App-style dark layout with header nav
- Glass sidebar or panel on left (optional)
- Main glass card for input
- Results in glass panels below or beside
- Subtle animated gradient border on active elements

Colors: Very dark background, 1-2 vivid accent colors (electric blue, violet, cyan, green).
Fonts: Choose a modern, technical-feeling font. Semi-bold weights for UI elements.
DO NOT: use light backgrounds, use fully opaque cards, skip the glow/accent effects.
""",
    },
}

# ─────────────────────────────────────────────────────────────
# PROMPT TEMPLATE
# ─────────────────────────────────────────────────────────────
PROMPT_TEMPLATE = """# AGENT PROMPT — {slug}
# {problem_title}
# Tool: {tool_name} | UI: {ui_name}
# ═══════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE GENERATING ANY CODE.
# ═══════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. You will generate a complete,
production-ready Next.js 16 web application as a functional MVP.

Generate ALL THREE files below in ONE response. Use the EXACT delimiters specified.
Do not add any explanation text, markdown, or commentary outside the delimiters.

---

## PROBLEM CONTEXT
{problem_statement}

---

## THIS SPECIFIC TOOL
**Name:** {tool_name}
**Tagline:** {tool_tagline}
**Domain:** {domain}

**What the user does:**
{user_input}

**What they see as output:**
{user_output}

**How Gemini AI is used:**
{gemini_role}

---

## UI STYLE REQUIREMENT
{ui_style_brief}

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${{API_KEY}}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{{ "prompt": "user input text here" }}`
- Response your API route returns: `{{ "result": "gemini response text" }}`

Gemini prompt to use in your API route (customize for this tool):
"{gemini_prompt_hint}"

Append the user's actual input to this system prompt when calling Gemini.

---

## TECH CONSTRAINTS (STRICT)
- Framework: Next.js 16, App Router (`app/` directory)
- Language: TypeScript (.tsx files)
- Styling: Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only (already installed)
- NO additional npm packages — only: next, react, react-dom, lucide-react, tailwindcss
- Build command: `next build --no-turbo`
- Node engine: 24.x
- The Gemini API call happens in `app/api/generate/route.ts` (server-side only)
- The page uses client-side fetch to call `/api/generate`
- Add `'use client'` directive to `app/page.tsx`

---

## FUNCTIONAL REQUIREMENTS
1. User sees a clean, styled input form matching the UI style described above
2. User fills in the required input fields (described in "What the user does" above)
3. User clicks a submit/analyze button
4. A loading state is shown while waiting for Gemini
5. The Gemini response is displayed in a well-styled results section
6. The result should be parsed and displayed with visual hierarchy (not just raw text)
7. Error states are handled gracefully
8. The page is fully responsive (mobile + desktop)

---

## OUTPUT FORMAT (MANDATORY)
Respond with EXACTLY this structure. No text before or after. No markdown code fences
inside the blocks. Use these exact delimiters:

--- FILE: app/page.tsx ---
[complete TypeScript React component code here]
--- FILE: app/api/generate/route.ts ---
[complete Next.js API route code here]
--- FILE: app/globals.css ---
[complete CSS with Tailwind directives and all custom styles here]
--- END ---

---

## QUALITY REQUIREMENTS
- The UI must look PROFESSIONAL and POLISHED — not like a placeholder
- The UI style must be immediately recognizable as {ui_name}
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "{tool_name}" must appear prominently in the UI
- Color palette must reflect: {color_hint}
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
"""

# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
def main():
    print("\n╔══════════════════════════════════════════════╗")
    print("║   HACKATHON FACTORY — GENERATE PROMPTS      ║")
    print("╚══════════════════════════════════════════════╝\n")

    if not os.path.isdir(PROJECTS_DIR):
        print(f"✗ Projects directory not found: {PROJECTS_DIR}")
        print("  Run: bash scripts/scaffold.sh first")
        sys.exit(1)

    total = 0
    for problem_slug, problem_data in PROBLEMS.items():
        tools_list = TOOLS[problem_slug]
        for tool in tools_list:
            style_slug = tool["slug"]
            project_slug = f"{problem_slug}-{style_slug}"
            project_dir = os.path.join(PROJECTS_DIR, project_slug)

            if not os.path.isdir(project_dir):
                print(f"  ⚠  Folder missing: {project_slug} — skipping")
                continue

            style_data = UI_STYLES[style_slug]

            prompt = PROMPT_TEMPLATE.format(
                slug=project_slug,
                problem_title=problem_data["title"],
                tool_name=tool["name"],
                ui_name=style_data["name"],
                problem_statement=problem_data["statement"].strip(),
                tool_tagline=tool["tagline"],
                domain=problem_data["domain"],
                user_input=tool["user_input"],
                user_output=tool["user_output"],
                gemini_role=tool["gemini_role"],
                ui_style_brief=style_data["brief"].strip(),
                gemini_prompt_hint=tool["gemini_prompt_hint"],
                color_hint=problem_data["color_hint"],
            )

            prompt_path = os.path.join(project_dir, "PROMPT.md")
            with open(prompt_path, "w", encoding="utf-8") as f:
                f.write(prompt)

            print(f"  ✅  {project_slug}/PROMPT.md")
            total += 1

    print(f"\n✨ {total}/30 PROMPT.md files written successfully")
    print("\nNext step → bash scripts/generate_one.sh <project-slug>")
    print("Example  → bash scripts/generate_one.sh p1-digital-asset-s1-bento")

if __name__ == "__main__":
    main()
