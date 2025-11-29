@echo off
echo ========================================
echo   Smart Adhat - Backend Startup
echo ========================================
echo.

cd backend

echo Building the application...
call mvn clean install -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080/api
echo H2 Console: http://localhost:8080/api/h2-console
echo.

call mvn spring-boot:run
