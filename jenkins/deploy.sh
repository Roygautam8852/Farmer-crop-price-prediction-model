#!/bin/bash
# Deploy Script for Crop Predictor
# Stops old containers, builds new ones, and deploys

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              Crop Predictor - Full Deployment                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${BLUE}[*] Checking Docker daemon...${NC}"
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}[✗] Docker daemon is not running${NC}"
    exit 1
fi
echo -e "${GREEN}[✓] Docker is running${NC}"

# Navigate to project root
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)
echo -e "${BLUE}[*] Project root: $PROJECT_ROOT${NC}"

# Stop existing containers
echo -e "\n${BLUE}[*] Stopping existing containers...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true
sleep 2
echo -e "${GREEN}[✓] Containers stopped${NC}"

# Build images
echo -e "\n${BLUE}[*] Building Docker images...${NC}"
echo "  → Backend..."
docker build -t crop-predictor-backend:latest ./backend
echo -e "${GREEN}  ✓ Backend built${NC}"

echo "  → Frontend..."
docker build -t crop-predictor-frontend:latest ./frontend
echo -e "${GREEN}  ✓ Frontend built${NC}"

# Start all services
echo -e "\n${BLUE}[*] Starting all services...${NC}"
docker-compose up -d
echo -e "${GREEN}[✓] Containers started${NC}"

# Wait for services
echo -e "\n${BLUE}[*] Waiting for services to become healthy...${NC}"
sleep 5

# Show status
echo -e "\n${BLUE}[*] Container Status:${NC}"
docker-compose ps

# Health checks
echo -e "\n${BLUE}[*] Running health checks...${NC}"

# Check Frontend
for i in {1..15}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}[✓] Frontend is ready (http://localhost:3000)${NC}"
        break
    fi
    if [ $i -eq 15 ]; then
        echo -e "${RED}[✗] Frontend failed to start${NC}"
    else
        echo "  → Attempt $i/15..."
        sleep 2
    fi
done

# Check Backend
for i in {1..15}; do
    if curl -s http://localhost:5000 > /dev/null 2>&1; then
        echo -e "${GREEN}[✓] Backend is ready (http://localhost:5000)${NC}"
        break
    fi
    if [ $i -eq 15 ]; then
        echo -e "${RED}[✗] Backend failed to start${NC}"
    else
        echo "  → Attempt $i/15..."
        sleep 2
    fi
done

# Check MongoDB
for i in {1..15}; do
    if docker exec crop_mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo -e "${GREEN}[✓] MongoDB is ready${NC}"
        break
    fi
    if [ $i -eq 15 ]; then
        echo -e "${RED}[✗] MongoDB failed to start${NC}"
    else
        echo "  → Attempt $i/15..."
        sleep 2
    fi
done

# Check Jenkins
for i in {1..20}; do
    if curl -s http://localhost:8080/login > /dev/null 2>&1; then
        echo -e "${GREEN}[✓] Jenkins is ready (http://localhost:8080)${NC}"
        break
    fi
    if [ $i -eq 20 ]; then
        echo -e "${RED}[✗] Jenkins is starting (may need a moment)${NC}"
    else
        echo "  → Attempt $i/20..."
        sleep 2
    fi
done

# Show logs
echo -e "\n${BLUE}[*] Recent logs:${NC}"
docker-compose logs --tail=10

echo -e "\n${BLUE}═════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}[✓] Deployment Complete!${NC}"
echo -e "${BLUE}═════════════════════════════════════════════════════════════════${NC}"

echo ""
echo "🌐 ACCESS YOUR SERVICES:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   MongoDB:   mongodb://localhost:27017"
echo "   Jenkins:   http://localhost:8080"
echo ""
echo "📊 USEFUL COMMANDS:"
echo "   View logs:      docker-compose logs -f [service]"
echo "   Stop services:  docker-compose down"
echo "   Restart:        docker-compose restart"
echo "   Clean rebuild:  bash jenkins/deploy.sh"
echo ""
