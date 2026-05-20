# 🚀 GitHub Webhook Deployment - Complete Setup Guide

This guide walks you through setting up automatic deployment when you push code to GitHub.

---

## **📋 What is This?**

Instead of Jenkins CI/CD, we're using a simpler **GitHub Webhook Server** that:
1. Listens for GitHub push events
2. Verifies the webhook signature (security)
3. Automatically runs `docker-compose down --remove-orphans && docker-compose up -d --build`
4. Redeploys your application within seconds

---

## **✅ PROGRESS CHECKLIST**

- [x] **STEP 1**: Create webhook server files
- [x] **STEP 2**: Install Node.js dependencies
- [x] **STEP 3**: Start webhook server locally
- [x] **STEP 4**: Test webhook locally
- [ ] **STEP 5**: Get ngrok public URL (for GitHub)
- [ ] **STEP 6**: Configure GitHub webhook
- [ ] **STEP 7**: Set GitHub secret in .env
- [ ] **STEP 8**: Restart webhook server
- [ ] **STEP 9**: Test end-to-end deployment

---

## **STEP 5: Get Public URL for GitHub (Using ngrok)**

GitHub needs to reach your webhook server from the internet. We'll use **ngrok** for this.

### **5.1 Start ngrok**

Open a new terminal and run:

```bash
# Windows
ngrok http 3001

# Or if you have authentication token:
ngrok config add-authtoken <your-authtoken>
ngrok http 3001

# Linux/Mac
ngrok http 3001
```

You'll see output like:
```
Session Status                online
Account                       ...
Version                       3.3.1
Region                        us-central (200 ms)
Forwarding                    https://abc-123-def.ngrok.io -> http://localhost:3001
```

**Copy the URL**: `https://abc-123-def.ngrok.io`

### **5.2 Keep ngrok Running**

Keep this terminal open! ngrok must stay running for GitHub webhooks to work.

---

## **STEP 6: Configure GitHub Webhook**

### **6.1 Go to Your GitHub Repository**

1. Open: https://github.com/Roygautam8852/Farmer-crop-price-prediction-model
2. Click **Settings** (gear icon top-right)
3. Click **Webhooks** (left sidebar)

### **6.2 Click "Add webhook"**

### **6.3 Fill in the Webhook Form**

| Field | Value |
|-------|-------|
| **Payload URL** | `https://abc-123-def.ngrok.io/webhook/github` |
| **Content type** | `application/json` |
| **Secret** | Generate a strong secret (see below) |
| **Which events?** | Select **Push events** |
| **Active** | ✓ Check this box |

### **6.4 Generate a Strong Secret**

You can use PowerShell to generate one:

```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Or use any random string (at least 20 characters):
```
MySecureWebhookSecret123!@#$%
```

**Copy this secret** - you'll need it in the next step.

### **6.5 Click "Add webhook"**

GitHub will create the webhook and immediately test it. You should see a green checkmark ✅ if successful.

---

## **STEP 7: Set GitHub Secret in .env**

### **7.1 Create/Update .env File**

In the `webhook/` directory, create a file called `.env`:

```bash
# File: webhook/.env
WEBHOOK_PORT=3001
GITHUB_SECRET=<paste-your-secret-here>
PROJECT_DIR=../
```

**Example:**
```bash
WEBHOOK_PORT=3001
GITHUB_SECRET=MySecureWebhookSecret123!@#$%
PROJECT_DIR=../
```

### **7.2 Verify the .env File**

```bash
cd webhook
cat .env
```

Output should show your secret (don't share this!).

---

## **STEP 8: Restart Webhook Server**

The webhook server reads the `.env` file on startup, so we need to restart it.

### **8.1 Kill Current Server**

In the webhook server terminal (where it's running), press:
```
Ctrl + C
```

### **8.2 Restart It**

```bash
cd webhook
npm start
```

Look for this in the output:
```
==================================================
🔗 Webhook Server Started
==================================================
📍 Port: 3001
🔗 Webhook URL: http://localhost:3001/webhook/github
🏥 Health Check: http://localhost:3001/health
📁 Project Directory: D:\Crop_price_prediction_system\farmer-crop-predictor
🔐 GitHub Secret Configured: ✅ Yes    <--- Should show YES now!
==================================================
```

If it shows **✅ Yes**, you're ready!

---

## **STEP 9: Test End-to-End Deployment**

### **9.1 Make a Test Commit**

```bash
cd farmer-crop-predictor
git add .
git commit -m "Test webhook deployment"
git push origin main
```

### **9.2 Monitor Webhook Server Logs**

In your webhook server terminal, you should see:

```
📨 Webhook received
📌 Event: push
🌿 Branch: main
✨ Main branch pushed - starting deployment
🚀 Starting deployment...
✅ Deployment successful!
```

### **9.3 Verify Services Restarted**

In a new terminal, check if services restarted:

```bash
cd farmer-crop-predictor
docker-compose ps

# Should show all services recently started
docker-compose logs --tail=20
```

### **9.4 Test the Live Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Webhook Health**: http://localhost:3001/health

---

## **🎯 SUCCESS! Your Deployment Pipeline is Live**

```
GitHub Push → GitHub Sends Webhook → Webhook Server Receives → 
docker-compose Rebuilds & Restarts → App is Live ✅
```

---

## **📚 Troubleshooting**

### **❌ Webhook not received?**

**Check 1**: Is webhook server running?
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"ok",...}`

**Check 2**: Is ngrok running?
Keep ngrok terminal open!

**Check 3**: Check GitHub webhook delivery logs
- Go to: GitHub Repo → Settings → Webhooks
- Click your webhook → "Recent Deliveries"
- Click the ❌ failed request to see the error

**Check 4**: Verify ngrok URL in GitHub
- Make sure Payload URL in GitHub exactly matches ngrok URL
- Example: `https://abc-123-def.ngrok.io/webhook/github`

### **❌ Invalid signature error?**

**Problem**: Secret in GitHub doesn't match `.env`

**Fix**:
1. Get the secret from GitHub webhook settings
2. Update `.env` with exact secret
3. Restart webhook server
4. Re-test webhook in GitHub ("Redeliver")

### **❌ docker-compose command failed?**

**Check 1**: Docker is running
```bash
docker ps
```

**Check 2**: Project directory path correct in `.env`
```bash
cat webhook/.env
# PROJECT_DIR should point to folder with docker-compose.yml
```

**Check 3**: Permissions error?
- On Linux/Mac: May need `sudo` for docker-compose
- Consider running webhook server with elevated privileges

### **❌ Services not restarting?**

**Check 1**: Look at full deployment log
- Check webhook server terminal output
- Run: `docker-compose logs --tail=50`

**Check 2**: Rebuild from scratch
```bash
cd farmer-crop-predictor
docker-compose down
docker-compose up -d --build
```

---

## **🔄 Running Webhook Server Permanently**

For production, use a process manager:

### **Using PM2 (Node.js process manager)**

```bash
npm install -g pm2
cd webhook
pm2 start server.js --name "crop-webhook"
pm2 save
pm2 startup
```

Now webhook server restarts automatically on reboot.

### **Using systemd (Linux)**

Create `/etc/systemd/system/crop-webhook.service`:

```ini
[Unit]
Description=Crop Predictor Webhook Server
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/webhook
ExecStart=/usr/bin/node /path/to/webhook/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl start crop-webhook
sudo systemctl enable crop-webhook
```

---

## **📝 Quick Reference**

| Action | Command |
|--------|---------|
| Start webhook server | `cd webhook && npm start` |
| Check health | `curl http://localhost:3001/health` |
| Start ngrok | `ngrok http 3001` |
| View webhook logs | Check GitHub Repo → Settings → Webhooks → Recent Deliveries |
| Restart Docker services | `cd farmer-crop-predictor && docker-compose up -d --build` |
| View service logs | `docker-compose logs -f` |

---

## **🎓 How It Works (Technical)**

1. **Push to GitHub**: You run `git push origin main`
2. **GitHub Webhook**: GitHub sends a POST to your ngrok URL with push event data
3. **Signature Verification**: Webhook server verifies HMAC-SHA256 signature using secret
4. **Filter Event**: Only redeploy on `main` branch push events
5. **Trigger Deployment**: Execute: `docker-compose down --remove-orphans && docker-compose up -d --build`
6. **Rebuild Images**: Docker builds new images from latest code
7. **Restart Services**: All containers restart with new code
8. **Done**: Your app is now live with latest changes

---

## **🔐 Security Notes**

- **GitHub Secret**: Keeps the webhook secure (only GitHub and you know it)
- **HMAC-SHA256**: Verifies the webhook request really came from GitHub
- **ngrok**: Use authentication token to avoid public ngrok URLs being stolen
- **.env file**: Keep `GITHUB_SECRET` private, add to `.gitignore`

---

## **📞 Support**

If something isn't working:

1. Check webhook server logs (terminal output)
2. Check GitHub webhook delivery logs
3. Verify ngrok is running
4. Verify `.env` file has correct secret
5. Test local webhook: `curl -X POST http://localhost:3001/webhook/github ...`

Happy deploying! 🚀
