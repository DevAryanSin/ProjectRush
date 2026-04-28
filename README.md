# 🚀 ProjectRush: The AI Hackathon Factory

ProjectRush is an automated ecosystem that generated **30 standalone, production-ready Next.js 16 MVPs** in a single sprint. 
Each project addresses a unique real-world problem across 5 domains, utilizes 1 of 6 distinct UI design systems, is powered by Google Gemini AI, and is independently deployed to Vercel.

## 🌟 The Vision

We built a factory that goes from idea to deployed code in minutes. By leveraging agentic AI workflows, we scaled up the development process to produce 30 distinct, fully-functional web applications. Each application is not just a template, but a custom-designed solution addressing specific industry challenges.

## 🏗️ Project Matrix (30 MVPs)

We mapped 5 problem statements against 6 unique UI design systems to create the following matrix of applications:

| Domain | 🧱 Brutalism (s1) | 🪞 Neumorphism (s2) | 🌌 Aurora (s3) | 💻 Hacker/Terminal (s4) | 📰 Editorial/Paper (s5) | 🏺 Claymorphism (s6) |
|---|---|---|---|---|---|---|
| **P1: Digital Asset Protection** | WatermarkIQ | CloneCourt | AssetVault | PlatformSpy | ReverseTrace | LicenseGen |
| **P2: Crisis Response** | PanicTranslate | StaffPulse | GuestSOS | CrisisScript | PostMortemPro | HazardMap |
| **P3: Supply Chain** | WeatherShield | VendorScore | ShipmentNarrator | CostLeakFinder | ContractClause | DemandSignal |
| **P4: Unbiased AI** | PromptBias | HiringLens | ModelCard | CounterfactualAI | BiasTranslator | RedTeamAI |
| **P5: Volunteer Coord** | GrantWriter | VolunteerBio | CommunityPulse | TaskNarrator | SkillGapFinder | EventPlanner |

> **Note:** All 30 finished projects are located in `phase-2/projects/`. Their respective live deployments, PPTX presentations, and Source Code ZIP links can be found in `phase-2/paste_ready.txt`.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **AI Integration**: Google Gemini 1.5/2.5 Flash API
- **Deployment**: Vercel (Automated & Isolated)

## 📁 Repository Structure

```text
ProjectRush_SC/
├── README.md               # You are here
├── phase-2/                # Finalized Phase 2 Generation
│   ├── projects/           # The 30 Next.js Apps (Final Source Code)
│   ├── scripts/            # Automation scripts for PPT, ZIP, Links
│   └── paste_ready.txt     # Complete index of projects, URLs, and Downloads
├── projects/               # Phase 1 Initial generation workspace
├── scripts/                # Scaffolding and Deployment automation
└── manifest.json           # Vercel Deployment URLs map
```

## 🚀 How It Works (The Factory Pipeline)

This repository is more than just code; it's a pipeline for generating applications:

1. **Scaffolding**: `scripts/scaffold.sh` generates 30 independent Next.js environments with all necessary configuration files.
2. **Prompt Generation**: `scripts/generate_prompts.py` creates highly specific instructions (`PROMPT.md`) for each app, dynamically combining the domain problem with the assigned UI style constraints.
3. **Agentic Code Generation**: An AI agent reads the prompt and outputs the entire Next.js application codebase.
4. **Parsing & Writing**: `scripts/parse_output.py` converts the AI's output into actual files (`page.tsx`, `globals.css`, `route.ts`).
5. **Deployment**: `scripts/deploy.sh` automatically deploys each subfolder to Vercel independently using custom `vercel.json` configurations.

## 💡 Key Features of Each MVP

- **Standalone Architecture**: Each MVP has its own `package.json`, dependencies, and build configuration, ensuring isolation.
- **AI-Powered Workflows**: Deep integration with the Gemini API to solve the core functional problem (e.g., analyzing bias, generating crisis scripts, forensic breakdowns).
- **Beautiful, Distinct UI**: Strict adherence to specific design aesthetics (Aurora, Claymorphism, Hacker/Terminal, etc.) avoiding generic look-and-feels.
- **Production-Ready**: Fully responsive, hydration-error-free, and handles loading/error states gracefully.

## 🔧 Local Development

To run any of the 30 projects locally, navigate to its directory, install dependencies, and start the development server.

```bash
# Example: Running the 'EventPlanner' project
cd phase-2/projects/volunteer-6
npm install
npm run dev

# Visit http://localhost:3000 in your browser
```

> **Important:** You must create a `.env.local` file inside the specific project directory containing your Google Gemini API key:
> ```env
> GEMINI_API_KEY=your_api_key_here
> ```

---
*Built with ❤️ using Agentic AI workflows and Next.js.*
