# GitHub Webhook Deployment Server

Automatically deploy your application when you push to GitHub.

## Setup Steps

### 1. Install Dependencies
```bash
cd webhook
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your GitHub secret (optional for testing)
```

### 3. Start the Webhook Server
```bash
npm start
# Server runs on http://localhost:3001
```

## Testing Locally

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```

### Test 2: Simulate GitHub Webhook
```bash
curl -X POST http://localhost:3001/webhook/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{
    "ref": "refs/heads/main",
    "repository": {
      "name": "Farmer-crop-price-prediction-model"
    }
  }'
```

### Expected Response
```json
{
  "status": "success",
  "message": "Deployment started",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## GitHub Webhook Configuration

### Go to Your Repository Settings:
1. Navigate to: https://github.com/Roygautam8852/Farmer-crop-price-prediction-model/settings/hooks
2. Click **Add webhook**
3. Configure:
   - **Payload URL**: Use ngrok tunnel or your server URL
     - Local: `http://localhost:3001/webhook/github` (for testing)
     - Public: Use ngrok: `https://xxxx-xx-xxx-xxx.ngrok.io/webhook/github`
   - **Content type**: application/json
   - **Secret**: Enter a strong secret (keep it safe!)
   - **Events**: Select "Push events"
   - **Active**: Check the box

### Set Your Secret in .env
```bash
# After creating webhook in GitHub, copy the secret
GITHUB_SECRET=your_github_webhook_secret_here
```

## How It Works

1. **Push to Main Branch**: When you push code to the `main` branch
2. **GitHub Sends Webhook**: GitHub sends a POST request to your webhook URL
3. **Server Verifies**: Webhook server verifies GitHub's signature (HMAC-SHA256)
4. **Triggers Deployment**: 
   ```bash
   docker-compose down --remove-orphans
   docker-compose up -d --build
   ```
5. **Services Restart**: Your frontend (port 3000) and backend (port 5000) restart with new code

## Using ngrok for Public Access (Optional)

If you need GitHub to reach your local webhook server from the internet:

```bash
# Download from: https://ngrok.com/download
# Start ngrok
ngrok http 3001

# You'll get a public URL like: https://abc-123-def.ngrok.io
# Use: https://abc-123-def.ngrok.io/webhook/github in GitHub
```

## Troubleshooting

### Webhook not triggering?
- ✅ Check if webhook server is running: `curl http://localhost:3001/health`
- ✅ Verify GitHub webhook status: Repository Settings > Webhooks > View delivery logs
- ✅ Check if branch is `main` (not `master`)

### Deployment failed?
- ✅ Check logs in webhook server output
- ✅ Verify Docker is running: `docker ps`
- ✅ Test docker-compose manually: `docker-compose up -d --build`

### Invalid signature error?
- ✅ Make sure `GITHUB_SECRET` in `.env` matches GitHub webhook secret exactly
- ✅ Spaces and special characters matter!

## Production Deployment

For production, run webhook server with a process manager:

```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name webhook

# Or using systemd (Linux)
# Create /etc/systemd/system/webhook.service
```

## Files

- `server.js` - Main webhook server
- `package.json` - Dependencies
- `.env.example` - Configuration template
- `.env` - Your actual configuration (create from .env.example)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| WEBHOOK_PORT | 3001 | Port for webhook server |
| GITHUB_SECRET | your-secret-here | GitHub webhook secret for HMAC verification |
| PROJECT_DIR | ../ | Path to project root (contains docker-compose.yml) |

## Logs Example

```
==================================================
🔗 Webhook Server Started
==================================================
📍 Port: 3001
🔗 Webhook URL: http://localhost:3001/webhook/github
🏥 Health Check: http://localhost:3001/health
📁 Project Directory: /path/to/project
🔐 GitHub Secret Configured: ✅ Yes
==================================================

📨 Webhook received
📌 Event: push
🌿 Branch: main
✨ Main branch pushed - starting deployment
🚀 Starting deployment...
✅ Deployment successful!
```
