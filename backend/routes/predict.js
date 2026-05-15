// routes/predict.js
// Express route handlers for /api/predict, /api/history, /api/crops, and /api/trend
// The ML prediction is delegated to Python's predict.py via child_process

const express = require('express');
const router  = express.Router();
const { spawn } = require('child_process');
const path    = require('path');
const fs      = require('fs');
const Prediction = require('../models/Prediction');

// ── Helper: call Python predict.py ────────────────────────────────────────────
function runPythonPredictor(inputData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'model', 'predict.py');

    // Spawn Python; use 'python' or 'python3' depending on system
    const python = spawn('python', [scriptPath]);

    let stdout = '';
    let stderr = '';

    // Write input JSON to Python's stdin
    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();

    python.stdout.on('data', (data) => { stdout += data.toString(); });
    python.stderr.on('data', (data) => { stderr += data.toString(); });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python exited with code ${code}: ${stderr}`));
      }
      try {
        const result = JSON.parse(stdout.trim());
        if (!result.success) return reject(new Error(result.error));
        resolve(result.data);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${stdout}`));
      }
    });
  });
}

// ── POST /api/predict ─────────────────────────────────────────────────────────
// Accepts: { crop, state, month, year, season }
// Returns: { predicted_price, min_range, max_range, model_used }
router.post('/predict', async (req, res) => {
  try {
    const { crop, state, month, year, season } = req.body;

    // Basic input validation
    if (!crop || !state || !month || !year || !season) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: crop, state, month, year, season',
      });
    }

    // Call ML model (returns predicted_price, min_range, max_range, model_used, all_models[])
    const prediction = await runPythonPredictor({ crop, state, month, year, season });

    // Persist primary prediction to MongoDB
    const record = new Prediction({
      crop,
      state,
      month: Number(month),
      year: Number(year),
      season,
      predicted_price: prediction.predicted_price,
      min_range: prediction.min_range,
      max_range: prediction.max_range,
      model_used: prediction.model_used,
    });
    await record.save();

    // Return everything including all_models array for multi-model display
    return res.json({ success: true, ...prediction });
  } catch (error) {
    console.error('[/api/predict] Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/history ──────────────────────────────────────────────────────────
// Returns the last 20 predictions stored in MongoDB
router.get('/history', async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .select('crop state season month year predicted_price min_range max_range model_used timestamp');

    return res.json({ success: true, predictions });
  } catch (error) {
    console.error('[/api/history] Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/trend ───────────────────────────────────────────────────────
// Returns monthly average min/modal/max prices for a given crop + state
// Query params: ?crop=Rice&state=Punjab
router.get('/trend', (req, res) => {
  try {
    const { crop, state } = req.query;
    if (!crop || !state) {
      return res.status(400).json({ success: false, message: 'crop and state query params required' });
    }

    const csvPath = path.join(__dirname, '..', 'data', 'crop_prices_dataset.csv');
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const lines = raw.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''));

    // Aggregate by month for the selected crop+state
    const monthly = {}; // { 1: { modal:[], min:[], max:[] }, ... }

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (cols.length < headers.length) continue;

      const row = {};
      headers.forEach((h, idx) => { row[h] = cols[idx]?.trim().replace(/\r/g, ''); });

      if (row.crop !== crop || row.state !== state) continue;

      const month = parseInt(row.month, 10);
      const modal = parseFloat(row.modal_price);
      const min   = parseFloat(row.min_price);
      const max   = parseFloat(row.max_price);

      if (isNaN(month) || isNaN(modal)) continue;

      if (!monthly[month]) monthly[month] = { modal: [], min: [], max: [] };
      monthly[month].modal.push(modal);
      monthly[month].min.push(min);
      monthly[month].max.push(max);
    }

    const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

    const trend = Object.keys(monthly)
      .map(Number)
      .sort((a, b) => a - b)
      .map(m => ({
        month:     m,
        avg_modal: avg(monthly[m].modal),
        avg_min:   avg(monthly[m].min),
        avg_max:   avg(monthly[m].max),
      }));

    return res.json({ success: true, crop, state, trend });
  } catch (error) {
    console.error('[/api/trend] Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/crops ───────────────────────────────────────────────────────
// Returns lists of available crops, states, and seasons from options.json
router.get('/crops', (req, res) => {
  try {
    const optionsPath = path.join(__dirname, '..', 'data', 'options.json');
    // Always re-read (don't cache with require) so retraining is reflected live
    const options = JSON.parse(fs.readFileSync(optionsPath, 'utf-8'));
    return res.json({ success: true, ...options });
  } catch (error) {
    // Fallback if options.json missing
    return res.json({
      success: true,
      crops:   ['Rice','Wheat','Tomato','Onion','Potato','Maize'],
      states:  ['Punjab','Uttar Pradesh','Maharashtra','Karnataka','Madhya Pradesh'],
      seasons: ['Kharif','Rabi','Zaid'],
    });
  }
});

module.exports = router;
