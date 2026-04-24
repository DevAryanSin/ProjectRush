$ErrorActionPreference = "Stop"

$ROOT_DIR   = (Get-Item -Path "$PSScriptRoot\..\..").FullName
$PROJECTS   = Join-Path $ROOT_DIR "phase-2\projects"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }

Write-Host ""
Write-Host "=== INSTALLING DEPENDENCIES FOR ALL PROJECTS ===" -ForegroundColor Cyan
Write-Host ""

$dirs = Get-ChildItem -Path $PROJECTS -Directory

foreach ($dir in $dirs) {
    $projectPath = $dir.FullName
    Write-Yellow "Installing in $($dir.Name)..."

    if (Test-Path (Join-Path $projectPath "package.json")) {
        try {
            Push-Location $projectPath

            npm install

            Write-Green "OK: $($dir.Name)"
        }
        catch {
            Write-Red "FAILED: $($dir.Name)"
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Red "Skipped (no package.json): $($dir.Name)"
    }
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan