// tests/predict.test.js
// Jest + Supertest tests for the /api/predict endpoint

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

// Use a separate test database
const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/crop_predictor_test';

beforeAll(async () => {
  // Connect to test DB before all tests
  await mongoose.connect(TEST_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up and close connection
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

// ── Test Suite: POST /api/predict ─────────────────────────────────────────────
describe('POST /api/predict', () => {
  it('should return a prediction for valid inputs', async () => {
    const res = await request(app)
      .post('/api/predict')
      .send({
        crop:   'Rice',
        state:  'Punjab',
        month:  7,
        year:   2024,
        season: 'Kharif',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('predicted_price');
    expect(res.body).toHaveProperty('min_range');
    expect(res.body).toHaveProperty('max_range');
    expect(res.body).toHaveProperty('model_used');
    expect(typeof res.body.predicted_price).toBe('number');
    expect(res.body.predicted_price).toBeGreaterThan(0);
  });

  it('should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/predict')
      .send({ crop: 'Wheat' }); // Missing state, month, year, season

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 when all fields are missing', async () => {
    const res = await request(app)
      .post('/api/predict')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should store prediction in MongoDB', async () => {
    await request(app)
      .post('/api/predict')
      .send({
        crop:   'Wheat',
        state:  'UP',
        month:  2,
        year:   2024,
        season: 'Rabi',
      });

    const Prediction = require('../models/Prediction');
    const count = await Prediction.countDocuments({ crop: 'Wheat', state: 'UP' });
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ── Test Suite: GET /api/history ──────────────────────────────────────────────
describe('GET /api/history', () => {
  it('should return an array of predictions', async () => {
    const res = await request(app).get('/api/history');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.predictions)).toBe(true);
  });

  it('should return at most 20 predictions', async () => {
    const res = await request(app).get('/api/history');
    expect(res.body.predictions.length).toBeLessThanOrEqual(20);
  });
});

// ── Test Suite: GET /api/crops ────────────────────────────────────────────────
describe('GET /api/crops', () => {
  it('should return available crops, states, and seasons', async () => {
    const res = await request(app).get('/api/crops');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.crops)).toBe(true);
    expect(Array.isArray(res.body.states)).toBe(true);
    expect(Array.isArray(res.body.seasons)).toBe(true);
    expect(res.body.crops.length).toBeGreaterThan(0);
  });
});

// ── Test Suite: GET /health ───────────────────────────────────────────────────
describe('GET /health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
