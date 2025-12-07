# Cleanup Script - Deletes ALL AWS Resources
# WARNING: This will delete everything and cannot be undone!

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Red
Write-Host "AWS Resources Cleanup" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  WARNING: This will DELETE all AWS resources!" -ForegroundColor Red
Write-Host ""

if (-not $Force) {
    Write-Host "Resources to be deleted:" -ForegroundColor Yellow
    Write-Host "  - CloudFront Distribution" -ForegroundColor White
    Write-Host "  - S3 Bucket and all files" -ForegroundColor White
    Write-Host "  - API Gateway" -ForegroundColor White
    Write-Host "  - Elastic Beanstalk Environment & Application" -ForegroundColor White
    Write-Host "  - Origin Access Control" -ForegroundColor White
    Write-Host ""
    $confirm = Read-Host "Type 'DELETE' to confirm"
    if ($confirm -ne "DELETE") {
        Write-Host "Cancelled" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Yellow
Write-Host ""

# Load configuration or search for resources
$configPath = "config"
$BucketName = if (Test-Path "$configPath\bucket-name.txt") { (Get-Content "$configPath\bucket-name.txt").Trim() } else { $null }
$CloudFrontId = if (Test-Path "$configPath\cloudfront-id.txt") { (Get-Content "$configPath\cloudfront-id.txt").Trim() } else { $null }
$ApiGatewayId = if (Test-Path "$configPath\api-gateway-id.txt") { (Get-Content "$configPath\api-gateway-id.txt").Trim() } else { $null }
$OacId = if (Test-Path "$configPath\oac-id.txt") { (Get-Content "$configPath\oac-id.txt").Trim() } else { $null }

# If no config, search for resources
if (-not $BucketName) {
    Write-Host "Searching for Smart Adhat S3 buckets..." -ForegroundColor Gray
    $allBuckets = aws s3 ls | Select-String "smartadhat-frontend"
    if ($allBuckets) {
        $BucketName = @()
        foreach ($line in $allBuckets) {
            $bucket = ($line.ToString() -split '\s+')[-1]
            $BucketName += $bucket
        }
    }
}

if (-not $CloudFrontId) {
    Write-Host "Searching for CloudFront distributions..." -ForegroundColor Gray
    $cfList = aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='Smart Adhat Frontend Distribution' || Comment=='SmartAdhat Frontend Distribution' || Comment=='SmartAdhat Frontend (Active)'].Id" --output text
    if ($cfList) {
        $CloudFrontId = $cfList -split '\s+'
    }
}

if (-not $OacId) {
    Write-Host "Searching for Origin Access Controls..." -ForegroundColor Gray
    $oacList = aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?contains(Name, 'smartadhat') || contains(Name, 'smart-adhat')].Id" --output text 2>&1
    if ($oacList -and $oacList -notmatch "error") {
        $OacId = $oacList -split '\s+'
    }
}

# 1. Disable and delete CloudFront Distribution
if ($CloudFrontId) {
    Write-Host "[1/5] Deleting CloudFront Distribution(s)..." -ForegroundColor Yellow
    foreach ($distId in $CloudFrontId) {
        $distId = $distId.Trim()
        if ($distId) {
            try {
                Write-Host "  Processing: $distId" -ForegroundColor Gray
                # Get current config
                $distConfig = aws cloudfront get-distribution-config --id $distId --output json | ConvertFrom-Json
                $etag = $distConfig.ETag

                # Disable distribution
                Write-Host "    Disabling distribution..." -ForegroundColor Gray
                $distConfig.DistributionConfig.Enabled = $false
                $configJson = $distConfig.DistributionConfig | ConvertTo-Json -Depth 10
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText("$PWD\temp-disable-cf-$distId.json", $configJson, $utf8NoBom)
                aws cloudfront update-distribution --id $distId --if-match $etag --distribution-config "file://temp-disable-cf-$distId.json" | Out-Null
                Remove-Item "temp-disable-cf-$distId.json" -ErrorAction SilentlyContinue

                Write-Host "    ⚠️  CloudFront disabled: $distId" -ForegroundColor Yellow
                Write-Host "    (Delete manually after 10-15 min from AWS Console)" -ForegroundColor Gray
            } catch {
                Write-Host "    ⚠️  Failed to disable $distId" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "[1/5] CloudFront: Not found" -ForegroundColor Gray
}

# 2. Delete S3 Bucket
if ($BucketName) {
    Write-Host "[2/5] Deleting S3 Bucket(s)..." -ForegroundColor Yellow
    if ($BucketName -is [array]) {
        foreach ($bucket in $BucketName) {
            try {
                Write-Host "  Processing: $bucket" -ForegroundColor Gray
                # Remove all objects
                Write-Host "    Removing all files..." -ForegroundColor Gray
                aws s3 rm "s3://$bucket" --recursive 2>&1 | Out-Null

                # Delete bucket
                aws s3 rb "s3://$bucket" --force 2>&1 | Out-Null
                Write-Host "    ✅ Deleted: $bucket" -ForegroundColor Green
            } catch {
                Write-Host "    ⚠️  Failed to delete $bucket (may be in use)" -ForegroundColor Yellow
            }
        }
    } else {
        try {
            Write-Host "  Removing all files..." -ForegroundColor Gray
            aws s3 rm "s3://$BucketName" --recursive 2>&1 | Out-Null

            # Delete bucket
            aws s3 rb "s3://$BucketName" --force 2>&1 | Out-Null
            Write-Host "  ✅ S3 Bucket deleted: $BucketName" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Failed to delete S3 (may be in use by CloudFront)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "[2/5] S3 Bucket: Not found" -ForegroundColor Gray
}

# 3. Delete API Gateway
if ($ApiGatewayId) {
    Write-Host "[3/5] Deleting API Gateway..." -ForegroundColor Yellow
    try {
        aws apigateway delete-rest-api --rest-api-id $ApiGatewayId
        Write-Host "  ✅ API Gateway deleted" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Failed to delete API Gateway" -ForegroundColor Yellow
    }
} else {
    Write-Host "[3/5] API Gateway: Searching..." -ForegroundColor Gray
    try {
        $apiList = aws apigateway get-rest-apis --query "items[?name=='smartadhat-api-proxy'].id" --output text
        if ($apiList) {
            aws apigateway delete-rest-api --rest-api-id $apiList
            Write-Host "  ✅ API Gateway deleted" -ForegroundColor Green
        } else {
            Write-Host "  Not found" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ⚠️  Failed to delete" -ForegroundColor Yellow
    }
}

# 4. Delete Elastic Beanstalk
Write-Host "[4/5] Deleting Elastic Beanstalk..." -ForegroundColor Yellow

# Search for Smart Adhat environments
$ebEnvs = aws elasticbeanstalk describe-environments --application-name smartadhat-app --query "Environments[?Status!='Terminated'].EnvironmentName" --output text 2>&1

if ($ebEnvs -and $ebEnvs -notmatch "error") {
    $envList = $ebEnvs -split '\s+'
    foreach ($env in $envList) {
        if ($env) {
            try {
                Write-Host "  Terminating environment: $env" -ForegroundColor Gray
                aws elasticbeanstalk terminate-environment --environment-name $env --terminate-resources 2>&1 | Out-Null
                Write-Host "  ⏳ $env terminating (takes 5-10 minutes)" -ForegroundColor Yellow
            } catch {
                Write-Host "  ⚠️  Failed to terminate $env" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "  No environments found" -ForegroundColor Gray
}

# Delete application
try {
    aws elasticbeanstalk delete-application --application-name smartadhat-app --terminate-env-by-force 2>&1 | Out-Null
    Write-Host "  ✅ Application deleted" -ForegroundColor Green
} catch {
    Write-Host "  Application not found or already deleted" -ForegroundColor Gray
}

# 5. Delete Origin Access Control
if ($OacId) {
    Write-Host "[5/5] Deleting Origin Access Control(s)..." -ForegroundColor Yellow
    if ($OacId -is [array]) {
        foreach ($oac in $OacId) {
            $oac = $oac.Trim()
            if ($oac) {
                try {
                    Write-Host "  Processing: $oac" -ForegroundColor Gray
                    $oacInfo = aws cloudfront get-origin-access-control --id $oac --output json | ConvertFrom-Json
                    $etag = $oacInfo.ETag
                    aws cloudfront delete-origin-access-control --id $oac --if-match $etag
                    Write-Host "    ✅ Deleted: $oac" -ForegroundColor Green
                } catch {
                    Write-Host "    ⚠️  Failed to delete $oac" -ForegroundColor Yellow
                }
            }
        }
    } else {
        try {
            $oac = aws cloudfront get-origin-access-control --id $OacId --output json | ConvertFrom-Json
            $etag = $oac.ETag
            aws cloudfront delete-origin-access-control --id $OacId --if-match $etag
            Write-Host "  ✅ OAC deleted" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Failed to delete OAC" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "[5/5] OAC: Searching..." -ForegroundColor Gray
    try {
        $allOacs = aws cloudfront list-origin-access-controls --output json | ConvertFrom-Json
        $smartadhatOacs = $allOacs.OriginAccessControlList.Items | Where-Object { $_.Name -match "smartadhat|smart-adhat" }
        if ($smartadhatOacs) {
            foreach ($oacItem in $smartadhatOacs) {
                try {
                    Write-Host "  Deleting: $($oacItem.Name)" -ForegroundColor Gray
                    $oacInfo = aws cloudfront get-origin-access-control --id $oacItem.Id --output json | ConvertFrom-Json
                    $etag = $oacInfo.ETag
                    aws cloudfront delete-origin-access-control --id $oacItem.Id --if-match $etag
                    Write-Host "  ✅ Deleted: $($oacItem.Name)" -ForegroundColor Green
                } catch {
                    Write-Host "  ⚠️  Failed to delete $($oacItem.Name)" -ForegroundColor Yellow
                }
            }
        } else {
            Write-Host "  Not found" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  Not found or no access" -ForegroundColor Gray
    }
}

# Clean up config folder
Write-Host ""
Write-Host "Cleaning up configuration files..." -ForegroundColor Yellow
if (Test-Path "config") {
    Remove-Item "config" -Recurse -Force
    Write-Host "  ✅ Config folder deleted" -ForegroundColor Green
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Note:" -ForegroundColor Yellow
Write-Host "  - CloudFront may need manual deletion after it's disabled" -ForegroundColor White
Write-Host "  - Check AWS Console to verify all resources are deleted" -ForegroundColor White
Write-Host "  - Elastic Beanstalk termination takes 5-10 minutes" -ForegroundColor White
Write-Host ""
Write-Host "AWS Console:" -ForegroundColor Cyan
Write-Host "  https://console.aws.amazon.com/" -ForegroundColor Cyan
Write-Host ""

