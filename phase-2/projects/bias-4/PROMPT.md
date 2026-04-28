# AGENT PROMPT — bias-4

# Tool: CounterfactualAI | UI: Terminal

# Deployment domain: counterfactualai-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **CounterfactualAI**

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

**Name:** CounterfactualAI
**Tagline:** Input an automated decision — generate counterfactual fairness test cases
**Domain:** AI fairness, bias detection, algorithmic accountability, ethics

**User inputs:** The decision made, key input factors used, the demographic context, decision domain
**User sees:** 5 counterfactual test scenarios that isolate demographic variables — each showing what SHOULD happen in a fair system
**Gemini's role:** Generate counterfactual fairness test cases by systematically varying demographic attributes while holding other factors constant. Each test case reveals whether the system would treat similar people differently.

---

## UI STYLE

TERMINAL / HACKER UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: Command-line interface aesthetic. Monospace everything. Green on black.
Feels like you're in a 90s hacker movie but functional and modern.

Visual language:

- Background: pure black (#000000) or very dark green-black (#0a0f0a)
- Primary text: bright green (#00ff41 or #39ff14)
- Secondary text: dim green (#008f11)
- Accent: white or bright cyan for highlights
- Font: monospace ONLY (Courier New, Fira Code, JetBrains Mono)
- Borders: 1px solid green, sometimes dashed
- Buttons look like CLI commands: [> EXECUTE] or [$ SUBMIT]
- Input fields look like terminal prompts: "> \_"
- Fake loading/typing animations using CSS
- Scanline effect optional (CSS repeating-gradient overlay)

Layout: Left-aligned, terminal-window style, fake window chrome optional.
Fonts: ONLY monospace. No exceptions.
DO NOT: use colors other than green/black/white/cyan, use rounded corners, use sans-serif.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a counterfactual fairness testing AI. Given this decision and its inputs, generate 5 counterfactual test cases. For each: change ONE demographic attribute (race/gender/age/location), keep all else identical, state the expected fair outcome, and flag if a biased system would likely give a different result. Format as testable scenarios with pass/fail criteria."

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

1. Page title and prominent heading = **CounterfactualAI**
2. Tagline shown below title: "Input an automated decision — generate counterfactual fairness test cases"
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

- UI must be immediately recognizable as Terminal
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: black and matrix green — systematic testing meets hacker rigor
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **CounterfactualAI** must be prominent in the UI
