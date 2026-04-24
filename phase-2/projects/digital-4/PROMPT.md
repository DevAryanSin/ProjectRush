# AGENT PROMPT — digital-4
# Tool: PlatformSpy | UI: Terminal
# Deployment domain: platformspy-sc
# ═══════════════════════════════════════════════════════════════
# READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
# Generate ALL files in ONE response using EXACT delimiters below.
# ═══════════════════════════════════════════════════════════════

## YOUR TASK
You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: **PlatformSpy**

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

## THIS TOOL
**Name:** PlatformSpy
**Tagline:** Input any platform name — get its content theft risk profile
**Domain:** digital sports media, copyright protection, IP rights management

**User inputs:** Platform name, content type you publish there, your account size/reach
**User sees:** Platform risk profile: IP enforcement rating, common theft vectors on this platform, your personal exposure level, and defensive tactics
**Gemini's role:** Generate a detailed IP theft risk profile for the specified platform. Cover enforcement reputation, common theft vectors, algorithmic exposure risks, and platform-specific defensive tactics.

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
"You are a platform IP risk analyst. For this platform, generate a risk profile covering: IP enforcement reputation (A-F grade with reasoning), top 3 content theft vectors specific to this platform, exposure risk for this account size, and 4 platform-specific defensive tactics. Be specific to this platform's actual policies and culture."

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
1. Page title and prominent heading = **PlatformSpy**
2. Tagline shown below title: "Input any platform name — get its content theft risk profile"
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
- Color palette: black background, bright green terminal text — hacker intelligence aesthetic
- Loading states must be visually distinct and styled
- Results section must have visual hierarchy — headings, sections, scores styled
- Tool name **PlatformSpy** must be prominent in the UI
