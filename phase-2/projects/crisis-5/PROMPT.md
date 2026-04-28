# AGENT PROMPT — crisis-5

# Tool: PostMortemPro | UI: Paper

# Deployment domain: postmortempro-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **PostMortemPro**

---

## PROBLEM CONTEXT

Hospitality venues face unpredictable, high-stakes emergencies that demand instantaneous,
coordinated reactions to protect lives and property. During a crisis, critical information is
often siloed, fracturing communication between distressed guests, on-site staff, and first responders.

Objective: Design a robust solution to instantly detect, report, and synchronize crisis response
efforts across a decentralized hospitality ecosystem. Eliminate fragmented communication by
creating a highly reliable bridge between distressed individuals, active personnel,
and emergency services.

---

## THIS TOOL

**Name:** PostMortemPro
**Tagline:** After a crisis — auto-generate a complete incident post-mortem report
**Domain:** hospitality emergency management, crisis coordination, safety systems

**User inputs:** What happened, timeline, what went well, what failed, teams involved, outcome
**User sees:** Structured post-mortem: executive summary, timeline, root causes, what worked, what failed, prevention plan
**Gemini's role:** Produce a structured hospitality incident post-mortem report. Extract root causes, identify systemic issues, document what worked, and generate a concrete prevention plan.

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
"You are a hospitality incident analyst. Write a post-mortem report with these sections: Executive Summary (2 sentences), Incident Timeline, Root Cause Analysis (5-Why format), What Worked Well, What Failed, 5-Item Prevention Plan ordered by priority. Be constructive and specific."

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

1. Page title and prominent heading = **PostMortemPro**
2. Tagline shown below title: "After a crisis — auto-generate a complete incident post-mortem report"
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
- Color palette: off-white and dark ink — formal reporting meets editorial clarity
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **PostMortemPro** must be prominent in the UI
