# AGENT PROMPT — digital-2
# Tool: CloneCourt | UI: Neomorphism
# Deployment domain: clonecourt-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **CloneCourt**

---

## PROBLEM CONTEXT
Sports organizations generate massive volumes of high-value digital media that rapidly
scatter across global platforms, making it nearly impossible to track. This vast visibility gap
leaves proprietary content highly vulnerable to widespread digital misappropriation, unauthorized
redistribution, and intellectual property violations.

Objective: Develop a scalable, innovative solution to identify, track, and flag unauthorized use
or misappropriation of official sports media across the internet. Enable organizations to
proactively authenticate their digital assets and detect anomalies in content propagation
in near real-time.

---

## THIS TOOL
**Name:** CloneCourt
**Tagline:** Build a legal case summary against a content thief in seconds
**Domain:** digital sports media, copyright protection, IP rights management

**User inputs:** Your asset description, original publish date, infringing URL, type of infringement, evidence available
**User sees:** A structured legal case summary with evidence chain, legal basis, estimated damages, and recommended actions
**Gemini's role:** Draft a compelling, evidence-based legal case summary against the content thief. Include legal basis, evidence chain, estimated damages, and step-by-step recommended legal actions.

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
"You are an IP litigation AI. Build a legal case summary for this content theft incident. Include: case title, legal basis (DMCA/copyright law), evidence chain (what they have vs what they need), estimated damages range, and 5 recommended legal actions in priority order. Be precise and actionable."

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
1. Page title and prominent heading = **CloneCourt**
2. Tagline shown below title: "Build a legal case summary against a content thief in seconds"
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
- Color palette: soft grey and deep blue — legal authority meets soft digital precision
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **CloneCourt** must be prominent in the UI
