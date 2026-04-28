# AGENT PROMPT — volunteer-3

# Tool: CommunityPulse | UI: Aurora

# Deployment domain: communitypulse-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **CommunityPulse**

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

**Name:** CommunityPulse
**Tagline:** Paste community social media posts — extract hidden needs for NGO action
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**User inputs:** Raw social media posts, forum comments, or community messages from a target area
**User sees:** Extracted community needs: ranked list with urgency scores, sentiment analysis, population segments affected, and NGO action recommendations
**Gemini's role:** Perform social listening analysis on community posts. Extract unmet needs, rank by urgency, identify affected segments, and translate signals into actionable NGO interventions.

---

## UI STYLE

AURORA UI STYLE
━━━━━━━━━━━━━━
Core concept: Dark background with flowing, ethereal gradient overlays inspired by the
northern lights. Deep, immersive, and premium feeling.

Visual language:

- Very dark background (#050810 or #0a0a1a)
- 2-4 large blurred gradient orbs (position: absolute, blur: 100-150px, opacity: 0.4-0.6)
  Colors: teal (#00d4aa), purple (#7c3aed), blue (#2563eb), pink (#db2777)
- Cards: dark semi-transparent (rgba(255,255,255,0.05)) with subtle border
- Text: white primary, light grey secondary
- Accent elements have gradient text or gradient borders
- Animated subtle movement on orbs (CSS keyframe, slow 8-12s)
- Input fields: dark glass style

Layout: Full-width sections, centered content, floating cards over the aurora background.
Fonts: Modern, elegant. Inter, Plus Jakarta Sans, or similar.
DO NOT: use light backgrounds, use flat colors, skip the gradient orbs.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a community intelligence AI for NGOs. Analyze these social media posts and extract: (1) Top 5 unmet needs ranked by urgency (1-10 score), (2) Sentiment per need (frustrated/scared/resigned/hopeful), (3) Population segments most affected, (4) Hidden needs not stated explicitly but implied, (5) 3 specific NGO interventions recommended. Quote specific posts as evidence."

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

1. Page title and prominent heading = **CommunityPulse**
2. Tagline shown below title: "Paste community social media posts — extract hidden needs for NGO action"
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

- UI must be immediately recognizable as Aurora
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: community blue and warm orange aurora — social listening meets action
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **CommunityPulse** must be prominent in the UI
