#!/usr/bin/env python3
"""
parse_output.py — Parses agentic Claude's delimited output and writes files to disk.

Usage:
  python3 scripts/parse_output.py <project-slug> <output-file>

Example:
  python3 scripts/parse_output.py p1-digital-asset-s1-bento /tmp/claude_output.txt

The output file should contain Claude's response in this format:
  --- FILE: app/page.tsx ---
  [code]
  --- FILE: app/api/generate/route.ts ---
  [code]
  --- FILE: app/globals.css ---
  [code]
  --- END ---
"""

import os
import sys
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_DIR = os.path.join(ROOT_DIR, "projects")

GREEN  = '\033[0;32m'
YELLOW = '\033[1;33m'
RED    = '\033[0;31m'
NC     = '\033[0m'

EXPECTED_FILES = [
    "app/page.tsx",
    "app/api/generate/route.ts",
    "app/globals.css",
]

def parse_claude_output(raw: str) -> dict[str, str]:
    """
    Parse Claude's delimited output into a dict of {filepath: content}.
    Handles both '--- FILE: path ---' and variations with extra spaces.
    """
    files = {}
    # Match --- FILE: <path> --- blocks
    pattern = r'---\s*FILE:\s*([^\s-][^\n]*?)\s*---\n(.*?)(?=---\s*FILE:|---\s*END\s*---|$)'
    matches = re.findall(pattern, raw, re.DOTALL)

    for filepath, content in matches:
        filepath = filepath.strip()
        content = content.strip()
        # Strip any accidental markdown code fences
        content = re.sub(r'^```[a-zA-Z]*\n?', '', content)
        content = re.sub(r'\n?```$', '', content)
        files[filepath] = content

    return files

def write_files(project_slug: str, files: dict[str, str]) -> bool:
    project_dir = os.path.join(PROJECTS_DIR, project_slug)

    if not os.path.isdir(project_dir):
        print(f"{RED}✗ Project folder not found: {project_dir}{NC}")
        print(f"  Run: bash scripts/scaffold.sh first")
        return False

    success = True
    for filepath, content in files.items():
        full_path = os.path.join(project_dir, filepath)
        # Ensure parent directory exists
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
            if not content.endswith('\n'):
                f.write('\n')

        line_count = len(content.splitlines())
        print(f"  {GREEN}✅  Wrote {filepath} ({line_count} lines){NC}")

    # Check all expected files were written
    for expected in EXPECTED_FILES:
        full_path = os.path.join(project_dir, expected)
        if not os.path.isfile(full_path):
            print(f"  {YELLOW}⚠  Missing expected file: {expected}{NC}")
            success = False

    return success

def main():
    print(f"\n{YELLOW}╔══════════════════════════════════════════════╗{NC}")
    print(f"{YELLOW}║   HACKATHON FACTORY — PARSE OUTPUT           ║{NC}")
    print(f"{YELLOW}╚══════════════════════════════════════════════╝{NC}\n")

    if len(sys.argv) < 3:
        print(f"{RED}Usage: python3 scripts/parse_output.py <project-slug> <output-file>{NC}")
        print(f"Example: python3 scripts/parse_output.py p1-digital-asset-s1-bento /tmp/out.txt")
        sys.exit(1)

    project_slug = sys.argv[1]
    output_file  = sys.argv[2]

    if not os.path.isfile(output_file):
        print(f"{RED}✗ Output file not found: {output_file}{NC}")
        sys.exit(1)

    with open(output_file, "r", encoding="utf-8") as f:
        raw = f.read()

    print(f"Parsing output for: {project_slug}")
    print(f"Source file: {output_file}")
    print(f"Source size: {len(raw)} chars\n")

    files = parse_claude_output(raw)

    if not files:
        print(f"{RED}✗ No file blocks found in output.{NC}")
        print("  Expected format: --- FILE: app/page.tsx ---")
        print("  Check that Claude followed the PROMPT.md output format instructions.")
        sys.exit(1)

    print(f"Found {len(files)} file blocks:")
    for fp in files:
        print(f"  → {fp}")
    print()

    ok = write_files(project_slug, files)

    if ok:
        print(f"\n{GREEN}✨ All files written successfully for {project_slug}{NC}")
        print(f"Next: cd projects/{project_slug} && npm install && npm run dev")
    else:
        print(f"\n{YELLOW}⚠  Some files may be missing. Check output above.{NC}")
        sys.exit(1)

if __name__ == "__main__":
    main()
