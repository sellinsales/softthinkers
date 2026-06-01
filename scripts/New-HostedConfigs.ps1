param(
    [string]$DbHost = $env:SOFTTHINKERS_DB_HOST,
    [string]$DbPort = $env:SOFTTHINKERS_DB_PORT,
    [string]$DbName = $env:SOFTTHINKERS_DB_NAME,
    [string]$DbUser = $env:SOFTTHINKERS_DB_USER,
    [string]$DbPassword = $env:SOFTTHINKERS_DB_PASSWORD,
    [string]$SiteUrl = $env:SOFTTHINKERS_SITE_URL,
    [string]$SiteTimezone = $env:SOFTTHINKERS_SITE_TIMEZONE,
    [string]$LeadStorage = $env:SOFTTHINKERS_LEAD_STORAGE
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($DbPassword)) {
    throw 'SOFTTHINKERS_DB_PASSWORD is required.'
}

if ([string]::IsNullOrWhiteSpace($DbHost)) { $DbHost = 'localhost' }
if ([string]::IsNullOrWhiteSpace($DbPort)) { $DbPort = '3306' }
if ([string]::IsNullOrWhiteSpace($DbName)) { $DbName = 'softthinkers_lingohunt' }
if ([string]::IsNullOrWhiteSpace($DbUser)) { $DbUser = 'softthinkers_akeel' }
if ([string]::IsNullOrWhiteSpace($SiteUrl)) { $SiteUrl = 'https://softthinkers.com' }
if ([string]::IsNullOrWhiteSpace($SiteTimezone)) { $SiteTimezone = 'Asia/Karachi' }
if ([string]::IsNullOrWhiteSpace($LeadStorage)) { $LeadStorage = 'database' }

$siteConfigPath = Join-Path $repoRoot 'softthinkers-site\config\app.php'
$apiConfigPath = Join-Path $repoRoot 'backend\config\app.php'

$siteConfig = @"
<?php

declare(strict_types=1);

return [
    'app' => [
        'name' => 'SoftThinkers',
        'env' => 'production',
        'url' => '$SiteUrl',
        'timezone' => '$SiteTimezone',
    ],
    'lead_capture' => [
        'storage' => '$LeadStorage',
        'file_path' => __DIR__ . '/../storage/leads.ndjson',
    ],
    'db' => [
        'host' => '$DbHost',
        'port' => $DbPort,
        'database' => '$DbName',
        'username' => '$DbUser',
        'password' => '$DbPassword',
        'charset' => 'utf8mb4',
    ],
];
"@

$apiConfig = @"
<?php

declare(strict_types=1);

return [
    'app' => [
        'name' => 'LingoHunt API',
        'env' => 'production',
        'base_path' => '',
        'token_ttl_days' => 90,
    ],
    'db' => [
        'host' => '$DbHost',
        'port' => $DbPort,
        'database' => '$DbName',
        'username' => '$DbUser',
        'password' => '$DbPassword',
        'charset' => 'utf8mb4',
    ],
];
"@

Set-Content -LiteralPath $siteConfigPath -Value $siteConfig -Encoding UTF8
Set-Content -LiteralPath $apiConfigPath -Value $apiConfig -Encoding UTF8

Write-Host "Generated $siteConfigPath"
Write-Host "Generated $apiConfigPath"
