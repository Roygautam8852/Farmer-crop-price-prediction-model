#!/bin/bash
# Jenkins Setup Script for Crop Predictor CI/CD Pipeline
# This script automates initial Jenkins configuration

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Jenkins Setup for Crop Predictor                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Jenkins container is running
echo -e "${BLUE}[*] Checking Jenkins container status...${NC}"
if ! docker ps | grep -q crop_jenkins; then
    echo -e "${YELLOW}[!] Jenkins container not running. Please start docker-compose first:${NC}"
    echo "    docker-compose up -d jenkins"
    exit 1
fi

echo -e "${GREEN}[✓] Jenkins is running${NC}"

# Get Jenkins initial admin password
echo -e "\n${BLUE}[*] Retrieving Jenkins initial admin password...${NC}"
JENKINS_PASSWORD=$(docker exec crop_jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "")

if [ -z "$JENKINS_PASSWORD" ]; then
    echo -e "${YELLOW}[!] Could not retrieve Jenkins password automatically${NC}"
    echo "    Run this command to get it:"
    echo "    docker exec crop_jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
else
    echo -e "${GREEN}[✓] Jenkins Initial Admin Password:${NC}"
    echo -e "${YELLOW}$JENKINS_PASSWORD${NC}"
fi

echo -e "\n${BLUE}[*] Jenkins Setup Instructions:${NC}"
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  OPEN JENKINS IN BROWSER:"
echo "    http://localhost:8080"
echo ""
echo "2️⃣  LOGIN with admin credentials:"
echo "    Username: admin"
echo "    Password: (copy from above)"
echo ""
echo "3️⃣  INSTALL RECOMMENDED PLUGINS:"
echo "    - Select 'Install suggested plugins'"
echo "    - Wait for installation to complete"
echo ""
echo "4️⃣  INSTALL ADDITIONAL PLUGINS:"
echo "    Manage Jenkins → Manage Plugins → Available"
echo "    Search and install:"
echo "    ✓ GitHub plugin"
echo "    ✓ Docker plugin"
echo "    ✓ Docker Pipeline"
echo "    ✓ Git plugin (usually pre-installed)"
echo ""
echo "5️⃣  CREATE NEW PIPELINE JOB:"
echo "    New Item → Enter name: 'crop-predictor-pipeline'"
echo "    Select: Pipeline → OK"
echo ""
echo "6️⃣  CONFIGURE PIPELINE:"
echo "    - Definition: Pipeline script from SCM"
echo "    - SCM: Git"
echo "    - Repository URL: https://github.com/YOUR_USERNAME/crop-predictor.git"
echo "    - Credentials: (if private repo, add GitHub credentials)"
echo "    - Branch: */main (or your branch)"
echo "    - Script Path: jenkins/Jenkinsfile"
echo ""
echo "7️⃣  SETUP GITHUB WEBHOOK (for automatic builds):"
echo "    A. In GitHub Repository Settings:"
echo "       - Go to Settings → Webhooks → Add webhook"
echo "       - Payload URL: http://YOUR_PUBLIC_IP:8080/github-webhook/"
echo "       - Content type: application/json"
echo "       - Events: Push events"
echo "       - Active: ✓"
echo ""
echo "    B. In Jenkins (alternative method):"
echo "       - Job → Configure → Build Triggers"
echo "       - Check: 'GitHub hook trigger for GITscm polling'"
echo ""
echo "8️⃣  SET GITHUB PAT (Personal Access Token) in Jenkins:"
echo "    Jenkins → Manage Jenkins → Manage Credentials"
echo "    - Add Credentials → Secret text"
echo "    - Scope: Global"
echo "    - Secret: Your GitHub PAT"
echo "    - ID: github-pat"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}[✓] Setup instructions displayed${NC}"
echo ""
echo "Next Steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Follow the setup wizard"
echo "3. Install plugins as listed above"
echo "4. Create and configure the pipeline job"
echo ""
