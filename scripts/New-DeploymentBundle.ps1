param(
    [string]$OutputRoot = (Join-Path (Split-Path -Parent $PSScriptRoot) 'dist\deploy')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Reset-Directory {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (Test-Path $Path) {
        Remove-Item -LiteralPath $Path -Recurse -Force
    }

    New-Item -ItemType Directory -Path $Path | Out-Null
}

function Copy-Tree {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$Destination
    )

    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    Copy-Item -Path (Join-Path $Source '*') -Destination $Destination -Recurse -Force
}

function Copy-FileSafe {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$Destination
    )

    $destinationDirectory = Split-Path -Parent $Destination
    New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
    Copy-Item -LiteralPath $Source -Destination $Destination -Force
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$websiteRoot = Join-Path $OutputRoot 'public_html'
$apiRoot = Join-Path $OutputRoot 'lingohunt.softthinkers.com'

Reset-Directory -Path $OutputRoot
New-Item -ItemType Directory -Path $websiteRoot | Out-Null
New-Item -ItemType Directory -Path $apiRoot | Out-Null

Copy-Tree -Source (Join-Path $repoRoot 'softthinkers-site\public') -Destination $websiteRoot
Copy-Tree -Source (Join-Path $repoRoot 'softthinkers-site\src') -Destination (Join-Path $websiteRoot 'src')
Copy-FileSafe -Source (Join-Path $repoRoot 'softthinkers-site\config\app.php') -Destination (Join-Path $websiteRoot 'config\app.php')

if (Test-Path (Join-Path $repoRoot 'softthinkers-site\storage')) {
    Copy-Tree -Source (Join-Path $repoRoot 'softthinkers-site\storage') -Destination (Join-Path $websiteRoot 'storage')
}

Copy-Tree -Source (Join-Path $repoRoot 'backend\public') -Destination $apiRoot
Copy-Tree -Source (Join-Path $repoRoot 'backend\src') -Destination (Join-Path $apiRoot 'src')
Copy-FileSafe -Source (Join-Path $repoRoot 'backend\config\app.php') -Destination (Join-Path $apiRoot 'config\app.php')

$manifest = @(
    "Deployment bundle created: $(Get-Date -Format s)"
    "Website root: $websiteRoot"
    "API root: $apiRoot"
    ""
    "Website files:"
)

$manifest += Get-ChildItem -Path $websiteRoot -Recurse -File | ForEach-Object {
    '  ' + $_.FullName.Substring($websiteRoot.Length).TrimStart('\')
}

$manifest += ''
$manifest += 'API files:'
$manifest += Get-ChildItem -Path $apiRoot -Recurse -File | ForEach-Object {
    '  ' + $_.FullName.Substring($apiRoot.Length).TrimStart('\')
}

$manifestPath = Join-Path $OutputRoot 'manifest.txt'
Set-Content -LiteralPath $manifestPath -Value $manifest -Encoding UTF8

Write-Host "Deployment bundle created at $OutputRoot"
Write-Host "Manifest written to $manifestPath"
