
---

# AGENT PROMPT — volunteer-merged

# Tool: ImpactForge | UI: Neo-Brutal Human Editorial

# Deployment domain: impactforge-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an elite frontend engineer and design-focused product builder.

Generate a complete, production-ready Next.js 16 web application as a working MVP with **distinctive, high-quality, non-generic frontend design**.

The website title (shown in browser tab and on page) must be: **ImpactForge**

---

## PROBLEM CONTEXT

NGOs and social organizations face two critical storytelling gaps:

* **Funding gap:** translating needs into compelling grant narratives
* **Recognition gap:** showcasing volunteer impact in a meaningful way

As a result:

* Funding applications lack clarity or emotional weight
* Volunteer contributions remain underrepresented

Objective: Build a system that:

1. Converts organizational needs into strong funding narratives
2. Translates volunteer contributions into compelling human stories
3. Aligns impact communication across stakeholders

---

## THIS TOOL

**Name:** ImpactForge
**Tagline:** Write for funding. Tell stories that matter.
**Domain:** NGO operations, grant writing, volunteer storytelling, social impact

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: GRANT BUILDER

**User inputs:**

* Organization name
* Program description
* Target population
* Impact goal
* Funding amount
* Grant type

**User sees:**

* A polished grant paragraph including:

  * Problem statement
  * Proposed solution
  * Expected impact
  * Budget justification

Purpose: Convert needs → fundable narrative

---

### MODE 2: VOLUNTEER STORY

**User inputs:**

* Volunteer name
* Skills
* Hours contributed
* Tasks completed
* Communities served
* Motivation

**User sees:**

* A compelling 150–200 word impact bio
* Human-centered narrative suitable for:

  * NGO websites
  * Donor reports
  * Recognition materials

Purpose: Convert contribution → human story

---

### GEMINI ROLE

System prompt used in API route:

"You are an NGO storytelling and grant writing AI.

If input describes an NGO program:

* Write a grant paragraph including:
  problem, solution, impact, and budget rationale

If input describes a volunteer:

* Write a compelling 150–200 word impact bio
* Include contributions, community impact, and motivation

Always:

* Be emotionally compelling but grounded in facts
* Avoid generic phrasing
* Use clear, structured storytelling"

Append user input dynamically.

---

## MVP TITLE

**ImpactForge MVP: Funding + Storytelling System**

---

## UI STYLE (CRITICAL)

NEO-BRUTAL HUMAN EDITORIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a deliberate fusion:

* **Brutalism → urgency, visibility (for funding)**
* **Neomorphism → warmth, human touch (for storytelling)**
* **Editorial → clarity, trust**

---

### CORE DESIGN CONCEPT

**"Bold advocacy meets human empathy."**

Left brain → structure
Right brain → emotion

---

### VISUAL LANGUAGE

#### BASE LAYER (NEOMORPHIC)

* Soft warm background (#f3efe7)
* Raised UI panels
* Gentle dual shadows

---

#### BRUTAL OVERLAY

* Key sections (headings, outputs):

  * Thick borders
  * Offset shadows
* Strong contrast blocks for emphasis

---

### COLOR SYSTEM

* Base: warm cream
* Primary: forest green (#166534)
* Accent: bold orange (#ea580c)
* Secondary: soft beige / pastel tones
* Text: deep charcoal

---

### TYPOGRAPHY (NON-GENERIC)

* Headings: **Libre Baskerville (editorial authority)**
* Body: **Source Serif 4**
* UI: **Nunito**

---

### LAYOUT

* Top mode switch:

  * "Grant Builder"
  * "Volunteer Story"

* Two-zone layout:

  * Input section
  * Output storytelling panel

---

### COMPONENT DESIGN

**Grant Output:**

* Editorial block with strong headings
* Highlighted key phrases

**Volunteer Output:**

* Narrative card
* Quote-style formatting
* Emphasis on human tone

**Cards:**

* Soft neomorphic base
* Brutal accents for hierarchy

**Buttons:**

* Hybrid:

  * Rounded base
  * Bold border on primary CTA

**Inputs:**

* Rounded fields
* Subtle inset shadows

---

### MOTION

* Soft fade-in for storytelling
* Slight lift on hover
* Subtle press animation

---

## TECH CONSTRAINTS

* Next.js 16 (App Router)
* TypeScript (.tsx)
* Tailwind CSS + globals.css
* lucide-react only
* No extra npm packages

---

## FUNCTIONAL REQUIREMENTS

1. Title: **ImpactForge**
2. Tagline clearly visible
3. Mode switch (Grant vs Story)
4. Dynamic input fields
5. Submit button with loading state
6. Structured outputs:

**Grant mode:**

* Professional, funder-ready paragraph

**Story mode:**

* Human-centered narrative

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
[complete CSS with Tailwind + neo-brutal editorial styles]

--- END ---

---

## QUALITY BAR

* Must feel like a **real NGO communication platform**
* Grant output must feel fundable
* Stories must feel authentic and human
* UI must balance boldness with warmth
* Avoid generic layouts completely
* Every visual choice must feel intentional

---
