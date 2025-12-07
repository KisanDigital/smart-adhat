# Step 2: Setup CloudFront Distribution (One-time setup)
# Creates CloudFront distribution with Origin Access Control for private S3

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 2: CloudFront Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load bucket name
$BucketName = (Get-Content "config\bucket-name.txt" -ErrorAction Stop).Trim()
Write-Host "Using S3 bucket: $BucketName" -ForegroundColor Gray
Write-Host ""

# Check for existing Origin Access Control
Write-Host "[1/6] Checking for existing Origin Access Control..." -ForegroundColor Yellow
$existingOac = aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='smartadhat-s3-oac'].Id" --output text 2>&1
if ($existingOac -and $existingOac -notmatch "error") {
    $oacId = $existingOac.Trim()
    Write-Host "  ✅ Found existing OAC: $oacId" -ForegroundColor Green
    $oacId | Out-File "config\oac-id.txt"
} else {
    Write-Host "  Creating new OAC..." -ForegroundColor Gray
    $oacResult = aws cloudfront create-origin-access-control --origin-access-control-config "Name=smartadhat-s3-oac,Description=OAC for Smart Adhat S3,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" --output json | ConvertFrom-Json
    $oacId = $oacResult.OriginAccessControl.Id
    Write-Host "  ✅ OAC created: $oacId" -ForegroundColor Green
    $oacId | Out-File "config\oac-id.txt"
}

# Check for existing CloudFront distribution
Write-Host "[2/6] Checking for existing CloudFront distribution..." -ForegroundColor Yellow
# Get ALL distributions sorted by creation date to find the FREE tier one (first created)
$allDistributions = aws cloudfront list-distributions --query "DistributionList.Items[?contains(Comment, 'Smart') || contains(Comment, 'smartadhat') || contains(Comment, 'SmartAdhat')].{Id:Id,Status:Status,Enabled:DistributionConfig.Enabled,Comment:Comment,CreatedTime:LastModifiedTime}" --output json 2>&1 | ConvertFrom-Json

if ($allDistributions) {
    # If multiple distributions exist, use the oldest one (FREE tier)
    if ($allDistributions -is [array]) {
        $existingDist = $allDistributions | Sort-Object CreatedTime | Select-Object -First 1
        Write-Host "  ✅ Found multiple distributions, using FREE tier (oldest): $($existingDist.Id)" -ForegroundColor Green
    } else {
        $existingDist = $allDistributions
        Write-Host "  ✅ Found existing distribution: $($existingDist.Id)" -ForegroundColor Green
    }

    $distId = $existingDist.Id
    $distEnabled = $existingDist.Enabled
    Write-Host "  Status: $($existingDist.Status), Enabled: $distEnabled" -ForegroundColor Gray
    Write-Host "  Comment: $($existingDist.Comment)" -ForegroundColor Gray
    Write-Host "  ⭐ This is your FREE tier distribution" -ForegroundColor Yellow

    if (-not $distEnabled) {
        Write-Host "[3/6] Enabling existing CloudFront distribution..." -ForegroundColor Yellow
        # Get current config
        $distConfig = aws cloudfront get-distribution-config --id $distId --output json | ConvertFrom-Json
        $etag = $distConfig.ETag

        # Enable distribution and update bucket
        $distConfig.DistributionConfig.Enabled = $true
        $distConfig.DistributionConfig.Origins.Items[0].DomainName = "$BucketName.s3.us-east-1.amazonaws.com"
        $distConfig.DistributionConfig.Origins.Items[0].Id = "S3-$BucketName"
        $distConfig.DistributionConfig.Origins.Items[0].OriginAccessControlId = $oacId
        $distConfig.DistributionConfig.DefaultCacheBehavior.TargetOriginId = "S3-$BucketName"

        $configJson = $distConfig.DistributionConfig | ConvertTo-Json -Depth 10
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText("$PWD\temp-cf-update.json", $configJson, $utf8NoBom)

        aws cloudfront update-distribution --id $distId --if-match $etag --distribution-config file://temp-cf-update.json | Out-Null
        Remove-Item "temp-cf-update.json" -ErrorAction SilentlyContinue

        Write-Host "  ✅ Distribution enabled and updated" -ForegroundColor Green
    } else {
        Write-Host "[3/6] Distribution already enabled, updating bucket..." -ForegroundColor Yellow
        # Get current config
        $distConfig = aws cloudfront get-distribution-config --id $distId --output json | ConvertFrom-Json
        $etag = $distConfig.ETag

        # Update bucket
        $distConfig.DistributionConfig.Origins.Items[0].DomainName = "$BucketName.s3.us-east-1.amazonaws.com"
        $distConfig.DistributionConfig.Origins.Items[0].Id = "S3-$BucketName"
        $distConfig.DistributionConfig.Origins.Items[0].OriginAccessControlId = $oacId
        $distConfig.DistributionConfig.DefaultCacheBehavior.TargetOriginId = "S3-$BucketName"

        $configJson = $distConfig.DistributionConfig | ConvertTo-Json -Depth 10
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText("$PWD\temp-cf-update.json", $configJson, $utf8NoBom)

        aws cloudfront update-distribution --id $distId --if-match $etag --distribution-config file://temp-cf-update.json | Out-Null
        Remove-Item "temp-cf-update.json" -ErrorAction SilentlyContinue

        Write-Host "  ✅ Distribution updated" -ForegroundColor Green
    }

    # Get domain name
    $distInfo = aws cloudfront get-distribution --id $distId --output json | ConvertFrom-Json
    $distDomain = $distInfo.Distribution.DomainName

    $distId | Out-File "config\cloudfront-id.txt"
    $distDomain | Out-File "config\cloudfront-domain.txt"
} else {
    Write-Host "  ⚠️  No existing CloudFront distribution found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  IMPORTANT: Creating a new distribution will be PAY-AS-YOU-GO" -ForegroundColor Red
    Write-Host "  Only the FIRST distribution per AWS account gets FREE tier" -ForegroundColor Red
    Write-Host ""
    $confirm = Read-Host "  Do you want to create a NEW pay-as-you-go distribution? (type 'YES' to confirm)"

    if ($confirm -ne "YES") {
        Write-Host ""
        Write-Host "  ❌ Cancelled. No new distribution created." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  To use existing FREE tier distribution:" -ForegroundColor Cyan
        Write-Host "  1. Check AWS Console for disabled distributions" -ForegroundColor White
        Write-Host "  2. Run this script again to enable it" -ForegroundColor White
        Write-Host ""
        exit 0
    }

    # Create CloudFront distribution config
    Write-Host "[3/6] Creating new CloudFront distribution (PAY-AS-YOU-GO)..." -ForegroundColor Yellow
    Write-Host "  ⚠️  This will NOT be FREE tier!" -ForegroundColor Red
$cfConfig = @"
{
  "CallerReference": "smartadhat-$(Get-Date -Format 'yyyyMMddHHmmss')",
  "Comment": "Smart Adhat Frontend Distribution",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$BucketName",
        "DomainName": "$BucketName.s3.us-east-1.amazonaws.com",
        "OriginPath": "",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        },
        "OriginAccessControlId": "$oacId"
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$BucketName",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      }
    ]
  },
  "DefaultRootObject": "index.html"
}
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\temp-cf-config.json", $cfConfig, $utf8NoBom)

$distResult = aws cloudfront create-distribution --distribution-config file://temp-cf-config.json --output json | ConvertFrom-Json
$distId = $distResult.Distribution.Id
$distDomain = $distResult.Distribution.DomainName
Remove-Item "temp-cf-config.json"

Write-Host "  ✅ Distribution created: $distId" -ForegroundColor Green
$distId | Out-File "config\cloudfront-id.txt"
$distDomain | Out-File "config\cloudfront-domain.txt"
}

# Update S3 bucket policy for CloudFront OAC
Write-Host "[4/6] Configuring S3 bucket policy..." -ForegroundColor Yellow
$accountId = aws sts get-caller-identity --query Account --output text
$bucketPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BucketName/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::${accountId}:distribution/$distId"
        }
      }
    }
  ]
}
"@

[System.IO.File]::WriteAllText("$PWD\temp-bucket-policy.json", $bucketPolicy, $utf8NoBom)
aws s3api put-bucket-policy --bucket $BucketName --policy file://temp-bucket-policy.json
Remove-Item "temp-bucket-policy.json"
Write-Host "  ✅ Bucket policy applied" -ForegroundColor Green

Write-Host "[5/6] Waiting for distribution to deploy..." -ForegroundColor Yellow
Write-Host "  You can continue with next steps while this deploys" -ForegroundColor Gray

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "CloudFront Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Distribution ID: $distId" -ForegroundColor Cyan
Write-Host "CloudFront URL: https://$distDomain" -ForegroundColor Cyan
Write-Host "Status: Deploying (10-15 minutes)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next: Run 3-setup-backend.ps1" -ForegroundColor Yellow
Write-Host ""

