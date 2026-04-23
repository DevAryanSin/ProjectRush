import os
import time
from pathlib import Path
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# ========= CONFIG =========

ROOT_DIR = Path("projects")
API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={API_KEY}"

MAX_WORKERS = 5          # parallelism
RETRY_LIMIT = 3          # retry on bad output
SKIP_EXISTING = True     # skip if ppt.md + overview.md exist

# ========= PROMPT =========

SYSTEM_PROMPT = """
You are generating project documentation.

INPUT:
{PROJECT_PROMPT}

OUTPUT FORMAT (STRICT):

=== OVERVIEW ===
[4–6 lines max. Clearly explain what the solution is and how it solves the problem.]

=== PPT ===

# Brief
...

# Opportunities
## Differentiation
...
## Problem Solving Approach
...
## USP
...

# Features
- ...
- ...

# Technologies
- ...
- ...

Constraints:
- No fluff
- No repetition
- Keep concise
- Bullet points where appropriate
"""

# ========= GEMINI CALL =========

def call_gemini(prompt_text: str) -> str:
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": SYSTEM_PROMPT.replace("{PROJECT_PROMPT}", prompt_text)
                    }
                ]
            }
        ]
    }

    response = requests.post(MODEL_URL, json=payload, timeout=60)
    response.raise_for_status()

    data = response.json()

    return data["candidates"][0]["content"]["parts"][0]["text"]

# ========= PARSING =========

def split_output(text: str):
    if "=== OVERVIEW ===" not in text or "=== PPT ===" not in text:
        raise ValueError("Missing required sections")

    try:
        overview = text.split("=== OVERVIEW ===")[1].split("=== PPT ===")[0].strip()
        ppt = text.split("=== PPT ===")[1].strip()
    except Exception:
        raise ValueError("Failed to parse output")

    if not overview or not ppt:
        raise ValueError("Empty sections")

    if "# Brief" not in ppt:
        raise ValueError("Invalid PPT structure")

    return overview, ppt

# ========= PROCESS ONE PROJECT =========

def process_project(folder: Path):
    prompt_file = folder / "prompt.md"
    ppt_file = folder / "ppt.md"
    overview_file = folder / "overview.md"

    if not prompt_file.exists():
        return f"Skipped (no prompt): {folder.name}"

    if SKIP_EXISTING and ppt_file.exists() and overview_file.exists():
        return f"Skipped (exists): {folder.name}"

    prompt_text = prompt_file.read_text(encoding="utf-8")

    for attempt in range(RETRY_LIMIT):
        try:
            result = call_gemini(prompt_text)

            overview, ppt = split_output(result)

            ppt_file.write_text(ppt, encoding="utf-8")
            overview_file.write_text(overview, encoding="utf-8")

            return f"Done: {folder.name}"

        except Exception as e:
            if attempt == RETRY_LIMIT - 1:
                return f"Failed: {folder.name} | {e}"
            time.sleep(1.5)  # small backoff

# ========= MAIN =========

def main():
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY not set")

    projects = [p for p in ROOT_DIR.iterdir() if p.is_dir()]

    print(f"Processing {len(projects)} projects...\n")

    results = []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(process_project, p) for p in projects]

        for future in as_completed(futures):
            res = future.result()
            print(res)
            results.append(res)

    print("\n=== SUMMARY ===")
    success = sum(1 for r in results if r.startswith("Done"))
    skipped = sum(1 for r in results if r.startswith("Skipped"))
    failed = sum(1 for r in results if r.startswith("Failed"))

    print(f"Done: {success}")
    print(f"Skipped: {skipped}")
    print(f"Failed: {failed}")


if __name__ == "__main__":
    main()