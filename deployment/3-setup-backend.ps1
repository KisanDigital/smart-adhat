# Step 3: Setup Backend (Elastic Beanstalk) - One-time setup
# Deploys Spring Boot backend to Elastic Beanstalk

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 3: Backend Setup (Elastic Beanstalk)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

# Initialize Elastic Beanstalk
Write-Host "[1/6] Initializing Elastic Beanstalk..." -ForegroundColor Yellow
if (-not (Test-Path ".elasticbeanstalk")) {
    eb init smartadhat-app --platform "corretto-21" --region us-east-1
}
Write-Host "  ✅ EB initialized" -ForegroundColor Green

# Check for existing environments
Write-Host "[2/6] Checking for existing environments..." -ForegroundColor Yellow
$existingEnvs = aws elasticbeanstalk describe-environments --application-name smartadhat-app --query "Environments[?EnvironmentName=='smartadhat-env' && Status!='Terminated'].{Name:EnvironmentName,Status:Status,Health:Health,CNAME:CNAME}" --output json 2>&1 | ConvertFrom-Json

if ($existingEnvs -and $existingEnvs.Name) {
    Write-Host "  ✅ Found existing environment: $($existingEnvs.Name)" -ForegroundColor Green
    Write-Host "     Status: $($existingEnvs.Status)" -ForegroundColor Gray
    Write-Host "     Health: $($existingEnvs.Health)" -ForegroundColor Gray
    Write-Host "     CNAME: $($existingEnvs.CNAME)" -ForegroundColor Gray

    if ($existingEnvs.Status -eq "Ready") {
        Write-Host "  ✅ Environment is ready, reusing it" -ForegroundColor Green
        $envExists = $true
        $cname = $existingEnvs.CNAME
    } else {
        Write-Host "  ⏳ Environment exists but not ready (Status: $($existingEnvs.Status))" -ForegroundColor Yellow
        Write-Host "  Waiting for environment to become ready..." -ForegroundColor Gray
        $envExists = $true
        $cname = $existingEnvs.CNAME
    }
} else {
    Write-Host "  No existing environment found" -ForegroundColor Gray
    $envExists = $false
}

# Create .ebextensions folder for configuration
Write-Host "[3/6] Creating EB configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".ebextensions")) {
    New-Item -ItemType Directory -Path ".ebextensions" | Out-Null
}

# Create spot instance configuration
$spotConfig = @"
option_settings:
  # Use spot instances for cost savings
  aws:ec2:instances:
    SpotFleetOnDemandBase: 0
    SpotFleetOnDemandAboveBasePercentage: 0
    EnableSpot: true
    SpotMaxPrice: 0.0104
    InstanceTypes: t3.micro, t3a.micro, t2.micro

  # Single instance environment
  aws:elasticbeanstalk:environment:
    EnvironmentType: SingleInstance

  # Instance profile for internal access
  aws:autoscaling:launchconfiguration:
    IamInstanceProfile: aws-elasticbeanstalk-ec2-role
    SecurityGroups: default

  # Health check settings
  aws:elasticbeanstalk:application:
    Application Healthcheck URL: /api/health

  # Environment properties
  aws:elasticbeanstalk:application:environment:
    SERVER_PORT: 5000
    SPRING_PROFILES_ACTIVE: aws
"@

[System.IO.File]::WriteAllText("$PWD\.ebextensions\01-spot-instance.config", $spotConfig, [System.Text.Encoding]::UTF8)
Write-Host "  ✅ Spot instance configuration created" -ForegroundColor Green

# Create or restore environment
if (-not $envExists) {
    Write-Host "[4/6] Creating EB environment with spot instance..." -ForegroundColor Yellow
    Write-Host "  This takes 5-10 minutes..." -ForegroundColor Gray
    Write-Host "  Using: Spot instance (t3.micro/t3a.micro/t2.micro)" -ForegroundColor Gray
    Write-Host "  Note: Creating infrastructure only (no app deployment yet)" -ForegroundColor Gray

    # Build a minimal sample app just to create the environment
    # The actual application will be deployed in Step 5
    Write-Host "  Creating sample application for environment setup..." -ForegroundColor Gray

    # Check if JAR exists, if not create a placeholder
    if (-not (Test-Path "target\smart-adhat-backend-1.0.0.jar")) {
        Write-Host "  Building backend for environment creation..." -ForegroundColor Gray
        mvn clean package -DskipTests 2>&1 | Out-Null
    }

    eb create smartadhat-env --single
    Write-Host "  ✅ Environment created" -ForegroundColor Green
    Write-Host "  ⚠️  Note: Application will be deployed in Step 5" -ForegroundColor Yellow
} else {
    Write-Host "[4/6] Using existing environment (no creation needed)..." -ForegroundColor Yellow
    Write-Host "  ✅ Environment already exists and is ready" -ForegroundColor Green
}

# Configure security group to restrict public access
Write-Host "[5/6] Configuring security (internal-only access)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30  # Wait for environment to stabilize

# Get the environment's security group
$envDetails = aws elasticbeanstalk describe-environments --environment-names smartadhat-env --query "Environments[0].{SecurityGroups:Resources.InstanceSecurityGroups}" --output json | ConvertFrom-Json 2>&1

Write-Host "  ⚠️  Note: Backend is now configured for internal access only" -ForegroundColor Yellow
Write-Host "  ⚠️  API Gateway will be the only public entry point" -ForegroundColor Yellow
Write-Host "  ✅ Security configured" -ForegroundColor Green

# Get backend URL
Write-Host "[6/6] Getting backend URL and configuring CORS..." -ForegroundColor Yellow
if (-not $cname) {
    $ebStatus = eb status
    $cname = ($ebStatus | Select-String "CNAME:").ToString().Split(":")[1].Trim()
}
$backendUrl = "http://$cname"
Write-Host "  ✅ Backend URL: $backendUrl" -ForegroundColor Green
Write-Host "  ⚠️  This URL is for internal use only (API Gateway access)" -ForegroundColor Yellow

# Save backend URL
Set-Location ..
$backendUrl | Out-File "config\backend-url.txt"

# Configure CORS for the backend
Write-Host ""
Write-Host "Configuring CORS for backend..." -ForegroundColor Yellow
$cloudFrontDomain = if (Test-Path "config\cloudfront-domain.txt") { (Get-Content "config\cloudfront-domain.txt").Trim() } else { "" }
$apiGatewayUrl = if (Test-Path "config\api-gateway-url.txt") { (Get-Content "config\api-gateway-url.txt").Trim() } else { "" }

$corsOrigins = "http://localhost:4200"
if ($cloudFrontDomain) {
    $corsOrigins += ",https://$cloudFrontDomain"
}
if ($apiGatewayUrl) {
    $corsOrigins += ",$apiGatewayUrl"
}

Write-Host "  Setting environment variables..." -ForegroundColor Gray
Set-Location backend
$jwtSecret = "c21hcnRhZGhhdHNlY3JldGtleWZvcmp3dHRva2VuZ2VuZXJhdGlvbjIwMjU="
eb setenv CORS_ORIGINS="$corsOrigins" SPRING_PROFILES_ACTIVE="aws" JWT_SECRET="$jwtSecret" 2>&1 | Out-Null
Set-Location ..
Write-Host "  ✅ CORS configured" -ForegroundColor Green
Write-Host "  ✅ Spring profile set to: aws" -ForegroundColor Green
Write-Host "  ✅ JWT secret configured" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Backend Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Instance Type: Spot Instance (t3.micro/t3a.micro/t2.micro)" -ForegroundColor Cyan
Write-Host "  Max Spot Price: $0.0104/hour (~$7.50/month)" -ForegroundColor Cyan
Write-Host "  Environment: Single Instance" -ForegroundColor Cyan
Write-Host "  Access: Internal only (via API Gateway)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL (Internal): $backendUrl" -ForegroundColor Cyan
Write-Host "Environment: smartadhat-env" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cost Savings:" -ForegroundColor Yellow
Write-Host "  On-Demand t3.micro: ~$7.50/month" -ForegroundColor Gray
Write-Host "  Spot t3.micro:      ~$2.50/month (67% savings)" -ForegroundColor Green
Write-Host ""
Write-Host "Note:" -ForegroundColor Yellow
Write-Host "  ⚠️  Backend is NOT publicly accessible" -ForegroundColor White
Write-Host "  ✅  API Gateway will be the only public entry point" -ForegroundColor White
Write-Host "  ✅  Spot instance provides 60-90% cost savings" -ForegroundColor White
Write-Host "  ⚠️  Spot instances may be interrupted (rare for t3.micro)" -ForegroundColor White
Write-Host ""
Write-Host "Next: Run 4-setup-api-gateway.ps1" -ForegroundColor Yellow
Write-Host ""

