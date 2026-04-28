# AGENT PROMPT — p2-crisis-response-s6-glassui

# Rapid Crisis Response — Accelerated Emergency Response and Crisis Coordination in Hospitality

# Tool: ResponderBrief | UI: Glass UI

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

**Name:** ResponderBrief
**Tagline:** Input crisis type and venue — generate a complete first responder handoff brief
**Domain:** hospitality emergency management, crisis coordination, safety systems

**What the user does:**
Venue name, venue type, crisis type, current status, number of casualties/affected persons, access point details

**What they see as output:**
A concise, structured situational brief formatted for incoming emergency services: EMS, fire, police

**How Gemini AI is used:**
Generate a clear, professional situational brief formatted specifically for incoming first responders. Prioritize facts over narrative. Include building layout context, current status, known hazards, and command contact.

---

## UI STYLE REQUIREMENT

GLASS UI STYLE
━━━━━━━━━━━━━━
Core concept: Similar to glassmorphism but more structured and UI-focused. Glass cards
within a defined application layout. More opaque than pure glassmorphism — feels like
a premium dark-mode application, not an ethereal design concept.

Visual language:

- Dark base background (#0d1117 or similar very dark color)
- Cards use: background: rgba(255,255,255,0.05-0.08), backdrop-filter: blur(8px)
- More defined borders: border: 1px solid rgba(255,255,255,0.1)
- Colored glow accents on focus/hover (box-shadow with color)
- Neon-adjacent accent colors against dark background
- Input fields dark glass with colored focus ring glow
- Buttons with gradient or subtle glow effect
- Icons and text in white/light grey

Layout rules:

- App-style dark layout with header nav
- Glass sidebar or panel on left (optional)
- Main glass card for input
- Results in glass panels below or beside
- Subtle animated gradient border on active elements

Colors: Very dark background, 1-2 vivid accent colors (electric blue, violet, cyan, green).
Fonts: Choose a modern, technical-feeling font. Semi-bold weights for UI elements.
DO NOT: use light backgrounds, use fully opaque cards, skip the glow/accent effects.

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
"Generate a first responder situational brief (SBAR format: Situation, Background, Assessment, Recommendation) for incoming emergency services at a hospitality venue. Include: venue access points, current situation status, known hazards, estimated casualties, on-site command contact. Be factual, concise, and use emergency services terminology."

Append the user's actual input to this system prompt when calling Gemini.

---

## TECH CONSTRAINTS (STRICT)

- Framework: Next.js 16, App Router (`app/` directory)
- Language: TypeScript (.tsx files)
- Styling: Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only (already installed)
- NO additional npm packages — only: next, react, react-dom, lucide-react, tailwindcss
- Build command: `next build `
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
- The UI style must be immediately recognizable as Glass UI
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "ResponderBrief" must appear prominently in the UI
- Color palette must reflect: urgent red and cool white — emergency alertness with calm authority
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
