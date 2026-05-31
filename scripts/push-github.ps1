param(
    [string]$Remote = 'origin',
    [string]$Branch = 'main',
    [string]$Message = 'Update SoftThinkers platform'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

git add .
git commit -m $Message
git branch -M $Branch
git push -u $Remote $Branch
