
---

# AGENT PROMPT — bias-merged-2

# Tool: FairScope | UI: Aurora Terminal Fusion

# Deployment domain: fairscope-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **FairScope**

---

## PROBLEM CONTEXT

AI systems are not only biased at the input level (prompts, job descriptions),
but also at the **system level**:

* Models are deployed without proper transparency
* Bias risks are undocumented or underestimated
* Decisions are rarely stress-tested for fairness

Two critical gaps exist:

1. **Lack of standardized bias-aware documentation**
2. **Lack of counterfactual testing before deployment**

Objective: Build a system that enables teams to:

* Document AI systems responsibly
* Stress-test them using counterfactual fairness scenarios

---

## THIS TOOL

**Name:** FairScope
**Tagline:** Document AI systems and stress-test them for fairness before deployment
**Domain:** AI governance, fairness auditing, model transparency, ethical AI

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: MODEL DOCUMENTATION

**User inputs:**

* Model purpose
* Training data description
* Intended users
* Known limitations
* Deployment context

**User sees:**

* Full AI model card:

  * Model Description
  * Intended Use
  * Out-of-Scope Use
  * Training Data Summary
  * Evaluation (placeholder)
  * Ethical Considerations
  * Bias & Fairness Risks
  * Mitigation Strategies
  * Pre-deployment checklist

---

### MODE 2: COUNTERFACTUAL TESTING

**User inputs:**

* Decision made
* Input variables used
* Demographic context
* Decision domain

**User sees:**

* 5 counterfactual fairness scenarios:

  * One demographic variable changed per case
  * Expected fair outcome
  * Bias risk indicator
  * Pass/fail style evaluation criteria

---

### GEMINI ROLE

System prompt used in API route:

"You are an AI fairness auditor and governance expert.

If the input describes a model:

* Generate a complete model card including fairness risks and mitigation strategies.

If the input describes a decision:

* Generate 5 counterfactual fairness test cases by changing one demographic variable at a time.
* Provide expected fair outcomes and indicate potential bias failures.

Always:

* Be specific
* Use structured sections
* Focus on real-world risks and actionable insights."

Append user input dynamically.

---

## MVP TITLE

**FairScope MVP: AI Governance + Counterfactual Testing System**

---

## UI STYLE

AURORA TERMINAL FUSION
━━━━━━━━━━━━━━━━━━━━━━

This UI merges:

* Aurora gradients (ModelCard)
* Terminal precision (CounterfactualAI)

---

### CORE CONCEPT

**Deep system visibility meets analytical rigor**

---

### VISUAL LANGUAGE

**Background Layer (Aurora):**

* Very dark base (#050810)
* Floating blurred gradient orbs:

  * Purple (#7c3aed)
  * Cyan (#22d3ee)
  * Blue (#2563eb)
* Slow animated movement (8–12s)

---

**Foreground Layer (Terminal):**

* Monospace overlays for outputs
* Green/cyan text highlights
* Structured "console-like" result sections

---

### COLOR SYSTEM

* Background: deep indigo / black
* Primary: violet / cyan gradients
* Terminal text: neon green (#39ff14)
* Secondary: grey text
* Alerts: red for bias risks

---

### TYPOGRAPHY

* Headings: Plus Jakarta Sans / Inter
* Results + inputs: JetBrains Mono (terminal feel)
* Mixed typography intentionally:

  * UI = modern
  * Output = machine-readable

---

### COMPONENT DESIGN

**Cards:**

* Glassmorphism + aurora glow
* Subtle borders

**Terminal Panels (results):**

* Black/dark panels inside cards
* Green monospace text
* Section headers like CLI output:

  * > BIAS RISKS
  * > TEST CASES

**Buttons:**

* Hybrid:

  * Soft glow + sharp hover states
  * Label style: `[ RUN ANALYSIS ]`

**Inputs:**

* Dark glass fields
* Cursor-focused glow

---

### LAYOUT

* Top mode switch:

  * "Model Card"
  * "Counterfactual Testing"
* Large centered workspace
* Results appear in stacked panels
* Responsive grid

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

1. Title: **FairScope**
2. Tagline displayed prominently
3. Mode switch (Documentation vs Testing)
4. Dynamic input form based on mode
5. Submit button with terminal-style loading
6. Structured outputs:

**Model mode:**

* Sectioned model card

**Testing mode:**

* 5 clearly separated test cases

7. Visual hierarchy with terminal blocks
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
[complete CSS with Tailwind + aurora + terminal styles]

--- END ---

---

## QUALITY BAR

* Must feel like a **serious AI governance tool**
* Visual identity must clearly reflect hybrid design
* Terminal sections must feel functional, not decorative
* Model card must be structured and readable
* Counterfactual outputs must be clearly testable
* Strong contrast between input UI and output panels
