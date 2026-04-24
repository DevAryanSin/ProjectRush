# AGENT PROMPT — supply-6
# Tool: DemandSignal | UI: Claymorphism
# Deployment domain: demandsignal-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **DemandSignal**

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
**Name:** DemandSignal
**Tagline:** Input market signals — get a near-term demand shift prediction
**Domain:** logistics, supply chain management, route optimization, disruption detection

**User inputs:** Industry/product type, recent market signals (news, trends, competitor moves, seasonal factors), current inventory level
**User sees:** Demand shift prediction: direction (up/down/stable), magnitude estimate, confidence level, leading indicators to watch, and inventory recommendation
**Gemini's role:** Analyze qualitative market signals to forecast near-term demand shifts. Provide directional prediction with confidence level, explain the signal logic, and recommend inventory actions.

---

## UI STYLE
CLAYMORPHISM UI STYLE
━━━━━━━━━━━━━━━━━━━━
Core concept: Soft, inflated, 3D-looking shapes that appear molded from clay. Pastel
colors, thick shadows, rounded everything. Playful and modern.

Visual language:
- Light pastel background (soft lavender, mint, peach, or sky blue)
- Cards appear inflated: border-radius 20-30px, strong drop shadow
  box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08)
- Elements have a "puffy" quality — generous padding, large border-radius
- Color palette: soft pastels with one punchy accent
- Inner elements also rounded and colorful
- Buttons are pill-shaped or very rounded rectangles
- Slight gradient on card backgrounds (same hue, slightly lighter top)
- Icons are filled, colorful, rounded style

Layout: Centered, card-based, generous whitespace. Feels like a mobile app.
Fonts: Rounded sans-serif (Nunito, Varela Round, Fredoka One for display).
DO NOT: use sharp corners, use dark backgrounds, use thin elements, use flat shadows.

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a demand forecasting AI. Analyze these market signals and predict near-term demand: direction (increase/decrease/stable), magnitude (%, low/medium/high confidence), top 3 signals driving the prediction, 2 counter-signals to watch, and specific inventory recommendation (build/hold/reduce by how much). Explain your signal logic clearly."

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
1. Page title and prominent heading = **DemandSignal**
2. Tagline shown below title: "Input market signals — get a near-term demand shift prediction"
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
- UI must be immediately recognizable as Claymorphism
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: soft orange and light blue — market energy meets approachable prediction
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **DemandSignal** must be prominent in the UI
