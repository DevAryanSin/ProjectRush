# AGENT PROMPT — p2-crisis-response-s5-normal

# Rapid Crisis Response — Accelerated Emergency Response and Crisis Coordination in Hospitality

# Tool: IncidentLog | UI: Normal / Professional

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

Hospitality venues face unpredictable, high-stakes emergencies that demand instantaneous,
coordinated reactions to protect lives and property. During a crisis, critical information is
often siloed, fracturing communication between distressed guests, on-site staff, and first
responders.

Objective: Design a robust solution to instantly detect, report, and synchronize crisis response
efforts across a decentralized hospitality ecosystem. Eliminate fragmented communication by
creating a highly reliable bridge between distressed individuals, active personnel,
and emergency services.

---

## THIS SPECIFIC TOOL

**Name:** IncidentLog
**Tagline:** Describe what happened in plain language — get a formatted official incident report
**Domain:** hospitality emergency management, crisis coordination, safety systems

**What the user does:**
A plain-language description of the incident: what happened, when, where, who was involved

**What they see as output:**
A formatted official incident report with timestamp, categorization, narrative, parties involved, actions taken, and follow-up required

**How Gemini AI is used:**
Transform messy plain-language field notes into a structured, professional incident report following hospitality industry standards. Extract key facts, fill standard report fields, and flag any missing critical information.

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

- Model: `gemini-2.5-flash`
- API Key env var: `process.env.GEMINI_API_KEY` (available server-side only)
- API Endpoint in your route: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
- The API route is at: `/api/generate` (POST)
- Request body your page sends: `{ "prompt": "user input text here" }`
- Response your API route returns: `{ "result": "gemini response text" }`

### CRITICAL: FIX HYDRATION ERROR

React 19 / Next.js 16 serializes `disabled={false}` as `null` during SSR, which causes a hydration mismatch on the client. You MUST add `suppressHydrationWarning` to any `<button>` or `<input>` that uses a dynamic `disabled` attribute (e.g., `disabled={isLoading}`).

Gemini prompt to use in your API route (customize for this tool):
"You are an incident documentation AI for hospitality operations. Convert this plain-language incident description into a formal incident report with these sections: Incident Reference, Date/Time, Location, Incident Type, Parties Involved, Narrative Description, Immediate Actions Taken, Follow-Up Required, Reporting Officer. Note any missing information that should be obtained."

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
- The UI style must be immediately recognizable as Normal / Professional
- Loading states must be visually clear
- Results must be formatted with visual hierarchy, not raw text dumps
- The tool name "IncidentLog" must appear prominently in the UI
- Color palette must reflect: urgent red and cool white — emergency alertness with calm authority
- Choose distinctive, non-generic fonts (use Google Fonts via @import in globals.css)
- The app should feel like a real product someone would use

Generate now. Only output the three file blocks.
