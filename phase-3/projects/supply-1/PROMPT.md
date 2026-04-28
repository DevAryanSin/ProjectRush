

---

# AGENT PROMPT — supply-merged

# Tool: StormRoute | UI: Industrial Neo-Brutal Intelligence

# Deployment domain: stormroute-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an elite frontend engineer AND design director.

Generate a complete, production-ready Next.js 16 web application as a working MVP **with exceptional, non-generic design quality**.

The website title (shown in browser tab and on page) must be: **StormRoute**

---

## PROBLEM CONTEXT

Modern supply chains operate under constant environmental uncertainty. Weather disruptions are not just delays — they cascade into:

* Missed SLAs
* Inventory shortages
* Financial losses

Existing tools fail because they:

* React too late
* Present data poorly
* Lack actionable clarity

Objective: Build a system that **predicts weather disruption risk AND presents it in a way that drives immediate operational decisions.**

---

## THIS TOOL

**Name:** StormRoute
**Tagline:** Predict disruption. Reroute before it hits.
**Domain:** logistics intelligence, weather risk analytics, supply chain optimization

---

### CORE FUNCTIONALITY

(From WeatherShield , upgraded)

**User inputs:**

* Origin
* Destination
* Transport mode
* Departure date
* Known weather conditions

**User sees:**

* Weather delay risk score (0–100%)
* Route segment threats (rain, storm, fog, etc.)
* ETA impact (in hours)
* 3 actionable mitigation strategies

---

## GEMINI ROLE

System prompt used in API route:

"You are a logistics weather intelligence AI.

Analyze the route and output:
(1) Overall delay risk (0-100%),
(2) Weather threats per route segment,
(3) Estimated ETA delay (hours),
(4) 3 concrete mitigation actions.

Be operational, concise, and specific."

Append user input dynamically.

---

## MVP TITLE

**StormRoute MVP: Predictive Weather Risk Engine**

---

## UI STYLE (CRITICAL — APPLY DESIGN SKILL)

INDUSTRIAL NEO-BRUTAL INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is NOT standard brutalism.

This is a **high-end logistics command interface**.

---

### CORE DESIGN CONCEPT

**"Control room for a storm."**

Feels like:

* A shipping operations war-room
* Aviation dashboards
* Industrial monitoring systems

---

### VISUAL DIRECTION

#### 1. BACKGROUND

* Deep matte charcoal (#0e1116)
* Subtle noise texture overlay
* Faint grid lines (like radar maps)

---

#### 2. TYPOGRAPHY (NON-GENERIC)

* Headings: **Bebas Neue / Oswald (condensed, industrial)**
* Body: **IBM Plex Sans / Source Sans 3**
* Data: **JetBrains Mono (for metrics)**

---

#### 3. COLOR SYSTEM

* Base: charcoal / near-black
* Primary: electric cyan (#22d3ee)
* Alert: signal red (#ef4444)
* Warning: amber (#f59e0b)
* Safe: neon green (#22c55e)

---

#### 4. LAYOUT

* Split dashboard layout:

  * LEFT → Input control panel
  * RIGHT → Risk visualization

* Grid-breaking:

  * Large risk score panel dominates screen
  * Smaller data modules around it

---

#### 5. COMPONENT STYLE

**Panels:**

* Hard edges (2px borders)
* Slight inner glow
* Subtle inset shadows

**Buttons:**

* Industrial:

  * `[ RUN ANALYSIS ]`
* Strong hover flicker/glow

**Inputs:**

* Dark panels
* Underline highlight instead of borders

---

#### 6. DATA VISUALIZATION (KEY DIFFERENTIATOR)

* Risk score = HUGE numeric display (centerpiece)
* Route segments = stacked blocks
* Threat types = colored tags
* ETA delay = emphasized metric

---

#### 7. MOTION

* On load:

  * Staggered panel reveals
* Risk number:

  * Animated count-up
* Subtle pulsing glow on high-risk outputs

---

#### 8. ATMOSPHERIC DETAILS

* Moving gradient overlay (slow)
* Radar sweep animation (very subtle)
* Noise/grain layer
* Flicker effect on critical alerts

---

## TECH CONSTRAINTS

* Next.js 16 (App Router)
* TypeScript (.tsx)
* Tailwind CSS + globals.css
* lucide-react icons only
* No extra npm packages

---

## FUNCTIONAL REQUIREMENTS

1. Title: **StormRoute**
2. Strong hero presence (command dashboard feel)
3. Input panel (left)
4. Output dashboard (right)
5. Loading state:

   * Terminal-style / radar scanning feel
6. Structured output:

**Main:**

* Risk Score (dominant)

**Secondary:**

* Threat breakdown
* ETA impact
* Recommendations

7. Fully responsive:

   * Desktop = dashboard
   * Mobile = stacked panels

---

## OUTPUT FORMAT — MANDATORY

No text outside these delimiters. No markdown fences inside blocks.

--- FILE: app/page.tsx ---
[complete code]

--- FILE: app/api/generate/route.ts ---
[complete code]

--- FILE: app/globals.css ---
[complete CSS with Tailwind + full custom design system]

--- END ---

---

## QUALITY BAR (VERY STRICT)

* Must NOT look like a template
* Must NOT resemble generic AI UI
* Must feel like a **real logistics intelligence system**
* Visual hierarchy must drive decision-making
* Risk score must be the visual centerpiece
* Every spacing, color, and font choice must feel intentional

---


