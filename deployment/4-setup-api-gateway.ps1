# Step 4: Setup API Gateway (One-time setup)
# Creates API Gateway proxy to private backend

$ErrorActionPreference = "Stop"

# Ensure we're in the project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Step 4: API Gateway Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load backend URL
$backendUrl = (Get-Content "config\backend-url.txt" -ErrorAction Stop).Trim()
Write-Host "Backend URL: $backendUrl" -ForegroundColor Gray
Write-Host ""

# Create REST API
Write-Host "[1/6] Creating API Gateway..." -ForegroundColor Yellow
$apiResult = aws apigateway create-rest-api --name "smartadhat-api-proxy" --description "Proxy for Smart Adhat backend" --endpoint-configuration "types=REGIONAL" --output json | ConvertFrom-Json
$apiId = $apiResult.id
Write-Host "  ✅ API created: $apiId" -ForegroundColor Green
$apiId | Out-File "config\api-gateway-id.txt"

# Get root resource
Write-Host "[2/6] Getting root resource..." -ForegroundColor Yellow
$resources = aws apigateway get-resources --rest-api-id $apiId --output json | ConvertFrom-Json
$rootId = $resources.items[0].id
Write-Host "  ✅ Root resource: $rootId" -ForegroundColor Green

# Create proxy resource
Write-Host "[3/6] Creating proxy resource..." -ForegroundColor Yellow
$proxyResource = aws apigateway create-resource --rest-api-id $apiId --parent-id $rootId --path-part "{proxy+}" --output json | ConvertFrom-Json
$proxyId = $proxyResource.id
Write-Host "  ✅ Proxy resource created" -ForegroundColor Green

# Create ANY method
Write-Host "[4/6] Creating ANY method..." -ForegroundColor Yellow
aws apigateway put-method --rest-api-id $apiId --resource-id $proxyId --http-method ANY --authorization-type NONE --request-parameters "method.request.path.proxy=true" | Out-Null
Write-Host "  ✅ Method created" -ForegroundColor Green

# Create integration
Write-Host "[5/6] Creating backend integration..." -ForegroundColor Yellow
aws apigateway put-integration --rest-api-id $apiId --resource-id $proxyId --http-method ANY --type HTTP_PROXY --integration-http-method ANY --uri "$backendUrl/{proxy}" --request-parameters "integration.request.path.proxy=method.request.path.proxy" --connection-type INTERNET | Out-Null
Write-Host "  ✅ Integration created" -ForegroundColor Green

# Deploy API
Write-Host "[6/6] Deploying API Gateway..." -ForegroundColor Yellow
aws apigateway create-deployment --rest-api-id $apiId --stage-name prod --stage-description "Production" --description "Initial deployment" | Out-Null
$apiUrl = "https://$apiId.execute-api.us-east-1.amazonaws.com/prod"
Write-Host "  ✅ API deployed" -ForegroundColor Green
$apiUrl | Out-File "config\api-gateway-url.txt"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "API Gateway Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "API Gateway URL: $apiUrl" -ForegroundColor Cyan
Write-Host "Backend (Private): $backendUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Architecture:" -ForegroundColor Yellow
Write-Host "  Frontend (CloudFront) → Private S3" -ForegroundColor White
Write-Host "  API Calls → API Gateway (HTTPS) → Private Backend (HTTP)" -ForegroundColor White
Write-Host ""
Write-Host "Next: Run 5-build-deploy.ps1 to deploy application" -ForegroundColor Yellow
Write-Host ""

