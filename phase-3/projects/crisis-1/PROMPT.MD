

---

# AGENT PROMPT — crisis-merged

# Tool: CrisisSync | UI: Neo-Brutal Command

# Deployment domain: crisissync-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **CrisisSync**

---

## PROBLEM CONTEXT

Hospitality and large venues operate in high-risk environments where emergencies unfold rapidly.
During a crisis, two critical failures occur simultaneously:

* **Signal chaos:** panicked, unstructured input from guests
* **Coordination gaps:** fragmented situational awareness across staff

This results in delayed response, misallocation of personnel, and preventable escalation.

Objective: Build a unified system that:

1. Converts chaotic emergency input into structured intelligence
2. Synthesizes staff status into a real-time operational view

---

## THIS TOOL

**Name:** CrisisSync
**Tagline:** Turn chaos into coordinated action in real time
**Domain:** crisis coordination, emergency response systems, hospitality safety

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: INCIDENT TRANSLATION

**User inputs:**

* Raw panicked message / call transcript

**User sees:**

* Incident Type
* Location
* People Affected
* Severity (1–5)
* Immediate Needs
* Caller Status
* Calm responder briefing

Purpose: Convert emotional noise into actionable intelligence instantly

---

### MODE 2: TEAM SYNTHESIS

**User inputs:**

* Multiple staff check-ins (name, location, status, observations)

**User sees:**

* Team Status Map
* Zone Coverage Assessment
* Top Coverage Gaps
* Redeployment Recommendations

Purpose: Build a real-time operational picture from fragmented updates

---

### GEMINI ROLE

System prompt used in API route:

"You are a real-time crisis coordination AI.

If the input is a distressed message:

* Extract structured emergency facts:
  Incident Type, Location, People Affected, Severity (1-5), Immediate Needs, Caller Status
* Provide a calm 2-sentence responder briefing

If the input is staff updates:

* Generate:
  (1) Team Status Map
  (2) Zone Coverage Assessment
  (3) Top 3 Coverage Gaps
  (4) Redeployment Recommendations

Always:

* Be concise, structured, and operationally actionable
* Prioritize clarity over completeness
* Remove emotional noise"

Append user input dynamically.

---

## MVP TITLE

**CrisisSync MVP: Signal → Situation → Response System**

---

## UI STYLE

NEO-BRUTAL COMMAND
━━━━━━━━━━━━━━━━━━━

Fusion of:

* Brutalism (urgency, visibility)
* Neomorphism (clarity, calm structure)

---

### CORE CONCEPT

**Harsh input. Calm control.**

---

### VISUAL LANGUAGE

**Base Layer (Neomorphism):**

* Soft grey background (#e6e9ef)
* Floating panels with dual shadows:

  * Light (top-left)
  * Dark (bottom-right)

---

**Overlay Layer (Brutalism):**

* Critical elements (alerts, headings, buttons):

  * Thick black borders (2–4px)
  * Offset shadows for urgency
* Red highlight blocks for high severity

---

### COLOR SYSTEM

* Base: soft grey
* Primary accent: emergency red (#dc2626)
* Secondary: amber (#f59e0b)
* Neutral: charcoal text
* Success: muted green

---

### TYPOGRAPHY

* Headings: Space Grotesk (bold, commanding)
* Body: Inter / Poppins (clean, readable)
* Labels: uppercase for operational clarity

---

### COMPONENT DESIGN

**Cards:**

* Soft neomorphic containers
* Critical sections get brutal borders

**Incident Output:**

* Structured blocks:

  * INCIDENT
  * LOCATION
  * SEVERITY
  * NEEDS
* Severity visually encoded (color + size)

**Team Output:**

* Grid-style map (textual)
* Coverage + gaps clearly highlighted

**Buttons:**

* Primary: brutal style (border + offset shadow)
* Secondary: soft neomorphic

**Inputs:**

* Soft inset fields
* Focus state with red/amber glow

---

### LAYOUT

* Top mode switch:

  * "Incident Input"
  * "Team Status"
* Split sections:

  * Input panel
  * Output panel
* Responsive stack on mobile

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

1. Title: **CrisisSync**
2. Tagline clearly visible
3. Mode switch (Incident vs Team)
4. Input adapts based on mode
5. Submit button with strong loading state
6. Structured outputs:

**Incident mode:**

* Clearly separated fact blocks
* Highlight severity

**Team mode:**

* Structured team + zone output
* Clear gaps + recommendations

7. Visual hierarchy must emphasize urgency vs clarity
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
[complete CSS with Tailwind + neo-brutal styles]

--- END ---

---

## QUALITY BAR

* Must feel like a **real emergency operations tool**
* Immediate readability under stress is critical
* Visual hierarchy must guide rapid decision-making
* Inputs and outputs must feel operational, not experimental
* UI must clearly differentiate urgency (brutal) vs structure (neo)
