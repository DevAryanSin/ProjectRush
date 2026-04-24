# AGENT PROMPT — digital-3
# Tool: AssetVault | UI: Aurora
# Deployment domain: assetvault-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **AssetVault**

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
**Name:** AssetVault
**Tagline:** Describe your media library — get a theft vulnerability ranking
**Domain:** digital sports media, copyright protection, IP rights management

**User inputs:** List of asset types in your library, their platforms, access levels, and commercial value
**User sees:** A prioritized vulnerability ranking of each asset type with theft risk score and protection recommendations
**Gemini's role:** Analyze the media library description and rank each asset type by theft vulnerability. Score each on a risk matrix and provide specific protection recommendations per asset type.

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
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a digital asset security analyst. Analyze this media library and rank each asset type by theft vulnerability (1-10 score). For each: explain why it's at risk, which platforms expose it most, and give 2 specific protection actions. Output as a prioritized ranked list."

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
1. Page title and prominent heading = **AssetVault**
2. Tagline shown below title: "Describe your media library — get a theft vulnerability ranking"
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
- Color palette: deep space navy with teal and purple aurora gradients
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **AssetVault** must be prominent in the UI
