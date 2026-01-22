@echo off
echo Starting Curamete Development Environment...
echo ==========================================

echo Starting Backend Server...
start "Backend" /D "..\backend" cmd /k "python main.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
npm run dev

echo.
echo Press any key to close this window...
pause >nul