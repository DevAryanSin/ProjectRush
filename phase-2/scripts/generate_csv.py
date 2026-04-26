import json
from pathlib import Path

# ========= PATHS =========
BASE_DIR = Path(__file__).resolve().parent
PROJECTS_DIR = BASE_DIR.parent / "projects"

URL_JSON = BASE_DIR.parent / "urls.json"
PPT_JSON = BASE_DIR.parent / "phase2_ppt_links.json"
ZIP_JSON = BASE_DIR.parent / "phase2_zip_links.json"

OUTPUT_FILE = BASE_DIR.parent / "paste_ready.txt"


# ---------- Load ----------
def load_json(path):
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def map_by_slug(data, key):
    return {item["slug"]: item.get(key, "") for item in data}


# ---------- Track mapping ----------
def get_track(slug):
    if slug.startswith("digital"):
        return "Digital Asset Protection"
    if slug.startswith("crisis"):
        return "Rapid Crisis Response"
    if slug.startswith("supply"):
        return "Smart Supply Chains"
    if slug.startswith("bias"):
        return "Unbiased AI Decision"
    if slug.startswith("volunteer"):
        return "Smart Resource Allocation"
    return "Other"


# ---------- Overview ----------
def read_overview(project_path):
    file = project_path / "overview.md"
    if not file.exists():
        return ""
    return " ".join(file.read_text(encoding="utf-8").split())


# ---------- Main ----------
def main():
    urls = load_json(URL_JSON)
    ppts = load_json(PPT_JSON)
    zips = load_json(ZIP_JSON)

    url_map = map_by_slug(urls, "url")
    ppt_map = map_by_slug(ppts, "ppt_url")
    zip_map = map_by_slug(zips, "zip_url")

    # collect rows
    rows = []

    for project in PROJECTS_DIR.iterdir():
        if not project.is_dir():
            continue

        slug = project.name

        name = next(
            (item.get("project_name") for item in urls if item["slug"] == slug),
            slug
        )

        rows.append({
            "track": get_track(slug),
            "data": [
                name,
                read_overview(project),
                url_map.get(slug, ""),
                ppt_map.get(slug, ""),
                zip_map.get(slug, "")
            ]
        })

    # ---------- ORDER TRACKS ----------
    track_order = [
        "Digital Asset Protection",
        "Rapid Crisis Response",
        "Smart Supply Chains",
        "Unbiased AI Decision",
        "Smart Resource Allocation"
    ]

    output_lines = []

    for track in track_order:
        group = [r["data"] for r in rows if r["track"] == track]

        if not group:
            continue

        # add rows
        for row in group:
            output_lines.append("\t".join(row))

        # add blank line after each group
        output_lines.append("")

    # remove last empty line
    if output_lines and output_lines[-1] == "":
        output_lines.pop()

    # ---------- WRITE ----------
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(output_lines))

    print(f"Generated {OUTPUT_FILE}")


if __name__ == "__main__":
    main()