# AGENT PROMPT — p1-digital-asset-s2-glassmorphism
# Digital Asset Protection — Protecting the Integrity of Digital Sports Media
# Tool: PropagationMap | UI: Glassmorphism
# ═══════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE GENERATING ANY CODE.
# ═══════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. You will generate a complete,
production-ready Next.js 16 web application as a functional MVP.

Generate ALL THREE files below in ONE response. Use the EXACT delimiters specified.
Do not add any explanation text, markdown, or commentary outside the delimiters.

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

## THIS SPECIFIC TOOL
**Name:** PropagationMap
**Tagline:** Describe a media asset — understand how it has likely spread across platforms
**Domain:** digital sports media, copyright protection, IP rights management

**What the user does:**
Asset name, type (video/image/article), original publish date, original platform

**What they see as output:**
A propagation risk summary: likely spread channels, high-risk platforms, anomaly signals, and a timeline narrative

**How Gemini AI is used:**
Based on the asset description, simulate and explain how this type of sports media typically propagates across the internet. Identify which platforms are highest risk for unauthorized redistribution and flag anomaly patterns.

---

## UI STYLE REQUIREMENT
GLASSMORPHISM UI STYLE
━━━━━━━━━━━━━━━━━━━━━━
Core concept: Frosted glass cards floating over a rich gradient or blurred background.
Everything feels translucent, layered, and ethereal. Depth is created through blur and opacity.

Visual language:
- Rich gradient background (deep, saturated — not flat)
- Cards use: backdrop-filter: blur(12-20px), background: rgba(255,255,255,0.08-0.15)
- Subtle white border: border: 1px solid rgba(255,255,255,0.18)
- Box shadows: 0 8px 32px rgba(0,0,0,0.3)
- Text is white or very light on dark glass panels
- Floating orbs or gradient blobs in background as atmosphere
- Input fields are glass-style with white placeholder text
- Buttons have gradient fills or glass variants

Layout rules:
- Centered card layout, max-width 680px for main panel
- Multiple layered glass panels for result sections
- Background has 2-3 large blurred color orbs (position: absolute, blur: 80-120px)
- Smooth CSS animations on load (fade + translateY)

Colors: Pick 2-3 saturated colors for background orbs. White for text.
Fonts: Choose an elegant, slightly rounded sans-serif. Light weights for body.
DO NOT: use white/light backgrounds, use solid opaque cards, skip the blur effect.

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

Gemini prompt to use in your API route (customize for this tool):
"You are a content propagation analyst for sports media. Given this asset description, explain its likely spread pattern across social media, streaming sites, and news aggregators. Identify top 3 high-risk redistribution channels and any anomaly signals to watch."

Append the user's actual input to this system prompt when calling Gemini.

---

## TECH CONSTRAINTS (STRICT)
- Framework: Next.js 16, App Router (`app/` directory)
- Language: TypeScript (.tsx files)
- Styling: Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only (already installed)
- NO additional npm packages — only: next, react, react-dom, lucide-react, tailwindcss
- Build command: `next build --no-turbo`
- Node engine: 24.x
- The Gemini API call happens in `app/api/generate/route.ts` (server-side only)
- The page uses client-side fetch to call `/api/generate`
- Add `'use client'` directive to `app/page.tsx`

---

## FUNCTIONAL REQUIREMENTS
1. User sees a clean, styled input form matching the UI style described above
2. User fills in the required input fields (described in "What the user does" above)
3. User clicks a submit/analyze button
4. A loading state is shown while waiting for Gemini
5. The Gemini response is displayed in a well-styled results section
6. The result should be parsed and displayed with visual hierarchy (not just raw text)
7. Error states are handled gracefully
8. The page is fully responsive (mobile + desktop)

---

## OUTPUT FORMAT (MANDATORY)
Respond with EXACTLY this structure. No text before or after. No markdown code fences
inside the blocks. Use these exact delimiters:

--- FILE: app/page.tsx ---
[complete TypeScript React component code here]
--- FILE: app/api/generate/route.ts ---
[complete Next.js API route code here]
--- FILE: app/globals.css ---
[complete CSS with Tailwind directives and all custom styles here]
--- END ---

---

## QUALITY REQUIREMENTS
- The UI must look PROFESSIONAL and POLISHED — not like a placeholder
- The UI style must be immediately recognizable as Glassmorphism
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "PropagationMap" must appear prominently in the UI
- Color palette must reflect: deep navy and electric gold — sports prestige meets digital security
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
