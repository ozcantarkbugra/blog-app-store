# Frontend'i baslat (PowerShell)
Set-Location $PSScriptRoot
$vite = Join-Path $PSScriptRoot "node_modules\.bin\vite.cmd"
if (-not (Test-Path $vite)) { $vite = Join-Path $PSScriptRoot "node_modules\.bin\vite" }
& $vite
