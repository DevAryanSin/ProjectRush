# AGENT PROMPT — bias-5

# Tool: BiasTranslator | UI: Paper

# Deployment domain: biastranslator-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **BiasTranslator**

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

**Name:** BiasTranslator
**Tagline:** Explain any AI bias concept in plain language for non-technical stakeholders
**Domain:** AI fairness, bias detection, algorithmic accountability, ethics

**User inputs:** The bias concept or technical term to explain (e.g. demographic parity, disparate impact, proxy discrimination)
**User sees:** A plain-language explanation, a real-world analogy, a concrete example, and why it matters to the organization
**Gemini's role:** Translate technical AI bias concepts into clear, jargon-free language for business stakeholders. Use relatable analogies and concrete examples. Connect to organizational impact.

---

## UI STYLE

PAPER / EDITORIAL UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: A well-designed newspaper or magazine layout. Serif fonts, structured
columns, clear typographic hierarchy. Serious, trustworthy, readable.

Visual language:

- Background: off-white/cream (#fafaf7 or #f5f0e8)
- Text: near-black (#1a1a1a) primary, dark grey secondary
- Accent: one ink color (dark red, dark blue, or forest green)
- Serif fonts for headings and body content
- Clear typographic hierarchy: massive headline → subhead → body → caption
- Thin rule lines (1px) to separate sections (like newspaper columns)
- Minimal decoration — content IS the design
- Pull quotes styled large and italic
- Date/byline style metadata
- Results displayed as formatted article sections

Layout: Column-based, justified or left-aligned text, editorial structure.
Fonts: Playfair Display or Lora for headings, Source Serif or Georgia for body.
DO NOT: use sans-serif for content, use gradients, use rounded cards, use bright colors.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are an AI ethics translator for non-technical audiences. Explain this bias concept with: (1) One-sentence plain definition, (2) A real-world analogy that makes it intuitive, (3) A concrete example in a business context, (4) Why it matters legally and reputationally, (5) One simple thing the organization can do about it. Use zero technical jargon."

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

1. Page title and prominent heading = **BiasTranslator**
2. Tagline shown below title: "Explain any AI bias concept in plain language for non-technical stakeholders"
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

- UI must be immediately recognizable as Paper
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: warm white and charcoal — educational clarity meets editorial trust
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **BiasTranslator** must be prominent in the UI
