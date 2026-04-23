# git_connect.ps1 - Connect all 30 Vercel projects to GitHub
# Runs: vercel git connect for each project folder
#
# Usage: .\scripts\git_connect.ps1
# Usage (single): .\scripts\git_connect.ps1 -Slug p1-digital-asset-s1-bento

param(
    [string]$Slug = ""
)

$ErrorActionPreference = "Continue"

$ROOT_DIR  = (Get-Item -Path "$PSScriptRoot\..").FullName
$PROJECTS  = Join-Path $ROOT_DIR "projects"
$ENV_FILE  = Join-Path $ROOT_DIR ".env"
$FAILED_LOG = Join-Path $ROOT_DIR "git_connect_failed.txt"

# ── Your Vercel details ────────────────────────────────────────
$GITHUB_REPO = "https://github.com/DevAryanSin/ProjectRush"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }
function Write-Blue   { param($t); Write-Host $t -ForegroundColor Cyan }

Write-Blue "=== HACKATHON FACTORY - GIT CONNECT ALL ==="
Write-Host ""
Write-Host "  GitHub: $GITHUB_REPO"
Write-Host ""

# ── Load .env ──────────────────────────────────────────────────
if (-not (Test-Path $ENV_FILE)) {
    Write-Red "ERROR: .env not found"; exit 1
}

$envVars = @{}
Get-Content $ENV_FILE | ForEach-Object {
    $line = $_.Trim()
    if ($line -match "^([^#=][^=]*)=(.+)$") {
        $envVars[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}

$VERCEL_TOKEN = $envVars["VERCEL_TOKEN"]
if (-not $VERCEL_TOKEN) { Write-Red "ERROR: VERCEL_TOKEN missing in .env"; exit 1 }

# Clear interfering env vars
$env:VERCEL_ORG_ID     = $null
$env:VERCEL_PROJECT_ID = $null
[System.Environment]::SetEnvironmentVariable("VERCEL_ORG_ID",     $null, "Process")
[System.Environment]::SetEnvironmentVariable("VERCEL_PROJECT_ID", $null, "Process")

Write-Green "OK: VERCEL_TOKEN loaded"
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

# ── Main loop ──────────────────────────────────────────────────
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

    # Check .vercel/project.json exists (must be linked first)
    $projectJson = Join-Path $DIR ".vercel\project.json"
    if (-not (Test-Path $projectJson)) {
        Write-Yellow "  -> No .vercel link found, linking first..."

        $linkArgs = @(
            "link",
            "--token", $VERCEL_TOKEN,
            "--cwd",   $DIR,
            "--yes",
            "--project", $P_SLUG
        )
        $linkOut = & vercel @linkArgs 2>&1

        if ($LASTEXITCODE -ne 0) {
            # Retry without --project
            $linkArgs2 = @("link", "--token", $VERCEL_TOKEN, "--cwd", $DIR, "--yes")
            $linkOut = & vercel @linkArgs2 2>&1

            if ($LASTEXITCODE -ne 0) {
                Write-Red "  FAILED: Could not link project"
                $linkOut | Select-Object -Last 3 | ForEach-Object {
                    Write-Host "    $_" -ForegroundColor Red
                }
                Add-Content $FAILED_LOG "$P_SLUG - link failed"
                $FAILED++
                Write-Host ""
                continue
            }
        }
        Write-Green "  -> Linked OK"
    } else {
        Write-Host "  -> Already linked"
    }

    # Run vercel git connect with auto-answers piped in
    # Answers in order:
    #   1. "yes"  -> connect this directory
    #   2. (scope is auto-selected when only one exists)
    #   3. "yes"  -> link to existing project
    #   4. project name
    #   5. GitHub repo URL
    Write-Host "  -> Running git connect..."

    # Build the input answers
    # vercel git connect asks:
    # Q1: Set up "<dir>"? -> yes
    # Q2: Which scope? -> (auto if only one, else pick)
    # Q3: Link to existing project? -> yes
    # Q4: What's the name of your existing project? -> $P_SLUG
    # Then it connects to GitHub automatically from .vercel/project.json

    $answers = "yes`nyes`n$P_SLUG`n$GITHUB_REPO`n"

    $connectArgs = @(
        "git", "connect",
        "--token", $VERCEL_TOKEN,
        "--cwd",   $DIR
    )

    $connectOutput = $answers | & vercel @connectArgs 2>&1

    if ($LASTEXITCODE -eq 0 -or ($connectOutput -join " ") -match "Connected") {
        Write-Green "  -> Git connected: $GITHUB_REPO"
        $Success++
    } else {
        # Check if already connected
        $outText = $connectOutput -join " "
        if ($outText -match "already" -or $outText -match "Connected") {
            Write-Green "  -> Already connected to GitHub"
            $SUCCESS++
        } else {
            Write-Red "  FAILED: Git connect error"
            $connectOutput | Select-Object -Last 4 | ForEach-Object {
                Write-Host "    $_" -ForegroundColor Red
            }
            Add-Content $FAILED_LOG "$P_SLUG - git connect failed"
            $FAILED++
        }
    }

    Write-Host ""
}

# ── Summary ────────────────────────────────────────────────────
Write-Blue "=== SUMMARY ==="
Write-Host ""
Write-Green "  Connected : $SUCCESS / $TOTAL"
Write-Red   "  Failed    : $FAILED"
Write-Host ""

if ($FAILED -gt 0) {
    Write-Yellow "  Failed log -> git_connect_failed.txt"
    Write-Yellow "  Retry one:"
    Write-Yellow "    .\scripts\git_connect.ps1 -Slug your-slug"
    Write-Host ""
    $logLines = Get-Content $FAILED_LOG
    foreach ($line in $logLines) {
        $trimmed = $line.Trim()
        if ($trimmed -ne "") { Write-Red "  - $trimmed" }
    }
}

Write-Host ""
Write-Blue "Done. Now run patch_and_deploy.ps1 to deploy all 30."
Write-Host ""