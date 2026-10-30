# Windows development setup. Requires Git, Python 3.10+, Node.js; no Docker.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
foreach ($command in @("py", "npm", "git")) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Missing $command. Install Git, Python 3.10+, and Node.js LTS first."
    }
}
py -3 -m venv .venv
if ($LASTEXITCODE -ne 0) { throw "Python virtual environment creation failed." }
$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
& $python -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { throw "Pip upgrade failed." }
& $python -m pip install "git+https://github.com/www222fff/muse2api.git@ae17131976aec95a49f21dfcccebce1b42706880"
if ($LASTEXITCODE -ne 0) { throw "Muse2API worker dependency installation failed." }
npm install --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "NPM dependencies failed to install." }
npm run check
if ($LASTEXITCODE -ne 0) { throw "TypeScript type-check failed." }
npm test
if ($LASTEXITCODE -ne 0) { throw "Gateway regression tests failed." }
Write-Host "All setup checks passed. Run: npm start" -ForegroundColor Green
Write-Host "For Windows installer: npm run package:win" -ForegroundColor Green
