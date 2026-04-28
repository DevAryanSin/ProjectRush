# AGENT PROMPT — volunteer-6

# Tool: EventPlanner | UI: Claymorphism

# Deployment domain: eventplanner-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **EventPlanner**

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

**Name:** EventPlanner
**Tagline:** Describe a community need — generate a complete volunteer event plan
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**User inputs:** Community need to address, available volunteers, budget, location/area, timeframe, any constraints
**User sees:** A complete volunteer event plan: event concept, schedule, role assignments, materials list, communication plan, and success metrics
**Gemini's role:** Generate a comprehensive, ready-to-execute volunteer event plan tailored to the community need and available resources. Include all operational details needed to run the event.

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

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a volunteer event planning AI. Create a complete event plan covering: (1) Event Concept and Name, (2) Full Day Schedule (hour by hour), (3) Volunteer Role Assignments (role name, responsibilities, count needed), (4) Materials and Resources List, (5) Pre-Event Communication Plan (what to send, when), (6) Success Metrics (how to measure impact). Make it ready to execute immediately."

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

1. Page title and prominent heading = **EventPlanner**
2. Tagline shown below title: "Describe a community need — generate a complete volunteer event plan"
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
- Color palette: cheerful yellow and soft green — community celebration meets organized action
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **EventPlanner** must be prominent in the UI
