import re
import json
from pathlib import Path

# ========= PATH FIX =========
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent / "projects"   # phase-2/projects

OWNER = "DevAryanSin"
REPO = "ProjectRush"
BRANCH = "main"

BASE_URL = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}"

OUTPUT_FILE = BASE_DIR.parent / "phase2_ppt_links.json"


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

    if not ROOT_DIR.exists():
        raise FileNotFoundError(f"Projects folder not found: {ROOT_DIR}")

    for project in ROOT_DIR.iterdir():
        if not project.is_dir():
            continue

        prompt_md = project / "prompt.md"

        # project name from prompt.md
        project_name = project.name
        if prompt_md.exists():
            project_name = extract_project_name(
                prompt_md.read_text(encoding="utf-8"),
                project_name
            )

        ppt_file = project / f"{project_name}.pptx"

        if ppt_file.exists():
            url = f"{BASE_URL}/phase-2/projects/{project.name}/{project_name}.pptx"

            results.append({
                "slug": project.name,
                "project_name": project_name,
                "ppt_url": url
            })

    # ---------- Write JSON ----------
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"Generated {OUTPUT_FILE} with {len(results)} entries.")


if __name__ == "__main__":
    main()