from pathlib import Path

ROOT_DIR = Path("projects")

OWNER = "DevAryanSin"
REPO = "ProjectRush"
BRANCH = "main"

BASE_URL = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}"

OUTPUT_FILE = Path("zip_links.txt")


def encode_url(url: str):
    return url.replace(" ", "%20")


def main():
    links = []

    for project in ROOT_DIR.iterdir():
        if not project.is_dir():
            continue

        folder = project.name
        zip_file = project / f"{folder}.zip"

        if zip_file.exists():
            url = encode_url(
                f"{BASE_URL}/projects/{folder}/{folder}.zip"
            )
            links.append(url)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for link in links:
            f.write(link + "\n")

    print(f"Generated {OUTPUT_FILE} with {len(links)} links.")


if __name__ == "__main__":
    main()