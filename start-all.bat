@echo off
echo ========================================
echo   Smart Adhat - Full Stack Startup
echo ========================================
echo.
echo Starting both Backend and Frontend...
echo.

start cmd /k "cd /d %~dp0 && start-backend.bat"
timeout /t 5 /nobreak > nul
start cmd /k "cd /d %~dp0 && start-frontend.bat"
