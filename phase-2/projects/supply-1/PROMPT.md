# AGENT PROMPT — supply-1

# Tool: WeatherShield | UI: Brutalism

# Deployment domain: weathershield-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **WeatherShield**

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

**Name:** WeatherShield
**Tagline:** Input your route and forecast — predict weather-based delay risk
**Domain:** logistics, supply chain management, route optimization, disruption detection

**User inputs:** Origin, destination, transport mode, departure date, any known weather conditions
**User sees:** Weather delay risk score, specific weather threats per route segment, impact on ETA, and weather-proofing recommendations
**Gemini's role:** Correlate the route details with weather risk patterns. Score weather-based delay probability, identify specific threat types per segment, and recommend weather-proofing actions.

---

## UI STYLE

BRUTALISM UI STYLE
━━━━━━━━━━━━━━━━━
Core concept: Raw, intentional ugliness that commands attention. Thick borders, offset
box shadows, loud typography, high contrast. Nothing is subtle. Everything is intentional.

Visual language:

- White or pale yellow background
- Thick solid black borders (3-5px) on ALL elements
- Offset box-shadows: 4-8px solid black (e.g. box-shadow: 6px 6px 0 black)
- Bold/black font weight (800-900) for all headings
- Uppercase text for labels and buttons
- Primary accent: one loud color (yellow, red, or lime green)
- Buttons are rectangles with thick border + offset shadow, no border-radius
- Hover: shadow reduces to 2px (feels like pressing)
- Input fields: thick bordered, no rounded corners

Layout: Asymmetric, intentional grid breaks, oversized elements, visible structure.
Fonts: Impact, Space Grotesk, or any extra-bold geometric sans-serif.
DO NOT: use rounded corners, use subtle shadows, use gradients, use thin fonts.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a logistics weather risk AI. Analyze this route for weather-based delay risk: overall risk score (0-100%), specific weather threats per segment (rain/snow/fog/wind/storm), estimated ETA impact in hours, and 3 weather-proofing recommendations. Base reasoning on typical seasonal patterns for the region and transport mode."

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

1. Page title and prominent heading = **WeatherShield**
2. Tagline shown below title: "Input your route and forecast — predict weather-based delay risk"
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

- UI must be immediately recognizable as Brutalism
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: stormy grey and electric blue — weather power meets logistics precision
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **WeatherShield** must be prominent in the UI
