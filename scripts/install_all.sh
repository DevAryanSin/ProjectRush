#!/bin/bash

# Navigate to the projects directory
PROJECTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../projects" && pwd)"

for project_dir in "$PROJECTS_DIR"/*/ ; do
    if [ -f "${project_dir}package.json" ]; then
        echo -e "\e[36mInstalling dependencies in $(basename "$project_dir")...\e[0m"
        (cd "$project_dir" && npm install)
    else
        echo -e "\e[33mSkipping $(basename "$project_dir") - no package.json found.\e[0m"
    fi
done

echo -e "\e[32mAll installations completed!\e[0m"
