# AGENT PROMPT — supply-5

# Tool: ContractClause | UI: Paper

# Deployment domain: contractclause-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **ContractClause**

---

## PROBLEM CONTEXT

Modern global supply chains manage millions of concurrent shipments across highly complex
and inherently volatile transportation networks. Critical transit disruptions ranging from sudden
weather events to hidden operational bottlenecks are chronically identified only after delivery
timelines are already compromised.

Objective: Design a scalable system capable of continuously analyzing multifaceted transit data
to preemptively detect and flag potential supply chain disruptions. Formulate dynamic mechanisms
that instantly execute or recommend highly optimized route adjustments before localized
bottlenecks cascade into broader delays.

---

## THIS TOOL

**Name:** ContractClause
**Tagline:** Generate protective contract clauses for supply chain disruption scenarios
**Domain:** logistics, supply chain management, route optimization, disruption detection

**User inputs:** Contract type, disruption scenario to protect against, your role (buyer/seller), jurisdiction, risk tolerance
**User sees:** 3-5 ready-to-insert contract clauses covering force majeure, SLA protection, penalty limits, and dispute resolution for the scenario
**Gemini's role:** Draft precise, legally-structured contract clauses that protect against the specified supply chain disruption scenario. Cover force majeure, SLA, penalties, and dispute resolution.

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
"You are a supply chain contract AI. Draft 4 protective contract clauses for this disruption scenario: (1) Force Majeure definition and triggers, (2) SLA modification rights, (3) Liability and penalty caps, (4) Dispute resolution mechanism. Use standard commercial contract language. Make each clause ready to insert into a contract."

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

1. Page title and prominent heading = **ContractClause**
2. Tagline shown below title: "Generate protective contract clauses for supply chain disruption scenarios"
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
- Color palette: legal cream and dark navy — contract authority meets editorial structure
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **ContractClause** must be prominent in the UI
