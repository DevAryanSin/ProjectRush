import os
import zipfile
from pathlib import Path

ROOT_DIR = Path("projects")

# whitelist (strict minimal)
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

# blacklist
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
    "PROMPT.md",
}


def should_include(file_path: Path, project_root: Path):
    rel = file_path.relative_to(project_root)

    # exclude unwanted directories
    if any(part in EXCLUDE_DIRS for part in rel.parts):
        return False

    # exclude unwanted files
    if rel.name in EXCLUDE_FILES:
        return False

    # include root-level important files
    if rel.name in INCLUDE_FILES:
        return True

    # include allowed directories
    if rel.parts[0] in INCLUDE_DIRS:
        return True

    return False


def zip_project(project_path: Path):
    zip_name = project_path / f"{project_path.name}.zip"

    print(f"Zipping: {project_path.name}")

    # remove old zip if exists
    if zip_name.exists():
        zip_name.unlink()

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(project_path):

            root_path = Path(root)

            # filter directories in-place
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for file in files:
                file_path = root_path / file

                # avoid including the zip itself
                if file_path == zip_name:
                    continue

                if should_include(file_path, project_path):
                    arcname = Path(project_path.name) / file_path.relative_to(project_path)
                    z.write(file_path, arcname)

    print(f"Created: {zip_name}")


def main():
    projects = [p for p in ROOT_DIR.iterdir() if p.is_dir()]

    print(f"Found {len(projects)} projects\n")

    for project in projects:
        zip_project(project)

    print("\nAll projects zipped successfully.")


if __name__ == "__main__":
    main()