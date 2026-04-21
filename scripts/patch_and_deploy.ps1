# patch_and_deploy.ps1
# 1. Patches all 30 vercel.json with correct git config + root directory
# 2. Links each project to Vercel
# 3. Deploys each project to production
#
# Usage: .\scripts\patch_and_deploy.ps1
# Usage (single): .\scripts\patch_and_deploy.ps1 -Slug p1-digital-asset-s1-bento

param(
    [string]$Slug = ""
)

$ErrorActionPreference = "Continue"

# ── Config ─────────────────────────────────────────────────────
$GITHUB_REPO = "DevAryanSin/ProjectRush"   # your GitHub repo
$GITHUB_BRANCH = "main"                     # change to master if needed

$ROOT_DIR   = (Get-Item -Path "$PSScriptRoot\..").FullName
$PROJECTS   = Join-Path $ROOT_DIR "projects"
$MANIFEST   = Join-Path $ROOT_DIR "manifest.json"
$FAILED_LOG = Join-Path $ROOT_DIR "failed_deploys.txt"
$ENV_FILE   = Join-Path $ROOT_DIR ".env"

function Write-Green  { param($t); Write-Host $t -ForegroundColor Green }
function Write-Yellow { param($t); Write-Host $t -ForegroundColor Yellow }
function Write-Red    { param($t); Write-Host $t -ForegroundColor Red }
function Write-Blue   { param($t); Write-Host $t -ForegroundColor Cyan }

Write-Blue "=== HACKATHON FACTORY - PATCH + LINK + DEPLOY ==="
Write-Host ""
Write-Host "  GitHub Repo : $GITHUB_REPO"
Write-Host "  Branch      : $GITHUB_BRANCH"
Write-Host ""

# ── Load .env ──────────────────────────────────────────────────
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

# Clear interfering Vercel env vars
$env:VERCEL_ORG_ID     = $null
$env:VERCEL_PROJECT_ID = $null
[System.Environment]::SetEnvironmentVariable("VERCEL_ORG_ID",     $null, "Process")
[System.Environment]::SetEnvironmentVariable("VERCEL_PROJECT_ID", $null, "Process")

Write-Green "OK: VERCEL_TOKEN loaded"
Write-Green "OK: GEMINI_API_KEY loaded"
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

$TOTAL        = $projectList.Count
$SUCCESS      = 0
$SKIPPED      = 0
$FAILED_COUNT = 0
$INDEX        = 0

Write-Host ""

# ── Load existing manifest ─────────────────────────────────────
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

# ── Main loop ──────────────────────────────────────────────────
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

    # Guard: must be generated
    $PAGE = Join-Path $DIR "app\page.tsx"
    if (-not (Test-Path $PAGE)) {
        Write-Yellow "  SKIP: app/page.tsx missing - not generated"
        Add-Content $FAILED_LOG "$P_SLUG - not generated"
        $SKIPPED++
        Write-Host ""
        continue
    }

    $pageContent = Get-Content $PAGE -Raw
    if ($pageContent -match "Awaiting generation") {
        Write-Yellow "  SKIP: Placeholder found - not generated"
        Add-Content $FAILED_LOG "$P_SLUG - not generated"
        $SKIPPED++
        Write-Host ""
        continue
    }

    # ── Step 1: Patch vercel.json ──────────────────────────────
    Write-Host "  -> Patching vercel.json..."

    $ROOT_DIRECTORY = "projects/$P_SLUG"

    $vercelJson = @{
        name            = $P_SLUG
        version         = 2
        framework       = "nextjs"
        buildCommand    = "next build --no-turbo"
        outputDirectory = ".next"
        installCommand  = "npm install"
        ignoreCommand   = "git diff --quiet HEAD^ HEAD -- $ROOT_DIRECTORY/"
        git             = @{
            deploymentEnabled = $true
        }
    }

    $vercelJsonPath = Join-Path $DIR "vercel.json"
    $vercelJson | ConvertTo-Json -Depth 5 | Set-Content $vercelJsonPath
    Write-Green "  -> vercel.json patched (rootDir: $ROOT_DIRECTORY)"

    # ── Step 2: Clear old .vercel link ────────────────────────
    $vercelDir = Join-Path $DIR ".vercel"
    if (Test-Path $vercelDir) {
        Remove-Item -Recurse -Force $vercelDir
        Write-Host "  -> Cleared old .vercel link"
    }

    # ── Step 3: Link project to Vercel ────────────────────────
    Write-Host "  -> Linking to Vercel (project: $P_SLUG)..."

    $linkArgs = @(
        "link",
        "--token", $VERCEL_TOKEN,
        "--cwd",   $DIR,
        "--yes",
        "--project", $P_SLUG
    )
    $linkOutput = & vercel @linkArgs 2>&1

    if ($LASTEXITCODE -ne 0) {
        # Retry without --project flag (Vercel auto-names it)
        Write-Yellow "  -> Retrying link without --project flag..."
        $linkArgs2 = @(
            "link",
            "--token", $VERCEL_TOKEN,
            "--cwd",   $DIR,
            "--yes"
        )
        $linkOutput = & vercel @linkArgs2 2>&1

        if ($LASTEXITCODE -ne 0) {
            Write-Red "  FAILED: Could not link to Vercel"
            $linkOutput | Select-Object -Last 3 | ForEach-Object {
                Write-Host "    $_" -ForegroundColor Red
            }
            Add-Content $FAILED_LOG "$P_SLUG - link failed"
            $FAILED_COUNT++
            Write-Host ""
            continue
        }
    }

    Write-Green "  -> Linked OK"

    # ── Step 4: Inject GEMINI_API_KEY ─────────────────────────
    Write-Host "  -> Setting GEMINI_API_KEY..."
    $addEnvArgs = @(
        "env", "add", "GEMINI_API_KEY", "production",
        "--token", $VERCEL_TOKEN,
        "--cwd",   $DIR,
        "--yes"
    )
    $GEMINI_API_KEY | vercel @addEnvArgs 2>&1 | Out-Null

    # ── Step 5: Deploy ─────────────────────────────────────────
    Write-Host "  -> Deploying to production..."
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

    # ── Step 6: Extract live URL ───────────────────────────────
    $URL = "check-vercel-dashboard"
    $outputJoined = ($deployOutput -join " ")
    $urlMatch = [regex]::Match($outputJoined, "https://[a-zA-Z0-9._-]+\.vercel\.app")
    if ($urlMatch.Success) {
        $URL = $urlMatch.Value
    }

    Write-Green "  LIVE: $URL"

    # ── Step 7: Save to manifest ───────────────────────────────
    $manifestData[$P_SLUG] = $URL
    $manifestData | ConvertTo-Json -Depth 5 | Set-Content $MANIFEST

    $SUCCESS++
    Write-Host ""
}

# ── Final summary ──────────────────────────────────────────────
Write-Blue "=== FINAL SUMMARY ==="
Write-Host ""
Write-Green  "  Deployed : $SUCCESS / $TOTAL"
Write-Yellow "  Skipped  : $SKIPPED (not generated yet)"
Write-Red    "  Failed   : $FAILED_COUNT"
Write-Host ""
Write-Green  "  Live URLs -> manifest.json"
Write-Host ""

if (($FAILED_COUNT -gt 0) -or ($SKIPPED -gt 0)) {
    Write-Yellow "  Failed/Skipped log -> failed_deploys.txt"
    Write-Yellow "  Retry a single project:"
    Write-Yellow "    .\scripts\patch_and_deploy.ps1 -Slug your-slug"
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
Write-Blue "Done. Each project is now an isolated Vercel deployment."
Write-Blue "Future git pushes to projects/<slug>/ will auto-redeploy only that project."
Write-Host ""
