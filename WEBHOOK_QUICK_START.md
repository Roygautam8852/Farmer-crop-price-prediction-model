# 🚀 Webhook Setup - Quick Start (Next Steps)

Your webhook server is **running and tested**! ✅

---

## **⚡ Quick Setup (5 minutes remaining)**

### **STEP 1: Start ngrok (New Terminal)**

```bash
# Get your auth token from: https://dashboard.ngrok.com/auth/your-authtoken
ngrok config add-authtoken <your-authtoken>

# Then start ngrok
ngrok http 3001
```

**Copy the URL shown**: `https://abc-123-xyz.ngrok.io`

---

### **STEP 2: Add GitHub Webhook**

1. Go to: https://github.com/Roygautam8852/Farmer-crop-price-prediction-model/settings/hooks

2. Click **"Add webhook"**

3. Fill in:
   - **Payload URL**: `https://abc-123-xyz.ngrok.io/webhook/github`
   - **Content type**: `application/json`
   - **Secret**: Copy any random string (20+ chars)
     - Example: `MyWebhookSecret12345ABC!@#`
   - **Events**: Push events
   - **Active**: ✓ Checked

4. Click **"Add webhook"**

---

### **STEP 3: Create .env File**

In `webhook/` folder, create `.env` file:

```
WEBHOOK_PORT=3001
GITHUB_SECRET=MyWebhookSecret12345ABC!@#
PROJECT_DIR=../
```

**Replace** `MyWebhookSecret12345ABC!@#` with your actual secret from GitHub!

---

### **STEP 4: Restart Webhook Server**

1. In webhook terminal, press **Ctrl+C**
2. Run: `npm start`
3. Look for: `🔐 GitHub Secret Configured: ✅ Yes`

---

### **STEP 5: Test Push to GitHub**

```bash
cd farmer-crop-predictor
git add .
git commit -m "Test webhook"
git push origin main
```

**Watch webhook terminal** - you should see:
```
📨 Webhook received
📌 Event: push
🌿 Branch: main
✨ Main branch pushed - starting deployment
🚀 Starting deployment...
✅ Deployment successful!
```

---

### **✅ Done!**

Your app now auto-deploys when you push to GitHub! 🎉

For detailed troubleshooting, see: `WEBHOOK_SETUP_GUIDE.md`
