# inject_env.ps1 - Inject GEMINI_API_KEY into all 30 deployed Vercel projects
#
# Usage: .\scripts\inject_env.ps1
# Usage (single): .\scripts\inject_env.ps1 -Slug p1-digital-asset-s1-bento

param(
    [string]$Slug = ""
)

$ErrorActionPreference = "Continue"

$ROOT_DIR   = (Get-Item -Path "$PSScriptRoot\..").FullName
$PROJECTS   = Join-Path $ROOT_DIR "projects"
$ENV_FILE   = Join-Path $ROOT_DIR ".env"
$FAILED_LOG = Join-Path $ROOT_DIR "env_inject_failed.txt"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }
function Write-Blue   { param($t); Write-Host $t -ForegroundColor Cyan }

Write-Blue "=== HACKATHON FACTORY - INJECT ENV VARS ==="
Write-Host ""

# ── Load .env ──────────────────────────────────────────────────
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

if (-not $VERCEL_TOKEN)   { Write-Red "ERROR: VERCEL_TOKEN missing in .env";   exit 1 }
if (-not $GEMINI_API_KEY) { Write-Red "ERROR: GEMINI_API_KEY missing in .env"; exit 1 }

# Clear interfering env vars
$env:VERCEL_ORG_ID     = $null
$env:VERCEL_PROJECT_ID = $null
[System.Environment]::SetEnvironmentVariable("VERCEL_ORG_ID",     $null, "Process")
[System.Environment]::SetEnvironmentVariable("VERCEL_PROJECT_ID", $null, "Process")

Write-Green "OK: VERCEL_TOKEN loaded"
Write-Green "OK: GEMINI_API_KEY loaded (${$GEMINI_API_KEY.Substring(0,6)}...)"
Write-Host ""

# ── Select projects ────────────────────────────────────────────
if ($Slug -ne "") {
    $projectList = @($Slug)
    Write-Yellow "Mode: single -> $Slug"
} else {
    $projectList = Get-ChildItem -Path $PROJECTS -Directory `
                  | Select-Object -ExpandProperty Name
    Write-Yellow "Mode: all $($projectList.Count) projects"
}

$TOTAL   = $projectList.Count
$SUCCESS = 0
$FAILED  = 0
$INDEX   = 0

Set-Content $FAILED_LOG ""
Write-Host ""

# ── Inject loop ────────────────────────────────────────────────
foreach ($P_SLUG in $projectList) {
    $INDEX++
    $DIR = Join-Path $PROJECTS $P_SLUG

    Write-Blue "[$INDEX/$TOTAL] $P_SLUG"

    if (-not (Test-Path $DIR)) {
        Write-Red "  SKIP: Folder not found"
        Add-Content $FAILED_LOG "$P_SLUG - folder missing"
        $FAILED++
        Write-Host ""
        continue
    }

    # ── Try to remove existing key first (ignore errors) ──────
    # This prevents "already exists" errors
    $rmArgs = @(
        "env", "rm", "GEMINI_API_KEY", "production",
        "--token", $VERCEL_TOKEN,
        "--cwd",   $DIR,
        "--yes"
    )
    & vercel @rmArgs 2>&1 | Out-Null

    # ── Add GEMINI_API_KEY for production ─────────────────────
    $addArgs = @(
        "env", "add", "GEMINI_API_KEY", "production",
        "--token", $VERCEL_TOKEN,
        "--cwd",   $DIR,
        "--yes"
    )
    $addOutput = $GEMINI_API_KEY | vercel @addArgs 2>&1
    $addText   = $addOutput -join " "

    if ($LASTEXITCODE -eq 0 -or $addText -match "added" -or $addText -match "success") {
        Write-Green "  -> GEMINI_API_KEY injected (production)"
    } else {
        Write-Red "  FAILED: Could not inject env var"
        $addOutput | Select-Object -Last 3 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Red
        }
        Add-Content $FAILED_LOG "$P_SLUG - env inject failed"
        $FAILED++
        Write-Host ""
        continue
    }

    # ── Also add for preview + development ────────────────────
    foreach ($envTarget in @("preview", "development")) {
        $addArgs2 = @(
            "env", "add", "GEMINI_API_KEY", $envTarget,
            "--token", $VERCEL_TOKEN,
            "--cwd",   $DIR,
            "--yes"
        )
        # Remove first silently
        $rmArgs2 = @(
            "env", "rm", "GEMINI_API_KEY", $envTarget,
            "--token", $VERCEL_TOKEN,
            "--cwd",   $DIR,
            "--yes"
        )
        & vercel @rmArgs2 2>&1 | Out-Null
        $GEMINI_API_KEY | vercel @addArgs2 2>&1 | Out-Null
    }

    Write-Green "  -> Injected into production + preview + development"
    $SUCCESS++
    Write-Host ""
}

# ── Summary ────────────────────────────────────────────────────
Write-Blue "=== SUMMARY ==="
Write-Host ""
Write-Green "  Injected : $SUCCESS / $TOTAL"
Write-Red   "  Failed   : $FAILED"
Write-Host ""

if ($FAILED -gt 0) {
    Write-Yellow "  Failed log -> env_inject_failed.txt"
    Write-Yellow "  Retry one:"
    Write-Yellow "    .\scripts\inject_env.ps1 -Slug your-slug"
    Write-Host ""
    $logLines = Get-Content $FAILED_LOG
    foreach ($line in $logLines) {
        $trimmed = $line.Trim()
        if ($trimmed -ne "") { Write-Red "  - $trimmed" }
    }
}

Write-Host ""
Write-Blue "Done. Redeploy all projects to apply the new env vars:"
Write-Yellow "  .\scripts\patch_and_deploy.ps1"
Write-Host ""