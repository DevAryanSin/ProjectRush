

---

# AGENT PROMPT — crisis-merged-3

# Tool: RiskLens | UI: Editorial Clay Fusion

# Deployment domain: risklens-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **RiskLens**

---

## PROBLEM CONTEXT

Crisis management is incomplete without both:

* **Prevention:** identifying risks before incidents occur
* **Reflection:** analyzing incidents after they happen

Most systems focus on one phase only, resulting in:

* Repeated failures due to unidentified hazards
* Poor learning from past incidents

Objective: Build a system that enables teams to:

1. Identify hazard zones proactively
2. Generate structured post-incident analysis
3. Close the loop between risk detection and continuous improvement

---

## THIS TOOL

**Name:** RiskLens
**Tagline:** Map risks before. Learn from failures after.
**Domain:** risk analysis, incident management, hospitality safety systems

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: HAZARD ANALYSIS

**User inputs:**

* Venue type
* Number of floors
* Key areas (lobby, kitchen, pool, etc.)
* Occupancy
* Known hazards

**User sees:**

* Risk-ranked zones (HIGH / MEDIUM / LOW)
* Hazard types per zone
* Why each zone is risky
* 2 mitigation actions per zone
* Top 3 emergency access recommendations

Purpose: Identify and mitigate risks before incidents occur

---

### MODE 2: POST-MORTEM REPORT

**User inputs:**

* What happened
* Timeline
* What worked
* What failed
* Teams involved
* Outcome

**User sees:**

* Executive Summary
* Incident Timeline
* Root Cause Analysis (5-Why)
* What Worked
* What Failed
* 5-point Prevention Plan

Purpose: Learn systematically from incidents and prevent recurrence

---

### GEMINI ROLE

System prompt used in API route:

"You are a risk analysis and incident review AI.

If the input describes a venue:

* Identify hazard zones with:
  risk level, hazard types, explanation, and mitigation actions
* Provide top 3 emergency access recommendations

If the input describes an incident:

* Generate a structured post-mortem:
  Executive Summary (2 sentences),
  Timeline,
  Root Cause Analysis (5-Why),
  What Worked,
  What Failed,
  5-item Prevention Plan

Always:

* Be specific and practical
* Focus on actionable insights
* Avoid generic statements"

Append user input dynamically.

---

## MVP TITLE

**RiskLens MVP: Prevention + Post-Mortem Intelligence System**

---

## UI STYLE

EDITORIAL CLAY FUSION
━━━━━━━━━━━━━━━━━━━━━━

Combines:

* Editorial (PostMortemPro)
* Claymorphism (HazardMap)

---

### CORE CONCEPT

**Serious analysis, delivered in a tactile interface**

---

### VISUAL LANGUAGE

**Base Layer (Editorial):**

* Background: warm off-white (#f5f0e8)
* Serif typography for reports
* Thin separators (1px rule lines)
* Structured, readable layout

---

**Component Layer (Claymorphism):**

* Soft, rounded cards (20–30px radius)
* Elevated shadows:
  box-shadow: 0 20px 60px rgba(0,0,0,0.12)
* Pastel accents for zones and highlights

---

### COLOR SYSTEM

* Background: cream
* Primary text: near-black
* Accent: deep red / ink blue (editorial tone)
* Secondary accents: pastel (risk visualization)
* Risk colors:

  * HIGH → soft red
  * MEDIUM → amber
  * LOW → green

---

### TYPOGRAPHY

* Headings: Playfair Display (authority)
* Body: Source Serif / Georgia
* UI elements: Nunito (rounded contrast)

---

### COMPONENT DESIGN

**Cards:**

* Clay-style containers holding structured editorial content

**Hazard Output:**

* Each zone in a separate rounded card
* Risk level visually encoded (color + label)

**Post-Mortem Output:**

* Article-style layout:

  * Headline (Executive Summary)
  * Sections clearly divided

**Buttons:**

* Rounded, pill-style
* Soft gradient
* Press interaction

**Inputs:**

* Rounded, spacious
* Clean editorial feel

---

### LAYOUT

* Top mode switch:

  * "Hazard Analysis"
  * "Post-Mortem"
* Centered column layout
* Outputs flow vertically
* Responsive design

---

## TECH CONSTRAINTS

* Next.js 16 (App Router)
* TypeScript (.tsx)
* Tailwind CSS + globals.css
* Icons: lucide-react only
* No extra npm packages

---

## GEMINI API INTEGRATION

* Model: `gemini-2.5-flash`
* API route: `app/api/generate/route.ts`
* POST body: `{ "prompt": "user input + mode context" }`
* Server-side only (env: GEMINI_API_KEY)

---

## FUNCTIONAL REQUIREMENTS

1. Title: **RiskLens**
2. Tagline clearly visible
3. Mode switch (Hazard vs Post-Mortem)
4. Input adapts to selected mode
5. Submit button with loading state
6. Structured outputs:

**Hazard mode:**

* Zone-based cards
* Risk clearly visualized

**Post-mortem mode:**

* Clean editorial report structure

7. Strong readability and hierarchy
8. Graceful error handling
9. Fully responsive

---

## OUTPUT FORMAT — MANDATORY

No text outside these delimiters. No markdown fences inside blocks.

--- FILE: app/page.tsx ---
[complete code]

--- FILE: app/api/generate/route.ts ---
[complete code]

--- FILE: app/globals.css ---
[complete CSS with Tailwind + editorial + clay styles]

--- END ---

---

## QUALITY BAR

* Must feel like a **professional risk management platform**
* Editorial clarity must be preserved for reports
* Clay UI must enhance usability, not distract
* Hazard outputs must be scannable and visual
* Post-mortems must be structured and actionable
