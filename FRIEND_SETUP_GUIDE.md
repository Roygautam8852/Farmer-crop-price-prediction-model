# 🚀 COMPLETE SETUP GUIDE FOR RUNNING PROJECT ON NEW LAPTOP

This guide helps your friend set up and run the Farmer Crop Price Prediction system with automatic GitHub deployment on their laptop.

---

## **STEP 1: Install Prerequisites** (15 minutes)

Your friend needs to install these tools:

### **Windows**

1. **Docker Desktop** (includes Docker & Docker Compose)
   - Download: https://www.docker.com/products/docker-desktop
   - Install it
   - Restart computer after installation
   - Verify: Open PowerShell and run:
     ```bash
     docker --version
     docker-compose --version
     ```

2. **Git**
   - Download: https://git-scm.com/download/win
   - Install with default options
   - Verify:
     ```bash
     git --version
     ```

3. **Node.js** (for webhook server)
   - Download: https://nodejs.org/
   - Install LTS version (20.x)
   - Verify:
     ```bash
     node --version
     npm --version
     ```

4. **ngrok** (for public URL)
   - Download: https://ngrok.com/download
   - Extract to a folder
   - Add to PATH:
     - Right-click "This PC" → Properties
     - Click "Advanced system settings"
     - Click "Environment Variables"
     - Under "Path", click "Edit"
     - Click "New" and paste your ngrok folder path
     - Click OK
   - Verify:
     ```bash
     ngrok --version
     ```

---

## **STEP 2: Clone the Repository** (5 minutes)

```bash
# Open PowerShell and run:
git clone https://github.com/Roygautam8852/Farmer-crop-price-prediction-model.git
cd Farmer-crop-price-prediction-model
```

---

## **STEP 3: Start Docker Services** (10 minutes)

```bash
# From the project root directory:
docker-compose up -d

# Wait 30 seconds for services to start
Start-Sleep -Seconds 30

# Verify all services are running:
docker-compose ps

# You should see 4 services (all should say "Up"):
# - crop_frontend
# - crop_backend
# - crop_mongo
# - crop_jenkins
```

---

## **STEP 4: Start Webhook Server** (5 minutes)

```bash
# In a NEW PowerShell terminal, navigate to webhook folder:
cd Farmer-crop-price-prediction-model\webhook

# Install dependencies:
npm install

# Start the webhook server:
npm start

# You should see:
# ✅ Server running on port 3001
# ✅ Webhook listening...
```

**Keep this terminal open!** The webhook server must keep running.

---

## **STEP 5: Set up ngrok Account** (5 minutes)

1. Go to: https://ngrok.com/
2. Click "Sign Up" (or "Sign In" if already has account)
3. Complete signup with email
4. Check email and verify account
5. Go to: https://dashboard.ngrok.com/get-started/your-authtoken
6. Copy the authtoken displayed

---

## **STEP 6: Configure ngrok** (5 minutes)

In a **NEW PowerShell terminal**, run:

```bash
# Configure ngrok with authtoken
ngrok config add-authtoken [PASTE_YOUR_TOKEN_HERE]

# Start ngrok tunnel
ngrok http 3001

# You'll see output like:
# Forwarding https://xxxx-xxxx-xxxx.ngrok-free.dev -> http://localhost:3001
# Copy this URL (you'll need it next)
```

**Keep this terminal open too!** ngrok must keep running.

---

## **STEP 7: Update GitHub Webhook** (5 minutes)

**IMPORTANT: Your friend must fork or own the GitHub repository!**

1. Go to: https://github.com/[YOUR_USERNAME]/Farmer-crop-price-prediction-model/settings/hooks
2. Click the existing webhook or create new one
3. Set these values:
   ```
   Payload URL: https://[YOUR_NGROK_URL]/webhook/github
   Content type: application/json
   Secret: MyWebhookSecret12345ABC!@#$
   Events: Push events (main branch)
   Active: ✅ Checked
   SSL verification: Enabled
   ```
4. Click "Update webhook" (or "Add webhook")

**Example Payload URL:**
```
https://scorebook-escalator-chemicals.ngrok-free.dev/webhook/github
```

---

## **STEP 8: Test Everything Works** (5 minutes)

In a **THIRD PowerShell terminal**, make a test commit:

```bash
cd Farmer-crop-price-prediction-model

# Make a test change
echo "Test deployment" >> README.md

# Commit and push
git add .
git commit -m "Test auto-deploy"
git push origin main
```

**Watch for these signs of success:**

1. **In the ngrok terminal:**
   ```
   200 POST /webhook/github
   ```

2. **In the webhook server terminal:**
   ```
   📨 Webhook received
   ✅ Deployment successful
   ```

3. **In the Docker services:**
   ```bash
   docker-compose ps
   # Backend should show "Up X seconds ago" (recently restarted)
   ```

---

## **STEP 9: Test the Running Application** (5 minutes)

Open a web browser and go to:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Jenkins:** http://localhost:8080
- **Webhook Health:** http://localhost:3001/health
- **MongoDB:** localhost:27017

All should respond successfully.

---

## **✅ FINAL SETUP CHECKLIST**

- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Node.js installed
- [ ] ngrok installed
- [ ] Repository cloned
- [ ] Docker services running (4/4 healthy)
- [ ] Webhook server running (port 3001)
- [ ] ngrok tunnel active (public URL)
- [ ] GitHub webhook configured
- [ ] Test commit pushed and deployment triggered
- [ ] All endpoints responding

---

## **🔄 HOW TO USE AFTER SETUP**

Once everything is set up, your friend just needs to:

1. **Make code changes locally**
2. **Push to GitHub main branch**
3. **Automatic deployment happens in seconds!**

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# That's it! Services redeploy automatically
```

---

## **⚠️ IMPORTANT: Keep These 3 Terminals Running**

Your friend must keep these 3 terminals open for automatic deployments to work:

```
Terminal 1: docker-compose up -d
Terminal 2: npm start (webhook server)
Terminal 3: ngrok http 3001
```

---

## **🛠️ TROUBLESHOOTING**

### **"Docker Desktop won't start"**
- Restart computer
- Make sure Windows is updated
- Try: Settings → Apps → Uninstall Docker → Reinstall

### **"ngrok says 'authtoken invalid'"**
- Log into ngrok dashboard again
- Copy the FULL token (don't include "ngrok_[" prefix)
- Try again: `ngrok config add-authtoken [TOKEN]`

### **"Webhook server won't start"**
- Check port 3001 not used: `netstat -ano | findstr "3001"`
- Try: `npm install && npm start`
- Check Node.js version: `node --version` (should be 20+)

### **"GitHub webhook not triggering"**
- Verify ngrok tunnel is running
- Check GitHub webhook logs: Settings → Webhooks → Recent Deliveries
- Verify Payload URL matches ngrok URL exactly

### **"Docker services not restarting after git push"**
- Check webhook server terminal for errors
- Verify webhook.log file
- Try manual test: `docker-compose down && docker-compose up -d --build`

---

## **📊 FOLDER STRUCTURE**

Your friend's project should look like:

```
Farmer-crop-price-prediction-model/
├── docker-compose.yml          (Run with: docker-compose up -d)
├── backend/                    (Node.js + Python ML)
├── frontend/                   (React app)
├── webhook/                    (GitHub webhook server)
│   ├── server.js              (Main webhook listener)
│   ├── package.json
│   ├── .env                   (Configuration)
│   └── node_modules/
├── jenkins/
├── README.md
└── [Other project files]
```

---

## **💡 QUICK START (TL;DR)**

For experienced developers, here's the quick version:

```bash
# 1. Install: Docker Desktop, Git, Node.js, ngrok
# 2. Clone and start
git clone https://github.com/[USER]/Farmer-crop-price-prediction-model.git
cd Farmer-crop-price-prediction-model
docker-compose up -d

# 3. In terminal 2, start webhook
cd webhook
npm install && npm start

# 4. In terminal 3, start ngrok
ngrok config add-authtoken [TOKEN]
ngrok http 3001

# 5. Update GitHub webhook with ngrok URL
# 6. Test with: git add . && git commit -m "test" && git push origin main
```

---

## **🎯 AFTER SUCCESSFUL SETUP**

Your friend can now:

- ✅ Push code to GitHub
- ✅ Automatic deployment happens in seconds
- ✅ Docker services rebuild with new code
- ✅ Application updates live
- ✅ No manual deployment steps needed

---

## **📞 SUPPORT**

If your friend gets stuck:

1. **Check webhook terminal** for error messages
2. **Check ngrok terminal** for connection logs
3. **Check GitHub webhook logs**: Settings → Webhooks → Recent Deliveries
4. **Check Docker logs**: `docker-compose logs backend`
5. **Check webhook server logs**: Look in webhook folder

---

**Your friend is now ready to run the complete automated deployment system! 🚀**
