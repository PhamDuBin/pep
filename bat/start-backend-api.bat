@echo off
REM Start backend (FastAPI)

cd /d "%~dp0"
set "BACKEND_DIR=%~dp0..\backend"

if not exist "%BACKEND_DIR%\requirements.txt" (
  echo backend folder or requirements.txt not found.
  echo Path: %BACKEND_DIR%
  pause
  exit /b 1
)

pushd "%BACKEND_DIR%"
if errorlevel 1 (
  echo Failed to change to backend dir.
  pause
  exit /b 1
)

REM Try python first, then py -3
set PYEXE=python
where python >nul 2>nul
if errorlevel 1 (
  set PYEXE=py
  set PYARG=-3
  where py >nul 2>nul
  if errorlevel 1 (
    echo Python not found. Install Python 3.11+ and add to PATH.
    pause
    popd
    exit /b 1
  )
) else (
  set PYARG=
)

echo Installing dependencies...
%PYEXE% %PYARG% -m pip install -r requirements.txt
if errorlevel 1 (
  echo pip install failed. Check Python and network.
  pause
  popd
  exit /b 1
)

echo Starting uvicorn. Press Ctrl+C to stop.
%PYEXE% %PYARG% -m uvicorn app.main:app --reload
set UVI_EXIT=%errorlevel%
popd

echo.
echo Uvicorn exited with code %UVI_EXIT%. Press any key to close.
pause
