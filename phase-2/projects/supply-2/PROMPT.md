# AGENT PROMPT — supply-2

# Tool: VendorScore | UI: Neomorphism

# Deployment domain: vendorscore-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **VendorScore**

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

**Name:** VendorScore
**Tagline:** Describe a vendor relationship — get a full reliability scorecard
**Domain:** logistics, supply chain management, route optimization, disruption detection

**User inputs:** Vendor type, how long you've worked together, recent issues, delivery performance, communication quality, financial stability signals
**User sees:** A vendor reliability scorecard: scores across 5 dimensions, overall grade, risk flags, and relationship recommendations
**Gemini's role:** Evaluate the vendor relationship across reliability dimensions: delivery performance, communication, financial stability, flexibility, and risk concentration. Output a scored card with grade and recommendations.

---

## UI STYLE

NEOMORPHISM UI STYLE
━━━━━━━━━━━━━━━━━━━
Core concept: Soft extruded 3D elements that appear pressed from the same material as
the background. Everything is the same color family. Depth through dual shadows only.

Visual language:

- Background: a mid-tone flat color (e.g. #e0e5ec or soft warm grey)
- Elements use TWO shadows: light shadow top-left, dark shadow bottom-right
  e.g. box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px rgba(0,0,0,0.15)
- Inset version for pressed/active states:
  box-shadow: inset -3px -3px 7px #ffffff, inset 3px 3px 7px rgba(0,0,0,0.15)
- One accent color (soft blue, green, or purple) for active states only
- Minimal text — clean, medium weight
- Icons are monoline, same color family
- NO harsh borders, NO gradients, NO bright colors

Layout: Centered, spacious, generous padding. Elements float softly.
Fonts: Clean rounded sans-serif (Nunito, Poppins). Medium weights.
DO NOT: use multiple colors, use hard borders, use flat shadows, use dark backgrounds.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a vendor assessment AI. Score this vendor across 5 dimensions (each 1-10): Delivery Reliability, Communication Quality, Financial Stability, Flexibility/Responsiveness, Risk Concentration. Give overall grade (A-F), top 2 risk flags, and 3 relationship recommendations. Justify each score briefly."

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

1. Page title and prominent heading = **VendorScore**
2. Tagline shown below title: "Describe a vendor relationship — get a full reliability scorecard"
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

- UI must be immediately recognizable as Neomorphism
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: soft white and forest green — trust and reliability in physical form
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **VendorScore** must be prominent in the UI
