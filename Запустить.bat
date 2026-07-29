@echo off
chcp 65001 >nul
title Дневник самопрограммирования
cd /d "%~dp0"

if not exist node_modules (
    echo Первый запуск: устанавливаю нужные компоненты, подождите пару минут...
    echo Для этого нужен интернет один раз.
    call npm install
    if errorlevel 1 (
        echo.
        echo Не удалось установить компоненты. Проверьте подключение к интернету и попробуйте снова.
        pause
        exit /b 1
    )
)

echo Запускаю дневник...
start "" cmd /c "timeout /t 4 >nul && start http://localhost:5173"
call npm run dev

echo.
echo Дневник остановлен. Нажмите любую клавишу, чтобы закрыть окно.
pause >nul
