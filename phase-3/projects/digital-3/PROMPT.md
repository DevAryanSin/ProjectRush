Background: warm cream (#f5f0e8)
Serif typography for analysis + legal text
Thin separators (1px rules)
Structured column layout

Component Layer (Claymorphism):

Rounded cards (20–30px radius)
Soft elevated shadows
Pastel highlights for interaction
COLOR SYSTEM
Background: cream
Primary text: near-black
Accent: deep blue / muted red (editorial tone)
Secondary: pastel lavender/mint highlights
TYPOGRAPHY
Headings: Playfair Display
Body: Source Serif / Georgia
UI elements: Nunito
COMPONENT DESIGN

Cards:

Rounded clay containers with structured editorial content

Trace Output:

Article-style breakdown:
SOURCE
PATH
SIGNALS
VERIFICATION

License Output:

Formal document layout inside a clay card
Clearly separated legal sections

Buttons:

Rounded pill-style
Soft gradient
Press interaction

Inputs:

Rounded, spacious
Clean editorial feel
LAYOUT
Top mode switch:
"Trace Origin"
"Generate License"
Centered content column
Vertical flow outputs
Responsive design
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
Title: OriginLock
Tagline clearly visible
Mode switch (Trace vs License)
Dynamic input forms
Submit button with loading state
Structured outputs:

Trace mode:

Forensic structured analysis

License mode:

Complete legal document
Strong readability and hierarchy
Graceful error handling
Fully responsive
OUTPUT FORMAT — MANDATORY

No text outside these delimiters. No markdown fences inside blocks.

--- FILE: app/page.tsx ---
[complete code]

--- FILE: app/api/generate/route.ts ---
[complete code]

--- FILE: app/globals.css ---
[complete CSS with Tailwind + editorial + clay styles]

--- END ---

QUALITY BAR
Must feel like a professional forensic + legal tool
Outputs must be immediately usable
Editorial clarity must be preserved
Clay UI must enhance usability
Trace outputs must feel analytical
License outputs must feel legally structured