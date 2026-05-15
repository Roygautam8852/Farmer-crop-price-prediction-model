// app.js — Main Express Server
// Farmer Crop Price Predictor — Node.js + Express Backend

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
require('dotenv').config();

const predictRoutes = require('./routes/predict');

const app  = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/crop_predictor';

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(helmet());                    // Secure HTTP headers
app.use(cors({ origin: '*' }));       // Allow React frontend
app.use(morgan('combined'));          // Request logging
app.use(express.json());              // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Farmer Crop Price Predictor API',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api', predictRoutes);

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ── Connect to MongoDB then Start Server ───────────────────────────────────────
// Only connect and listen if we are NOT in a test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`✅ MongoDB connected: ${MONGO_URI}`);
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = app; // Export for testing
