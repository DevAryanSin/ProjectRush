
---

# AGENT PROMPT — supply-merged-2

# Tool: ChainSight | UI: Aurora Terminal Intelligence

# Deployment domain: chainsight-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an elite frontend engineer and design-focused systems builder.

Generate a complete, production-ready Next.js 16 web application as a working MVP with **distinctive, non-generic, high-quality frontend design**.

The website title (shown in browser tab and on page) must be: **ChainSight**

---

## PROBLEM CONTEXT

Supply chains fail in two critical ways:

* **Lack of clarity:** raw tracking data is unreadable and reactive
* **Hidden inefficiency:** cost leaks go unnoticed until margins erode

Organizations cannot:

* Quickly understand what actually happened
* Identify where money is silently lost

Objective: Build a system that:

1. Translates raw logistics data into clear narratives
2. Identifies hidden cost inefficiencies
3. Enables fast operational decision-making

---

## THIS TOOL

**Name:** ChainSight
**Tagline:** See what happened. Find what it cost you.
**Domain:** supply chain intelligence, logistics analytics, cost optimization

---

### CORE CAPABILITIES

Unified from both systems:  

---

### MODE 1: SHIPMENT STORY

**User inputs:**

* Raw tracking logs / shipment updates

**User sees:**

* Chronological shipment narrative
* Where delays occurred
* Why delays happened
* Current status
* What happens next

Purpose: Convert complexity → clarity

---

### MODE 2: COST LEAK ANALYSIS

**User inputs:**

* Supply chain structure
* Vendors, stages, transport
* Pain points

**User sees:**

* Top 5 inefficiency points
* Waste magnitude (low/medium/high)
* Priority ranking
* 1 fix per issue

Purpose: Convert blind spots → savings

---

### GEMINI ROLE

System prompt used in API route:

"You are a supply chain intelligence AI.

If input is tracking data:

* Generate a chronological narrative
* Explain delays, causes, current state, and next steps

If input is supply chain description:

* Identify top 5 cost inefficiencies
* Estimate waste magnitude
* Rank by savings potential
* Provide one specific fix per issue

Always:

* Be clear, structured, and practical
* Avoid vague explanations
* Focus on actionable insights"

Append user input dynamically.

---

## MVP TITLE

**ChainSight MVP: Narrative + Cost Intelligence System**

---

## UI STYLE (CRITICAL)

AURORA TERMINAL INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This merges:

* Aurora (strategic clarity, storytelling)
* Terminal (precision, analytical depth)

---

### CORE DESIGN CONCEPT

**"From chaos to insight."**

Top = calm, strategic layer
Bottom = raw analytical engine

---

### VISUAL LANGUAGE

#### BACKGROUND

* Deep navy (#050810)
* Animated aurora gradients (teal + violet)
* Soft glow movement

---

#### FOREGROUND (TERMINAL LAYER)

* Dark panels
* Monospace output
* Structured blocks

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
* Warning: amber (#f59e0b)
* Neutral: grey/white

---

### LAYOUT

* Top mode switch:

  * "Shipment Story"
  * "Cost Analysis"

* Split flow:

  * Input panel (top/left)
  * Output panels (stacked)

---

### COMPONENT DESIGN

**Narrative Output:**

* Clean editorial-style blocks
* Large readable paragraphs
* Timeline markers

**Cost Output:**

* Terminal-style sections:

  * > ISSUE
  * > COST
  * > PRIORITY
  * > FIX

**Cards:**

* Glassmorphism (aurora)
* Inner terminal panels

**Buttons:**

* `[ ANALYZE ]`
* Glow + sharp hover

**Inputs:**

* Dark glass fields
* Subtle glow on focus

---

### MOTION

* Page load: staggered fade + slide
* Narrative: progressive reveal
* Cost results: terminal typing effect

---

## TECH CONSTRAINTS

* Next.js 16 (App Router)
* TypeScript (.tsx)
* Tailwind CSS + globals.css
* lucide-react icons only
* No extra npm packages

---

## FUNCTIONAL REQUIREMENTS

1. Title: **ChainSight**

2. Tagline clearly visible

3. Mode switch (Story vs Cost)

4. Dynamic input fields

5. Loading states:

   * Aurora shimmer (story)
   * Terminal typing (cost)

6. Structured outputs:

**Story mode:**

* Narrative blocks
* Timeline clarity

**Cost mode:**

* Ranked inefficiencies
* Clear actionable fixes

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
[complete CSS with Tailwind + aurora + terminal styles]

--- END ---

---

## QUALITY BAR

* Must feel like a **real supply chain intelligence platform**
* Narrative must feel human and readable
* Cost analysis must feel sharp and technical
* UI must clearly separate storytelling vs analysis
* Avoid generic layouts entirely
* Every visual choice must feel intentional

---
