param(
    [string]$Server = 'ftp.softthinkers.com',
    [int]$Port = 21,
    [string]$Username = 'softthinkers',
    [string]$Password = $env:SOFTTHINKERS_FTP_PASSWORD,
    [string]$RemoteRoot = 'lingohunt.softthinkers.com',
    [switch]$BuildBundle = $true,
    [switch]$AllowInsecureFtps
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($Password)) {
    throw "Provide the FTP password with -Password or the SOFTTHINKERS_FTP_PASSWORD environment variable."
}

. (Join-Path $PSScriptRoot 'Invoke-FtpUpload.ps1')

$curlPath = Get-CurlExecutable
$repoRoot = Split-Path -Parent $PSScriptRoot

if ($BuildBundle) {
    & (Join-Path $PSScriptRoot 'New-DeploymentBundle.ps1')
}

$bundleApiRoot = Join-Path $repoRoot 'dist\deploy\lingohunt.softthinkers.com'
Publish-FtpTree -CurlPath $curlPath -Server $Server -Port $Port -Username $Username -Password $Password -LocalPath $bundleApiRoot -RemoteBasePath $RemoteRoot -AllowInsecureFtps:$AllowInsecureFtps
