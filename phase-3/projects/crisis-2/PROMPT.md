

---

# AGENT PROMPT — crisis-merged-2

# Tool: CrisisFlow | UI: Aurora Terminal Fusion

# Deployment domain: crisisflow-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **CrisisFlow**

---

## PROBLEM CONTEXT

In high-stakes emergencies, communication fails at two critical layers:

* **Guest layer:** distressed individuals need immediate, simple instructions
* **Broadcast layer:** organizations must communicate clearly across multiple channels

Most systems solve one, not both — leading to confusion, panic, or inconsistent messaging.

Objective: Build a unified communication system that:

1. Guides individuals in real time during emergencies
2. Generates coordinated communication across all official channels

---

## THIS TOOL

**Name:** CrisisFlow
**Tagline:** Guide individuals. Align communication. Control the narrative.
**Domain:** emergency communication systems, hospitality safety, crisis coordination

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: GUEST GUIDANCE

**User inputs:**

* Emergency type
* Guest location
* Number of people
* Visible dangers

**User sees:**

* 5 immediate action steps (simple, numbered)
* 3 critical “DO NOT” warnings
* One calming reassurance sentence

Purpose: Reduce panic and guide immediate safe behavior

---

### MODE 2: CRISIS BROADCAST

**User inputs:**

* Emergency type
* Venue name
* Current situation
* Target audience
* Tone

**User sees:**

* PA announcement (≤3 sentences)
* Staff briefing (5 tactical bullets)
* Social media statement (≤280 chars)

Purpose: Ensure consistent, multi-channel communication

---

### GEMINI ROLE

System prompt used in API route:

"You are a real-time crisis communication AI.

If the input is about a guest in danger:

* Provide:
  (1) 5 simple immediate actions
  (2) 3 critical things NOT to do
  (3) One calming reassurance sentence
* Use extremely simple language

If the input is about organizational communication:

* Generate:
  (1) PA announcement (≤3 sentences)
  (2) Staff briefing (5 bullet points)
  (3) Social media statement (≤280 characters)
* Tailor tone to audience

Always:

* Be clear, calm, and precise
* Avoid unnecessary complexity
* Prioritize real-world usability"

Append user input dynamically.

---

## MVP TITLE

**CrisisFlow MVP: Individual Guidance + Broadcast Control System**

---

## UI STYLE

AURORA TERMINAL FUSION
━━━━━━━━━━━━━━━━━━━━━━

Combines:

* Aurora (calm, immersive guidance)
* Terminal (precise, command-style output)

---

### CORE CONCEPT

**Calm interface. Command-grade output.**

---

### VISUAL LANGUAGE

**Background (Aurora):**

* Deep dark base (#050810)
* Animated gradient orbs:

  * Blue (#2563eb)
  * Purple (#7c3aed)
  * Teal (#00d4aa)
* Slow movement (8–12s)

---

**Foreground (Terminal panels):**

* Output sections use:

  * Dark panels
  * Monospace font
  * Cyan/green highlights
* Structured like command output

---

### COLOR SYSTEM

* Background: deep navy/black
* Primary: cyan + purple gradients
* Text: white primary, grey secondary
* Terminal accents: green (#39ff14)
* Alerts: red for danger

---

### TYPOGRAPHY

* Headings: Inter / Plus Jakarta Sans
* Output: JetBrains Mono (terminal feel)
* Mixed typography:

  * UI = modern clean
  * Output = machine precise

---

### COMPONENT DESIGN

**Cards:**

* Glassmorphism style (aurora overlay)
* Subtle borders + glow

**Guest Output:**

* Large, readable steps
* Clear separation of DO vs DO NOT

**Broadcast Output:**

* Terminal-style blocks:

  * > PA SYSTEM
  * > STAFF BRIEFING
  * > SOCIAL OUTPUT

**Buttons:**

* Hybrid:

  * Glow + sharp hover
  * Label style: `[ GENERATE ]`

**Inputs:**

* Dark glass fields
* Focus glow

---

### LAYOUT

* Top mode switch:

  * "Guest Guidance"
  * "Broadcast Scripts"
* Centered workspace
* Output appears in structured panels
* Mobile responsive stack

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

1. Title: **CrisisFlow**
2. Tagline clearly visible
3. Mode switch (Guidance vs Broadcast)
4. Dynamic input fields per mode
5. Submit button with loading state
6. Structured outputs:

**Guidance mode:**

* Numbered steps
* DO NOT section
* Reassurance clearly visible

**Broadcast mode:**

* 3 distinct script sections
* Terminal-style formatting

7. Strong visual hierarchy
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
[complete CSS with Tailwind + aurora + terminal styles]

--- END ---

---

## QUALITY BAR

* Must feel like a **real emergency communication platform**
* Guidance must be readable under stress
* Broadcast outputs must feel deployable immediately
* UI must clearly separate calm (aurora) vs command (terminal)
* Outputs must be structured, not verbose
