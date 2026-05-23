# 🚀 TERMINAL & DOCKER COMMANDS

## **PART 1: RUN THE PROJECT**

### **Quick Start (All in One Terminal)**

```bash
# 1. Navigate to project
cd C:\Users\gauta\Farmer-crop-price-prediction-model

# 2. Start all Docker services
docker-compose up -d

# 3. Done! Services running on:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000
# MongoDB:   localhost:27017
# Jenkins:   http://localhost:8080
```

### **Step-by-Step (Separate Terminals)**

**Terminal 1: Start Docker Services**
```bash
cd C:\Users\gauta\Farmer-crop-price-prediction-model
docker-compose up -d
```

**Terminal 2: Start Webhook Server** (For GitHub auto-deploy)
```bash
cd C:\Users\gauta\Farmer-crop-price-prediction-model\webhook
npm install
npm start
```

**Terminal 3: Start ngrok** (For public HTTPS URL)
```bash
ngrok config add-authtoken 3Dyo2cABzsC92zlUetFD6MRSttk_6UU9ea1U7vuQj897ZvGgt
ngrok http 3001
```

---

## **PART 2: GET HTTPS LINK (ngrok)**

### **What is ngrok?**
ngrok creates a **public HTTPS URL** for your local services so GitHub and internet can reach them.

### **Step 1: Configure ngrok**
```bash
ngrok config add-authtoken 3Dyo2cABzsC92zlUetFD6MRSttk_6UU9ea1U7vuQj897ZvGgt
```

### **Step 2: Create HTTPS Tunnel**
```bash
# Create tunnel for webhook server (port 3001)
ngrok http 3001
```

### **Step 3: Get Your HTTPS Link**
The output will show:
```
Forwarding https://scorebook-escalator-chemicals.ngrok-free.dev -> http://localhost:3001
```

**Your HTTPS link is**: `https://scorebook-escalator-chemicals.ngrok-free.dev`

### **For Other Services**

**Frontend (port 3000):**
```bash
ngrok http 3000
```

**Backend API (port 5000):**
```bash
ngrok http 5000
```

**Jenkins (port 8080):**
```bash
ngrok http 8080
```

---

## **DOCKER COMMANDS REFERENCE**

### **Start Services**
```bash
# Start all services
docker-compose up -d

# Start and rebuild
docker-compose up -d --build

# Start with logs visible
docker-compose up
```

### **Stop Services**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove orphans
docker-compose down --remove-orphans
```

### **Check Status**
```bash
# List all containers
docker-compose ps

# Show detailed info
docker-compose ps -a

# Show only container names
docker-compose ps --format "table {{.Names}}\t{{.Status}}"
```

### **View Logs**
```bash
# View all logs
docker-compose logs

# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend

# View MongoDB logs
docker-compose logs mongo

# Follow logs in real-time
docker-compose logs -f

# Last 10 lines
docker-compose logs --tail 10
```

### **Enter Container**
```bash
# Enter backend container
docker exec -it crop_backend bash

# Enter frontend container
docker exec -it crop_frontend sh

# Enter MongoDB container
docker exec -it crop_mongo mongosh
```

### **Rebuild & Restart**
```bash
# Remove everything and restart
docker-compose down
docker-compose up -d --build

# Or one command
docker-compose down && docker-compose up -d --build

# Or with cleanup
docker-compose down --remove-orphans
docker-compose up -d --build
```

### **Clean Up**
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove everything unused
docker system prune -a

# Check disk usage
docker system df
```

---

## **NGROK COMMANDS REFERENCE**

### **Configure**
```bash
# Add authtoken
ngrok config add-authtoken YOUR_TOKEN

# View current config
ngrok config status
```

### **Create Tunnels**
```bash
# Single tunnel
ngrok http 3001

# Multiple tunnels (different terminal)
ngrok http 3000 3001 5000 8080

# With custom subdomain (requires paid plan)
ngrok http 3001 --subdomain=my-app
```

### **Advanced ngrok**
```bash
# With logging
ngrok http 3001 --log=stdout

# View ngrok dashboard
# Open: http://127.0.0.1:4040
```

---

## **COMPLETE WORKFLOW EXAMPLE**

### **Terminal 1: Start Docker**
```bash
cd C:\Users\gauta\Farmer-crop-price-prediction-model
docker-compose up -d

# Check status
docker-compose ps
```

### **Terminal 2: Start Webhook Server**
```bash
cd C:\Users\gauta\Farmer-crop-price-prediction-model\webhook
npm start
```

### **Terminal 3: Start ngrok Tunnel**
```bash
ngrok config add-authtoken 3Dyo2cABzsC92zlUetFD6MRSttk_6UU9ea1U7vuQj897ZvGgt
ngrok http 3001

# Copy the HTTPS URL from output:
# https://scorebook-escalator-chemicals.ngrok-free.dev
```

### **Then Update GitHub**
1. Go to: https://github.com/Roygautam8852/Farmer-crop-price-prediction-model/settings/hooks
2. Edit webhook
3. Update Payload URL to: `https://scorebook-escalator-chemicals.ngrok-free.dev/webhook/github`
4. Save

### **Test with Git Push**
```bash
cd C:\Users\gauta\Farmer-crop-price-prediction-model
git add .
git commit -m "Test auto-deploy"
git push origin main

# Watch ngrok terminal - you'll see webhook received!
```

---

## **QUICK REFERENCE CHEATSHEET**

| What | Command |
|------|---------|
| Start project | `docker-compose up -d` |
| Stop project | `docker-compose down` |
| Check status | `docker-compose ps` |
| View logs | `docker-compose logs -f` |
| Get HTTPS URL | `ngrok http 3001` |
| Configure ngrok | `ngrok config add-authtoken TOKEN` |
| Enter backend | `docker exec -it crop_backend bash` |
| Rebuild & restart | `docker-compose down && docker-compose up -d --build` |
| Clean everything | `docker system prune -a` |

---

## **PORTS REFERENCE**

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5000 | http://localhost:5000 |
| Webhook | 3001 | http://localhost:3001 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Jenkins | 8080 | http://localhost:8080 |
| ngrok Dashboard | 4040 | http://127.0.0.1:4040 |

---

**All commands are ready to copy-paste!** 🚀
