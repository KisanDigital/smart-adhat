# Step 5: Build and Deploy Application (Recurring task)
# Builds frontend and backend, deploys to AWS

param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend
)

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Build and Deploy Application" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load configuration
$BucketName = (Get-Content "config\bucket-name.txt").Trim()
$CloudFrontId = (Get-Content "config\cloudfront-id.txt").Trim()
$ApiGatewayUrl = (Get-Content "config\api-gateway-url.txt").Trim()

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  S3 Bucket: $BucketName" -ForegroundColor Gray
Write-Host "  CloudFront: $CloudFrontId" -ForegroundColor Gray
Write-Host "  API Gateway: $ApiGatewayUrl" -ForegroundColor Gray
Write-Host ""

# Deploy Backend
if (-not $SkipBackend) {
    & "$PSScriptRoot\5a-deploy-backend.ps1"
} else {
    Write-Host "[Backend] Skipped" -ForegroundColor Gray
    Write-Host ""
}

# Deploy Frontend
if (-not $SkipFrontend) {
    & "$PSScriptRoot\5b-deploy-frontend.ps1"
} else {
    Write-Host "[Frontend] Skipped" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor Yellow
$CloudFrontDomain = (Get-Content "config\cloudfront-domain.txt").Trim()
Write-Host "  Frontend: https://$CloudFrontDomain" -ForegroundColor Cyan
Write-Host "  API: $ApiGatewayUrl" -ForegroundColor Cyan
Write-Host ""
if (-not $SkipFrontend) {
    Write-Host "Note: CloudFront cache invalidation takes 2-3 minutes" -ForegroundColor Yellow
}
Write-Host ""

