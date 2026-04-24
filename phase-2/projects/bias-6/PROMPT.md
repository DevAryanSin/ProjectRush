# AGENT PROMPT — bias-6

# Tool: RedTeamAI | UI: Claymorphism

# Deployment domain: redteamai-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **RedTeamAI**

---

## PROBLEM CONTEXT

Computer programs now make life-changing decisions about who gets a job, a bank loan,
or even medical care. However, if these programs learn from flawed or unfair historical data,
they will repeat and amplify those exact same discriminatory mistakes.

Objective: Build a clear, accessible solution to thoroughly inspect data sets and software models
for hidden unfairness or discrimination. Provide organizations with an easy way to measure, flag,
and fix harmful bias before their systems impact real people.

---

## THIS TOOL

**Name:** RedTeamAI
**Tagline:** Describe your AI system — generate adversarial bias attack scenarios
**Domain:** AI fairness, bias detection, algorithmic accountability, ethics

**User inputs:** AI system purpose, input types it accepts, decisions it makes, user population
**User sees:** 10 adversarial bias attack scenarios: each with attack method, target vulnerability, expected biased output, and detection strategy
**Gemini's role:** Generate adversarial red-team scenarios designed to expose bias vulnerabilities in the AI system. Each scenario should be a concrete, executable test that could reveal discriminatory behavior.

---

## UI STYLE

CLAYMORPHISM UI STYLE
━━━━━━━━━━━━━━━━━━━━
Core concept: Soft, inflated, 3D-looking shapes that appear molded from clay. Pastel
colors, thick shadows, rounded everything. Playful and modern.

Visual language:

- Light pastel background (soft lavender, mint, peach, or sky blue)
- Cards appear inflated: border-radius 20-30px, strong drop shadow
  box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08)
- Elements have a "puffy" quality — generous padding, large border-radius
- Color palette: soft pastels with one punchy accent
- Inner elements also rounded and colorful
- Buttons are pill-shaped or very rounded rectangles
- Slight gradient on card backgrounds (same hue, slightly lighter top)
- Icons are filled, colorful, rounded style

Layout: Centered, card-based, generous whitespace. Feels like a mobile app.
Fonts: Rounded sans-serif (Nunito, Varela Round, Fredoka One for display).
DO NOT: use sharp corners, use dark backgrounds, use thin elements, use flat shadows.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are an AI red-team specialist. Generate 10 adversarial bias test scenarios for this AI system. For each scenario: attack name, specific input to submit, which bias vulnerability it targets, what a biased system would likely output, and how to detect if the system failed the test. Make scenarios concrete and executable by a QA tester."

Append the user's actual input to this prompt when calling Gemini.

---

## TECH CONSTRAINTS

- Next.js 16, App Router (`app/` directory), TypeScript (.tsx)
- Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only
- NO extra npm packages beyond: next, react, react-dom, lucide-react, tailwindcss
- Build: `next build --no-turbo`
- Node: 24.x
- Add `'use client'` to app/page.tsx
- Gemini call is server-side only in route.ts
- Page fetches `/api/generate` client-side

---

## FUNCTIONAL REQUIREMENTS

1. Page title and prominent heading = **RedTeamAI**
2. Tagline shown below title: "Describe your AI system — generate adversarial bias attack scenarios"
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

- UI must be immediately recognizable as Claymorphism
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: soft red and light grey — adversarial testing meets approachable safety
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **RedTeamAI** must be prominent in the UI
