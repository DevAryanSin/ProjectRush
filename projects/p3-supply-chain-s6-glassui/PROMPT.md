# AGENT PROMPT — p3-supply-chain-s6-glassui
# Smart Supply Chains — Resilient Logistics and Dynamic Supply Chain Optimization
# Tool: CargoDebrief | UI: Glass UI
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
**Name:** CargoDebrief
**Tagline:** After a delay, describe what happened — get a full post-mortem and prevention plan
**Domain:** logistics, supply chain management, route optimization, disruption detection

**What the user does:**
What happened, timeline of events, root cause (if known), business impact, teams involved

**What they see as output:**
Structured post-mortem report with timeline, root cause analysis, lessons learned, and a prioritized prevention checklist

**How Gemini AI is used:**
Conduct a supply chain post-mortem analysis. Extract root causes, identify systemic weaknesses, distill lessons, and generate a concrete prevention checklist ordered by impact.

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
- Model: `gemini-1.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

### CRITICAL: FIX HYDRATION ERROR
React 19 / Next.js 16 serializes `disabled={false}` as `null` during SSR, which causes a hydration mismatch on the client. You MUST add `suppressHydrationWarning` to any `<button>` or `<input>` that uses a dynamic `disabled` attribute (e.g., `disabled={isLoading}`).

Gemini prompt to use in your API route (customize for this tool):
"You are a supply chain post-mortem analyst. Analyze this incident and produce: structured timeline of failure, root cause analysis (5-Why format), 3 systemic weaknesses identified, key lessons learned, and a prioritized prevention checklist (5 items, ordered by impact). Be forensic and constructive."

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
- The UI style must be immediately recognizable as Glass UI
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "CargoDebrief" must appear prominently in the UI
- Color palette must reflect: industrial teal and amber — logistics precision meets real-time intelligence
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
