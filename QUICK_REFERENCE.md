#!/usr/bin/env bash
# QUICK REFERENCE - Copy & Paste These Commands

# ═══════════════════════════════════════════════════════════════
# 🌐 OPEN YOUR SERVICES IN BROWSER
# ═══════════════════════════════════════════════════════════════

echo "🌐 OPEN THESE URLS IN YOUR BROWSER:"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo "Jenkins:   http://localhost:8080"
echo "MongoDB:   mongodb://localhost:27017"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🔑 JENKINS CREDENTIALS
# ═══════════════════════════════════════════════════════════════

echo "🔑 JENKINS LOGIN:"
echo "Username: admin"
echo "Password: 6ec800b5fd3c4b178ad02acced0f9025"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📋 USEFUL DOCKER COMMANDS
# ═══════════════════════════════════════════════════════════════

echo "📋 DOCKER COMMANDS:"
echo ""
echo "# View all containers"
echo "docker-compose ps"
echo ""
echo "# View logs"
echo "docker-compose logs -f                 # All services"
echo "docker-compose logs -f backend         # Backend only"
echo "docker-compose logs -f frontend        # Frontend only"
echo "docker-compose logs -f jenkins         # Jenkins only"
echo ""
echo "# Restart"
echo "docker-compose restart"
echo ""
echo "# Stop everything"
echo "docker-compose down"
echo ""
echo "# Full rebuild"
echo "docker-compose down && docker-compose up -d --build"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🚀 GITHUB INTEGRATION SETUP
# ═══════════════════════════════════════════════════════════════

echo "🚀 GITHUB INTEGRATION (RECOMMENDED):"
echo ""
echo "1️⃣  Download & install ngrok:"
echo "   https://ngrok.com/download"
echo ""
echo "2️⃣  Create ngrok account and get auth token"
echo ""
echo "3️⃣  Authenticate ngrok:"
echo "   ngrok config add-authtoken YOUR_AUTH_TOKEN"
echo ""
echo "4️⃣  Start ngrok tunnel:"
echo "   ngrok http 8080"
echo ""
echo "5️⃣  Copy the HTTPS URL (e.g., https://xxxxx-xxxx.ngrok.io)"
echo ""
echo "6️⃣  Go to GitHub repo → Settings → Webhooks → Add webhook:"
echo "   Payload URL: https://xxxxx-xxxx.ngrok.io/github-webhook/"
echo "   Content type: application/json"
echo "   Events: Push events"
echo "   Active: ✓"
echo ""
echo "7️⃣  Create Jenkins job:"
echo "   Jenkins → New Item → crop-predictor-pipeline"
echo "   Type: Pipeline"
echo "   Definition: Pipeline script from SCM"
echo "   SCM: Git"
echo "   Repo: https://github.com/YOUR_USERNAME/farmer-crop-predictor.git"
echo "   Branch: */main"
echo "   Script Path: jenkins/Jenkinsfile"
echo "   Build Triggers: Check 'GitHub hook trigger for GITscm polling'"
echo ""
echo "8️⃣  Test by pushing code:"
echo "   git commit -m 'Test'"
echo "   git push origin main"
echo ""
echo "9️⃣  Watch Jenkins build automatically! 🎉"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🌐 PUBLIC ACCESS (LIVE LINK)
# ═══════════════════════════════════════════════════════════════

echo "🌐 MAKE IT LIVE (Public Internet Access):"
echo ""
echo "Option 1: ngrok Tunnel (Easiest)"
echo "   ngrok http 8080  # Jenkins"
echo "   ngrok http 3000  # Frontend (in another terminal)"
echo "   ngrok http 5000  # Backend (in another terminal)"
echo ""
echo "Option 2: Cloudflare Tunnel (More Stable)"
echo "   cloudflared tunnel --url http://localhost:8080"
echo ""
echo "Option 3: Production Deploy"
echo "   - AWS EC2"
echo "   - DigitalOcean"
echo "   - Railway.app"
echo "   - Render.com"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📁 IMPORTANT FILES
# ═══════════════════════════════════════════════════════════════

echo "📁 IMPORTANT FILES:"
echo ""
echo "   docker-compose.yml          - Service definitions"
echo "   jenkins/Jenkinsfile         - CI/CD pipeline"
echo "   jenkins/deploy.sh           - Manual deployment"
echo "   JENKINS_SETUP_GUIDE.md      - Complete setup guide"
echo "   GITHUB_WEBHOOK_SETUP.md     - Webhook configuration"
echo "   DEPLOYMENT_COMPLETE.md      - Deployment status"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🆘 TROUBLESHOOTING
# ═══════════════════════════════════════════════════════════════

echo "🆘 TROUBLESHOOTING:"
echo ""
echo "Services won't start:"
echo "  docker-compose down && docker-compose up -d --build"
echo ""
echo "Port already in use:"
echo "  # Windows"
echo "  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess"
echo "  # Or edit docker-compose.yml to use different port"
echo ""
echo "Check service health:"
echo "  docker-compose ps"
echo "  docker-compose logs"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "✅ ALL SYSTEMS READY! 🚀"
echo "═══════════════════════════════════════════════════════════════"
