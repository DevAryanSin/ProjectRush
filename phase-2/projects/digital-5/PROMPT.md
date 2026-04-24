# AGENT PROMPT — digital-5

# Tool: ReverseTrace | UI: Paper

# Deployment domain: reversetrace-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **ReverseTrace**

---

## PROBLEM CONTEXT

Sports organizations generate massive volumes of high-value digital media that rapidly
scatter across global platforms, making it nearly impossible to track. This vast visibility gap
leaves proprietary content highly vulnerable to widespread digital misappropriation, unauthorized
redistribution, and intellectual property violations.

Objective: Develop a scalable, innovative solution to identify, track, and flag unauthorized use
or misappropriation of official sports media across the internet. Enable organizations to
proactively authenticate their digital assets and detect anomalies in content propagation
in near real-time.

---

## THIS TOOL

**Name:** ReverseTrace
**Tagline:** Describe suspicious content — trace it back to its likely original source
**Domain:** digital sports media, copyright protection, IP rights management

**User inputs:** Description of suspicious content: what it shows, where you found it, any visible metadata, quality/format details
**User sees:** Origin likelihood analysis: probable original source, distribution path hypothesis, authenticity signals, and verification steps
**Gemini's role:** Reason forensically about the content description to hypothesize its likely original source, distribution path, and authenticity signals. Provide a structured origin analysis.

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
"You are a digital forensics AI. Analyze this suspicious content description and provide: most likely original source (with confidence %), hypothetical distribution path, authenticity signals present or missing, 3 specific verification steps to confirm origin. Be forensic and methodical."

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

1. Page title and prominent heading = **ReverseTrace**
2. Tagline shown below title: "Describe suspicious content — trace it back to its likely original source"
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
- Color palette: cream white and ink black — investigative journalism editorial aesthetic
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **ReverseTrace** must be prominent in the UI
