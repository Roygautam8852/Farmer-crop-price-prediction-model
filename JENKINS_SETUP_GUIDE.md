# Crop Predictor - Jenkins CI/CD Setup Guide

Complete guide to set up Jenkins, GitHub integration, Docker deployment, and live deployment.

## 📋 Quick Start (5 minutes)

### Step 1: Start All Services
```bash
cd farmer-crop-predictor
docker-compose up -d
```

Wait 30 seconds for services to start.

### Step 2: Access Your Services
```
Frontend:   http://localhost:3000
Backend:    http://localhost:5000
Jenkins:    http://localhost:8080
MongoDB:    mongodb://localhost:27017
```

### Step 3: Get Jenkins Initial Password
```bash
docker exec crop_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 4: Complete Jenkins Setup
1. Open http://localhost:8080
2. Login with `admin` + password from above
3. Install suggested plugins
4. Install additional plugins: GitHub, Docker, Docker Pipeline

---

## 🔄 GitHub Integration (10 minutes)

### Option A: Using ngrok (For automatic builds on push)

#### 1. Download and install ngrok
```bash
# macOS
brew install ngrok

# Linux
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz -C /usr/local/bin

# Windows: Download from https://ngrok.com/download
```

#### 2. Sign up and authenticate
```bash
# Visit https://ngrok.com and create account
# Get your auth token from https://dashboard.ngrok.com/auth

ngrok config add-authtoken YOUR_AUTH_TOKEN
ngrok http 8080
```

You'll see output like:
```
Session Status                online
Account                       john@example.com
Version                       3.0.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://xxxxx-xxxx-ngrok.io -> http://localhost:8080
```

**Copy the HTTPS URL** (e.g., https://xxxxx-xxxx-ngrok.io)

#### 3. Create GitHub Webhook
1. Go to your GitHub repository
2. Settings → Webhooks → Add webhook
3. Fill in:
   - **Payload URL:** `https://xxxxx-xxxx-ngrok.io/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** Push events
   - **Active:** ✓

4. Click "Add webhook"

#### 4. Create Jenkins Pipeline Job
1. Open Jenkins (http://localhost:8080)
2. New Item → Enter name: `crop-predictor-pipeline`
3. Select: Pipeline → OK
4. Configure:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** Your GitHub repo URL
   - **Credentials:** (if private, add GitHub credentials)
   - **Branches:** `*/main` (or your branch)
   - **Script Path:** `jenkins/Jenkinsfile`
5. **Build Triggers:** Check "GitHub hook trigger for GITscm polling"
6. Save

#### 5. Test the pipeline
Make a test commit:
```bash
echo "Test webhook" >> README.md
git add README.md
git commit -m "Test webhook trigger"
git push origin main
```

Watch Jenkins automatically build!

### Option B: Manual Jenkins Poll (No public URL needed)

If you don't want to expose Jenkins publicly:

1. Jenkins Job → Configure
2. Build Triggers → Check "Poll SCM"
3. Schedule: `H/5 * * * *` (polls every 5 minutes)
4. Save

---

## 🚀 Deployment

### Automatic (via Jenkins)
Once GitHub webhook is set up, every push to your main branch triggers:
1. Code checkout
2. Docker build (backend & frontend)
3. Docker-compose deployment
4. Health checks
5. Notification

### Manual Deployment
```bash
bash jenkins/deploy.sh
```

This will:
1. Stop existing containers
2. Build fresh Docker images
3. Start all services
4. Run health checks
5. Display access URLs

---

## 🌐 Making It Live (Ngrok)

Your deployment is already accessible via ngrok tunnel:

```
Frontend Live Link: https://xxxxx-xxxx-ngrok.io (if you run ngrok http 3000)
```

To expose different ports:
```bash
# Terminal 1: Expose Jenkins
ngrok http 8080

# Terminal 2: Expose Frontend
ngrok http 3000

# Terminal 3: Expose Backend API
ngrok http 5000
```

Keep ngrok running to maintain the tunnel.

---

## 📊 Project Structure

```
farmer-crop-predictor/
├── backend/              # Node.js Express API + Python ML
│   ├── Dockerfile       # Backend container
│   ├── app.js
│   ├── package.json
│   ├── data/           # Training data
│   └── model/          # ML models
│
├── frontend/           # React app
│   ├── Dockerfile     # Frontend container
│   ├── src/
│   └── public/
│
├── jenkins/           # Jenkins CI/CD
│   ├── Jenkinsfile    # Pipeline configuration
│   ├── deploy.sh      # Deployment script
│   ├── setup-jenkins.sh
│   └── setup-ngrok.sh
│
└── docker-compose.yml # All services definition
```

---

## 🐳 Docker Services

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 3000 | React web app |
| Backend | 5000 | API server |
| MongoDB | 27017 | Database |
| Jenkins | 8080 | CI/CD pipeline |

---

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f                 # All services
docker-compose logs -f backend        # Specific service

# Restart services
docker-compose restart
docker-compose restart backend

# Stop all
docker-compose down

# View containers
docker-compose ps

# Execute in container
docker exec crop_backend bash
docker exec crop_jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Check service health
curl http://localhost:3000          # Frontend
curl http://localhost:5000          # Backend
curl http://localhost:8080/login    # Jenkins
```

---

## 🛠️ Troubleshooting

### Jenkins not accessible
```bash
# Check if running
docker-compose ps | grep jenkins

# View logs
docker-compose logs jenkins

# Get initial password
docker exec crop_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### GitHub webhook not triggering
1. Check ngrok is still running
2. Verify webhook delivery in GitHub (Settings → Webhooks → Recent Deliveries)
3. Check Jenkins logs for GitHub events
4. Verify plugin is installed (GitHub plugin)

### Build fails
1. Check logs: `docker-compose logs -f`
2. Verify Docker can access directories
3. Ensure backend/frontend Dockerfiles are valid

### Services not starting
```bash
# Clean and restart
docker-compose down
docker-compose up -d --build
```

---

## 📝 Advanced Configuration

### Using GitHub Personal Access Token
1. Create PAT in GitHub: Settings → Developer settings → Personal access tokens
2. In Jenkins: Manage → Credentials → Add GitHub credential
3. Use in pipeline for higher rate limits

### Environment Variables
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
MONGO_URI=mongodb://mongo:27017/crop_predictor
NODE_ENV=production
```

### Custom Domain
Replace ngrok with:
- **Cloudflare Tunnel** (more stable)
- **AWS Route 53** + EC2 (production)
- **Firebase Hosting** (frontend only)

---

## 🎯 Next Steps

1. ✅ Start Docker Compose
2. ✅ Set up Jenkins & install plugins
3. ✅ Set up ngrok for public access
4. ✅ Configure GitHub webhook
5. ✅ Create Jenkins pipeline job
6. ✅ Test with a commit
7. ✅ Access live deployment

---

## 📚 Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [GitHub Webhook Docs](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [ngrok Documentation](https://ngrok.com/docs)

---

## 💬 Support

For issues:
1. Check logs: `docker-compose logs [service]`
2. Read troubleshooting section above
3. Check file permissions
4. Verify Docker is installed and running

---

**Happy deploying! 🚀**
