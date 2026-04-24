# AGENT PROMPT — digital-1
# Tool: WatermarkIQ | UI: Brutalism
# Deployment domain: watermarkiq-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **WatermarkIQ**

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
**Name:** WatermarkIQ
**Tagline:** Generate invisible watermark signatures for any digital asset
**Domain:** digital sports media, copyright protection, IP rights management

**User inputs:** Asset title, creator name, organization, asset type, creation date
**User sees:** A unique steganographic text signature, encoded ownership string, and embedding instructions
**Gemini's role:** Generate a unique cryptographic-style ownership signature string and invisible watermark text for the asset. Include encoding instructions.

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
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a digital watermarking AI. Generate a unique ownership signature for this asset: create a steganographic text string, an encoded ownership token, and step-by-step instructions for embedding it invisibly into the asset. Make the signature unique and traceable."

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
1. Page title and prominent heading = **WatermarkIQ**
2. Tagline shown below title: "Generate invisible watermark signatures for any digital asset"
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
- Color palette: electric yellow and black — raw power meets digital fingerprinting
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **WatermarkIQ** must be prominent in the UI
