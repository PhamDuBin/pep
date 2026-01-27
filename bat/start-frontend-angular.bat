@echo off
REM Start frontend-angular (Angular)
REM フロントエンド起動（Angular）

where npm >nul 2>nul
if errorlevel 1 (
  echo npm not found. Please install Node.js and reopen the terminal.
  echo npm が見つかりません。Node.js をインストールして端末を再起動してください。
  pause
  exit /b 1
)

if not exist "%~dp0..\frontend-angular\package.json" (
  echo frontend-angular folder or package.json not found.
  echo frontend-angular フォルダまたは package.json が見つかりません。
  pause
  exit /b 1
)

pushd "%~dp0..\frontend-angular"
call npm install
call npm start
popd
pause