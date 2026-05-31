param(
    [string]$Server = 'ftp.softthinkers.com',
    [int]$Port = 21,
    [string]$Username = 'softthinkers',
    [string]$Password = $env:SOFTTHINKERS_FTP_PASSWORD,
    [string]$RemoteRoot = 'public_html',
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

Publish-FtpTree -CurlPath $curlPath -Server $Server -Port $Port -Username $Username -Password $Password -LocalPath (Join-Path $repoRoot 'softthinkers-site/public') -RemoteBasePath $RemoteRoot -AllowInsecureFtps:$AllowInsecureFtps
Publish-FtpTree -CurlPath $curlPath -Server $Server -Port $Port -Username $Username -Password $Password -LocalPath (Join-Path $repoRoot 'softthinkers-site/src') -RemoteBasePath ($RemoteRoot + '/src') -AllowInsecureFtps:$AllowInsecureFtps
Publish-FtpTree -CurlPath $curlPath -Server $Server -Port $Port -Username $Username -Password $Password -LocalPath (Join-Path $repoRoot 'softthinkers-site/config/app.php') -RemoteBasePath ($RemoteRoot + '/config/app.php') -AllowInsecureFtps:$AllowInsecureFtps
