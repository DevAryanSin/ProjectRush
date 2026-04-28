# inject_templates_phase3.ps1 (FIXED)

$ErrorActionPreference = "Stop"

$ROOT_DIR = (Get-Item -Path "$PSScriptRoot\..\..").FullName
$PROJECTS = Join-Path $ROOT_DIR "phase-3\projects"
$ENV_FILE = Join-Path $ROOT_DIR ".env"

function Write-Green { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red { param($t); Write-Host $t -ForegroundColor Red }
function Write-Blue { param($t); Write-Host $t -ForegroundColor Cyan }

Write-Blue "=== PHASE 3 — INJECT TEMPLATE FILES ==="
Write-Host ""

# ─────────────────────────────────────────────
# Robust .env parsing
# ─────────────────────────────────────────────
if (-not (Test-Path $ENV_FILE)) {
  Write-Red "ERROR: .env not found at $ROOT_DIR"
  exit 1
}

$envVars = @{}
Get-Content $ENV_FILE | ForEach-Object {
  $line = $_.Trim()
  if ($line -match '^\s*([^#=]+?)\s*=\s*(.*)\s*$') {
    $key = $Matches[1].Trim()
    $val = $Matches[2].Trim().Trim('"').Trim("'")
    $envVars[$key] = $val
  }
}

$GEMINI_KEY = $envVars["GEMINI_API_KEY"]
$VERCEL_TOKEN = $envVars["VERCEL_TOKEN"]

if (-not $GEMINI_KEY) { Write-Red "ERROR: GEMINI_API_KEY missing"; exit 1 }
if (-not $VERCEL_TOKEN) { Write-Red "ERROR: VERCEL_TOKEN missing"; exit 1 }

Write-Green "OK: ENV loaded"
Write-Host ""

# ─────────────────────────────────────────────
# Projects
# ─────────────────────────────────────────────
$projectList = Get-ChildItem -Path $PROJECTS -Directory | Select-Object -ExpandProperty Name

if (-not $projectList -or $projectList.Count -eq 0) {
  Write-Red "ERROR: No project folders found"
  exit 1
}

Write-Yellow "Found $($projectList.Count) projects"
$projectList | ForEach-Object { Write-Host "  - $_" }
Write-Host ""

$SUCCESS = 0
$FAILED = 0

foreach ($P_SLUG in $projectList) {
  try {
    $DIR = Join-Path $PROJECTS $P_SLUG
    $rootPath = "phase-3/projects/$P_SLUG"

    Write-Blue "-> $P_SLUG"

    # Directories
    New-Item -ItemType Directory -Force -Path "$DIR\app\api\generate" | Out-Null
    New-Item -ItemType Directory -Force -Path "$DIR\public" | Out-Null

    # Helper for safe write
    function Write-File($path, $content) {
      $content | Out-File -FilePath $path -Encoding utf8 -Force
    }

    # ── package.json ──
    Write-File "$DIR\package.json" @"
{
  "name": "$P_SLUG",
  "version": "1.0.0",
  "private": true,
  "engines": { "node": ">=24.0.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build ",
    "start": "next start"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
"@

    # ── next.config.js ──
    Write-File "$DIR\next.config.js" @"
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true }
module.exports = nextConfig
"@

    # ── tailwind.config.js ──
    Write-File "$DIR\tailwind.config.js" @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {} },
  plugins: [],
}
"@

    # ── postcss.config.js ──
    Write-File "$DIR\postcss.config.js" @"
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
"@

    # ── tsconfig.json ──
    Write-File "$DIR\tsconfig.json" @"
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
"@

    # ── next-env.d.ts (MISSING FIX) ──
    Write-File "$DIR\next-env.d.ts" @"
/// <reference types="next" />
/// <reference types="next/image-types/global" />
"@

    # ── vercel.json ──
    Write-File "$DIR\vercel.json" @"
{
  "name": "$P_SLUG",
  "framework": "nextjs",
  "buildCommand": "next build ",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- $rootPath/"
}
"@

    # ── env ──
    Write-File "$DIR\.env.local" "GEMINI_API_KEY=$GEMINI_KEY"

    # ── layout ──
    Write-File "$DIR\app\layout.tsx" @"
import './globals.css'
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>
}
"@

    # ── placeholders ──
    Write-File "$DIR\app\page.tsx" @"
export default function Home() {
  return <div style={{padding:40}}>Awaiting generation...</div>
}
"@

    Write-File "$DIR\app\api\generate\route.ts" @"
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Not generated yet' }, { status: 503 })
}
"@

    $SUCCESS++
    Write-Green "   OK"
  }
  catch {
    $FAILED++
    Write-Red "   FAILED: $_"
  }

  Write-Host ""
}

Write-Blue "=== DONE ==="
Write-Green "  Success : $SUCCESS"
Write-Red   "  Failed  : $FAILED"