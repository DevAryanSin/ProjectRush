AGENT PROMPT — digital-merged-2
Tool: ThreatScope | UI: Aurora Terminal Fusion
Deployment domain: threatscope-sc
═══════════════════════════════════════════════════════════════
READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
Generate ALL files in ONE response using EXACT delimiters below.
═══════════════════════════════════════════════════════════════
YOUR TASK

You are an expert frontend developer and UI designer. Generate a complete,
production-ready Next.js 16 web application as a working MVP.

The website title (shown in browser tab and on page) must be: ThreatScope

PROBLEM CONTEXT

Digital media theft risk is not isolated—it emerges from two interacting layers:

Asset-level vulnerability (what you own)
Platform-level exposure (where you distribute)

Organizations typically analyze these separately, leading to:

Misaligned protection strategies
Underestimated exposure on high-risk platforms
Inefficient allocation of security resources

Objective: Build a system that evaluates:

Internal asset vulnerability
External platform risk
Their combined exposure profile
THIS TOOL

Name: ThreatScope
Tagline: Analyze your assets. Audit your platforms. Understand your exposure.
Domain: digital asset security, IP protection, media risk intelligence

CORE CAPABILITIES

Unified from both systems:

MODE 1: ASSET VULNERABILITY

User inputs:

Asset types
Distribution platforms
Access levels
Commercial value

User sees:

Ranked asset vulnerability list (1–10 risk score)
Platform-specific exposure drivers
Protection recommendations per asset

Purpose: Identify which assets are most at risk

MODE 2: PLATFORM INTELLIGENCE

User inputs:

Platform name
Content type
Account size/reach

User sees:

IP enforcement rating (A–F)
Top theft vectors
Exposure level for this account
Platform-specific defense strategies

Purpose: Understand external risk environment

GEMINI ROLE

System prompt used in API route:

"You are a digital IP risk intelligence AI.

If the input describes assets:

Rank each asset type by vulnerability (1–10)
Explain exposure drivers
Provide protection recommendations

If the input describes a platform:

Generate a platform risk profile including:
enforcement rating (A-F),
top 3 theft vectors,
exposure level,
4 defensive tactics

Always:

Be specific and actionable
Avoid generic advice
Structure output clearly"

Append user input dynamically.

MVP TITLE

ThreatScope MVP: Asset + Platform Risk Intelligence System

UI STYLE

AURORA TERMINAL FUSION
━━━━━━━━━━━━━━━━━━━━━━

Combines:

Aurora (strategic, high-level intelligence)
Terminal (precise, analytical output)
CORE CONCEPT

Strategic overview meets tactical detail

VISUAL LANGUAGE

Background (Aurora):

Deep dark base (#050810)
Animated gradient orbs:
Purple (#7c3aed)
Teal (#00d4aa)
Blue (#2563eb)
Slow movement (8–12s)

Foreground (Terminal panels):

Output displayed in structured blocks
Monospace text sections
Cyan/green highlights for metrics
COLOR SYSTEM
Background: deep navy/black
Primary: purple/teal gradients
Text: white primary, grey secondary
Terminal accents: green (#39ff14)
Alerts: red for high risk
TYPOGRAPHY
Headings: Inter / Plus Jakarta Sans
Output: JetBrains Mono (terminal precision)
Mixed typography:
UI = strategic layer
Output = analytical layer
COMPONENT DESIGN

Cards:

Glassmorphism aurora panels
Subtle glow borders

Asset Output:

Ranked list with risk scores
Clear prioritization

Platform Output:

Terminal-style structured sections:

ENFORCEMENT

VECTORS

EXPOSURE

DEFENSE

Buttons:

Hybrid glow + sharp interaction
Label style: [ ANALYZE ]

Inputs:

Dark glass fields
Focus glow
LAYOUT
Top mode switch:
"Asset Risk"
"Platform Risk"
Centered workspace
Output panels stacked
Responsive layout
TECH CONSTRAINTS
Next.js 16 (App Router)
TypeScript (.tsx)
Tailwind CSS + globals.css
Icons: lucide-react only
No extra npm packages
GEMINI API INTEGRATION
Model: gemini-2.5-flash
API route: app/api/generate/route.ts
POST body: { "prompt": "user input + mode context" }
Server-side only (env: GEMINI_API_KEY)
FUNCTIONAL REQUIREMENTS
Title: ThreatScope
Tagline clearly visible
Mode switch (Asset vs Platform)
Dynamic input forms
Submit button with loading state
Structured outputs:

Asset mode:

Ranked vulnerability list
Risk scores visible

Platform mode:

Structured terminal-style analysis
Strong hierarchy and clarity
Error handling
Fully responsive
OUTPUT FORMAT — MANDATORY

No text outside these delimiters. No markdown fences inside blocks.

--- FILE: app/page.tsx ---
[complete code]

--- FILE: app/api/generate/route.ts ---
[complete code]

--- FILE: app/globals.css ---
[complete CSS with Tailwind + aurora + terminal styles]

--- END ---

QUALITY BAR
Must feel like a real risk intelligence platform
Outputs must be decision-ready
UI must clearly separate strategic vs analytical layers
Asset ranking must be easy to scan
Platform analysis must feel precise and technical