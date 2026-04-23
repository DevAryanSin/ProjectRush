import re
import json
from pathlib import Path

ROOT_DIR = Path("projects")

OWNER = "DevAryanSin"
REPO = "ProjectRush"
BRANCH = "main"

BASE_URL = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}"

OUTPUT_FILE = Path("links.json")


# ---------- Extract project name ----------
def extract_project_name(prompt_text: str, fallback: str):
    match = re.search(r"\*\*Name:\*\*\s*(.+)", prompt_text)
    if match:
        name = match.group(1).strip()
        return re.sub(r'[\\/*?:"<>|]', "", name)
    return fallback


# ---------- Main ----------
def main():
    results = []

    for project in ROOT_DIR.iterdir():
        if not project.is_dir():
            continue

        prompt_md = project / "prompt.md"

        # Get project name
        project_name = project.name
        if prompt_md.exists():
            project_name = extract_project_name(
                prompt_md.read_text(encoding="utf-8"),
                project_name
            )

        # Look for ppt
        ppt_file = project / f"{project_name}.pptx"

        if ppt_file.exists():
            url = f"{BASE_URL}/projects/{project.name}/{project_name}.pptx"

            results.append({
                "project": project.name,
                "name": project_name,
                "download_url": url
            })

    # ---------- Write JSON file ----------
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"Generated {OUTPUT_FILE} with {len(results)} entries.")


if __name__ == "__main__":
    main()