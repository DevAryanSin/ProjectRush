# AGENT PROMPT — p5-volunteer-coord-s3-flat
# Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact
# Tool: TaskForge | UI: Flat Design
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
**Name:** TaskForge
**Tagline:** Describe a community problem — auto-generate a complete volunteer task breakdown
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**What the user does:**
Community problem description, available volunteer count, timeframe, geographic area, resources available

**What they see as output:**
A structured volunteer task breakdown with specific assignable tasks, time estimates, skill requirements, and coordination notes

**How Gemini AI is used:**
Decompose a vague community problem into specific, assignable, time-boxed volunteer tasks. Each task should have a clear output, required skills, time estimate, and dependencies.

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
- Model: `gemini-2.5-flash
`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

Gemini prompt to use in your API route (customize for this tool):
"You are a volunteer task planning AI for NGOs. Decompose this community problem into exactly 6-8 specific volunteer tasks. For each task: task name, clear deliverable, required skills (max 3), time estimate (hours), volunteer count needed, dependencies on other tasks, and success criteria. Make tasks specific enough to assign immediately. Output as a structured task list."

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
- The UI style must be immediately recognizable as Flat Design
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "TaskForge" must appear prominently in the UI
- Color palette must reflect: warm green and earthy orange — community warmth meets organized action
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
