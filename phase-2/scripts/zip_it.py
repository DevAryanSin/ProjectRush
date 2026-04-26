import os
import re
import zipfile
from pathlib import Path

ROOT_DIR = Path("phase-2/projects")

# ========= NAME EXTRACTION =========
def extract_project_name(prompt_text: str, fallback: str):
    match = re.search(r"\*\*Name:\*\*\s*(.+)", prompt_text)
    if match:
        name = match.group(1).strip()
        return re.sub(r'[\\/*?:"<>|]', "", name)
    return fallback


# ========= INCLUDE / EXCLUDE =========

INCLUDE_FILES = {
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "tsconfig.json",
}

INCLUDE_DIRS = {
    "app",
}

EXCLUDE_DIRS = {
    ".next",
    "node_modules",
    ".vercel",
    ".git",
    "public",
}

EXCLUDE_FILES = {
    ".gitignore",
    ".env.local",
    "ppt.md",
    "overview.md",
    "prompt.md",   # fixed case
}


# ========= FILTER =========

def should_include(file_path: Path, project_root: Path):
    rel = file_path.relative_to(project_root)

    # exclude directories
    if any(part in EXCLUDE_DIRS for part in rel.parts):
        return False

    # exclude files
    if rel.name in EXCLUDE_FILES:
        return False

    # include root-level files
    if rel.name in INCLUDE_FILES:
        return True

    # include allowed dirs
    if rel.parts[0] in INCLUDE_DIRS:
        return True

    return False


# ========= ZIP LOGIC =========

def zip_project(project_path: Path):
    prompt_file = project_path / "prompt.md"

    project_name = project_path.name

    if prompt_file.exists():
        prompt_text = prompt_file.read_text(encoding="utf-8")
        project_name = extract_project_name(prompt_text, project_name)

    zip_name = project_path / f"{project_name}.zip"

    print(f"Zipping: {project_name}")

    # remove old zip
    if zip_name.exists():
        zip_name.unlink()

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(project_path):

            root_path = Path(root)

            # filter dirs in-place
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for file in files:
                file_path = root_path / file

                # skip zip itself
                if file_path == zip_name:
                    continue

                if should_include(file_path, project_path):
                    arcname = Path(project_name) / file_path.relative_to(project_path)
                    z.write(file_path, arcname)

    print(f"Created: {zip_name}")


# ========= MAIN =========

def main():
    if not ROOT_DIR.exists():
        raise FileNotFoundError(f"Projects folder not found: {ROOT_DIR}")

    projects = [p for p in ROOT_DIR.iterdir() if p.is_dir()]

    print(f"Found {len(projects)} projects\n")

    for project in projects:
        zip_project(project)

    print("\nAll projects zipped successfully.")


if __name__ == "__main__":
    main()