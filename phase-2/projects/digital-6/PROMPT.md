# AGENT PROMPT — digital-6

# Tool: LicenseGen | UI: Claymorphism

# Deployment domain: licensegen-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **LicenseGen**

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

**Name:** LicenseGen
**Tagline:** Input your asset details — get a custom license agreement generated instantly
**Domain:** digital sports media, copyright protection, IP rights management

**User inputs:** Asset type, permitted uses, prohibited uses, attribution requirements, commercial terms, territory
**User sees:** A complete, structured content license agreement ready to attach to your asset
**Gemini's role:** Draft a complete, legally-structured content license agreement based on the specified terms. Use standard IP licensing language adapted to the asset type and usage requirements.

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
"You are an IP licensing AI. Draft a complete content license agreement for this asset with these sections: Grant of License, Permitted Uses, Prohibited Uses, Attribution Requirements, Commercial Terms, Territory, Term and Termination, Warranties, Governing Law. Use precise legal language appropriate for digital media licensing."

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

1. Page title and prominent heading = **LicenseGen**
2. Tagline shown below title: "Input your asset details — get a custom license agreement generated instantly"
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
- Color palette: soft lavender and mint — approachable legal meets playful digital
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **LicenseGen** must be prominent in the UI
