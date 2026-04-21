# AGENT PROMPT — p5-volunteer-coord-s2-glassmorphism

# Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact

# Tool: VolunteerMatch | UI: Glassmorphism

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

Local social groups and NGOs collect a lot of important information about community needs
through paper surveys and field reports. However, this valuable data is often scattered across
different places, making it hard to see the biggest problems clearly.

Objective: Design a powerful system that gathers scattered community information to clearly show
the most urgent local needs. Build a smart way to quickly match and connect available volunteers
with the specific tasks and areas where they are needed most.

---

## THIS SPECIFIC TOOL

**Name:** VolunteerMatch
**Tagline:** Describe a volunteer and a community need — get a match score and detailed reasoning
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**What the user does:**
Volunteer skills, availability (hours/week), location, languages spoken, experience — AND a community task description

**What they see as output:**
Match score (0-100%), fit reasoning, skill alignment breakdown, potential gaps, and onboarding recommendations

**How Gemini AI is used:**
Intelligently match volunteer profile to task requirements. Score the match across multiple dimensions (skills, availability, location, language, experience). Identify gaps and suggest how they can be bridged.

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

Fonts: Choose an elegant, slightly rounded sans-serif. Light weights for body.
DO NOT: use white/light backgrounds, use solid opaque cards, skip the blur effect.

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
"You are a volunteer-task matching AI. Analyze this volunteer profile against this community task. Provide: overall match score (0-100%), skill alignment breakdown (score each relevant skill 1-5), availability fit assessment, location compatibility, language match, experience relevance, top 2 gaps and how to address them, and a 2-sentence onboarding recommendation. Be specific."

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
- The UI style must be immediately recognizable as Glassmorphism
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "VolunteerMatch" must appear prominently in the UI
- Color palette must reflect: warm green and earthy orange — community warmth meets organized action
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
