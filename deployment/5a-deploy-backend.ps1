# Step 5a: Build and Deploy Backend Only
# Builds and deploys Spring Boot backend to Elastic Beanstalk

$ErrorActionPreference = "Stop"

# Update PATH to include EB CLI
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Build and Deploy Backend" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load configuration
$ApiGatewayUrl = (Get-Content "config\api-gateway-url.txt").Trim()
$CloudFrontDomain = (Get-Content "config\cloudfront-domain.txt").Trim()

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  API Gateway: $ApiGatewayUrl" -ForegroundColor Gray
Write-Host ""

Set-Location backend

Write-Host "[1/4] Updating environment variables..." -ForegroundColor Yellow
$corsOrigins = "http://localhost:4200,https://$CloudFrontDomain,$ApiGatewayUrl"
$jwtSecret = "c21hcnRhZGhhdHNlY3JldGtleWZvcmp3dHRva2VuZ2VuZXJhdGlvbjIwMjU="
eb setenv CORS_ORIGINS="$corsOrigins" SPRING_PROFILES_ACTIVE="aws" JWT_SECRET="$jwtSecret" 2>&1 | Out-Null
Write-Host "  ✅ CORS configured: $corsOrigins" -ForegroundColor Green
Write-Host "  ✅ Spring profile set to: aws" -ForegroundColor Green
Write-Host "  ✅ JWT secret configured" -ForegroundColor Green
Write-Host "  ⏳ Waiting for environment to update..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "[2/4] Building backend..." -ForegroundColor Yellow
mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Backend built" -ForegroundColor Green

Write-Host "[3/4] Deploying to Elastic Beanstalk..." -ForegroundColor Yellow
eb deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Backend deployed" -ForegroundColor Green


Set-Location ..

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Backend Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend URL: $ApiGatewayUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment variables configured:" -ForegroundColor Yellow
Write-Host "  - CORS_ORIGINS (CloudFront, API Gateway, localhost)" -ForegroundColor White
Write-Host "  - SPRING_PROFILES_ACTIVE=aws" -ForegroundColor White
Write-Host "  - JWT_SECRET (secure Base64 key)" -ForegroundColor White
Write-Host ""

