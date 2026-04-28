# AGENT PROMPT — bias-1

# Tool: PromptBias | UI: Brutalism

# Deployment domain: promptbias-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **PromptBias**

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

**Name:** PromptBias
**Tagline:** Paste any AI prompt — detect bias baked into the prompt itself
**Domain:** AI fairness, bias detection, algorithmic accountability, ethics

**User inputs:** An AI system prompt or user prompt to analyze
**User sees:** Bias analysis of the prompt: bias types found, affected groups, severity rating, and rewritten bias-reduced version
**Gemini's role:** Analyze the AI prompt for embedded bias in framing, assumptions, loaded language, and exclusionary defaults. Identify bias types, affected groups, severity, and rewrite the prompt to reduce bias.

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
"You are a prompt bias auditor. Analyze this AI prompt for: (1) Bias types present (framing/assumption/exclusion/stereotype), (2) Which groups are disadvantaged by the bias, (3) Severity rating HIGH/MEDIUM/LOW for each, (4) A rewritten bias-reduced version of the prompt. Be specific about which exact words or phrases carry bias."

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

1. Page title and prominent heading = **PromptBias**
2. Tagline shown below title: "Paste any AI prompt — detect bias baked into the prompt itself"
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
- Color palette: bold purple and white — raw truth meets analytical power
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **PromptBias** must be prominent in the UI
