# Backend'i baslat (PowerShell)
Set-Location $PSScriptRoot
$tsx = Join-Path $PSScriptRoot "node_modules\.bin\tsx.cmd"
if (-not (Test-Path $tsx)) { $tsx = Join-Path $PSScriptRoot "node_modules\.bin\tsx" }
& $tsx watch src/index.ts
