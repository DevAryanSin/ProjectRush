

---

# AGENT PROMPT — bias-merged-3

# Tool: BiasLab | UI: Editorial Clay Fusion

# Deployment domain: biaslab-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **BiasLab**

---

## PROBLEM CONTEXT

AI bias is not just a technical issue—it is also a **communication problem** and a
**testing problem**:

* Stakeholders often do not understand bias concepts clearly
* Teams fail to actively probe systems for failure cases
* Bias risks remain both **misunderstood** and **untested**

This creates a gap between:

* **Understanding bias** (theory)
* **Breaking systems** (practice)

Objective: Build a system that both:

1. Explains bias in clear, non-technical language
2. Generates adversarial scenarios to actively uncover bias in AI systems

---

## THIS TOOL

**Name:** BiasLab
**Tagline:** Understand bias. Then break your system to find it.
**Domain:** AI fairness, explainability, adversarial testing, AI safety

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: BIAS EXPLAINER

**User inputs:**

* Any bias concept or term (e.g., “disparate impact”, “proxy bias”)

**User sees:**

* One-line plain definition
* Real-world analogy
* Concrete business example
* Why it matters (legal + reputational)
* One actionable step

---

### MODE 2: ADVERSARIAL RED TEAM

**User inputs:**

* AI system purpose
* Input types
* Decisions it makes
* Target user population

**User sees:**

* 10 adversarial bias test scenarios:

  * Attack name
  * Exact input to test
  * Targeted vulnerability
  * Expected biased behavior
  * Detection strategy

---

### GEMINI ROLE

System prompt used in API route:

"You are an AI bias educator and red-team specialist.

If the input is a concept:

* Explain it in plain, non-technical language
* Include analogy, example, impact, and one action

If the input is a system:

* Generate 10 adversarial bias test scenarios
* Make each scenario concrete and executable

Always:

* Be clear and structured
* Avoid jargon unless absolutely necessary
* Focus on real-world applicability"

Append user input dynamically.

---

## MVP TITLE

**BiasLab MVP: Explain + Attack Bias System**

---

## UI STYLE

EDITORIAL CLAY FUSION
━━━━━━━━━━━━━━━━━━━━━━

Combines:

* Editorial / Paper (BiasTranslator)
* Claymorphism (RedTeamAI)

---

### CORE CONCEPT

**Serious knowledge, delivered in a tactile interface**

---

### VISUAL LANGUAGE

**Base Layer (Editorial):**

* Background: warm paper (#f5f0e8)
* Serif typography for content
* Thin rule lines separating sections
* Structured column-like layout

---

**Component Layer (Claymorphism):**

* Soft, rounded cards (20–30px radius)
* Puffy shadows:
  box-shadow: 0 20px 60px rgba(0,0,0,0.12)
* Pastel accents (lavender, peach, mint)

---

### COLOR SYSTEM

* Background: warm cream
* Primary text: near-black (#1a1a1a)
* Accent: muted red or deep blue (editorial ink)
* Secondary UI accents: pastel highlights
* Alert: soft red for bias risks

---

### TYPOGRAPHY

* Headings: Playfair Display (editorial authority)
* Body: Source Serif / Georgia
* UI labels/buttons: rounded sans-serif (Nunito)

---

### COMPONENT DESIGN

**Cards:**

* Rounded clay cards containing editorial content
* Clear hierarchy inside

**Explainer Mode Output:**

* Structured like an article:

  * Headline
  * Subhead
  * Sections
  * Pull quote (analogy)

**Red Team Mode Output:**

* Each scenario in a separate clay card
* Clearly labeled sections:

  * ATTACK
  * INPUT
  * FAILURE
  * DETECTION

**Buttons:**

* Rounded, pill-shaped
* Slight gradient
* Soft press interaction

**Inputs:**

* Rounded, padded, friendly
* Clean editorial feel

---

### LAYOUT

* Top mode switch:

  * "Explain Bias"
  * "Red Team System"
* Centered content column
* Generous spacing
* Results flow vertically

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

1. Title: **BiasLab**
2. Tagline clearly visible
3. Mode switch (Explainer vs Red Team)
4. Input adapts to selected mode
5. Submit button with loading state
6. Structured outputs:

**Explainer:**

* Clearly sectioned article-style response

**Red Team:**

* 10 distinct scenario cards

7. Visual hierarchy must be strong
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

* Must feel like a **serious but accessible AI safety tool**
* Editorial readability must be preserved
* Clay elements must enhance—not distract
* Outputs must be highly structured and usable
* Red-team scenarios must feel actionable, not generic
