@echo off
REM Start frontend (Next.js)
REM フロントエンド起動（Next.js）

where npm >nul 2>nul
if errorlevel 1 (
  echo npm not found. Please install Node.js and reopen the terminal.
  echo npm が見つかりません。Node.js をインストールして端末を再起動してください。
  pause
  exit /b 1
)

if not exist "%~dp0..\frontend\package.json" (
  echo frontend folder or package.json not found.
  echo frontend フォルダまたは package.json が見つかりません。
  pause
  exit /b 1
)

pushd "%~dp0..\frontend"
call npm install
call npm run dev
popd
pause