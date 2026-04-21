# AGENT PROMPT — p2-crisis-response-s1-bento

# Rapid Crisis Response — Accelerated Emergency Response and Crisis Coordination in Hospitality

# Tool: AlertBridge | UI: Bento Box Grid

# ═══════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE GENERATING ANY CODE.

# ═══════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. You will generate a complete,
production-ready Next.js 16 web application as a functional MVP.

Generate ALL THREE files below in ONE response. Use the EXACT delimiters specified.
Do not add any explanation text, markdown, or commentary outside the delimiters.

---

## PROBLEM CONTEXT

Hospitality venues face unpredictable, high-stakes emergencies that demand instantaneous,
coordinated reactions to protect lives and property. During a crisis, critical information is
often siloed, fracturing communication between distressed guests, on-site staff, and first
responders.

Objective: Design a robust solution to instantly detect, report, and synchronize crisis response
efforts across a decentralized hospitality ecosystem. Eliminate fragmented communication by
creating a highly reliable bridge between distressed individuals, active personnel,
and emergency services.

---

## THIS SPECIFIC TOOL

**Name:** AlertBridge
**Tagline:** Submit a crisis report — instantly generate a structured alert for all responders
**Domain:** hospitality emergency management, crisis coordination, safety systems

**What the user does:**
Crisis type, location within venue, number of people affected, severity (1-5), brief description

**What they see as output:**
A structured emergency alert with role-specific summaries for security, medical, management, and guest comms

**How Gemini AI is used:**
Convert raw crisis input into a calm, structured multi-channel emergency alert. Generate separate brief summaries for each responder role. Prioritize clarity and actionability under pressure.

---

## UI STYLE REQUIREMENT

BENTO BOX GRID UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━
Core concept: The entire page is a grid of distinct rectangular cards (the "bento boxes").
Each card has a clear purpose and contains self-contained content. The grid is asymmetric —
cards vary in size (1×1, 2×1, 1×2, 2×2 units) creating visual hierarchy.

Visual language:

- Dark background (near-black #0a0a0a or deep navy) with colored card backgrounds
- Cards have subtle borders and slight rounded corners (8-12px)
- Each card has its the common accent color or subtle gradient
- Typography is bold and large for headers inside cards
- Dense but organized — lots of information visible at once
- Card hover states with subtle glow or border highlight
- Numbers and stats get their own dedicated large-number cards

Layout rules:

- Use CSS Grid with auto-placement
- Main interaction card should be 2×2 or span full width
- Result cards populate the grid dynamically
- Mobile: stack to single column

Colors: Use the problem's color hint as your palette base.
Fonts: Choose a distinctive geometric sans-serif for headers, clean mono for data.
DO NOT: use white backgrounds, use equal-sized cards, use standard list layouts.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

### CRITICAL: FIX HYDRATION ERROR

React 19 / Next.js 16 serializes `disabled={false}` as `null` during SSR, which causes a hydration mismatch on the client. You MUST add `suppressHydrationWarning` to any `<button>` or `<input>` that uses a dynamic `disabled` attribute (e.g., `disabled={isLoading}`).

Gemini prompt to use in your API route (customize for this tool):
"You are a crisis communications AI for a hospitality venue. Convert this incident report into a structured emergency alert with 4 separate role-specific summaries: (1) Security Team, (2) Medical Response, (3) Management, (4) Guest Communication. Each should be 2-3 sentences, clear and action-focused."

Append the user's actual input to this system prompt when calling Gemini.

---

## TECH CONSTRAINTS (STRICT)

- Framework: Next.js 16, App Router (`app/` directory)
- Language: TypeScript (.tsx files)
- Styling: Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only (already installed)
- NO additional npm packages — only: next, react, react-dom, lucide-react, tailwindcss
- Build command: `next build --no-turbo`
- Node engine: 24.x
- The Gemini API call happens in `app/api/generate/route.ts` (server-side only)
- The page uses client-side fetch to call `/api/generate`
- Add `'use client'` directive to `app/page.tsx`
- Add `suppressHydrationWarning` to any `<button>` or `<input>` element that uses a dynamic `disabled` prop — React 19 serializes `disabled={false}` as `null` in SSR causing hydration mismatches

---

## FUNCTIONAL REQUIREMENTS

1. User sees a clean, styled input form matching the UI style described above
2. User fills in the required input fields (described in "What the user does" above)
3. User clicks a submit/analyze button
4. A loading state is shown while waiting for Gemini
5. The Gemini response is displayed in a well-styled results section
6. The result should be parsed and displayed with visual hierarchy (not just raw text)
7. Error states are handled gracefully
8. The page is fully responsive (mobile + desktop)

---

## OUTPUT FORMAT (MANDATORY)

Respond with EXACTLY this structure. No text before or after. No markdown code fences
inside the blocks. Use these exact delimiters:

--- FILE: app/page.tsx ---
[complete TypeScript React component code here]
--- FILE: app/api/generate/route.ts ---
[complete Next.js API route code here]
--- FILE: app/globals.css ---
[complete CSS with Tailwind directives and all custom styles here]
--- END ---

---

## QUALITY REQUIREMENTS

- The UI must look PROFESSIONAL and POLISHED — not like a placeholder
- The UI style must be immediately recognizable as Bento Box Grid
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "AlertBridge" must appear prominently in the UI
- Color palette must reflect: urgent red and cool white — emergency alertness with calm authority
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
