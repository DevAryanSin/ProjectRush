
---

# AGENT PROMPT — digital-merged

# Tool: IPForge | UI: Neo-Brutal Legal Fusion

# Deployment domain: ipforge-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **IPForge**

---

## PROBLEM CONTEXT

Digital sports media assets are increasingly vulnerable to:

* Unauthorized redistribution
* Content cloning and reposting
* Lack of traceable ownership proof
* Weak legal follow-through

Organizations face two major gaps:

1. **Pre-protection failure** — assets are not uniquely fingerprinted
2. **Post-violation friction** — legal action is slow and unstructured

Objective: Build a system that:

* Generates strong ownership signatures upfront
* Enables rapid legal action when infringement occurs

---

## THIS TOOL

**Name:** IPForge
**Tagline:** Mark your assets. Prove ownership. Build your case instantly.
**Domain:** digital rights management, copyright enforcement, sports media protection

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: WATERMARK GENERATION

**User inputs:**

* Asset title
* Creator name
* Organization
* Asset type
* Creation date

**User sees:**

* Unique steganographic watermark string
* Encoded ownership signature
* Step-by-step embedding instructions

Purpose: Establish traceable ownership before distribution

---

### MODE 2: LEGAL CASE BUILDER

**User inputs:**

* Asset description
* Original publish date
* Infringing URL
* Type of infringement
* Evidence available

**User sees:**

* Case title
* Legal basis (copyright / DMCA)
* Evidence chain (present vs missing)
* Estimated damages range
* 5 prioritized legal actions

Purpose: Enable rapid, structured legal response

---

### GEMINI ROLE

System prompt used in API route:

"You are a digital IP protection and legal analysis AI.

If the input is about asset creation:

* Generate:
  (1) A unique watermark signature
  (2) Encoded ownership token
  (3) Clear embedding instructions

If the input is about infringement:

* Generate:
  (1) Case title
  (2) Legal basis (copyright/DMCA)
  (3) Evidence chain (have vs need)
  (4) Estimated damages range
  (5) 5 prioritized legal actions

Always:

* Be precise and actionable
* Avoid vague statements
* Structure output clearly"

Append user input dynamically.

---

## MVP TITLE

**IPForge MVP: Ownership + Enforcement System**

---

## UI STYLE

NEO-BRUTAL LEGAL FUSION
━━━━━━━━━━━━━━━━━━━━━━━

Combines:

* Brutalism (authority, assertiveness)
* Neomorphism (clarity, usability)

---

### CORE CONCEPT

**Hard protection. Soft workflow.**

---

### VISUAL LANGUAGE

**Base Layer (Neomorphism):**

* Soft grey background (#e5e7eb)
* Floating UI panels with dual shadows

---

**Overlay Layer (Brutalism):**

* Key outputs (signatures, legal results):

  * Thick black borders
  * Offset shadows
* Emphasized sections for authority

---

### COLOR SYSTEM

* Base: soft grey
* Primary: deep blue (#1e3a8a)
* Accent: electric yellow (#facc15)
* Alert: red for violations
* Neutral: charcoal text

---

### TYPOGRAPHY

* Headings: Space Grotesk (bold, authoritative)
* Body: Inter / Poppins
* Labels: uppercase for structure

---

### COMPONENT DESIGN

**Cards:**

* Neomorphic containers
* Critical outputs get brutal styling

**Watermark Output:**

* Signature displayed in bold, boxed format
* Copy-ready blocks

**Legal Output:**

* Sectioned legal summary:

  * CASE TITLE
  * LEGAL BASIS
  * EVIDENCE
  * DAMAGES
  * ACTION PLAN

**Buttons:**

* Primary: brutal style (border + offset shadow)
* Secondary: soft inset

**Inputs:**

* Soft inset fields
* Focus glow

---

### LAYOUT

* Top mode switch:

  * "Watermark"
  * "Legal Case"
* Two-panel layout:

  * Input (left/top)
  * Output (right/bottom)
* Responsive stacking

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

1. Title: **IPForge**
2. Tagline clearly visible
3. Mode switch (Watermark vs Legal)
4. Dynamic input forms
5. Submit button with strong loading state
6. Structured outputs:

**Watermark mode:**

* Signature + encoding instructions

**Legal mode:**

* Fully structured legal summary

7. Strong visual hierarchy
8. Error handling
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

* Must feel like a **serious IP protection platform**
* Outputs must be immediately usable
* UI must communicate authority and clarity
* Watermark section must feel technical and precise
* Legal section must feel structured and actionable
