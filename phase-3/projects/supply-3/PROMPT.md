
---

# AGENT PROMPT — supply-merged-3

# Tool: SignalContract | UI: Editorial Clay Intelligence

# Deployment domain: signalcontract-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an elite frontend engineer and design-focused systems builder.

Generate a complete, production-ready Next.js 16 web application as a working MVP with **distinctive, non-generic, high-quality frontend design**.

The website title (shown in browser tab and on page) must be: **SignalContract**

---

## PROBLEM CONTEXT

Supply chain decisions fail across two critical layers:

* **Forecasting gap:** organizations cannot reliably interpret market signals
* **Contract rigidity:** agreements fail to adapt to real-world volatility

This leads to:

* Over/under inventory
* Legal exposure during disruptions
* Poor risk allocation between parties

Objective: Build a system that:

1. Interprets market signals into demand forecasts
2. Translates those risks into protective contract clauses
3. Aligns operational and legal strategy

---

## THIS TOOL

**Name:** SignalContract
**Tagline:** Predict demand. Protect your agreements.
**Domain:** supply chain intelligence, demand forecasting, contract optimization

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: DEMAND INTELLIGENCE

**User inputs:**

* Industry / product type
* Market signals (news, trends, competitors, seasonality)
* Current inventory

**User sees:**

* Demand direction (increase / decrease / stable)
* Magnitude estimate
* Confidence level
* Key driving signals
* Counter-signals
* Inventory recommendation

Purpose: Convert market noise → actionable forecast

---

### MODE 2: CONTRACT PROTECTION

**User inputs:**

* Contract type
* Disruption scenario
* Role (buyer/seller)
* Jurisdiction
* Risk tolerance

**User sees:**

* 4 structured contract clauses:

  * Force majeure
  * SLA flexibility
  * Liability caps
  * Dispute resolution

Purpose: Convert risk → enforceable legal protection

---

### GEMINI ROLE

System prompt used in API route:

"You are a supply chain intelligence and contract strategy AI.

If input describes market signals:

* Predict demand direction, magnitude, confidence
* Identify key drivers and counter-signals
* Recommend inventory action

If input describes contract needs:

* Generate 4 contract clauses:
  force majeure, SLA flexibility, liability caps, dispute resolution

Always:

* Be structured, specific, and practical
* Avoid generic statements
* Focus on actionable outputs"

Append user input dynamically.

---

## MVP TITLE

**SignalContract MVP: Demand + Legal Intelligence System**

---

## UI STYLE (CRITICAL)

EDITORIAL CLAY INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a deliberate fusion:

* **Editorial (authority, clarity)**
* **Claymorphism (approachability, usability)**

---

### CORE DESIGN CONCEPT

**"Serious decisions, made approachable."**

Top layer → strategic insight
Bottom layer → actionable output

---

### VISUAL LANGUAGE

#### BASE (EDITORIAL)

* Background: warm cream (#f5f0e8)
* Serif typography for results
* Thin rule separators
* Structured column layout

---

#### COMPONENT LAYER (CLAY)

* Soft rounded cards (20–30px radius)
* Elevated shadows
* Gentle pastel highlights

---

### COLOR SYSTEM

* Base: cream
* Primary: deep navy (#1e3a8a)
* Accent: muted red (#b91c1c)
* Secondary: pastel lavender / mint
* Neutral: charcoal text

---

### TYPOGRAPHY (NON-GENERIC)

* Headings: **Playfair Display**
* Body: **Source Serif / Georgia**
* UI elements: **Nunito**

---

### LAYOUT

* Top mode switch:

  * "Demand Intelligence"
  * "Contract Protection"

* Centered column layout

* Vertical flow

* Strong section separation

---

### COMPONENT DESIGN

**Demand Output:**

* Structured insight blocks:

  * SIGNALS
  * FORECAST
  * CONFIDENCE
  * ACTION

**Contract Output:**

* Editorial legal document format
* Each clause clearly sectioned

**Cards:**

* Clay-style containers
* Editorial content inside

**Buttons:**

* Rounded, soft
* Slight gradient

**Inputs:**

* Spacious, rounded
* Clean layout

---

### MOTION

* Gentle fade-in on load
* Card lift on hover
* Subtle transitions only (no aggressive motion)

---

## TECH CONSTRAINTS

* Next.js 16 (App Router)
* TypeScript (.tsx)
* Tailwind CSS + globals.css
* lucide-react only
* No extra npm packages

---

## FUNCTIONAL REQUIREMENTS

1. Title: **SignalContract**
2. Tagline clearly visible
3. Mode switch (Demand vs Contract)
4. Dynamic input fields
5. Submit button with loading state
6. Structured outputs:

**Demand mode:**

* Forecast + reasoning + action

**Contract mode:**

* 4 clearly formatted clauses

7. Strong readability
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

* Must feel like a **professional decision-support system**
* Forecast must feel analytical but readable
* Contracts must feel legally credible
* UI must balance seriousness with usability
* Avoid generic layouts completely
* Every visual element must feel intentional

---

