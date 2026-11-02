param(
    [string]$Version = "",
    [switch]$NoSite
)

# Builds dist/askpias-<version>.zip on Windows with forward-slash paths (Linux-safe).
#   powershell -ExecutionPolicy Bypass -File package.ps1
#   powershell -ExecutionPolicy Bypass -File package.ps1 -Version 1.1.0 -NoSite

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not $Version) {
    $envExample = Join-Path $root "backend\.env.example"
    if (Test-Path $envExample) {
        $line = Get-Content $envExample | Where-Object { $_ -match '^APP_VERSION=' } | Select-Object -First 1
        if ($line) { $Version = ($line -split '=', 2)[1].Trim('"') }
    }
}
if (-not $Version) { $Version = "1.0.0" }

$stageParent = Join-Path $env:TEMP ("askpias-build-" + [guid]::NewGuid().ToString("N"))
$stage = Join-Path $stageParent "askpias-$Version"
New-Item -ItemType Directory -Path $stage -Force | Out-Null

Write-Output "Copying tracked files..."

$files = git ls-files
if (-not $files) { throw "git ls-files returned nothing - run this inside the repository." }

foreach ($file in $files) {
    $source = Join-Path $root $file
    if (-not (Test-Path $source)) { continue }
    $destination = Join-Path $stage $file
    $directory = Split-Path $destination -Parent
    if (-not (Test-Path $directory)) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
    Copy-Item $source $destination -Force
}

if (-not $NoSite) {
    Write-Output "Building the site..."
    if (-not (Test-Path (Join-Path $root "node_modules"))) {
        if (Get-Command bun -ErrorAction SilentlyContinue) { bun install --frozen-lockfile } else { npm install }
    }
    if (Get-Command bun -ErrorAction SilentlyContinue) { bun run build } else { npm run build }

    $output = Join-Path $root ".output"
    if (Test-Path $output) {
        Copy-Item $output (Join-Path $stage ".output") -Recurse -Force
        Write-Output "Site included (.output)"
    } else {
        Write-Output "No .output folder found - package ships without the prebuilt site."
    }
}

$dist = Join-Path $root "dist"
if (-not (Test-Path $dist)) { New-Item -ItemType Directory -Path $dist -Force | Out-Null }
$zipPath = Join-Path $dist "askpias-$Version.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem -Path $stage -Recurse -File | ForEach-Object {
        $relative = $_.FullName.Substring($stage.Length + 1).Replace('\', '/')
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip, $_.FullName, "askpias-$Version/$relative",
            [System.IO.Compression.CompressionLevel]::Optimal
        )
    }
} finally {
    $zip.Dispose()
}

Remove-Item $stageParent -Recurse -Force -ErrorAction SilentlyContinue

$size = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Output "Built dist/askpias-$Version.zip ($size MB)"
Write-Output "Install: extract on the server, then open https://<api-domain>/install.php"
