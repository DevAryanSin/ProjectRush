# AGENT PROMPT — bias-3
# Tool: ModelCard | UI: Aurora
# Deployment domain: modelcard-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **ModelCard**

---

## PROBLEM CONTEXT
Computer programs now make life-changing decisions about who gets a job, a bank loan,
or even medical care. However, if these programs learn from flawed or unfair historical data,
they will repeat and amplify those exact same discriminatory mistakes.

Objective: Build a clear, accessible solution to thoroughly inspect data sets and software models
for hidden unfairness or discrimination. Provide organizations with an easy way to measure, flag,
and fix harmful bias before their systems impact real people.

---

## THIS TOOL
**Name:** ModelCard
**Tagline:** Describe your AI model — auto-generate a bias-aware model card
**Domain:** AI fairness, bias detection, algorithmic accountability, ethics

**User inputs:** Model purpose, training data description, intended users, known limitations, deployment context
**User sees:** A complete model card with fairness section: intended use, limitations, bias risks, recommended mitigations, and evaluation checklist
**Gemini's role:** Generate a comprehensive, bias-aware model card. Include standard model card sections plus a detailed fairness and bias risk section with specific mitigation recommendations.

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
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are an AI documentation specialist. Generate a model card with these sections: Model Description, Intended Use, Out-of-Scope Uses, Training Data Summary, Evaluation Results (placeholder), Ethical Considerations, Bias and Fairness Risks (list specific risks for this model type), Recommended Mitigations, and a 10-item Pre-Deployment Fairness Checklist. Be specific to this model's domain."

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
1. Page title and prominent heading = **ModelCard**
2. Tagline shown below title: "Describe your AI model — auto-generate a bias-aware model card"
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
- Color palette: deep indigo and violet aurora — AI documentation meets ethical clarity
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **ModelCard** must be prominent in the UI
