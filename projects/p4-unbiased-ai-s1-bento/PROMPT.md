# AGENT PROMPT — p4-unbiased-ai-s1-bento
# Unbiased AI Decision — Ensuring Fairness and Detecting Bias in Automated Decisions
# Tool: BiasScope | UI: Bento Box Grid
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
Computer programs now make life-changing decisions about who gets a job, a bank loan,
or even medical care. However, if these programs learn from flawed or unfair historical data,
they will repeat and amplify those exact same discriminatory mistakes.

Objective: Build a clear, accessible solution to thoroughly inspect data sets and software models
for hidden unfairness or discrimination. Provide organizations with an easy way to measure, flag,
and fix harmful bias before their systems impact real people.

---

## THIS SPECIFIC TOOL
**Name:** BiasScope
**Tagline:** Paste a dataset description or model output — get a bias risk assessment instantly
**Domain:** AI fairness, bias detection, algorithmic accountability, ethics

**What the user does:**
Dataset description OR model output sample, use case (hiring/lending/medical/other), target population

**What they see as output:**
Bias risk rating, bias type identification, affected demographic groups, severity scores, and recommended audits

**How Gemini AI is used:**
Analyze the dataset or model output for bias risk vectors. Identify bias types (historical, representation, measurement, aggregation), affected groups, and severity. Return a structured risk assessment.

---

## UI STYLE REQUIREMENT
BENTO BOX GRID UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━
Core concept: The entire page is a grid of distinct rectangular cards (the "bento boxes").
Each card has a clear purpose and contains self-contained content. The grid is asymmetric —
cards vary in size (1×1, 2×1, 1×2, 2×2 units) creating visual hierarchy.

Visual language:
- Dark background (near-black #0a0a0a or deep navy) with colored card backgrounds
- Cards have subtle borders and slight rounded corners (8-12px)
- Each card has its own accent color or subtle gradient
- Typography is bold and large for headers inside cards
- Dense but organized — lots of information visible at once
- Card hover states with subtle glow or border highlight
- Numbers and stats get their own dedicated large-number cards

Layout rules:
- Use CSS Grid with auto-placement
- Main interaction card should be 2×2 or span full width
- Result cards populate the grid dynamically
- Mobile: stack to single column

Colors: Use the problem's color hint as your palette base.
Fonts: Choose a distinctive geometric sans-serif for headers, clean mono for data.
DO NOT: use white backgrounds, use equal-sized cards, use standard list layouts.

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

### CRITICAL: FIX HYDRATION ERROR
React 19 / Next.js 16 serializes `disabled={false}` as `null` during SSR, which causes a hydration mismatch on the client. You MUST add `suppressHydrationWarning` to any `<button>` or `<input>` that uses a dynamic `disabled` attribute (e.g., `disabled={isLoading}`).

Gemini prompt to use in your API route (customize for this tool):
"You are an AI bias risk analyst. Analyze this dataset description or model output for bias. Provide: overall bias risk rating (HIGH/MEDIUM/LOW), types of bias detected (historical/representation/measurement/aggregation), demographic groups most at risk, severity score for each bias type (1-5), and top 3 recommended audit actions. Be specific and cite evidence from the input."

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
- The UI style must be immediately recognizable as Bento Box Grid
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "BiasScope" must appear prominently in the UI
- Color palette must reflect: deep purple and clean white — analytical precision meets human ethics
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
