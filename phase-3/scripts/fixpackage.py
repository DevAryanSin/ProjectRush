import os
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PROJECTS_DIR = os.path.join(ROOT, "phase-3", "projects")

success = 0
failed = 0

print("=== FIX PACKAGE.JSON (PYTHON) ===\n")

for project in os.listdir(PROJECTS_DIR):
    project_path = os.path.join(PROJECTS_DIR, project)

    if not os.path.isdir(project_path):
        continue

    pkg_path = os.path.join(project_path, "package.json")

    print(f"-> {project}")

    if not os.path.exists(pkg_path):
        print("   SKIP: no package.json\n")
        continue

    try:
        # Read raw bytes (handles BOM safely)
        with open(pkg_path, "rb") as f:
            raw_bytes = f.read()

        # Decode with utf-8-sig (removes BOM automatically)
        text = raw_bytes.decode("utf-8-sig")

        # Validate JSON
        data = json.loads(text)

        # Rewrite clean JSON (no BOM, pretty format)
        with open(pkg_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        print("   FIXED\n")
        success += 1

    except Exception as e:
        print(f"   FAILED: {e}\n")
        failed += 1

print("=== DONE ===")
print(f"Fixed : {success}")
print(f"Failed: {failed}")