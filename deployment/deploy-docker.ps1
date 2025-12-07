# Docker Deployment - Local/Self-Hosted
# Deploys the application using Docker Compose

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Docker Deployment (Local)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deployment Options:" -ForegroundColor Yellow
Write-Host "  1. Development (H2 in-memory database)" -ForegroundColor White
Write-Host "  2. Production (PostgreSQL database)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select option (1 or 2)"

if ($choice -eq "2") {
    Write-Host ""
    Write-Host "Using production configuration with PostgreSQL..." -ForegroundColor Cyan
    $composeFile = "docker-compose.prod.yml"
} else {
    Write-Host ""
    Write-Host "Using development configuration with H2 database..." -ForegroundColor Cyan
    $composeFile = "docker-compose.yml"
}

Write-Host ""
Write-Host "[1/3] Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f $composeFile down 2>&1 | Out-Null
Write-Host "  ✅ Containers stopped" -ForegroundColor Green

Write-Host "[2/3] Building images..." -ForegroundColor Yellow
docker-compose -f $composeFile build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Images built" -ForegroundColor Green

Write-Host "[3/3] Starting containers..." -ForegroundColor Yellow
docker-compose -f $composeFile up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Failed to start" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Containers started" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Docker Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Application URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8080/api" -ForegroundColor Cyan
Write-Host ""

Write-Host "Container Status:" -ForegroundColor Yellow
docker-compose -f $composeFile ps

Write-Host ""
Write-Host "View Logs:" -ForegroundColor Yellow
Write-Host "  docker-compose -f $composeFile logs -f" -ForegroundColor Gray
Write-Host ""
Write-Host "Stop Containers:" -ForegroundColor Yellow
Write-Host "  docker-compose -f $composeFile down" -ForegroundColor Gray
Write-Host ""

