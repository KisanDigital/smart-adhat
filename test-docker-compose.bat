@echo off
echo ========================================
echo   Smart Adhat - Docker Compose Test
echo ========================================
echo.

echo Testing docker-compose.yml (Simple H2 mode)...
echo.
docker-compose config > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] docker-compose.yml is valid
) else (
    echo [ERROR] docker-compose.yml has errors
    docker-compose config
    pause
    exit /b 1
)

echo.
echo Testing docker-compose.prod.yml (Production PostgreSQL mode)...
echo.
docker-compose -f docker-compose.prod.yml config > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] docker-compose.prod.yml is valid
) else (
    echo [ERROR] docker-compose.prod.yml has errors
    docker-compose -f docker-compose.prod.yml config
    pause
    exit /b 1
)

echo.
echo ========================================
echo   All Docker Compose files are valid!
echo ========================================
echo.
echo You can now run:
echo   - Simple mode: docker-compose up -d
echo   - Production:  docker-compose -f docker-compose.prod.yml up -d
echo.
pause

