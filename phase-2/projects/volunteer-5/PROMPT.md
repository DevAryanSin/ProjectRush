# AGENT PROMPT — volunteer-5
# Tool: SkillGapFinder | UI: Paper
# Deployment domain: skillgapfinder-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **SkillGapFinder**

---

## PROBLEM CONTEXT
Local social groups and NGOs collect a lot of important information about community needs
through paper surveys and field reports. However, this valuable data is often scattered across
different places, making it hard to see the biggest problems clearly.

Objective: Design a powerful system that gathers scattered community information to clearly show
the most urgent local needs. Build a smart way to quickly match and connect available volunteers
with the specific tasks and areas where they are needed most.

---

## THIS TOOL
**Name:** SkillGapFinder
**Tagline:** Describe your NGO projects — find the volunteer skill gaps holding you back
**Domain:** NGO operations, volunteer management, community needs assessment, social impact

**User inputs:** Current NGO projects, current volunteer skills available, project challenges faced, upcoming initiatives
**User sees:** Skill gap analysis: missing skills ranked by criticality, impact of each gap, recruitment brief for each missing skill, and interim workarounds
**Gemini's role:** Analyze the gap between NGO project needs and available volunteer skills. Rank gaps by criticality, quantify impact, and generate targeted recruitment briefs for each missing skill.

---

## UI STYLE
PAPER / EDITORIAL UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: A well-designed newspaper or magazine layout. Serif fonts, structured
columns, clear typographic hierarchy. Serious, trustworthy, readable.

Visual language:
- Background: off-white/cream (#fafaf7 or #f5f0e8)
- Text: near-black (#1a1a1a) primary, dark grey secondary
- Accent: one ink color (dark red, dark blue, or forest green)
- Serif fonts for headings and body content
- Clear typographic hierarchy: massive headline → subhead → body → caption
- Thin rule lines (1px) to separate sections (like newspaper columns)
- Minimal decoration — content IS the design
- Pull quotes styled large and italic
- Date/byline style metadata
- Results displayed as formatted article sections

Layout: Column-based, justified or left-aligned text, editorial structure.
Fonts: Playfair Display or Lora for headings, Source Serif or Georgia for body.
DO NOT: use sans-serif for content, use gradients, use rounded cards, use bright colors.

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are an NGO talent strategy AI. Analyze this skill gap and provide: (1) Top 5 missing skills ranked by criticality to mission, (2) Impact of each gap on project outcomes, (3) A 3-sentence volunteer recruitment brief for each missing skill, (4) An interim workaround for each gap while recruiting. Make recruitment briefs compelling for potential volunteers."

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
1. Page title and prominent heading = **SkillGapFinder**
2. Tagline shown below title: "Describe your NGO projects — find the volunteer skill gaps holding you back"
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
- UI must be immediately recognizable as Paper
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: warm ivory and deep teal — organizational clarity meets editorial structure
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **SkillGapFinder** must be prominent in the UI
