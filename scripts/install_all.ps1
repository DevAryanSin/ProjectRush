$projectsDir = Join-Path $PSScriptRoot "..\projects"

# Get all directories in the projects folder
$projects = Get-ChildItem -Path $projectsDir -Directory

foreach ($project in $projects) {
    $projectPath = $project.FullName
    $packageJsonPath = Join-Path $projectPath "package.json"

    # Check if package.json exists to ensure it's a Node project
    if (Test-Path $packageJsonPath) {
        Write-Host "Installing dependencies in $($project.Name)..." -ForegroundColor Cyan
        Push-Location $projectPath
        
        try {
            # Run npm install
            npm install
        }
        catch {
            Write-Host "Error installing in $($project.Name)" -ForegroundColor Red
        }
        finally {
            Pop-Location
        }
    } else {
        Write-Host "Skipping $($project.Name) - no package.json found." -ForegroundColor Yellow
    }
}

Write-Host "All installations completed!" -ForegroundColor Green
