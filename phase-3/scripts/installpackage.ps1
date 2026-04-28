# install_phase3.ps1
# Installs npm dependencies for all phase-3 projects

$ErrorActionPreference = "Continue"

$ROOT_DIR = (Get-Item -Path "$PSScriptRoot\..\..").FullName
$PROJECTS = Join-Path $ROOT_DIR "phase-3\projects"

function Write-Green  { param($t) Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t) Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t) Write-Host $t -ForegroundColor Red }
function Write-Blue   { param($t) Write-Host $t -ForegroundColor Cyan }

Write-Blue '=== PHASE 3 — INSTALL DEPENDENCIES ==='
Write-Host ''

# Validate projects folder
if (-not (Test-Path $PROJECTS)) {
    Write-Red "ERROR: Projects folder not found at $PROJECTS"
    exit 1
}

# Get all project folders
$projectList = Get-ChildItem -Path $PROJECTS -Directory | Select-Object -ExpandProperty Name

if (-not $projectList -or $projectList.Count -eq 0) {
    Write-Red 'ERROR: No project folders found'
    exit 1
}

Write-Yellow ("Found {0} projects:" -f $projectList.Count)
$projectList | ForEach-Object { Write-Host ("  - {0}" -f $_) }
Write-Host ''

$SUCCESS = 0
$FAILED  = 0

foreach ($P_SLUG in $projectList) {
    $DIR = Join-Path $PROJECTS $P_SLUG

    Write-Blue ("-> Installing in {0}" -f $P_SLUG)

    if (-not (Test-Path (Join-Path $DIR 'package.json'))) {
        Write-Red '   SKIPPED: No package.json'
        $FAILED++
        Write-Host ''
        continue
    }

    $pushed = $false

    try {
        Push-Location $DIR
        $pushed = $true

        # Clean install preferred for consistency
        if (Test-Path (Join-Path $DIR 'node_modules')) {
            Write-Yellow '   Cleaning existing node_modules'
            Remove-Item -Recurse -Force (Join-Path $DIR 'node_modules') -ErrorAction SilentlyContinue
        }

        if (Test-Path (Join-Path $DIR 'package-lock.json')) {
            Write-Host '   Running npm ci...'
            npm ci
        }
        else {
            Write-Host '   Running npm install...'
            npm install
        }

        if ($LASTEXITCODE -ne 0) {
            throw 'npm install failed'
        }

        $SUCCESS++
        Write-Green '   OK'
    }
    catch {
        $FAILED++
        Write-Red ("   FAILED: {0}" -f $_)
    }
    finally {
        if ($pushed) { Pop-Location }
    }

    Write-Host ''
}

Write-Blue '=== DONE ==='
Write-Green ("  Success : {0}" -f $SUCCESS)
Write-Red   ("  Failed  : {0}" -f $FAILED)
Write-Host ''

Write-Yellow 'Next:'
Write-Yellow '  Run deploy script or start dev servers'