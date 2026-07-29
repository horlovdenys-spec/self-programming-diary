@echo off
title Self-Programming Diary
cd /d "%~dp0"

if not exist node_modules (
    echo First run: installing required components, please wait a couple of minutes...
    echo This needs an internet connection just this once.
    call npm install
    if errorlevel 1 (
        echo.
        echo Installation failed. Check your internet connection and try again.
        pause
        exit /b 1
    )
)

echo Starting the diary...
start "" cmd /c "timeout /t 4 >nul && start http://localhost:5173"
call npm run dev

echo.
echo Server stopped. Press any key to close this window.
pause >nul
