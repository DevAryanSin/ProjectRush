#!/bin/bash
# =============================================================
# generate_one.sh — Prints PROMPT.md for a single project.
# Feed this output to your agentic Claude session.
# Save Claude's response to a file, then run parse_output.py.
#
# Usage:
#   bash scripts/generate_one.sh <project-slug>
#
# Example:
#   bash scripts/generate_one.sh p1-digital-asset-s1-bento
#
# Full workflow for one project:
#   1. bash scripts/generate_one.sh p1-digital-asset-s1-bento
#      → copies prompt to clipboard (if pbcopy/xclip available)
#      → paste into Claude agentic session
#   2. Save Claude's response to /tmp/claude_out.txt
#   3. python3 scripts/parse_output.py p1-digital-asset-s1-bento /tmp/claude_out.txt
#   4. cd projects/p1-digital-asset-s1-bento && npm install && npm run dev
# =============================================================

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_DIR="$ROOT_DIR/projects"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'

if [ -z "$1" ]; then
  echo -e "${RED}Usage: bash scripts/generate_one.sh <project-slug>${NC}"
  echo ""
  echo "Available projects:"
  ls "$PROJECTS_DIR" | sed 's/^/  /'
  exit 1
fi

SLUG="$1"
PROMPT_FILE="$PROJECTS_DIR/$SLUG/PROMPT.md"

if [ ! -f "$PROMPT_FILE" ]; then
  echo -e "${RED}✗ PROMPT.md not found for: $SLUG${NC}"
  echo -e "  Run: python3 scripts/generate_prompts.py first"
  exit 1
fi

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   PROJECT: $SLUG${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}PROMPT.md contents (copy and send to agentic Claude):${NC}"
echo -e "${YELLOW}──────────────────────────────────────────────────────${NC}"
echo ""
cat "$PROMPT_FILE"
echo ""
echo -e "${YELLOW}──────────────────────────────────────────────────────${NC}"
echo ""

# Try to copy to clipboard
if command -v pbcopy >/dev/null 2>&1; then
  cat "$PROMPT_FILE" | pbcopy
  echo -e "${GREEN}✓ Prompt copied to clipboard (macOS)${NC}"
elif command -v xclip >/dev/null 2>&1; then
  cat "$PROMPT_FILE" | xclip -selection clipboard
  echo -e "${GREEN}✓ Prompt copied to clipboard (Linux/xclip)${NC}"
elif command -v xsel >/dev/null 2>&1; then
  cat "$PROMPT_FILE" | xsel --clipboard --input
  echo -e "${GREEN}✓ Prompt copied to clipboard (Linux/xsel)${NC}"
else
  echo -e "${YELLOW}⚠  Clipboard tool not found. Copy the prompt above manually.${NC}"
fi

echo ""
echo -e "${YELLOW}After getting Claude's response:${NC}"
echo -e "  1. Save response to a file, e.g.: /tmp/claude_${SLUG}.txt"
echo -e "  2. Run: python3 scripts/parse_output.py ${SLUG} /tmp/claude_${SLUG}.txt"
echo -e "  3. Run: cd projects/${SLUG} && npm install && npm run dev"
