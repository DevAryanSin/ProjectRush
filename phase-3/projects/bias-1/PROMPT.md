
---

# AGENT PROMPT — bias-merged

# Tool: FairPrompt | UI: Neo-Brutal Fusion

# Deployment domain: fairprompt-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **FairPrompt**

---

## PROBLEM CONTEXT

Modern AI systems increasingly influence critical decisions such as hiring, lending,
and access to services. These systems often inherit bias from both:

* The **data they are trained on**
* The **prompts or instructions they are given**

Bias can exist **before** a model is even executed — embedded directly in prompts,
job descriptions, or task framing.

Objective: Build a unified tool that analyzes **both AI prompts and job descriptions**
for bias, surfaces risks, and provides actionable rewrites to improve fairness and inclusivity.

---

## THIS TOOL

**Name:** FairPrompt
**Tagline:** Audit prompts and job descriptions for bias — fix them before they cause harm
**Domain:** AI fairness, hiring equity, bias detection, algorithmic accountability

---

### CORE CAPABILITIES

This tool combines functionality from both systems:  

---

### MODE 1: PROMPT AUDIT

**User inputs:** Any AI system prompt or user prompt
**User sees:**

* Bias types (framing / assumptions / stereotypes / exclusions)
* Affected groups
* Severity ratings (HIGH / MEDIUM / LOW)
* Highlighted biased phrases
* Bias-reduced rewritten prompt

---

### MODE 2: HIRING AUDIT

**User inputs:** Full job description
**User sees:**

* Flagged discriminatory phrases
* Explanation of discrimination mechanism
* Affected groups
* Severity ratings
* Fully rewritten inclusive job description

---

### GEMINI ROLE

Gemini acts as a **bias analysis engine** across both modes:

System prompt used in API route:

"You are a bias and fairness auditor. Analyze the input text and:
(1) Identify all biased or discriminatory phrases (quote exact text),
(2) Classify bias type (framing, assumption, exclusion, stereotype),
(3) Identify affected groups,
(4) Assign severity HIGH/MEDIUM/LOW,
(5) Explain why each instance is problematic,
(6) Provide a fully rewritten, bias-reduced version of the text.
If the input is a job description, apply inclusive hiring principles and reference EEOC-style fairness where relevant."

Append user input dynamically.

---

## MVP TITLE

**FairPrompt MVP: Dual Bias Intelligence System**

---

## UI STYLE

NEO-BRUTAL FUSION
━━━━━━━━━━━━━━━━━━

This UI intentionally merges:

* Brutalism (from PromptBias)
* Neomorphism (from HiringLens)

### Core Concept:

**Soft structure meets hard truth**

---

### VISUAL LANGUAGE

**Base Layer (Neomorphism):**

* Background: soft neutral (#e8ecf1)
* Elements: soft extruded surfaces
* Dual shadows:

  * Light: top-left
  * Dark: bottom-right

**Overlay Layer (Brutalism accents):**

* Sharp black borders (2–4px) on key interactive elements
* Offset shadows for emphasis (buttons, results)
* High contrast highlight blocks for flagged bias

---

### COLOR SYSTEM

* Base: soft grey / off-white
* Primary accent: electric purple (#6D28D9)
* Secondary accent: warning red (#EF4444)
* Success accent: green (#10B981)

---

### TYPOGRAPHY

* Headings: Space Grotesk (bold, slightly brutal)
* Body: Poppins (clean, readable)
* Labels: uppercase, medium weight

---

### COMPONENT STYLE

**Cards:**

* Neomorphic base
* Optional brutal border for emphasis sections

**Buttons:**

* Default: soft extruded
* Active: inset (pressed)
* Primary CTA: brutal border + offset shadow

**Inputs:**

* Soft inset fields (neomorphic)
* Focus: purple glow + thin border

**Results:**

* Sectioned blocks:

  * Bias Findings
  * Affected Groups
  * Severity
  * Rewritten Version
* Highlight flagged phrases with red brutal tags

---

### LAYOUT

* Centered main container
* Toggle at top:

  * "Prompt Audit"
  * "Hiring Audit"
* Responsive grid
* Clear separation between input and results

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

1. Title: **FairPrompt**
2. Tagline visible below
3. Mode switch (Prompt vs Hiring)
4. Input textarea adapts label based on mode
5. Submit button with loading state
6. Structured results display:

   * Bias types
   * Affected groups
   * Severity
   * Highlighted phrases
   * Rewritten output
7. Clear visual hierarchy
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
[complete CSS with Tailwind + fonts + neo-brutal styles]

--- END ---

---

## QUALITY BAR

* Must feel like a **real SaaS product**
* UI must clearly reflect hybrid design system
* Mode switching must feel intentional and distinct
* Results must be structured — not raw text
* Bias highlighting must be visually obvious
* Typography must reinforce hierarchy and clarity

---
