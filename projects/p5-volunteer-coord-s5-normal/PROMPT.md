# AGENT PROMPT — p5-volunteer-coord-s5-normal
# Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact
# Tool: FieldDebrief | UI: Normal / Professional
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
**Name:** FieldDebrief
**Tagline:** Submit your field report in plain language — get it structured for NGO records automatically
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**What the user does:**
A plain-language field report: what you saw, what you did, who you helped, any issues encountered

**What they see as output:**
A structured NGO field report with date, location, activities, beneficiaries reached, issues flagged, and follow-up needed

**How Gemini AI is used:**
Convert conversational volunteer field notes into structured, searchable NGO documentation. Extract key facts, fill standard report fields, flag urgent issues, and identify follow-up requirements.

---

## UI STYLE REQUIREMENT
NORMAL / PROFESSIONAL UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: A clean, professional web application UI. Familiar patterns but executed
with care and quality. Looks like a real SaaS product a professional would trust.

Visual language:
- White main background with light grey (#f8f9fa) sidebars or sections
- Primary brand color for CTAs and highlights
- Subtle shadows (0 1px 3px rgba(0,0,0,0.1)) to define card depth
- Consistent 4px border radius on cards and inputs
- Professional typography — clean, readable, appropriate size hierarchy
- Header/nav bar with logo area and possibly nav links
- Status indicators (badges, colored dots) for results
- Progress or loading states that feel polished

Layout rules:
- App-style layout with optional sidebar or top nav
- Main content area with card-based sections
- Form in a contained card with clear label/input pairs
- Results in separate card below or beside input
- Footer with minimal info

Colors: Professional palette — trust-inspiring. Blue/teal/green tones work well.
Fonts: Clean, legible sans-serif. System-font stack or a reliable Google Font.
DO NOT: look like a landing page, use heavy gradients, look like a portfolio site.

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

Gemini prompt to use in your API route (customize for this tool):
"You are a field documentation AI for NGOs. Convert this volunteer field report into a structured record with these sections: Date/Location, Volunteer Name (if mentioned), Activities Completed, Beneficiaries Reached (count + description), Resources Used, Issues Encountered (flag urgent ones), Follow-Up Required, and Overall Field Status (GREEN/YELLOW/RED). Note any critical information that is missing."

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
- The UI style must be immediately recognizable as Normal / Professional
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "FieldDebrief" must appear prominently in the UI
- Color palette must reflect: warm green and earthy orange — community warmth meets organized action
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
