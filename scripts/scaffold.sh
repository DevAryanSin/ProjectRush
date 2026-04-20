#!/bin/bash
# =============================================================
# scaffold.sh — Phase 1 + 2
#   Phase 1: Validates environment (Node 24, Vercel CLI, .env)
#   Phase 2: Creates all 30 standalone Next.js project folders
# Usage: bash scripts/scaffold.sh
# =============================================================

set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_DIR="$ROOT_DIR/projects"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        HACKATHON FACTORY — SCAFFOLD          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ─────────────────────────────────────────────
# PHASE 1 — Environment Check
# ─────────────────────────────────────────────
echo -e "${YELLOW}▶ Phase 1 — Environment Check${NC}"

command -v node >/dev/null 2>&1    || { echo -e "${RED}✗ Node.js not found. Install Node 24.x from nodejs.org${NC}"; exit 1; }
command -v npm  >/dev/null 2>&1    || { echo -e "${RED}✗ npm not found.${NC}"; exit 1; }
command -v vercel >/dev/null 2>&1  || { echo -e "${RED}✗ Vercel CLI not found. Run: npm i -g vercel${NC}"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}✗ python3 not found. Required for generate_prompts.py${NC}"; exit 1; }

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 24 ]; then
  echo -e "${YELLOW}⚠  Node $(node -v) detected. Recommended: 24.x. Proceeding anyway.${NC}"
else
  echo -e "${GREEN}✓  Node $(node -v)${NC}"
fi

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo -e "${RED}✗  .env file missing at project root.${NC}"
  echo -e "   Create it with: echo 'GEMINI_API_KEY=your_key_here' > .env"
  exit 1
fi

GEMINI_KEY=$(grep -E "^GEMINI_API_KEY=" "$ROOT_DIR/.env" | cut -d'=' -f2 | tr -d '"'"'" )
if [ -z "$GEMINI_KEY" ]; then
  echo -e "${RED}✗  GEMINI_API_KEY not set in .env${NC}"; exit 1
fi

echo -e "${GREEN}✓  npm $(npm -v)${NC}"
echo -e "${GREEN}✓  Vercel CLI $(vercel --version 2>/dev/null | head -1)${NC}"
echo -e "${GREEN}✓  GEMINI_API_KEY found${NC}"
echo ""

# Root package.json (no workspaces — each project is standalone)
cat > "$ROOT_DIR/package.json" <<'ROOTPKG'
{
  "name": "hackathon-factory",
  "version": "1.0.0",
  "private": true,
  "description": "30 standalone Next.js MVPs — 5 problems × 6 UI styles"
}
ROOTPKG

# Empty manifest for deploy phase
echo "{}" > "$ROOT_DIR/manifest.json"

echo -e "${GREEN}✓  Root package.json + manifest.json created${NC}"
echo ""

# ─────────────────────────────────────────────
# PHASE 2 — Scaffold 30 Projects
# ─────────────────────────────────────────────
echo -e "${YELLOW}▶ Phase 2 — Scaffolding 30 Standalone Projects${NC}"
echo ""
mkdir -p "$PROJECTS_DIR"

PROBLEMS=("p1-digital-asset" "p2-crisis-response" "p3-supply-chain" "p4-unbiased-ai" "p5-volunteer-coord")
STYLES=("s1-bento" "s2-glassmorphism" "s3-flat" "s4-minimalism" "s5-normal" "s6-glassui")

for problem in "${PROBLEMS[@]}"; do
  for style in "${STYLES[@]}"; do
    SLUG="${problem}-${style}"
    DIR="$PROJECTS_DIR/$SLUG"

    mkdir -p "$DIR/app/api/generate"
    mkdir -p "$DIR/public"

    # ── package.json ──────────────────────────────────────────
    cat > "$DIR/package.json" <<EOF
{
  "name": "$SLUG",
  "version": "1.0.0",
  "private": true,
  "engines": { "node": ">=24.0.0" },
  "scripts": {
    "dev":   "next dev",
    "build": "next build --no-turbo",
    "start": "next start"
  },
  "dependencies": {
    "next":        "^16.0.0",
    "react":       "^19.0.0",
    "react-dom":   "^19.0.0",
    "lucide-react":"^0.469.0"
  },
  "devDependencies": {
    "@types/node":     "^22.0.0",
    "@types/react":    "^19.0.0",
    "@types/react-dom":"^19.0.0",
    "typescript":      "^5.0.0",
    "tailwindcss":     "^3.4.0",
    "postcss":         "^8.4.0",
    "autoprefixer":    "^10.4.0"
  }
}
EOF

    # ── next.config.js ────────────────────────────────────────
    cat > "$DIR/next.config.js" <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true }
module.exports = nextConfig
EOF

    # ── tailwind.config.js (HSL variable bridging) ────────────
    cat > "$DIR/tailwind.config.js" <<'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary:    'hsl(var(--primary)    / <alpha-value>)',
        secondary:  'hsl(var(--secondary)  / <alpha-value>)',
        accent:     'hsl(var(--accent)     / <alpha-value>)',
        muted:      'hsl(var(--muted)      / <alpha-value>)',
        border:     'hsl(var(--border)     / <alpha-value>)',
        card:       'hsl(var(--card)       / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
EOF

    # ── postcss.config.js ─────────────────────────────────────
    cat > "$DIR/postcss.config.js" <<'EOF'
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
EOF

    # ── tsconfig.json ─────────────────────────────────────────
    cat > "$DIR/tsconfig.json" <<'EOF'
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
EOF

    # ── vercel.json ───────────────────────────────────────────
    # ignoreCommand scoped to THIS project's subfolder only
    # → other projects' changes won't trigger this deployment
    cat > "$DIR/vercel.json" <<EOF
{
  "name": "$SLUG",
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "next build --no-turbo",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- projects/$SLUG/"
}
EOF

    # ── .env.local (Gemini key from root .env) ────────────────
    echo "GEMINI_API_KEY=$GEMINI_KEY" > "$DIR/.env.local"

    # ── app/layout.tsx ────────────────────────────────────────
    cat > "$DIR/app/layout.tsx" <<'EOF'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MVP — Hackathon Factory',
  description: 'AI-powered MVP',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

    # ── app/globals.css (shell — Claude fills) ────────────────
    cat > "$DIR/app/globals.css" <<'EOF'
/* Style theme injected by agentic Claude — do not edit manually */
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

    # ── app/page.tsx (placeholder) ────────────────────────────
    cat > "$DIR/app/page.tsx" <<'EOF'
/* Replaced by agentic Claude reading PROMPT.md */
export default function Home() {
  return <div style={{ padding: 40, fontFamily: 'monospace' }}>Awaiting generation — run generate.sh {slugHere}</div>
}
EOF

    # ── app/api/generate/route.ts (placeholder) ───────────────
    cat > "$DIR/app/api/generate/route.ts" <<'EOF'
/* Replaced by agentic Claude reading PROMPT.md */
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Not yet generated' }, { status: 503 })
}
EOF

    # ── PROMPT.md (empty shell — filled by generate_prompts.py)
    echo "# PROMPT — $SLUG" > "$DIR/PROMPT.md"
    echo "(Filled by python3 scripts/generate_prompts.py)" >> "$DIR/PROMPT.md"

    echo -e "  ${GREEN}✅  $SLUG${NC}"
  done
done

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✨ 30 projects scaffolded successfully!     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Next step → ${YELLOW}python3 scripts/generate_prompts.py${NC}"
