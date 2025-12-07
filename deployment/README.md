# Smart Adhat - Deployment Scripts

## Overview
This folder contains organized deployment scripts for both AWS cloud deployment and local Docker deployment.

## Deployment Options

### Option 1: AWS Cloud Deployment (Secure, Scalable)
- **Cost**: ~$8-12/month
- **Setup Time**: 20-30 minutes (one-time)
- **Best For**: Production, public access
- **Features**: HTTPS, CDN, Auto-scaling, Private backend

### Option 2: Docker Deployment (Local/Self-Hosted)
- **Cost**: $0 (uses your own hardware)
- **Setup Time**: 5 minutes
- **Best For**: Development, testing, private networks
- **Features**: Easy setup, portable, reproducible

---

## Quick Start

### AWS Cloud Deployment
```powershell
cd deployment

# One-time setup
.\1-setup-s3.ps1
.\2-setup-cloudfront.ps1
.\3-setup-backend.ps1
.\4-setup-api-gateway.ps1

# Deploy application
.\5-build-deploy.ps1
```

### Docker Deployment (Local)
```powershell
cd deployment
.\deploy-docker.ps1
```

---

## AWS Deployment - Detailed Guide
1. **1-setup-s3.ps1** - Creates private S3 bucket for frontend
2. **2-setup-cloudfront.ps1** - Creates CloudFront distribution with OAC
3. **3-setup-backend.ps1** - Deploys backend to Elastic Beanstalk
4. **4-setup-api-gateway.ps1** - Creates API Gateway proxy

#### Recurring Tasks (Run when updating application)
5. **5-build-deploy.ps1** - Build & deploy (both frontend and backend)
   - **5a-deploy-backend.ps1** - Deploy backend only
   - **5b-deploy-frontend.ps1** - Deploy frontend only

### Cleanup
- **cleanup.ps1** - Deletes ALL AWS resources

### Docker Deployment
- **deploy-docker.ps1** - Deploy using Docker Compose (local/self-hosted)

---

## AWS Deployment - Detailed Guide

### Script Execution Order

#### One-Time Setup (Run once)
1. **1-setup-s3.ps1** - Creates private S3 bucket for frontend
2. **2-setup-cloudfront.ps1** - Creates CloudFront distribution with OAC
3. **3-setup-backend.ps1** - Deploys backend to Elastic Beanstalk
4. **4-setup-api-gateway.ps1** - Creates API Gateway proxy

#### Recurring Tasks (Run when updating application)
```powershell
cd deployment

# Update both frontend and backend
.\5-build-deploy.ps1

# Update only frontend
.\5-build-deploy.ps1 -SkipBackend

# Update only backend
.\5-build-deploy.ps1 -SkipFrontend
```

### Delete Everything
```powershell
cd deployment
.\cleanup.ps1
```

---

## Architecture

```
Users (HTTPS)
    ↓
CloudFront (HTTPS) → Private S3 (OAC) → Frontend Files
    ↓
API Gateway (HTTPS) → Private Backend (HTTP) → Elastic Beanstalk (Spot Instance)
```

### Security
- ✅ S3: Private (CloudFront OAC only)
- ✅ Backend: Internal access only (API Gateway proxy)
- ✅ All public endpoints use HTTPS
- ✅ No direct public access to backend
- ✅ Spot instance for cost optimization

---

## Configuration

All configuration is stored in `../config/` folder:
- `bucket-name.txt` - S3 bucket name
- `cloudfront-id.txt` - CloudFront distribution ID
- `cloudfront-domain.txt` - CloudFront domain name
- `api-gateway-id.txt` - API Gateway ID
- `api-gateway-url.txt` - API Gateway URL
- `backend-url.txt` - Backend URL
- `oac-id.txt` - Origin Access Control ID

---

## Cost Estimate

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| EC2 Spot Instance (Backend) | **$2.50-3.50** | t3.micro spot (67% savings vs on-demand) |
| S3 Storage | ~$0.50 | Private bucket |
| CloudFront | **FREE** | 12 months: 1TB + 10M requests |
| API Gateway | ~$3.50 per million requests | Pay-per-request |
| **Total** | **$6-8/month** | With free tiers |
| **After Free Tier** | **$8-12/month** | CloudFront ~$1-2, API Gateway varies |

**Cost Savings:**
- Using **Spot Instances** saves 60-90% on compute costs
- On-demand t3.micro: ~$7.50/month
- Spot t3.micro: ~$2.50/month ✅ **67% savings**

---

## Script Details

### 1-setup-s3.ps1
Creates private S3 bucket with:
- Public access blocked
- Regional bucket (us-east-1)
- Configuration saved for other scripts

### 2-setup-cloudfront.ps1
Creates CloudFront distribution with:
- Origin Access Control (OAC) for private S3
- HTTPS redirect
- Custom error pages for SPA routing
- S3 bucket policy for CloudFront access

### 3-setup-backend.ps1
Creates Elastic Beanstalk environment (infrastructure setup):
- Initializes EB CLI
- Creates .ebextensions configuration for spot instance
- Creates single-instance environment with **spot instance**
- Configures for internal-only access (via API Gateway)
- Spot instance provides 60-90% cost savings
- Max spot price: $0.0104/hour (~$2.50/month)
- **Note**: Builds backend once to create environment, but actual deployment happens in Step 5

### Important: Step 3 vs Step 5
- **Step 3**: Sets up AWS infrastructure (EB environment creation) - Run once
- **Step 5**: Builds and deploys your application code - Run for every update

### 4-setup-api-gateway.ps1
Creates API Gateway:
- REST API with proxy integration
- Routes all requests to backend
- HTTPS endpoint
- Production stage deployment

### 5-build-deploy.ps1
Builds and deploys application (recurring task):
- **Backend**: Builds Spring Boot application (Maven)
- **Backend**: Deploys to Elastic Beanstalk
- **Backend**: Configures CORS
- **Frontend**: Updates environment configuration with API Gateway URL
- **Frontend**: Builds Angular application (npm)
- **Frontend**: Uploads to S3
- **CloudFront**: Invalidates cache

**This is the main script you run for updates!**

**Parameters:**
- `-SkipBackend` - Skip backend deployment
- `-SkipFrontend` - Skip frontend deployment

### 5a-deploy-backend.ps1
Deploys backend only:
- Builds Spring Boot application (Maven)
- Deploys to Elastic Beanstalk
- Configures CORS with CloudFront and API Gateway URLs

**Use this when you only changed backend code**

### 5b-deploy-frontend.ps1
Deploys frontend only:
- Updates environment configuration
- Builds Angular application (npm)
- Uploads to S3
- Invalidates CloudFront cache

**Use this when you only changed frontend code**

### cleanup.ps1
Deletes all AWS resources:
- CloudFront distribution (disabled first)
- S3 bucket and files
- API Gateway
- Elastic Beanstalk environment
- Origin Access Control
- Configuration files

**Parameters:**
- `-Force` - Skip confirmation prompt

---

## Prerequisites

### Required Software
- **AWS CLI** - Configured with credentials
- **Node.js & npm** - For frontend build
- **Java 21 & Maven** - For backend build
- **EB CLI** - For Elastic Beanstalk (optional)
- **PowerShell** - Windows PowerShell 5.1 or later

### AWS Permissions Required
- S3: Full access
- CloudFront: Full access
- API Gateway: Full access
- Elastic Beanstalk: Full access
- IAM: Read access (for OAC)

---

## Troubleshooting

### CloudFront shows 403
- Wait 10-15 minutes for distribution to deploy
- Check S3 bucket policy is applied
- Verify OAC is configured

### API Gateway timeout
- Check backend is running: `eb status`
- Verify backend URL in config
- Check CloudWatch logs

### Build fails
- Frontend: Run `npm install` in frontend folder
- Backend: Check Java version (requires Java 21)

### Cleanup stuck
- CloudFront takes time to disable
- Delete manually from AWS Console
- Check EB environment is terminated

---

## Support

### View Logs
```powershell
# Backend logs
cd backend
eb logs

# API Gateway logs
aws logs tail /aws/apigateway/smartadhat-api-proxy --follow

# CloudFront status
aws cloudfront get-distribution --id <DISTRIBUTION-ID>
```

### Check Status
```powershell
# Backend
cd backend
eb status

# CloudFront
aws cloudfront list-distributions --query "DistributionList.Items[].{Id:Id,Status:Status}"

# API Gateway
aws apigateway get-rest-apis --query "items[].{name:name,id:id}"
```

---

## Notes

- First deployment takes 15-20 minutes (CloudFront + EB setup)
- Subsequent deployments take 3-5 minutes
- CloudFront cache invalidation takes 2-3 minutes
- Always run scripts from the `deployment` folder
- Configuration is automatically saved and reused

---

## Docker Deployment Guide

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Ports 80 and 8080 available

### Quick Deploy
```powershell
cd deployment
.\deploy-docker.ps1
```

### Options
1. **Development Mode** (Default)
   - H2 in-memory database
   - Data resets on restart
   - Fast startup
   - Good for testing

2. **Production Mode**
   - PostgreSQL database
   - Persistent data
   - Production-ready
   - See `docker-compose.prod.yml`

### Access Application
- **Frontend**: http://localhost
- **Backend**: http://localhost:8080/api

### Management Commands
```powershell
# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Restart
docker-compose restart

# View status
docker-compose ps

# Remove everything (including volumes)
docker-compose down -v
```

---

## Comparison: AWS vs Docker

| Feature | AWS Cloud | Docker Local |
|---------|-----------|--------------|
| **Cost** | $8-12/month | Free (your hardware) |
| **Setup Time** | 20-30 minutes | 5 minutes |
| **Public Access** | ✅ Yes (HTTPS) | ❌ No (localhost only) |
| **Scalability** | ✅ Auto-scaling | ❌ Single server |
| **Security** | ✅ Private backend, OAC | ⚠️ Basic |
| **HTTPS** | ✅ Built-in (CloudFront) | ❌ Need reverse proxy |
| **CDN** | ✅ Global (CloudFront) | ❌ No CDN |
| **Database** | ⚠️ H2 in-memory | ✅ PostgreSQL option |
| **Updates** | Automated scripts | Docker rebuild |
| **Monitoring** | CloudWatch | Docker logs |
| **Best For** | Production, public apps | Development, testing |

---

## When to Use Which?

### Use AWS Cloud When:
- ✅ You need public internet access
- ✅ You want HTTPS/SSL
- ✅ You need global CDN
- ✅ You want scalability
- ✅ You need professional hosting
- ✅ Budget allows $8-12/month

### Use Docker Local When:
- ✅ Development and testing
- ✅ Private network only
- ✅ Learning/experimentation
- ✅ No budget for hosting
- ✅ Need quick setup
- ✅ Want full control

---

## AWS Console Links

- **S3**: https://console.aws.amazon.com/s3/
- **CloudFront**: https://console.aws.amazon.com/cloudfront/
- **API Gateway**: https://console.aws.amazon.com/apigateway/
- **Elastic Beanstalk**: https://console.aws.amazon.com/elasticbeanstalk/
- **CloudWatch**: https://console.aws.amazon.com/cloudwatch/

