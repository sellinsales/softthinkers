Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-CurlExecutable {
    $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
    if (-not $curl) {
        throw "curl.exe is required for FTP deployment but was not found."
    }

    return $curl.Source
}

function New-CurlArgs {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Username,
        [Parameter(Mandatory = $true)]
        [string]$Password,
        [switch]$AllowInsecureFtps
    )

    $args = @(
        '--fail',
        '--silent',
        '--show-error',
        '--ssl-reqd',
        '--ftp-create-dirs',
        '--user',
        ("{0}:{1}" -f $Username, $Password)
    )

    if ($AllowInsecureFtps) {
        $args += '--insecure'
    }

    return $args
}

function Send-FtpFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$CurlPath,
        [Parameter(Mandatory = $true)]
        [string]$Server,
        [Parameter(Mandatory = $true)]
        [int]$Port,
        [Parameter(Mandatory = $true)]
        [string]$Username,
        [Parameter(Mandatory = $true)]
        [string]$Password,
        [Parameter(Mandatory = $true)]
        [string]$LocalPath,
        [Parameter(Mandatory = $true)]
        [string]$RemotePath,
        [switch]$AllowInsecureFtps
    )

    $normalizedRemote = ($RemotePath -replace '\\', '/').TrimStart('/')
    $uri = "ftp://{0}:{1}/{2}" -f $Server, $Port, $normalizedRemote
    $args = New-CurlArgs -Username $Username -Password $Password -AllowInsecureFtps:$AllowInsecureFtps
    $args += @('-T', $LocalPath, $uri)

    & $CurlPath @args
}

function Publish-FtpTree {
    param(
        [Parameter(Mandatory = $true)]
        [string]$CurlPath,
        [Parameter(Mandatory = $true)]
        [string]$Server,
        [Parameter(Mandatory = $true)]
        [int]$Port,
        [Parameter(Mandatory = $true)]
        [string]$Username,
        [Parameter(Mandatory = $true)]
        [string]$Password,
        [Parameter(Mandatory = $true)]
        [string]$LocalPath,
        [Parameter(Mandatory = $true)]
        [string]$RemoteBasePath,
        [string[]]$IncludeFiles = @(),
        [switch]$AllowInsecureFtps
    )

    $resolvedLocal = (Resolve-Path $LocalPath).Path
    if (Test-Path $resolvedLocal -PathType Leaf) {
        $remoteFile = ($RemoteBasePath -replace '\\', '/').TrimStart('/')
        Send-FtpFile `
            -CurlPath $CurlPath `
            -Server $Server `
            -Port $Port `
            -Username $Username `
            -Password $Password `
            -LocalPath $resolvedLocal `
            -RemotePath $remoteFile `
            -AllowInsecureFtps:$AllowInsecureFtps
        return
    }

    $files = Get-ChildItem -Path $resolvedLocal -Recurse -File
    if ($IncludeFiles.Count -gt 0) {
        $lookup = @{}
        foreach ($name in $IncludeFiles) {
            $lookup[$name] = $true
        }
        $files = $files | Where-Object { $lookup.ContainsKey($_.Name) }
    }

    foreach ($file in $files) {
        $relative = $file.FullName.Substring($resolvedLocal.Length).TrimStart('\', '/')
        $remotePath = (($RemoteBasePath.TrimEnd('/')) + '/' + ($relative -replace '\\', '/')).TrimStart('/')
        Write-Host ("Uploading {0} -> {1}" -f $file.FullName, $remotePath)
        Send-FtpFile `
            -CurlPath $CurlPath `
            -Server $Server `
            -Port $Port `
            -Username $Username `
            -Password $Password `
            -LocalPath $file.FullName `
            -RemotePath $remotePath `
            -AllowInsecureFtps:$AllowInsecureFtps
    }
}
