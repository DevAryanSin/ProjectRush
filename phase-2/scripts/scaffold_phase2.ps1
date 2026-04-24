# scaffold_phase2.ps1 — Create all 30 phase-2 project folders
# Usage: .\phase-2\scripts\scaffold_phase2.ps1

$ErrorActionPreference = "Stop"

$ROOT_DIR    = (Get-Item -Path "$PSScriptRoot\..\..").FullName
$PHASE2_DIR  = Join-Path $ROOT_DIR "phase-2"
$PROJECTS    = Join-Path $PHASE2_DIR "projects"
$ENV_FILE    = Join-Path $ROOT_DIR ".env"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }
function Write-Blue   { param($t); Write-Host $t -ForegroundColor Cyan }

Write-Blue "=== HACKATHON FACTORY PHASE 2 - SCAFFOLD ==="
Write-Host ""

# Load .env
if (-not (Test-Path $ENV_FILE)) {
    Write-Red "ERROR: .env not found at $ROOT_DIR"; exit 1
}
$envVars = @{}
Get-Content $ENV_FILE | ForEach-Object {
    $line = $_.Trim()
    if ($line -match "^([^#=][^=]*)=(.+)$") {
        $envVars[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}
$GEMINI_KEY = $envVars["GEMINI_API_KEY"]
if (-not $GEMINI_KEY) { Write-Red "ERROR: GEMINI_API_KEY missing in .env"; exit 1 }

Write-Green "OK: GEMINI_API_KEY loaded"
Write-Host ""

# Project slugs: problem-number
$PROBLEMS = @("digital", "crisis", "supply", "bias", "volunteer")
$NUMBERS  = @(1, 2, 3, 4, 5, 6)

# Tool names per problem (for vercel name = toolname-sc)
$TOOL_NAMES = @{
    "digital"   = @("watermarkiq", "clonecourt", "assetvault", "platformspy", "reversetrace", "licensegen")
    "crisis"    = @("panictranslate", "staffpulse", "guestsos", "crisisscript", "postmortempeg", "hazardmap")
    "supply"    = @("weathershield", "vendorscore", "shipmentnarrator", "costleakfinder", "contractclause", "demandsignal")
    "bias"      = @("promptbias", "hiringlens", "modelcard", "counterfactualai", "biastranslator", "redteamai")
    "volunteer" = @("grantwriter", "volunteerbio", "communitypulse", "tasknarrator", "skillgapfinder", "eventplanner")
}

New-Item -ItemType Directory -Force -Path $PROJECTS | Out-Null

$COUNT = 0

foreach ($problem in $PROBLEMS) {
    for ($i = 0; $i -lt 6; $i++) {
        $num      = $i + 1
        $slug     = "$problem-$num"
        $toolName = $TOOL_NAMES[$problem][$i]
        $vercelName = "$toolName-sc"
        $DIR      = Join-Path $PROJECTS $slug
        $rootPath = "phase-2/projects/$slug"

        # Create folder structure
        New-Item -ItemType Directory -Force -Path "$DIR\app\api\generate" | Out-Null
        New-Item -ItemType Directory -Force -Path "$DIR\public" | Out-Null

        # package.json
        @"
{
  "name": "$vercelName",
  "version": "1.0.0",
  "private": true,
  "engines": { "node": ">=24.0.0" },
  "scripts": {
    "dev":   "next dev",
    "build": "next build --no-turbo",
    "start": "next start"
  },
  "dependencies": {
    "next":         "^16.0.0",
    "react":        "^19.0.0",
    "react-dom":    "^19.0.0",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@types/node":      "^22.0.0",
    "@types/react":     "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript":       "^5.0.0",
    "tailwindcss":      "^3.4.0",
    "postcss":          "^8.4.0",
    "autoprefixer":     "^10.4.0"
  }
}
"@ | Set-Content "$DIR\package.json"

        # next.config.js
        @"
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true }
module.exports = nextConfig
"@ | Set-Content "$DIR\next.config.js"

        # tailwind.config.js
        @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary:    'hsl(var(--primary)    / <alpha-value>)',
        accent:     'hsl(var(--accent)     / <alpha-value>)',
        card:       'hsl(var(--card)       / <alpha-value>)',
        border:     'hsl(var(--border)     / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
"@ | Set-Content "$DIR\tailwind.config.js"

        # postcss.config.js
        @"
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
"@ | Set-Content "$DIR\postcss.config.js"

        # tsconfig.json
        @"
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"@ | Set-Content "$DIR\tsconfig.json"

        # vercel.json — name is toolname-sc, ignoreCommand scoped to this folder
        @"
{
  "name": "$vercelName",
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "next build --no-turbo",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- $rootPath/"
}
"@ | Set-Content "$DIR\vercel.json"

        # .env.local
        "GEMINI_API_KEY=$GEMINI_KEY" | Set-Content "$DIR\.env.local"

        # app/layout.tsx
        @"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '$toolName',
  description: 'AI-powered MVP — Hackathon Factory Phase 2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
"@ | Set-Content "$DIR\app\layout.tsx"

        # app/globals.css placeholder
        @"
/* Filled by agentic Claude from PROMPT.md */
@tailwind base;
@tailwind components;
@tailwind utilities;
"@ | Set-Content "$DIR\app\globals.css"

        # app/page.tsx placeholder
        @"
/* Replaced by agentic Claude reading PROMPT.md */
export default function Home() {
  return <div style={{ padding: 40, fontFamily: 'monospace' }}>Awaiting generation...</div>
}
"@ | Set-Content "$DIR\app\page.tsx"

        # app/api/generate/route.ts placeholder
        @"
/* Replaced by agentic Claude reading PROMPT.md */
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Not generated yet' }, { status: 503 })
}
"@ | Set-Content "$DIR\app\api\generate\route.ts"

        # PROMPT.md placeholder
        "# PROMPT — $slug`n(Run generate_prompts_phase2.py to fill this)" `
            | Set-Content "$DIR\PROMPT.md"

        $COUNT++
        Write-Green "  OK: $slug ($vercelName)"
    }
}

Write-Host ""
Write-Blue "=== SCAFFOLD COMPLETE ==="
Write-Green "  $COUNT / 30 projects created in phase-2/projects/"
Write-Host ""
Write-Yellow "Next: python3 phase-2/scripts/generate_prompts_phase2.py"
Write-Host ""