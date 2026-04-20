# 🏭 Hackathon Factory

30 standalone Next.js 16 MVPs — 5 problem statements × 6 UI styles.
Each powered by Gemini AI. Each deployed independently to Vercel.

---

## Project Matrix

| | s1-Bento | s2-Glassmorphism | s3-Flat | s4-Minimalism | s5-Normal | s6-GlassUI |
|---|---|---|---|---|---|---|
| **P1** Digital Asset | ScanGuard | PropagationMap | DMCA Forge | AuthentiProof | TamperLens | RightsDesk |
| **P2** Crisis Response | AlertBridge | CrisisSync | EvacuGuide | FirstContact | IncidentLog | ResponderBrief |
| **P3** Supply Chain | DisruptRadar | RouteRethink | BottleneckBot | ETA Shield | SupplierPulse | CargoDebrief |
| **P4** Unbiased AI | BiasScope | FairnessAudit | DataMirror | DecisionTrace | FixItFlow | EthicsCheck |
| **P5** Volunteer Coord | NeedMapper | VolunteerMatch | TaskForge | ImpactPulse | FieldDebrief | UrgencyRank |

---

## Prerequisites

- Node.js 24.x → https://nodejs.org
- Vercel CLI → `npm i -g vercel` then `vercel login`
- Python 3.8+
- Gemini API Key → https://aistudio.google.com/app/apikey

---

## Setup

```bash
# 1. Clone repo
git clone <your-repo-url>
cd hackathon-factory

# 2. Create .env
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 3. Run scaffold (creates all 30 project folders + configs)
bash scripts/scaffold.sh

# 4. Generate all 30 PROMPT.md files
python3 scripts/generate_prompts.py
```

---

## Generating a Website (One at a Time)

```bash
# Step 1: Get the prompt for a project
bash scripts/generate_one.sh p1-digital-asset-s1-bento
# → Prints PROMPT.md to terminal + copies to clipboard

# Step 2: Paste into your agentic Claude session
# Claude outputs the website code in delimited blocks

# Step 3: Save Claude's response to a file
# e.g. /tmp/claude_out.txt

# Step 4: Parse output and write files
python3 scripts/parse_output.py p1-digital-asset-s1-bento /tmp/claude_out.txt

# Step 5: Test locally
cd projects/p1-digital-asset-s1-bento
npm install
npm run dev
# Visit http://localhost:3000
```

---

## Deploying to Vercel

```bash
# Deploy all 30
bash scripts/deploy.sh

# Deploy a single project
bash scripts/deploy.sh p1-digital-asset-s1-bento

# View all deployed URLs
cat manifest.json
```

---

## Auto-Deploy on Git Push

Each project's `vercel.json` has an `ignoreCommand` that scopes redeployment
to only that project's subfolder. This means:

- Push a change to `projects/p1-digital-asset-s1-bento/` → **only that project redeploys**
- All other 29 projects **ignore the push**

This is automatic after the first Vercel CLI deploy links each project to your Git repo.

---

## Folder Structure

```
hackathon-factory/
├── .env                    ← Your GEMINI_API_KEY (never commit)
├── .env.example            ← Template
├── .gitignore
├── package.json
├── manifest.json           ← Auto-filled with 30 Vercel URLs
├── scripts/
│   ├── scaffold.sh         ← Phase 1+2: env check + create folders
│   ├── generate_prompts.py ← Phase 3: write PROMPT.md to each project
│   ├── generate_one.sh     ← Helper: print/copy prompt for one project
│   ├── parse_output.py     ← Helper: parse Claude output → write files
│   └── deploy.sh           ← Phase 4: vercel deploy all 30
└── projects/
    ├── p1-digital-asset-s1-bento/
    │   ├── PROMPT.md           ← Agentic Claude reads this
    │   ├── package.json
    │   ├── next.config.js
    │   ├── tailwind.config.js
    │   ├── postcss.config.js
    │   ├── tsconfig.json
    │   ├── vercel.json
    │   ├── .env.local
    │   └── app/
    │       ├── layout.tsx
    │       ├── globals.css      ← Claude fills this
    │       ├── page.tsx         ← Claude fills this
    │       └── api/generate/
    │           └── route.ts     ← Claude fills this
    └── ... (29 more)
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS HSL variables
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Vercel
- **Node**: 24.x

---

## Known Issues & Fixes

Based on prior battle-testing:

| Issue | Fix Applied |
|---|---|
| Vercel workspace detection failure | Each project is fully standalone with own deps |
| TypeScript not found on build | TypeScript in devDependencies of each project |
| PostCSS / Tailwind build failure | `postcss.config.js` in every project root |
| Turbopack instability | `--no-turbo` in build script |
| API key not in production | `vercel env add` in deploy script |
| Other projects redeploy on unrelated push | `ignoreCommand` in each `vercel.json` |
