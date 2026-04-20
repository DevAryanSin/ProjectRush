#!/bin/bash
# =============================================================
# deploy.sh — Phase 4: Deploy all 30 projects to Vercel
#
# Usage:
#   bash scripts/deploy.sh              # deploy all 30
#   bash scripts/deploy.sh p1-digital-asset-s1-bento  # deploy one
#
# Requirements:
#   - vercel CLI installed and logged in (run: vercel login)
#   - .env file at root with GEMINI_API_KEY
#   - All projects have been generated (parse_output.py run)
# =============================================================

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_DIR="$ROOT_DIR/projects"
MANIFEST="$ROOT_DIR/manifest.json"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   HACKATHON FACTORY — DEPLOY                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Read Gemini key from root .env
GEMINI_KEY=$(grep -E "^GEMINI_API_KEY=" "$ROOT_DIR/.env" | cut -d'=' -f2 | tr -d '"'"'" )
if [ -z "$GEMINI_KEY" ]; then
  echo -e "${RED}✗ GEMINI_API_KEY not found in .env${NC}"; exit 1
fi

# Determine which projects to deploy
if [ -n "$1" ]; then
  PROJECTS=("$1")
  echo -e "Deploying single project: ${YELLOW}$1${NC}"
else
  PROJECTS=()
  for dir in "$PROJECTS_DIR"/*/; do
    SLUG=$(basename "$dir")
    PROJECTS+=("$SLUG")
  done
  echo -e "Deploying all ${#PROJECTS[@]} projects..."
fi

echo ""

SUCCESS=0
FAILED=()

# Load existing manifest
if [ -f "$MANIFEST" ]; then
  MANIFEST_CONTENT=$(cat "$MANIFEST")
else
  MANIFEST_CONTENT="{}"
fi

for SLUG in "${PROJECTS[@]}"; do
  DIR="$PROJECTS_DIR/$SLUG"

  if [ ! -d "$DIR" ]; then
    echo -e "  ${RED}✗ Not found: $SLUG${NC}"
    FAILED+=("$SLUG")
    continue
  fi

  echo -e "  ${YELLOW}▶ Deploying: $SLUG${NC}"

  # Inject Gemini API key into Vercel project environment
  # --yes skips confirmation, --force overwrites existing
  echo "$GEMINI_KEY" | vercel env add GEMINI_API_KEY production \
    --cwd "$DIR" --yes 2>/dev/null || true

  # Deploy to production
  DEPLOY_OUTPUT=$(cd "$DIR" && vercel --prod --yes 2>&1)
  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 0 ]; then
    # Extract URL from output (vercel outputs the URL on the last line)
    URL=$(echo "$DEPLOY_OUTPUT" | grep -E "https://[a-zA-Z0-9-]+\.vercel\.app" | tail -1 | tr -d ' ')

    if [ -z "$URL" ]; then
      # Fallback: get from vercel inspect
      URL=$(cd "$DIR" && vercel inspect --yes 2>/dev/null | grep "https://" | head -1 | tr -d ' ') || true
    fi

    if [ -n "$URL" ]; then
      echo -e "    ${GREEN}✅ Deployed: $URL${NC}"
      # Update manifest JSON
      MANIFEST_CONTENT=$(echo "$MANIFEST_CONTENT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
data['$SLUG'] = '$URL'
print(json.dumps(data, indent=2))
")
      SUCCESS=$((SUCCESS + 1))
    else
      echo -e "    ${GREEN}✅ Deployed (URL not captured — check Vercel dashboard)${NC}"
      SUCCESS=$((SUCCESS + 1))
    fi
  else
    echo -e "    ${RED}✗ Deploy failed for $SLUG${NC}"
    echo -e "    ${RED}  Error: $(echo "$DEPLOY_OUTPUT" | tail -3)${NC}"
    FAILED+=("$SLUG")
  fi

  # Write manifest after each deploy (so partial progress is saved)
  echo "$MANIFEST_CONTENT" > "$MANIFEST"

  echo ""
done

# Final report
echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DEPLOY SUMMARY                             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}✅ Successful: $SUCCESS${NC}"
echo -e "  ${RED}✗  Failed:     ${#FAILED[@]}${NC}"

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo -e "  ${YELLOW}Failed projects:${NC}"
  for f in "${FAILED[@]}"; do
    echo -e "    - $f"
  done
  echo ""
  echo -e "  ${YELLOW}Retry a single project:${NC}"
  echo -e "    bash scripts/deploy.sh <slug>"
fi

echo ""
echo -e "  ${GREEN}Manifest saved to: manifest.json${NC}"
echo -e "  ${GREEN}All URLs: cat manifest.json${NC}"
