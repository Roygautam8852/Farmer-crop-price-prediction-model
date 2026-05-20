const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;
const SECRET = process.env.GITHUB_SECRET || 'your-secret-here';
const PROJECT_DIR = process.env.PROJECT_DIR || path.join(__dirname, '..');

// Middleware
app.use(bodyParser.json({ limit: '1mb' }));

// Verify GitHub webhook signature
function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const hash = crypto
    .createHmac('sha256', SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  const expected = `sha256=${hash}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// Deploy function
function deploy() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting deployment...');
    
    const commands = [
      `cd "${PROJECT_DIR}"`,
      'docker-compose down --remove-orphans',
      'docker-compose up -d --build'
    ].join(' && ');

    exec(commands, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Deployment failed:', error.message);
        console.error('stderr:', stderr);
        reject(error);
      } else {
        console.log('✅ Deployment successful!');
        console.log('stdout:', stdout);
        resolve(stdout);
      }
    });
  });
}

// GitHub Webhook Endpoint
app.post('/webhook/github', async (req, res) => {
  console.log('\n📨 Webhook received');
  
  // Verify signature (skip if SECRET is 'your-secret-here')
  if (SECRET !== 'your-secret-here' && !verifySignature(req)) {
    console.log('❌ Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.headers['x-github-event'];
  const branch = req.body.ref?.split('/').pop() || 'unknown';

  console.log(`📌 Event: ${event}`);
  console.log(`🌿 Branch: ${branch}`);

  // Only deploy on push to main branch
  if (event === 'push' && branch === 'main') {
    console.log('✨ Main branch pushed - starting deployment');
    
    try {
      await deploy();
      res.json({ 
        status: 'success',
        message: 'Deployment started',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    console.log(`⏭️  Skipping deployment (event: ${event}, branch: ${branch})`);
    res.json({ 
      status: 'skipped',
      reason: `Only main branch pushes trigger deployment`,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'GitHub Webhook Server',
    status: 'running',
    webhook_url: `http://localhost:${PORT}/webhook/github`,
    health_url: `http://localhost:${PORT}/health`,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🔗 Webhook Server Started`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook/github`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📁 Project Directory: ${PROJECT_DIR}`);
  console.log(`🔐 GitHub Secret Configured: ${SECRET !== 'your-secret-here' ? '✅ Yes' : '⚠️  No'}`);
  console.log(`${'='.repeat(50)}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏹️  Webhook server shutting down...');
  process.exit(0);
});
