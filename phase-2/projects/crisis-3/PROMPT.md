# AGENT PROMPT — crisis-3

# Tool: GuestSOS | UI: Aurora

# Deployment domain: guestsos-sc

# ═══════════════════════════════════════════════════════════════

# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.

# Generate ALL files in ONE response using EXACT delimiters below.

# ═══════════════════════════════════════════════════════════════

## YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **GuestSOS**

---

## PROBLEM CONTEXT

Hospitality venues face unpredictable, high-stakes emergencies that demand instantaneous,
coordinated reactions to protect lives and property. During a crisis, critical information is
often siloed, fracturing communication between distressed guests, on-site staff, and first responders.

Objective: Design a robust solution to instantly detect, report, and synchronize crisis response
efforts across a decentralized hospitality ecosystem. Eliminate fragmented communication by
creating a highly reliable bridge between distressed individuals, active personnel,
and emergency services.

---

## THIS TOOL

**Name:** GuestSOS
**Tagline:** Guest describes emergency — get immediate calm guidance in plain language
**Domain:** hospitality emergency management, crisis coordination, safety systems

**User inputs:** Emergency type, guest location in venue, number of people, any immediate dangers visible
**User sees:** Step-by-step immediate safety instructions written for a panicked non-expert, plus what NOT to do
**Gemini's role:** Generate clear, numbered, panic-reducing immediate safety instructions for a distressed venue guest. Use simple language. Include critical don'ts. End with reassurance.

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
"You are a guest safety AI for a hospitality venue. A guest is in distress. Give them: (1) 5 immediate actions numbered simply, (2) 3 things NOT to do, (3) one reassuring closing sentence. Use the simplest possible language. No jargon. Write as if texting someone who is panicking."

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

1. Page title and prominent heading = **GuestSOS**
2. Tagline shown below title: "Guest describes emergency — get immediate calm guidance in plain language"
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
- Color palette: calming deep blue and soft white aurora — safety and reassurance
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **GuestSOS** must be prominent in the UI
