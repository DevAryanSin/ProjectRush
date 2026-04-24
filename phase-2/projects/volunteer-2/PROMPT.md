# AGENT PROMPT — volunteer-2
# Tool: VolunteerBio | UI: Neomorphism
# Deployment domain: volunteerbio-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **VolunteerBio**

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
**Name:** VolunteerBio
**Tagline:** Volunteer fills in their details — get a compelling impact bio generated
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**User inputs:** Volunteer name, skills, hours contributed, tasks completed, communities served, personal motivation
**User sees:** A personal impact bio suitable for NGO website, donor reports, and volunteer recognition
**Gemini's role:** Craft a compelling, human-centered volunteer impact bio. Highlight concrete contributions, personal motivation, and community impact in an inspiring narrative format.

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
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are an NGO storytelling AI. Write a compelling volunteer impact bio (150-200 words) covering: who they are, what they did (specific tasks and hours), who they helped (concrete community impact), and what drives them. Make it inspiring for donor reports and volunteer recruitment. Use first-person voice."

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
1. Page title and prominent heading = **VolunteerBio**
2. Tagline shown below title: "Volunteer fills in their details — get a compelling impact bio generated"
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
- Color palette: warm peach and soft brown — human warmth meets professional recognition
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **VolunteerBio** must be prominent in the UI
