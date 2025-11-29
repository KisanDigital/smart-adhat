@echo off
echo ========================================
echo   Smart Adhat - Frontend Startup
echo ========================================
echo.

cd frontend

echo Installing dependencies (if needed)...
if not exist "node_modules\" (
    echo Installing npm packages...
    call npm install
)

echo.
echo Starting Angular development server...
echo Frontend will be available at: http://localhost:4200
echo.

call npm start
