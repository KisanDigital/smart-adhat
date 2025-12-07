# Step 5b: Build and Deploy Frontend Only
# Builds and deploys Angular frontend to S3 and CloudFront

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Build and Deploy Frontend" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load configuration
$BucketName = (Get-Content "config\bucket-name.txt").Trim()
$CloudFrontId = (Get-Content "config\cloudfront-id.txt").Trim()
$CloudFrontDomain = (Get-Content "config\cloudfront-domain.txt").Trim()
$ApiGatewayUrl = (Get-Content "config\api-gateway-url.txt").Trim()

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  S3 Bucket: $BucketName" -ForegroundColor Gray
Write-Host "  CloudFront: $CloudFrontId" -ForegroundColor Gray
Write-Host "  API Gateway: $ApiGatewayUrl" -ForegroundColor Gray
Write-Host ""

Set-Location frontend

Write-Host "[1/4] Updating environment configuration..." -ForegroundColor Yellow
$envContent = @"
export const environment = {
  production: true,
  apiUrl: '$ApiGatewayUrl/api'
};
"@
$envContent | Out-File -FilePath "src\environments\environment.aws.ts" -Encoding utf8
Write-Host "  ✅ Environment configured with API: $ApiGatewayUrl/api" -ForegroundColor Green

Write-Host "[2/4] Building frontend..." -ForegroundColor Yellow
npm run build -- --configuration aws
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Frontend built" -ForegroundColor Green

Write-Host "[3/4] Uploading to S3..." -ForegroundColor Yellow
aws s3 sync dist\smart-adhat-frontend\browser "s3://$BucketName" --delete
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Upload failed" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Files uploaded to S3" -ForegroundColor Green

Write-Host "[4/4] Invalidating CloudFront cache..." -ForegroundColor Yellow
aws cloudfront create-invalidation --distribution-id $CloudFrontId --paths "/*" | Out-Null
Write-Host "  ✅ Cache invalidated" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Frontend Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend URL: https://$CloudFrontDomain" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ CloudFront cache invalidation takes 2-3 minutes" -ForegroundColor Yellow
Write-Host "   Your changes will be live after that" -ForegroundColor Gray
Write-Host ""

