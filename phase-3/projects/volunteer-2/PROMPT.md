
---

# AGENT PROMPT — volunteer-merged-2

# Tool: ImpactSignal | UI: Aurora Terminal Narrative

# Deployment domain: impactsignal-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an elite frontend engineer and design-focused product builder.

Generate a complete, production-ready Next.js 16 web application as a working MVP with **distinctive, high-quality, non-generic frontend design**.

The website title (shown in browser tab and on page) must be: **ImpactSignal**

---

## PROBLEM CONTEXT

NGOs struggle across two critical stages of impact:

* **Signal detection gap:** community needs are hidden in scattered, unstructured data
* **Communication gap:** completed work is not translated into compelling donor narratives

This results in:

* Missed urgent needs
* Weak donor engagement
* Inefficient allocation of volunteer effort

Objective: Build a system that:

1. Extracts real community needs from raw signals
2. Converts completed work into powerful donor-facing stories
3. Bridges detection → action → communication

---

## THIS TOOL

**Name:** ImpactSignal
**Tagline:** Detect needs. Tell impact.
**Domain:** NGO intelligence, community analysis, impact storytelling

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: COMMUNITY INTELLIGENCE

**User inputs:**

* Social media posts
* Community messages
* Forum discussions

**User sees:**

* Top 5 unmet needs (ranked by urgency 1–10)
* Sentiment per need
* Affected population segments
* Hidden/implied needs
* 3 NGO action recommendations

Purpose: Convert raw community noise → structured needs

---

### MODE 2: IMPACT STORY

**User inputs:**

* Task completed
* Volunteers involved
* Beneficiaries
* Outcomes
* Location

**User sees:**

* Headline
* Narrative story
* Emotionalized impact metrics
* Quote
* Call to action

Purpose: Convert operational data → donor motivation

---

### GEMINI ROLE

System prompt used in API route:

"You are an NGO intelligence and storytelling AI.

If input contains community posts:

* Extract unmet needs ranked by urgency
* Identify sentiment and affected groups
* Recommend NGO actions

If input contains task data:

* Generate a donor-facing impact story with:
  headline, narrative, metrics, quote, and call to action

Always:

* Be specific and grounded in real signals
* Avoid generic summaries
* Focus on actionable insights and emotional clarity"

Append user input dynamically.

---

## MVP TITLE

**ImpactSignal MVP: Needs Detection + Storytelling System**

---

## UI STYLE (CRITICAL)

AURORA TERMINAL NARRATIVE
━━━━━━━━━━━━━━━━━━━━━━━━━

This is a layered system:

* **Aurora (top layer): insight, discovery, calm analysis**
* **Terminal (bottom layer): execution, data, precision**

---

### CORE DESIGN CONCEPT

**"From signal to story."**

Top = understanding the community
Bottom = communicating impact

---

### VISUAL LANGUAGE

#### BACKGROUND (AURORA)

* Deep dark base (#050810)
* Animated gradient orbs:

  * teal (#00d4aa)
  * purple (#7c3aed)
  * blue (#2563eb)
* Slow, subtle movement

---

#### FOREGROUND (TERMINAL PANELS)

* Dark panels inside aurora cards
* Monospace outputs
* Structured sections

---

### TYPOGRAPHY (NON-GENERIC)

* Headings: **Plus Jakarta Sans / Sora**
* Body: **DM Sans**
* Data: **JetBrains Mono**

---

### COLOR SYSTEM

* Primary: cyan (#22d3ee)
* Secondary: violet (#7c3aed)
* Alert: red (#ef4444)
* Neutral: white/grey
* Terminal accent: green (#39ff14)

---

### LAYOUT

* Top mode switch:

  * "Community Signals"
  * "Impact Story"

* Centered workspace

* Output panels stacked vertically

---

### COMPONENT DESIGN

**Community Output:**

* Ranked cards with urgency score
* Sentiment tags
* Highlighted quotes

**Story Output:**

* Narrative block
* Headline emphasis
* Quote styling

**Cards:**

* Glassmorphism aurora panels
* Terminal sub-panels

**Buttons:**

* `[ ANALYZE ]`
* Glow + sharp hover

**Inputs:**

* Dark glass fields
* Focus glow

---

### MOTION

* Aurora background movement
* Staggered result reveal
* Terminal typing animation for story generation

---

## TECH CONSTRAINTS

* Next.js 16 (App Router)
* TypeScript (.tsx)
* Tailwind CSS + globals.css
* lucide-react only
* No extra npm packages

---

## FUNCTIONAL REQUIREMENTS

1. Title: **ImpactSignal**

2. Tagline clearly visible

3. Mode switch (Signals vs Story)

4. Dynamic input forms

5. Loading states:

   * Aurora shimmer (signals)
   * Terminal typing (story)

6. Structured outputs:

**Signals mode:**

* Ranked needs
* Actionable recommendations

**Story mode:**

* Fully structured narrative

7. Strong hierarchy and readability
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

* Must feel like a **real NGO intelligence platform**
* Needs analysis must feel data-driven
* Stories must feel emotionally compelling
* UI must clearly separate analysis vs storytelling
* Avoid generic layouts entirely
* Every design choice must feel intentional

---
