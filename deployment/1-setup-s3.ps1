# Step 1: Setup S3 Bucket (One-time setup)
# Creates private S3 bucket for frontend hosting

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$BucketName = "smartadhat-frontend-$(Get-Date -Format 'yyyyMMddHHmmss')"
$Region = "us-east-1"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 1: S3 Bucket Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check for existing Smart Adhat buckets
Write-Host "[1/4] Checking for existing S3 buckets..." -ForegroundColor Yellow
$existingBuckets = aws s3 ls | Select-String "smartadhat-frontend-" | ForEach-Object { ($_ -split '\s+')[-1] }

if ($existingBuckets) {
    Write-Host "  ✅ Found existing Smart Adhat bucket(s):" -ForegroundColor Green
    if ($existingBuckets -is [array]) {
        $existingBuckets | ForEach-Object { Write-Host "     - $_" -ForegroundColor Gray }
        $BucketName = $existingBuckets | Sort-Object | Select-Object -First 1
        Write-Host "  ⭐ Using oldest bucket: $BucketName" -ForegroundColor Yellow
    } else {
        Write-Host "     - $existingBuckets" -ForegroundColor Gray
        $BucketName = $existingBuckets
    }
    Write-Host "  ✅ Reusing existing bucket (no new bucket created)" -ForegroundColor Green
} else {
    Write-Host "  No existing buckets found, creating new..." -ForegroundColor Gray

    # Create S3 bucket
    Write-Host "[2/4] Creating S3 bucket..." -ForegroundColor Yellow
    try {
        aws s3 mb "s3://$BucketName" --region $Region
        Write-Host "  ✅ Bucket created: $BucketName" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed to create bucket" -ForegroundColor Red
        exit 1
    }
}

# Block public access (private bucket)
Write-Host "[3/4] Blocking public access..." -ForegroundColor Yellow
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
Write-Host "  ✅ Bucket is private" -ForegroundColor Green

# Save bucket name for other scripts
Write-Host "[4/4] Saving configuration..." -ForegroundColor Yellow
# Create config folder if it doesn't exist
if (-not (Test-Path "config")) {
    New-Item -ItemType Directory -Path "config" | Out-Null
}
$BucketName | Out-File -FilePath "config\bucket-name.txt" -Encoding utf8
Write-Host "  ✅ Configuration saved" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "S3 Bucket Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Bucket Name: $BucketName" -ForegroundColor Cyan
Write-Host "Status: Private (no public access)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Run 2-setup-cloudfront.ps1" -ForegroundColor Yellow
Write-Host ""

