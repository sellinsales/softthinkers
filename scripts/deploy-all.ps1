param(
    [string]$Server = 'ftp.softthinkers.com',
    [int]$Port = 21,
    [string]$Username = 'softthinkers',
    [string]$Password = $env:SOFTTHINKERS_FTP_PASSWORD,
    [string]$WebsiteRoot = 'public_html',
    [string]$ApiRoot = 'lingohunt.softthinkers.com',
    [switch]$AllowInsecureFtps
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($Password)) {
    throw "Provide the FTP password with -Password or the SOFTTHINKERS_FTP_PASSWORD environment variable."
}

& (Join-Path $PSScriptRoot 'deploy-softthinkers.ps1') -Server $Server -Port $Port -Username $Username -Password $Password -RemoteRoot $WebsiteRoot -AllowInsecureFtps:$AllowInsecureFtps
& (Join-Path $PSScriptRoot 'deploy-lingohunt-api.ps1') -Server $Server -Port $Port -Username $Username -Password $Password -RemoteRoot $ApiRoot -AllowInsecureFtps:$AllowInsecureFtps
