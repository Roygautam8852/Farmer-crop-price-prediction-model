# GitHub Webhook Setup Guide

This guide explains how to set up GitHub webhooks to automatically trigger Jenkins builds.

## Option 1: Using GitHub Repository Webhook (Recommended)

### Step 1: Get Your Jenkins Public URL
For local development, you need a public URL pointing to your Jenkins. Use **ngrok** or **Cloudflare Tunnel**.

#### Using ngrok (easiest):
```bash
# Download from https://ngrok.com/download
# Create account at https://ngrok.com

# Authenticate
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Expose Jenkins
ngrok http 8080

# Your public URL will be: https://xxxxx-xxx-ngrok.io
```

#### Using Cloudflare Tunnel (more stable):
```bash
# Download Cloudflare Tunnel (cloudflared)
# https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/installation/

# Start tunnel
cloudflared tunnel --url http://localhost:8080
```

### Step 2: Configure GitHub Webhook

1. **Go to your GitHub repository**
   - Settings → Webhooks → Add webhook

2. **Fill in the webhook details:**
   - **Payload URL:** `https://your-ngrok-url/github-webhook/`
     - Example: `https://1234a5b67890-ngrok.io/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** 
     - ✓ Push events
     - ✓ Pull requests (optional)
   - **Active:** ✓ (checked)

3. **Click "Add webhook"**

### Step 3: Verify Webhook Delivery

In GitHub Webhooks settings, scroll to "Recent Deliveries" to see if webhooks are being sent.

---

## Option 2: Jenkins Poll GitHub (Alternative)

If you don't want to expose Jenkins publicly:

1. **In Jenkins Job Configuration:**
   - Go to your pipeline job → Configure
   - Build Triggers → Check "Poll SCM"
   - Schedule: `H/5 * * * *` (polls every 5 minutes)

2. This doesn't trigger instantly like webhooks, but works without public URL.

---

## Option 3: Jenkins GitHub App Integration (Advanced)

1. **Create GitHub App**
   - GitHub Settings → Developer settings → GitHub Apps → New GitHub App
   - Configure as needed

2. **Install in Jenkins**
   - Manage Jenkins → Manage Credentials
   - Add GitHub App credentials

3. **Configure in Job**
   - Job Configure → Build Triggers
   - GitHub App Trigger

---

## Testing the Webhook

### Test 1: Manual Trigger from GitHub
```bash
# Go to webhook Recent Deliveries in GitHub
# Click on latest delivery → Redeliver
```

### Test 2: Push Code to Trigger
```bash
# Make a small change to your repo and push
git add .
git commit -m "Test webhook"
git push origin main
```

### Test 3: Check Jenkins Logs
```bash
# Watch Jenkins logs in real-time
docker-compose logs -f jenkins

# Or check in Jenkins UI:
# Jenkins → Build History → Check for new builds
```

---

## Troubleshooting

### Webhook not delivering?

1. **Check Jenkins URL is reachable:**
   ```bash
   curl https://your-ngrok-url/
   ```

2. **Check Jenkins logs:**
   ```bash
   docker-compose logs jenkins | grep -i "github\|webhook"
   ```

3. **Verify GitHub plugin is installed:**
   - Jenkins → Manage Jenkins → Manage Plugins
   - Search "GitHub plugin" → Should be installed

4. **Check job configuration:**
   - Job → Configure
   - Make sure "GitHub hook trigger for GITscm polling" is CHECKED

5. **Test webhook manually:**
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     http://localhost:8080/github-webhook/ \
     -d '{"action":"push"}'
   ```

---

## .env Variables (Optional)

Create `.env` file if you need environment-specific settings:

```env
GITHUB_TOKEN=your_github_pat_here
JENKINS_URL=https://your-ngrok-url
REACT_APP_API_URL=http://localhost:5000
MONGO_URI=mongodb://mongo:27017/crop_predictor
```

---

## Next Steps

1. Set up ngrok or Cloudflare Tunnel for public access
2. Configure GitHub webhook
3. Make a test commit
4. Watch Jenkins build automatically
5. Verify deployment success

For more info: https://plugins.jenkins.io/github/
