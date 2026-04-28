# AGENT PROMPT — p1-digital-asset-s3-flat

# Digital Asset Protection — Protecting the Integrity of Digital Sports Media

# Tool: DMCA Forge | UI: Flat Design

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

**Name:** DMCA Forge
**Tagline:** Fill in asset details — get a ready-to-send DMCA takedown notice drafted instantly
**Domain:** digital sports media, copyright protection, IP rights management

**What the user does:**
Rights holder name, asset description, original URL, infringing URL, date of infringement

**What they see as output:**
A complete, formatted DMCA takedown notice ready to send to the platform

**How Gemini AI is used:**
Draft a formal, legally-structured DMCA takedown notice using the provided details. Use standard legal language. Make it specific, professional, and actionable.

---

## UI STYLE REQUIREMENT

FLAT DESIGN UI STYLE
━━━━━━━━━━━━━━━━━━━
Core concept: Zero depth. No shadows, no gradients, no skeuomorphism. Pure color blocks,
sharp edges, and bold typography. Every element is defined by color contrast alone.

Visual language:

- Bright, saturated flat colors (pick a bold primary + 2-3 complementary colors)
- No box-shadows, no gradients, no blur effects
- Sharp 0px or minimal (4px max) border radius
- Bold, large typography — font weight 700-900 for headers
- Flat icons (use lucide-react, strokeWidth 1.5-2)
- Color blocks define sections — alternating background colors
- Buttons are solid color rectangles with no effects
- Flat illustration-style decorative elements using CSS shapes

Layout rules:

- Clear section-based layout with color-defined zones
- Full-width colored header section
- Content in a clean grid below
- Results displayed as flat colored cards/tags
- Strong color contrast for all text (WCAG AA minimum)

Colors: Choose a bold palette — one dominant color, one action color, neutral base.
Fonts: Choose a bold geometric or humanist sans-serif. Avoid thin weights.
DO NOT: add shadows, add gradients, add blur, use rounded pill shapes.

---

## GEMINI API INTEGRATION

- Model: `gemini-2.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

### CRITICAL: FIX HYDRATION ERROR

React 19 / Next.js 16 serializes `disabled={false}` as `null` during SSR, which causes a hydration mismatch on the client. You MUST add `suppressHydrationWarning` to any `<button>` or `<input>` that uses a dynamic `disabled` attribute (e.g., `disabled={isLoading}`).

Gemini prompt to use in your API route (customize for this tool):
"Draft a formal DMCA Section 512(c) takedown notice using these details. Include: identification of copyrighted work, location of infringing material, statement of good faith belief, accuracy statement, and signature block. Use professional legal language."

Append the user's actual input to this system prompt when calling Gemini.

---

## TECH CONSTRAINTS (STRICT)

- Framework: Next.js 16, App Router (`app/` directory)
- Language: TypeScript (.tsx files)
- Styling: Tailwind CSS + custom CSS variables in globals.css
- Icons: lucide-react only (already installed)
- NO additional npm packages — only: next, react, react-dom, lucide-react, tailwindcss
- Build command: `next build `
- Node engine: 24.x
- The Gemini API call happens in `app/api/generate/route.ts` (server-side only)
- The page uses client-side fetch to call `/api/generate`
- Add `'use client'` directive to `app/page.tsx`
- Add `suppressHydrationWarning` to any `<button>` or `<input>` element that uses a dynamic `disabled` prop — React 19 serializes `disabled={false}` as `null` in SSR causing hydration mismatches

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
- The UI style must be immediately recognizable as Flat Design
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "DMCA Forge" must appear prominently in the UI
- Color palette must reflect: deep navy and electric gold — sports prestige meets digital security
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
