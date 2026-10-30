# Build a portable Windows Muse2API executable using the pinned local venv.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    throw "Run setup-windows.ps1 first; Muse2API Python environment is missing."
}
& $python -m pip install "pyinstaller==6.16.0"
if ($LASTEXITCODE -ne 0) { throw "Unable to install PyInstaller." }
& $python -m PyInstaller --noconfirm --clean --onedir --name muse-worker --collect-all muse2api --distpath "$PSScriptRoot\worker-dist" --workpath "$PSScriptRoot\worker-build" --specpath "$PSScriptRoot\worker-build" "$PSScriptRoot\worker-entry.py"
if ($LASTEXITCODE -ne 0) { throw "Worker packaging failed." }
if (-not (Test-Path "$PSScriptRoot\worker-dist\muse-worker\muse-worker.exe")) {
    throw "Worker executable was not produced."
}
Write-Host "Portable Muse worker compiled successfully." -ForegroundColor Green
