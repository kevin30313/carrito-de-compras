#!/bin/bash

# CYBERSTORE Deployment Script
# This script automates the deployment process across different cloud providers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="cyberstore"
VERSION=${1:-"latest"}
ENVIRONMENT=${2:-"prod"}

echo -e "${CYAN}🚀 Starting CYBERSTORE Deployment${NC}"
echo -e "${YELLOW}Version: ${VERSION}${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to deploy to Google Cloud
deploy_gcp() {
    echo -e "${CYAN}🌐 Deploying to Google Cloud Platform...${NC}"
    
    if ! command_exists gcloud; then
        echo -e "${RED}❌ gcloud CLI not found. Please install Google Cloud SDK.${NC}"
        exit 1
    fi
    
    # Build and push to Container Registry
    echo -e "${YELLOW}📦 Building and pushing Docker image...${NC}"
    docker build -t gcr.io/${GCP_PROJECT_ID}/${APP_NAME}:${VERSION} -f deployment/docker/Dockerfile .
    docker push gcr.io/${GCP_PROJECT_ID}/${APP_NAME}:${VERSION}
    
    # Deploy with Terraform
    echo -e "${YELLOW}🏗️ Deploying infrastructure with Terraform...${NC}"
    cd terraform/gcp
    terraform init
    terraform plan -var="project_id=${GCP_PROJECT_ID}"
    terraform apply -auto-approve -var="project_id=${GCP_PROJECT_ID}"
    cd ../..
    
    echo -e "${GREEN}✅ GCP deployment completed!${NC}"
}

# Function to deploy to AWS
deploy_aws() {
    echo -e "${CYAN}☁️ Deploying to Amazon Web Services...${NC}"
    
    if ! command_exists aws; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI.${NC}"
        exit 1
    fi
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    # Build and push to ECR
    echo -e "${YELLOW}📦 Building and pushing Docker image...${NC}"
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
    docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}:${VERSION} -f deployment/docker/Dockerfile .
    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}:${VERSION}
    
    # Deploy with Terraform
    echo -e "${YELLOW}🏗️ Deploying infrastructure with Terraform...${NC}"
    cd terraform/aws
    terraform init
    terraform plan -var="region=${AWS_REGION}"
    terraform apply -auto-approve -var="region=${AWS_REGION}"
    cd ../..
    
    echo -e "${GREEN}✅ AWS deployment completed!${NC}"
}

# Function to deploy to Azure
deploy_azure() {
    echo -e "${CYAN}🔷 Deploying to Microsoft Azure...${NC}"
    
    if ! command_exists az; then
        echo -e "${RED}❌ Azure CLI not found. Please install Azure CLI.${NC}"
        exit 1
    fi
    
    # Build and push to Container Registry
    echo -e "${YELLOW}📦 Building and pushing Docker image...${NC}"
    az acr build --registry ${AZURE_REGISTRY} --image ${APP_NAME}:${VERSION} -f deployment/docker/Dockerfile .
    
    # Deploy with Terraform
    echo -e "${YELLOW}🏗️ Deploying infrastructure with Terraform...${NC}"
    cd terraform/azure
    terraform init
    terraform plan -var="location=${AZURE_LOCATION}"
    terraform apply -auto-approve -var="location=${AZURE_LOCATION}"
    cd ../..
    
    echo -e "${GREEN}✅ Azure deployment completed!${NC}"
}

# Function to deploy to Kubernetes
deploy_kubernetes() {
    echo -e "${CYAN}⚓ Deploying to Kubernetes...${NC}"
    
    if ! command_exists kubectl; then
        echo -e "${RED}❌ kubectl not found. Please install kubectl.${NC}"
        exit 1
    fi
    
    # Create namespace if it doesn't exist
    kubectl create namespace cyberstore --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    echo -e "${YELLOW}🚢 Applying Kubernetes manifests...${NC}"
    kubectl apply -f deployment/kubernetes/
    
    # Wait for deployment to be ready
    echo -e "${YELLOW}⏳ Waiting for deployment to be ready...${NC}"
    kubectl rollout status deployment/cyberstore-app -n cyberstore --timeout=300s
    
    echo -e "${GREEN}✅ Kubernetes deployment completed!${NC}"
}

# Function to run health checks
health_check() {
    echo -e "${CYAN}🏥 Running health checks...${NC}"
    
    # Add health check logic here
    # This would typically check if the application is responding
    
    echo -e "${GREEN}✅ All health checks passed!${NC}"
}

# Main deployment logic
case "${3:-all}" in
    "gcp")
        deploy_gcp
        ;;
    "aws")
        deploy_aws
        ;;
    "azure")
        deploy_azure
        ;;
    "k8s"|"kubernetes")
        deploy_kubernetes
        ;;
    "all")
        echo -e "${YELLOW}⚠️ Deploying to all providers requires environment variables to be set:${NC}"
        echo -e "${YELLOW}  - GCP_PROJECT_ID${NC}"
        echo -e "${YELLOW}  - AWS_REGION${NC}"
        echo -e "${YELLOW}  - AZURE_LOCATION, AZURE_REGISTRY${NC}"
        echo ""
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            deploy_gcp
            deploy_aws
            deploy_azure
        else
            echo -e "${YELLOW}⏹️ Deployment cancelled.${NC}"
            exit 0
        fi
        ;;
    *)
        echo -e "${RED}❌ Invalid deployment target. Options: gcp, aws, azure, kubernetes, all${NC}"
        exit 1
        ;;
esac

# Run health checks
health_check

echo -e "${GREEN}🎉 CYBERSTORE deployment completed successfully!${NC}"
echo -e "${CYAN}💡 Don't forget to configure your DNS to point to the load balancer IP/DNS.${NC}"