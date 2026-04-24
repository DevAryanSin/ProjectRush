# deploy_phase2.ps1 — Link + Inject env + Deploy all 30 phase-2 projects
# Usage: .\phase-2\scripts\deploy_phase2.ps1
# Usage (single): .\phase-2\scripts\deploy_phase2.ps1 -Slug digital-1

param(
    [string]$Slug = ""
)

$ErrorActionPreference = "Continue"

$ROOT_DIR    = (Get-Item -Path "$PSScriptRoot\..\..").FullName
$PHASE2_DIR  = Join-Path $ROOT_DIR "phase-2"
$PROJECTS    = Join-Path $PHASE2_DIR "projects"
$MANIFEST    = Join-Path $PHASE2_DIR "manifest.json"
$FAILED_LOG  = Join-Path $PHASE2_DIR "failed_deploys.txt"
$ENV_FILE    = Join-Path $ROOT_DIR ".env"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }
function Write-Blue   { param($t); Write-Host $t -ForegroundColor Cyan }

Write-Blue "=== HACKATHON FACTORY PHASE 2 - DEPLOY ==="
Write-Host ""

# Load .env
if (-not (Test-Path $ENV_FILE)) {
    Write-Red "ERROR: .env not found at $ROOT_DIR"; exit 1
}

$envVars = @{}
Get-Content $ENV_FILE | ForEach-Object {
    $line = $_.Trim()
    if ($line -match "^([^#=][^=]*)=(.+)$") {
        $envVars[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}

$VERCEL_TOKEN   = $envVars["VERCEL_TOKEN"]
$GEMINI_API_KEY = $envVars["GEMINI_API_KEY"]

if (-not $VERCEL_TOKEN)   { Write-Red "ERROR: VERCEL_TOKEN missing";   exit 1 }
if (-not $GEMINI_API_KEY) { Write-Red "ERROR: GEMINI_API_KEY missing"; exit 1 }

# Clear interfering Vercel env vars — critical for personal accounts
$env:VERCEL_ORG_ID     = $null
$env:VERCEL_PROJECT_ID = $null
[System.Environment]::SetEnvironmentVariable("VERCEL_ORG_ID",     $null, "Process")
[System.Environment]::SetEnvironmentVariable("VERCEL_PROJECT_ID", $null, "Process")

Write-Green "OK: VERCEL_TOKEN loaded"
Write-Green "OK: GEMINI_API_KEY loaded"
Write-Host ""

# Select projects
if ($Slug -ne "") {
    $projectList = @($Slug)
    Write-Yellow "Mode: single -> $Slug"
} else {
    $projectList = Get-ChildItem -Path $PROJECTS -Directory | Select-Object -ExpandProperty Name
    Write-Yellow "Mode: all $($projectList.Count) projects"
}

$TOTAL        = $projectList.Count
$SUCCESS      = 0
$SKIPPED      = 0
$FAILED_COUNT = 0
$INDEX        = 0

Write-Host ""

# Load manifest
if (Test-Path $MANIFEST) {
    try { $manifestData = Get-Content $MANIFEST -Raw | ConvertFrom-Json -AsHashtable }
    catch { $manifestData = @{} }
} else {
    $manifestData = @{}
}

Set-Content $FAILED_LOG ""

# Deploy loop
foreach ($P_SLUG in $projectList) {
    $INDEX++
    $DIR = Join-Path $PROJECTS $P_SLUG

    Write-Blue "[$INDEX/$TOTAL] $P_SLUG"

    # Guard: folder exists
    if (-not (Test-Path $DIR)) {
        Write-Red "  SKIP: Folder not found"
        Add-Content $FAILED_LOG "$P_SLUG - folder missing"
        $FAILED_COUNT++; Write-Host ""; continue
    }

    # Guard: generated (not placeholder)
    $PAGE = Join-Path $DIR "app\page.tsx"
    if (-not (Test-Path $PAGE)) {
        Write-Yellow "  SKIP: app/page.tsx missing"
        Add-Content $FAILED_LOG "$P_SLUG - not generated"
        $SKIPPED++; Write-Host ""; continue
    }
    $pageContent = Get-Content $PAGE -Raw
    if ($pageContent -match 'Awaiting generation') {
        Write-Yellow '  SKIP: Placeholder - run Claude generation first'
        Add-Content $FAILED_LOG "$P_SLUG - not generated"
        $SKIPPED++; Write-Host ""; continue
    }

    # Step 1: Clear old .vercel link for clean link
    $vercelDir = Join-Path $DIR ".vercel"
    if (Test-Path $vercelDir) {
        Remove-Item -Recurse -Force $vercelDir
        Write-Host "  -> Cleared old .vercel link"
    }

    # Step 2: Link project to Vercel
    Write-Host "  -> Linking to Vercel..."
    $vercelJson  = Get-Content (Join-Path $DIR "vercel.json") -Raw | ConvertFrom-Json
    $projectName = $vercelJson.name

    $linkArgs = @("link", "--token", $VERCEL_TOKEN, "--cwd", $DIR, "--yes", "--project", $projectName)
    $linkOut  = & vercel @linkArgs 2>&1

    if ($LASTEXITCODE -ne 0) {
        # Retry without --project
        $linkArgs2 = @("link", "--token", $VERCEL_TOKEN, "--cwd", $DIR, "--yes")
        $linkOut   = & vercel @linkArgs2 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Red "  FAILED: Link error"
            $linkOut | Select-Object -Last 3 | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
            Add-Content $FAILED_LOG "$P_SLUG - link failed"
            $FAILED_COUNT++; Write-Host ""; continue
        }
    }
    Write-Green "  -> Linked as: $projectName"

    # Step 3: Remove + re-inject GEMINI_API_KEY (all environments)
    Write-Host "  -> Injecting GEMINI_API_KEY..."
    foreach ($target in @("production", "preview", "development")) {
        $rmArgs = @("env", "rm", "GEMINI_API_KEY", $target, "--token", $VERCEL_TOKEN, "--cwd", $DIR, "--yes")
        & vercel @rmArgs 2>&1 | Out-Null
        $addArgs = @("env", "add", "GEMINI_API_KEY", $target, "--token", $VERCEL_TOKEN, "--cwd", $DIR, "--yes")
        $GEMINI_API_KEY | vercel @addArgs 2>&1 | Out-Null
    }
    Write-Green "  -> GEMINI_API_KEY injected (prod + preview + dev)"

    # Step 4: Deploy to production
    Write-Host "  -> Deploying..."
    $deployArgs   = @("deploy", "--prod", "--yes", "--token", $VERCEL_TOKEN, "--cwd", $DIR)
    $deployOutput = & vercel @deployArgs 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Red "  FAILED: Deploy error"
        $deployOutput | Select-Object -Last 5 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Red
        }
        Add-Content $FAILED_LOG $P_SLUG
        $FAILED_COUNT++; Write-Host ""; continue
    }

    # Step 5: Extract URL
    $URL = "check-vercel-dashboard"
    $outputJoined = ($deployOutput -join " ")
    $urlMatch = [regex]::Match($outputJoined, "https://[a-zA-Z0-9._-]+\.vercel\.app")
    if ($urlMatch.Success) { $URL = $urlMatch.Value }

    Write-Green "  LIVE: $URL"

    # Step 6: Save to manifest
    $manifestData[$P_SLUG] = @{
        name = $projectName
        url  = $URL
    }
    $manifestData | ConvertTo-Json -Depth 5 | Set-Content $MANIFEST

    $SUCCESS++
    Write-Host ""
}

# Summary
Write-Blue "=== PHASE 2 DEPLOY SUMMARY ==="
Write-Host ""
Write-Green  "  Deployed : $SUCCESS / $TOTAL"
Write-Yellow "  Skipped  : $SKIPPED (not generated)"
Write-Red    "  Failed   : $FAILED_COUNT"
Write-Host ""
Write-Green  "  All URLs -> phase-2/manifest.json"

if (($FAILED_COUNT -gt 0) -or ($SKIPPED -gt 0)) {
    Write-Host ""
    Write-Yellow "  Failed log -> phase-2/failed_deploys.txt"
    Write-Yellow "  Retry one:"
    Write-Yellow "    .\phase-2\scripts\deploy_phase2.ps1 -Slug digital-1"
    Write-Host ""
    $logLines = Get-Content $FAILED_LOG
    foreach ($line in $logLines) {
        $t = $line.Trim()
        if ($t -ne "") { Write-Red "  - $t" }
    }
}

Write-Host ""
Write-Blue 'Done. Each project deployed as <toolname>-sc.vercel.app'
Write-Host ""