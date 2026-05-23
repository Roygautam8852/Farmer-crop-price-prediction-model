# 🐳 QUICK DOCKER SETUP - FOR YOUR FRIEND

Your friend wants to run this project on their Docker? **Here's the fastest way!**

---

## **OPTION 1: Simplest (Docker Only - No GitHub Auto-Deploy)**

Perfect if they just want to run the project locally.

### **Step 1: Install Docker Desktop**
- Download: https://www.docker.com/products/docker-desktop
- Install and restart computer
- Verify: Open PowerShell and run:
  ```bash
  docker --version
  docker-compose --version
  ```

### **Step 2: Clone & Run**
```bash
# Clone the project
git clone https://github.com/Roygautam8852/Farmer-crop-price-prediction-model.git
cd Farmer-crop-price-prediction-model

# Start all services with Docker
docker-compose up -d

# Wait 30 seconds, then check status
Start-Sleep -Seconds 30
docker-compose ps
```

### **Step 3: Done! Access the App**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017
- **Jenkins:** http://localhost:8080

✅ **That's it! Everything is running in Docker!**

---

## **OPTION 2: With GitHub Auto-Deploy (Full Setup)**

If they want automatic deployments when pushing to GitHub.

### **Prerequisites:**
- Docker Desktop ✅
- Git ✅
- Node.js 20+ (for webhook server)
- ngrok account (free)

### **Quick Setup:**
```bash
# 1. Clone
git clone https://github.com/Roygautam8852/Farmer-crop-price-prediction-model.git
cd Farmer-crop-price-prediction-model

# 2. Start Docker services
docker-compose up -d

# 3. In NEW terminal, start webhook server
cd webhook
npm install
npm start

# 4. In ANOTHER NEW terminal, start ngrok
ngrok config add-authtoken [NGROK_TOKEN]
ngrok http 3001

# 5. Copy ngrok URL and update GitHub webhook
# Payload URL: https://[ngrok-url]/webhook/github

# 6. Test: Push code to GitHub
git add .
git commit -m "Test"
git push origin main

# ✅ Auto-deployment happens!
```

---

## **🚀 WHAT GETS DEPLOYED IN DOCKER**

```
Container 1: crop_frontend (React app - port 3000)
Container 2: crop_backend (Node.js + Python ML - port 5000)
Container 3: crop_mongo (MongoDB database - port 27017)
Container 4: crop_jenkins (CI/CD - port 8080)

All connected via: crop_network (bridge network)
```

---

## **📊 CHECK IF EVERYTHING IS RUNNING**

```bash
# List all containers
docker-compose ps

# Should show 4 containers all "Up"

# View logs for backend
docker-compose logs backend

# View logs for frontend
docker-compose logs frontend

# View logs for MongoDB
docker-compose logs mongo
```

---

## **✅ QUICK CHECKLIST FOR YOUR FRIEND**

- [ ] Docker Desktop installed
- [ ] Git installed
- [ ] Cloned the repository
- [ ] Ran: `docker-compose up -d`
- [ ] Waited 30 seconds
- [ ] Checked: `docker-compose ps`
- [ ] Opened: http://localhost:3000 in browser
- [ ] Can see the app running ✅

---

## **⚠️ COMMON ISSUES**

### **"docker-compose command not found"**
```bash
# Make sure Docker Desktop is running
# Or use:
docker compose up -d  (newer Docker version)
```

### **"Port 3000 already in use"**
```bash
# Find what's using it
netstat -ano | findstr "3000"

# Stop the container using it
docker-compose down
docker-compose up -d
```

### **"Services won't start"**
```bash
# Check Docker Desktop is running
# Restart Docker:
docker-compose down
docker-compose up -d --build
```

### **"Can't access http://localhost:3000"**
```bash
# Wait 60 seconds for services to fully start
# Check logs:
docker-compose logs frontend

# Verify service is running:
docker-compose ps
```

---

## **🔄 DAILY USAGE FOR YOUR FRIEND**

**To start the project:**
```bash
docker-compose up -d
```

**To stop everything:**
```bash
docker-compose down
```

**To view logs in real-time:**
```bash
docker-compose logs -f
```

**To rebuild services:**
```bash
docker-compose down
docker-compose up -d --build
```

---

## **📁 WHERE EVERYTHING RUNS**

Everything runs **inside Docker containers**:
- Code is isolated
- Database is isolated
- Services are isolated
- Easy to tear down and restart
- No dependencies needed on their laptop (except Docker)

---

## **💡 WHAT THEIR FRIEND GETS**

✅ React frontend (http://localhost:3000)
✅ Node.js backend (http://localhost:5000)
✅ Python ML models (running in backend)
✅ MongoDB database (http://localhost:27017)
✅ Jenkins CI/CD (http://localhost:8080)

**Everything running in 4 Docker containers!**

---

## **🎯 NEXT STEPS FOR YOUR FRIEND**

1. **Just running the project?**
   - Use Option 1 (Docker only)
   - Takes 5 minutes

2. **Want GitHub auto-deploy too?**
   - Use Option 2
   - Takes 15 minutes
   - Follow FRIEND_SETUP_GUIDE.md (in project) for detailed steps

---

**Tell your friend: It's literally just `git clone` → `docker-compose up -d` → Done!** 🐳🚀
