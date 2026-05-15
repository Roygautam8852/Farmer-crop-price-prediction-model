// models/Prediction.js
// Mongoose schema for storing prediction records in MongoDB

const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    crop:            { type: String, required: true },
    state:           { type: String, required: true },
    season:          { type: String, required: true },
    month:           { type: Number, required: true, min: 1, max: 12 },
    year:            { type: Number, required: true },
    predicted_price: { type: Number, required: true },
    min_range:       { type: Number, required: true },
    max_range:       { type: Number, required: true },
    model_used:      { type: String, required: true },
    timestamp:       { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', predictionSchema);
