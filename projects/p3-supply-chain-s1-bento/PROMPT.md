# AGENT PROMPT — p3-supply-chain-s1-bento
# Smart Supply Chains — Resilient Logistics and Dynamic Supply Chain Optimization
# Tool: DisruptRadar | UI: Bento Box Grid
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
**Name:** DisruptRadar
**Tagline:** Input your shipment route — get a disruption risk score before it happens
**Domain:** logistics, supply chain management, route optimization, disruption detection

**What the user does:**
Origin city, destination city, cargo type, departure date, transport mode (air/sea/rail/road)

**What they see as output:**
Disruption probability score (0-100%), top risk factors, severity breakdown by category, and recommended mitigation

**How Gemini AI is used:**
Analyze the route details and assess disruption probability. Consider weather patterns, geopolitical factors, seasonal demand, infrastructure reliability, and historical disruption data for that route type. Return a scored risk assessment.

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
- Each card has its own accent color or subtle gradient
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
- Model: `gemini-1.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

Gemini prompt to use in your API route (customize for this tool):
"You are a supply chain disruption analyst AI. Analyze this shipment route and provide: overall disruption risk score (0-100%), top 3 risk factors with individual scores, risk categories (weather/geopolitical/infrastructure/demand), and 2-3 specific mitigation recommendations. Be data-driven and specific."

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
- The tool name "DisruptRadar" must appear prominently in the UI
- Color palette must reflect: industrial teal and amber — logistics precision meets real-time intelligence
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
