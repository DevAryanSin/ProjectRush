import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent / "projects"
OUTPUT_FILE = BASE_DIR.parent / "urls.json"


def extract_fields(prompt_text: str):
    slug = None
    project_name = None
    domain = None

    # slug (from title line)
    slug_match = re.search(r"# AGENT PROMPT — (.+)", prompt_text)
    if slug_match:
        slug = slug_match.group(1).strip()

    # project name
    name_match = re.search(r"# Tool:\s*(.+?)\s*\|", prompt_text)
    if name_match:
        project_name = name_match.group(1).strip()

    # deployment domain
    domain_match = re.search(r"# Deployment domain:\s*(.+)", prompt_text)
    if domain_match:
        domain = domain_match.group(1).strip()

    return slug, project_name, domain


def main():
    results = []

    for project in ROOT_DIR.iterdir():
        if not project.is_dir():
            continue

        prompt_file = project / "prompt.md"
        if not prompt_file.exists():
            continue

        text = prompt_file.read_text(encoding="utf-8")

        slug, project_name, domain = extract_fields(text)

        # fallback safety
        if not slug:
            slug = project.name
        if not project_name:
            project_name = project.name

        url = ""
        if domain:
            url = f"https://{domain}.vercel.app"

        results.append({
            "slug": slug,
            "project_name": project_name,
            "url": url
        })

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"Generated {OUTPUT_FILE} with {len(results)} entries.")


if __name__ == "__main__":
    main()