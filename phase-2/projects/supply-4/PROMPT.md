# AGENT PROMPT — supply-4
# Tool: CostLeakFinder | UI: Terminal
# Deployment domain: costleakfinder-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **CostLeakFinder**

---

## PROBLEM CONTEXT
Modern global supply chains manage millions of concurrent shipments across highly complex
and inherently volatile transportation networks. Critical transit disruptions ranging from sudden
weather events to hidden operational bottlenecks are chronically identified only after delivery
timelines are already compromised.

Objective: Design a scalable system capable of continuously analyzing multifaceted transit data
to preemptively detect and flag potential supply chain disruptions. Formulate dynamic mechanisms
that instantly execute or recommend highly optimized route adjustments before localized
bottlenecks cascade into broader delays.

---

## THIS TOOL
**Name:** CostLeakFinder
**Tagline:** Describe your supply chain — find hidden cost inefficiencies instantly
**Domain:** logistics, supply chain management, route optimization, disruption detection

**User inputs:** Supply chain description: stages, vendors, transport modes, storage, current pain points
**User sees:** A cost leak analysis: identified inefficiency points, estimated waste per issue, priority ranking, and cost-saving actions
**Gemini's role:** Analyze the supply chain description for hidden cost inefficiencies. Identify waste points, estimate financial impact, and prescribe targeted cost-saving interventions.

---

## UI STYLE
TERMINAL / HACKER UI STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Core concept: Command-line interface aesthetic. Monospace everything. Green on black.
Feels like you're in a 90s hacker movie but functional and modern.

Visual language:
- Background: pure black (#000000) or very dark green-black (#0a0f0a)
- Primary text: bright green (#00ff41 or #39ff14)
- Secondary text: dim green (#008f11)
- Accent: white or bright cyan for highlights
- Font: monospace ONLY (Courier New, Fira Code, JetBrains Mono)
- Borders: 1px solid green, sometimes dashed
- Buttons look like CLI commands: [> EXECUTE] or [$ SUBMIT]
- Input fields look like terminal prompts: "> _"
- Fake loading/typing animations using CSS
- Scanline effect optional (CSS repeating-gradient overlay)

Layout: Left-aligned, terminal-window style, fake window chrome optional.
Fonts: ONLY monospace. No exceptions.
DO NOT: use colors other than green/black/white/cyan, use rounded corners, use sans-serif.

---

## GEMINI API INTEGRATION
- Model: `gemini-1.5-flash`
- API key env var: `process.env.GEMINI_API_KEY` (server-side only)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`
- Your API route: `app/api/generate/route.ts` (POST)
- Page sends: `{ "prompt": "assembled user input" }`
- Route returns: `{ "result": "gemini response text" }`

Gemini system prompt to use in route.ts:
"You are a supply chain cost optimization AI. Analyze this supply chain for cost leaks: identify top 5 inefficiency points, estimate waste magnitude for each (low/medium/high $), rank by savings potential, and prescribe 1 specific fix per issue. Focus on non-obvious inefficiencies beyond the stated pain points."

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
1. Page title and prominent heading = **CostLeakFinder**
2. Tagline shown below title: "Describe your supply chain — find hidden cost inefficiencies instantly"
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
- UI must be immediately recognizable as Terminal
- Must look like a real product — not a template or placeholder
- Font choice must match the style (imported via Google Fonts in globals.css)
- Color palette: dark green terminal on black — cost intelligence meets hacker precision
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **CostLeakFinder** must be prominent in the UI
