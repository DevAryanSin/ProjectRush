$ErrorActionPreference = "Stop"

$ROOT_DIR   = (Get-Item -Path "$PSScriptRoot\..\..").FullName
$PROJECTS   = Join-Path $ROOT_DIR "phase-2\projects"
$SKILL_FILE = Join-Path $ROOT_DIR "SKILL.md"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }

Write-Host ""
Write-Host "=== COPYING SKILL.md TO ALL PROJECTS ===" -ForegroundColor Cyan
Write-Host ""

# Validate source file
if (-not (Test-Path $SKILL_FILE)) {
    Write-Red "ERROR: SKILL.md not found at root"
    exit 1
}

$dirs = Get-ChildItem -Path $PROJECTS -Directory

foreach ($dir in $dirs) {
    $dest = Join-Path $dir.FullName "SKILL.md"

    try {
        Copy-Item -Path $SKILL_FILE -Destination $dest -Force
        Write-Green "OK: $($dir.Name)"
    }
    catch {
        Write-Red "FAILED: $($dir.Name)"
    }
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan