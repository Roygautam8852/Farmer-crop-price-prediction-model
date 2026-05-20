#!/bin/bash
# Quick start script for Crop Predictor with Jenkins CI/CD

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Crop Predictor - Quick Start Script                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Docker is running
echo -e "${BLUE}[1/5] Checking Docker...${NC}"
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}[✗] Docker is not running. Please start Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}[✓] Docker is running${NC}"

# Navigate to project root
cd "$(dirname "$0")" || exit
PROJECT_ROOT=$(pwd)

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}[✗] docker-compose.yml not found${NC}"
    exit 1
fi

# Start services
echo -e "\n${BLUE}[2/5] Starting Docker Compose services...${NC}"
docker-compose down 2>/dev/null || true
docker-compose up -d
echo -e "${GREEN}[✓] Services started${NC}"

# Wait for services
echo -e "\n${BLUE}[3/5] Waiting for services (30 seconds)...${NC}"
sleep 15

# Get Jenkins password
echo -e "\n${BLUE}[4/5] Retrieving Jenkins credentials...${NC}"
JENKINS_PASS=$(docker exec crop_jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "")

# Show access information
echo -e "\n${BLUE}[5/5] Services Ready!${NC}"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ All Services Started Successfully!${NC}"
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "🌐 ACCESS YOUR SERVICES:"
echo "   Frontend:   ${GREEN}http://localhost:3000${NC}"
echo "   Backend:    ${GREEN}http://localhost:5000${NC}"
echo "   MongoDB:    ${GREEN}mongodb://localhost:27017${NC}"
echo "   Jenkins:    ${GREEN}http://localhost:8080${NC}"
echo ""
echo "🔑 JENKINS LOGIN CREDENTIALS:"
echo "   Username: ${GREEN}admin${NC}"
if [ -n "$JENKINS_PASS" ]; then
    echo "   Password: ${GREEN}$JENKINS_PASS${NC}"
    echo ""
    echo "   ⚠️  Save this password in a secure place!"
else
    echo "   Password: (check with: docker exec crop_jenkins cat /var/jenkins_home/secrets/initialAdminPassword)"
fi
echo ""
echo "📚 NEXT STEPS:"
echo "   1. Open http://localhost:8080 in your browser"
echo "   2. Login with admin credentials"
echo "   3. Install recommended plugins"
echo "   4. Read JENKINS_SETUP_GUIDE.md for GitHub integration"
echo ""
echo "🚀 FOR GITHUB INTEGRATION:"
echo "   - Run: bash jenkins/setup-ngrok.sh (for public access)"
echo "   - OR Read: GITHUB_WEBHOOK_SETUP.md"
echo ""
echo "📊 DOCKER COMMANDS:"
echo "   View logs:        docker-compose logs -f [service]"
echo "   Stop all:         docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Clean deploy:     bash jenkins/deploy.sh"
echo ""
docker-compose ps
echo ""
echo "═════════════════════════════════════════════════════════════════"
