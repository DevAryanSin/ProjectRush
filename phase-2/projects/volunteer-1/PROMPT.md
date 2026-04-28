# AGENT PROMPT — volunteer-1

# Tool: GrantWriter | UI: Brutalism

# Deployment domain: grantwriter-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **GrantWriter**

---

## PROBLEM CONTEXT

Local social groups and NGOs collect a lot of important information about community needs
through paper surveys and field reports. However, this valuable data is often scattered across
different places, making it hard to see the biggest problems clearly.

Objective: Design a powerful system that gathers scattered community information to clearly show
the most urgent local needs. Build a smart way to quickly match and connect available volunteers
with the specific tasks and areas where they are needed most.

---

## THIS TOOL

**Name:** GrantWriter
**Tagline:** Describe your NGO need — auto-draft a compelling grant application paragraph
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**User inputs:** Organization name, program description, target population, impact goal, funding amount needed, grant type
**User sees:** A polished grant application paragraph with problem statement, proposed solution, expected impact, and budget justification
**Gemini's role:** Draft a compelling, funder-ready grant application paragraph. Use proven grant writing structure: problem statement, solution, impact, and budget rationale.

---

## UI STYLE

BRUTALISM UI STYLE
━━━━━━━━━━━━━━━━━
Core concept: Raw, intentional ugliness that commands attention. Thick borders, offset
box shadows, loud typography, high contrast. Nothing is subtle. Everything is intentional.

Visual language:

- White or pale yellow background
- Thick solid black borders (3-5px) on ALL elements
- Offset box-shadows: 4-8px solid black (e.g. box-shadow: 6px 6px 0 black)
- Bold/black font weight (800-900) for all headings
- Uppercase text for labels and buttons
- Primary accent: one loud color (yellow, red, or lime green)
- Buttons are rectangles with thick border + offset shadow, no border-radius
- Hover: shadow reduces to 2px (feels like pressing)
- Input fields: thick bordered, no rounded corners

Layout: Asymmetric, intentional grid breaks, oversized elements, visible structure.
Fonts: Impact, Space Grotesk, or any extra-bold geometric sans-serif.
DO NOT: use rounded corners, use subtle shadows, use gradients, use thin fonts.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are an expert grant writer for NGOs. Draft a compelling grant application paragraph covering: (1) Problem Statement (specific, data-referenced), (2) Proposed Solution (clear and feasible), (3) Expected Impact (quantified outcomes), (4) Budget Justification (why this amount). Make it emotionally compelling yet evidence-based. Aim for foundation grant standards."

Append the user's actual input to this prompt when calling Gemini.

---

## TECH CONSTRAINTS

- Next.js 16, App Router (`app/` directory), TypeScript (.tsx)
- Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only
- NO extra npm packages beyond: next, react, react-dom, lucide-react, tailwindcss
- Build: `next build `
- Node: 24.x
- Add `'use client'` to app/page.tsx
- Gemini call is server-side only in route.ts
- Page fetches `/api/generate` client-side

---

## FUNCTIONAL REQUIREMENTS

1. Page title and prominent heading = **GrantWriter**
2. Tagline shown below title: "Describe your NGO need — auto-draft a compelling grant application paragraph"
3. Input form matching the UI style — all required fields visible
4. Submit button triggers loading state
5. Gemini response displayed with clear visual hierarchy (not raw text)
6. Parse response into sections where possible
7. Handle errors gracefully with user-friendly message
8. Fully responsive — mobile and desktop

---

## OUTPUT FORMAT — MANDATORY

No text outside these delimiters. No markdown fences inside blocks.

--- FILE: app/page.tsx ---
[complete code]
--- FILE: app/api/generate/route.ts ---
[complete code]
--- FILE: app/globals.css ---
[complete CSS with @tailwind directives + all custom styles + Google Font @import]
--- END ---

---

## QUALITY BAR

- UI must be immediately recognizable as Brutalism
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: forest green and cream — community strength meets bold advocacy
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **GrantWriter** must be prominent in the UI
