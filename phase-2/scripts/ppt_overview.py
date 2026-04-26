import os
import time
from pathlib import Path
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# ========= CONFIG =========

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent / "projects"   # points to phase-2/projects

API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={API_KEY}"

MAX_WORKERS = 2          # keep low to avoid 429
RETRY_LIMIT = 3
SKIP_EXISTING = True

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

    overview = text.split("=== OVERVIEW ===")[1].split("=== PPT ===")[0].strip()
    ppt = text.split("=== PPT ===")[1].strip()

    if not overview or not ppt:
        raise ValueError("Empty sections")

    if "# Brief" not in ppt:
        raise ValueError("Invalid PPT structure")

    return overview, ppt

# ========= PROCESS =========

def process_project(folder: Path):
    prompt_file = folder / "prompt.md"
    ppt_file = folder / "ppt.md"
    overview_file = folder / "overview.md"

    if not prompt_file.exists():
        return f"Skipped (no prompt): {folder.name}"

    ppt_exists = ppt_file.exists()
    overview_exists = overview_file.exists()

    print(f"{folder.name} -> ppt:{ppt_exists}, overview:{overview_exists}")

    # ✅ skip only if BOTH exist
    if SKIP_EXISTING and ppt_exists and overview_exists:
        return f"Skipped (both exist): {folder.name}"

    prompt_text = prompt_file.read_text(encoding="utf-8")

    delay = 1.5
    last_error = None

    for attempt in range(RETRY_LIMIT):
        try:
            # ✅ API is called here
            result = call_gemini(prompt_text)
            overview, ppt = split_output(result)

            actions = []

            if not ppt_exists:
                ppt_file.write_text(ppt, encoding="utf-8")
                actions.append("ppt")

            if not overview_exists:
                overview_file.write_text(overview, encoding="utf-8")
                actions.append("overview")

            return f"Done ({'+'.join(actions)}): {folder.name}"

        except requests.exceptions.HTTPError as e:
            last_error = e
            if e.response.status_code == 429:
                time.sleep(delay)
                delay *= 2
            else:
                break

        except Exception as e:
            last_error = e
            time.sleep(delay)
            delay *= 2

    # ✅ ALWAYS return something
    return f"Failed: {folder.name} | {last_error}"

# ========= MAIN =========

def main():
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY not set")

    if not ROOT_DIR.exists():
        raise FileNotFoundError(f"Projects folder not found: {ROOT_DIR}")

    print(f"ROOT_DIR = {ROOT_DIR.resolve()}\n")

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
    print(f"Done: {sum(r.startswith('Done') for r in results)}")
    print(f"Skipped: {sum(r.startswith('Skipped') for r in results)}")
    print(f"Failed: {sum(r.startswith('Failed') for r in results)}")


if __name__ == "__main__":
    main()