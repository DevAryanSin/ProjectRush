# deploy.ps1 - Deploy all 30 projects to Vercel (Windows - Personal Account)
# Usage:
#   .\scripts\deploy.ps1                                   # all 30
#   .\scripts\deploy.ps1 -Slug p1-digital-asset-s1-bento  # one only

param(
    [string]$Slug = ""
)

$ErrorActionPreference = "Continue"

$ROOT_DIR   = (Get-Item -Path "$PSScriptRoot\..").FullName
$PROJECTS   = Join-Path $ROOT_DIR "projects"
$MANIFEST   = Join-Path $ROOT_DIR "manifest.json"
$FAILED_LOG = Join-Path $ROOT_DIR "failed_deploys.txt"
$ENV_FILE   = Join-Path $ROOT_DIR ".env"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }
function Write-Blue   { param($t); Write-Host $t -ForegroundColor Cyan }

Write-Blue "=== HACKATHON FACTORY - VERCEL DEPLOY ==="
Write-Host ""

# Load .env
if (-not (Test-Path $ENV_FILE)) {
    Write-Red "ERROR: .env not found at $ROOT_DIR"
    exit 1
}

$envVars = @{}
Get-Content $ENV_FILE | ForEach-Object {
    $line = $_.Trim()
    if ($line -match "^([^#=][^=]*)=(.+)$") {
        $key = $Matches[1].Trim()
        $val = $Matches[2].Trim()
        $envVars[$key] = $val
    }
}

$VERCEL_TOKEN   = $envVars["VERCEL_TOKEN"]
$GEMINI_API_KEY = $envVars["GEMINI_API_KEY"]

if (-not $VERCEL_TOKEN)   { Write-Red "ERROR: VERCEL_TOKEN missing in .env";   exit 1 }
if (-not $GEMINI_API_KEY) { Write-Red "ERROR: GEMINI_API_KEY missing in .env"; exit 1 }

# Clear any Vercel env vars that could interfere with personal account deploys
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
    $projectList = Get-ChildItem -Path $PROJECTS -Directory `
                  | Select-Object -ExpandProperty Name
    Write-Yellow "Mode: all $($projectList.Count) projects"
}

$TOTAL        = $projectList.Count
$SUCCESS      = 0
$SKIPPED      = 0
$FAILED_COUNT = 0
$INDEX        = 0

Write-Host ""

# Load existing manifest
if (Test-Path $MANIFEST) {
    try {
        $manifestData = Get-Content $MANIFEST -Raw | ConvertFrom-Json -AsHashtable
    } catch {
        $manifestData = @{}
    }
} else {
    $manifestData = @{}
}

Set-Content $FAILED_LOG ""

# Deploy loop
foreach ($P_SLUG in $projectList) {
    $INDEX++
    $DIR = Join-Path $PROJECTS $P_SLUG

    Write-Blue "[$INDEX/$TOTAL] $P_SLUG"

    # Guard: folder must exist
    if (-not (Test-Path $DIR)) {
        Write-Red "  SKIP: Folder not found"
        Add-Content $FAILED_LOG "$P_SLUG - folder missing"
        $FAILED_COUNT++
        Write-Host ""
        continue
    }

    # Guard: page.tsx must be generated
    $PAGE = Join-Path $DIR "app\page.tsx"
    if (-not (Test-Path $PAGE)) {
        Write-Yellow "  SKIP: app/page.tsx missing"
        Add-Content $FAILED_LOG "$P_SLUG - not generated"
        $SKIPPED++
        Write-Host ""
        continue
    }

    $pageContent = Get-Content $PAGE -Raw
    if ($pageContent -match "Awaiting generation") {
        Write-Yellow "  SKIP: Still a placeholder - run Claude generation first"
        Add-Content $FAILED_LOG "$P_SLUG - not generated"
        $SKIPPED++
        Write-Host ""
        continue
    }

    # Step 1: Add GEMINI_API_KEY to Vercel project env
    Write-Host "  -> Setting GEMINI_API_KEY..."
    $addEnvArgs = @(
        "env", "add", "GEMINI_API_KEY", "production",
        "--token", $VERCEL_TOKEN,
        "--cwd",   $DIR,
        "--yes"
    )
    $GEMINI_API_KEY | vercel @addEnvArgs 2>&1 | Out-Null

    # Step 2: Deploy — token only, no --scope for personal accounts
    Write-Host "  -> Deploying..."
    $deployArgs = @(
        "deploy",
        "--prod",
        "--yes",
        "--token", $VERCEL_TOKEN,
        "--cwd",   $DIR
    )
    $deployOutput = & vercel @deployArgs 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Red "  FAILED: Deploy error"
        $deployOutput | Select-Object -Last 5 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Red
        }
        Add-Content $FAILED_LOG $P_SLUG
        $FAILED_COUNT++
        Write-Host ""
        continue
    }

    # Step 3: Extract URL
    $URL = "check-vercel-dashboard"
    $outputJoined = ($deployOutput -join " ")
    $urlMatch = [regex]::Match($outputJoined, "https://[a-zA-Z0-9._-]+\.vercel\.app")
    if ($urlMatch.Success) {
        $URL = $urlMatch.Value
    }

    Write-Green "  LIVE: $URL"

    # Step 4: Save to manifest
    $manifestData[$P_SLUG] = $URL
    $manifestData | ConvertTo-Json -Depth 5 | Set-Content $MANIFEST

    $SUCCESS++
    Write-Host ""
}

# Summary
Write-Blue "=== DEPLOY SUMMARY ==="
Write-Host ""
Write-Green  "  Deployed : $SUCCESS / $TOTAL"
Write-Yellow "  Skipped  : $SKIPPED (not generated yet)"
Write-Red    "  Failed   : $FAILED_COUNT"
Write-Host ""
Write-Green  "  All URLs saved to manifest.json"

if (($FAILED_COUNT -gt 0) -or ($SKIPPED -gt 0)) {
    Write-Host ""
    Write-Yellow "  Issues logged to failed_deploys.txt"
    Write-Yellow "  Retry one project with:"
    Write-Yellow "    .\scripts\deploy.ps1 -Slug your-project-slug"
    Write-Host ""
    $logLines = Get-Content $FAILED_LOG
    if ($logLines) {
        Write-Red "  Problem list:"
        foreach ($line in $logLines) {
            $trimmed = $line.Trim()
            if ($trimmed -ne "") {
                Write-Red "    - $trimmed"
            }
        }
    }
}

Write-Host ""