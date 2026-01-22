@echo off
REM Start backend (FastAPI)
REM バックエンド起動（FastAPI）

where python >nul 2>nul
if errorlevel 1 (
  echo Python not found. Please install Python 3.11+ and reopen the terminal.
  echo Python が見つかりません。Python 3.11+ をインストールして端末を再起動してください。
  pause
  exit /b 1
)

if not exist "%~dp0..\backend\requirements.txt" (
  echo backend folder or requirements.txt not found.
  echo backend フォルダまたは requirements.txt が見つかりません。
  pause
  exit /b 1
)

pushd "%~dp0..\backend"
call py -3.12 -m pip install -r requirements.txt
call py -3.12 -m uvicorn app.main:app --reload
popd
pause
