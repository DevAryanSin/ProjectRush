# AGENT PROMPT — p3-supply-chain-s4-minimalism

# Smart Supply Chains — Resilient Logistics and Dynamic Supply Chain Optimization

# Tool: ETA Shield | UI: Minimalism

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

Modern global supply chains manage millions of concurrent shipments across highly complex
and inherently volatile transportation networks. Critical transit disruptions ranging from sudden
weather events to hidden operational bottlenecks are chronically identified only after delivery
timelines are already compromised.

Objective: Design a scalable system capable of continuously analyzing multifaceted transit data
to preemptively detect and flag potential supply chain disruptions. Formulate dynamic mechanisms
that instantly execute or recommend highly optimized route adjustments before localized
bottlenecks cascade into broader delays.

---

## THIS SPECIFIC TOOL

**Name:** ETA Shield
**Tagline:** Input your shipment details and disruption event — get a revised ETA and impact summary
**Domain:** logistics, supply chain management, route optimization, disruption detection

**What the user does:**
Original ETA, disruption type, disruption severity (1-5), current location, cargo criticality

**What they see as output:**
Revised ETA range, delay impact assessment, downstream effects, and stakeholder communication draft

**How Gemini AI is used:**
Recalculate delivery timeline based on disruption details. Assess downstream impact on dependent shipments or operations. Draft a concise stakeholder update communication.

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
"You are a logistics ETA recalculation AI. Given this disruption, provide: revised ETA (best case / likely / worst case), delay breakdown by cause, downstream impact on operations, and a draft stakeholder update email (3 sentences: what happened, new ETA, what's being done). Be realistic and specific."

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
- The tool name "ETA Shield" must appear prominently in the UI
- Color palette must reflect: industrial teal and amber — logistics precision meets real-time intelligence
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
