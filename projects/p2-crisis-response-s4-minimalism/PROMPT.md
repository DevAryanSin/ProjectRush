# AGENT PROMPT — p2-crisis-response-s4-minimalism

# Rapid Crisis Response — Accelerated Emergency Response and Crisis Coordination in Hospitality

# Tool: FirstContact | UI: Minimalism

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

**Name:** FirstContact
**Tagline:** Describe your emergency — get immediate calm guidance while help is on the way
**Domain:** hospitality emergency management, crisis coordination, safety systems

**What the user does:**
Type of emergency, your location, number of people with you, any immediate dangers

**What they see as output:**
Step-by-step immediate safety instructions, what to do RIGHT NOW, what NOT to do, and reassurance that help is coming

**How Gemini AI is used:**
Act as a calm, authoritative emergency first-response guide for a distressed guest. Provide clear, numbered immediate safety steps. Use simple, panic-reducing language. Confirm help is being dispatched.

---

## UI STYLE REQUIREMENT

MINIMALIST UI STYLE
━━━━━━━━━━━━━━━━━━
Core concept: Maximum reduction. Only what is absolutely necessary exists on the page.
Whitespace is the primary design element. One or two accent colors maximum.
Every element has clear purpose — nothing decorative.

Visual language:

- White or very light grey background (#fafafa or #f5f5f5)
- One strong accent color (used sparingly — only for key actions and highlights)
- Typography-first: beautiful, considered type hierarchy does all the heavy lifting
- Generous padding and margin — content breathes
- Fine hairline borders (1px, light grey) instead of backgrounds to define sections
- No icons unless absolutely necessary; if used, they are monoline and small
- Inputs are borderless or have only a bottom border
- Results displayed as clean typographic lists or simple data lines

Layout rules:

- Single centered column, max-width 560-640px
- Large hero text at top stating purpose
- Simple form below
- Results as clean typographic output
- Significant empty space between sections

Colors: Off-white background, near-black text, ONE accent color.
Fonts: Choose a premium, distinctive typeface. Large sizes, tight leading.
DO NOT: add decorative elements, use multiple colors, add shadows or effects.

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
"You are a calm emergency response AI helping a distressed hotel or venue guest. Provide: (1) 3-5 immediate safety steps in simple numbered language, (2) 2-3 things NOT to do, (3) a reassuring closing statement confirming help is on the way. Keep language simple, clear, and calming. No jargon."

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
- The UI style must be immediately recognizable as Minimalism
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "FirstContact" must appear prominently in the UI
- Color palette must reflect: urgent red and cool white — emergency alertness with calm authority
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
