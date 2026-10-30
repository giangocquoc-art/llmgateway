# Run from PowerShell with Python 3.10+ and Node.js installed. No Docker.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Get-Command py -ErrorAction SilentlyContinue)) { throw "Install Python 3.10+ first." }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw "Install Node.js LTS first." }
py -3 -m venv .venv
& ".\.venv\Scripts\python.exe" -m pip install --upgrade pip
& ".\.venv\Scripts\python.exe" -m pip install "git+https://github.com/www222fff/muse2api.git@ae17131976aec95a49f21dfcccebce1b42706880"
npm install --no-audit --no-fund
npm run check
npm test
Write-Host "Setup complete. Run: npm start" -ForegroundColor Green
Write-Host "To build a Windows installer: npm run package:win" -ForegroundColor Green
