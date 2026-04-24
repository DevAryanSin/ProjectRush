# AGENT PROMPT — volunteer-4

# Tool: TaskNarrator | UI: Terminal

# Deployment domain: tasknarrator-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **TaskNarrator**

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

**Name:** TaskNarrator
**Tagline:** Completed task details — generate a donor-motivating impact story
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**User inputs:** Task completed, volunteer details, beneficiaries helped, resources used, outcomes achieved, location
**User sees:** A compelling donor-facing impact story with headline, narrative, key metrics, and a call to action
**Gemini's role:** Transform dry task completion data into an emotionally compelling donor-facing impact story. Create narrative arc, humanize the numbers, and include a motivating call to action.

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
"You are a nonprofit storytelling AI. Transform this task data into a donor impact story with: (1) Compelling headline, (2) Human narrative (who helped who, what changed), (3) Key impact metrics made emotional (not just numbers), (4) Quote from the experience (fabricate plausibly), (5) Call to action for continued support. Make donors feel the difference their money made."

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

1. Page title and prominent heading = **TaskNarrator**
2. Tagline shown below title: "Completed task details — generate a donor-motivating impact story"
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
- Color palette: dark bg and warm amber text — impact data meets human narrative
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **TaskNarrator** must be prominent in the UI
