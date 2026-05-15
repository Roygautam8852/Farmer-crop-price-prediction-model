// src/components/PredictForm.jsx
// Form component for submitting crop price prediction requests
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MONTH_NAMES = [
  '', 'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function PredictForm({ onResult, onLoading }) {
  const [options, setOptions] = useState({
    crops: ['Rice','Wheat','Tomato','Onion','Potato','Maize'],
    states: ['Punjab','UP','Maharashtra','Karnataka','MP'],
    seasons: ['Kharif','Rabi','Zaid'],
  });

  const [form, setForm] = useState({
    crop: '',
    state: '',
    month: '',
    year: new Date().getFullYear(),
    season: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Fetch available options from API ────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API_BASE}/api/crops`)
      .then(res => {
        if (res.data.success) {
          setOptions({
            crops:   res.data.crops,
            states:  res.data.states,
            seasons: res.data.seasons,
          });
        }
      })
      .catch(() => { /* use defaults */ });
  }, []);

  // ── Form Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.crop)   errs.crop   = 'Please select a crop';
    if (!form.state)  errs.state  = 'Please select a state';
    if (!form.month)  errs.month  = 'Please select a month';
    if (!form.year)   errs.year   = 'Please enter a year';
    if (!form.season) errs.season = 'Please select a season';
    if (form.year < 2020 || form.year > 2030) errs.year = 'Year must be between 2020-2030';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Handle Input Change ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── Handle Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    onLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/predict`, {
        ...form,
        month: Number(form.month),
        year:  Number(form.year),
      });

      if (res.data.success) {
        onResult({ ...res.data, form });
      }
    } catch (err) {
      console.error('Prediction error:', err);
      onResult(null, err.response?.data?.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <div className="card predict-form-card">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
          🌾 Get Price Prediction
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Enter details to predict the crop's modal market price (₹/quintal)
        </p>
      </div>

      <form onSubmit={handleSubmit} id="predict-form">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '20px' }}>

          {/* Crop Select */}
          <div className="form-group">
            <label className="form-label" htmlFor="crop-select">Crop</label>
            <select
              id="crop-select"
              name="crop"
              className={`form-control ${errors.crop ? 'error' : ''}`}
              value={form.crop}
              onChange={handleChange}
            >
              <option value="">Select crop...</option>
              {options.crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.crop && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.crop}</span>}
          </div>

          {/* State Select */}
          <div className="form-group">
            <label className="form-label" htmlFor="state-select">State</label>
            <select
              id="state-select"
              name="state"
              className={`form-control ${errors.state ? 'error' : ''}`}
              value={form.state}
              onChange={handleChange}
            >
              <option value="">Select state...</option>
              {options.states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.state}</span>}
          </div>

          {/* Season Select */}
          <div className="form-group">
            <label className="form-label" htmlFor="season-select">Season</label>
            <select
              id="season-select"
              name="season"
              className={`form-control ${errors.season ? 'error' : ''}`}
              value={form.season}
              onChange={handleChange}
            >
              <option value="">Select season...</option>
              {options.seasons.map(s => {
                let label = s;
                if (s === 'Kharif') label = 'Kharif (June - Oct)';
                if (s === 'Rabi')   label = 'Rabi (Oct - March)';
                if (s === 'Zaid')   label = 'Zaid (March - June)';
                return <option key={s} value={s}>{label}</option>;
              })}
            </select>
            {errors.season && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.season}</span>}
          </div>

          {/* Month Select */}
          <div className="form-group">
            <label className="form-label" htmlFor="month-select">Month</label>
            <select
              id="month-select"
              name="month"
              className={`form-control ${errors.month ? 'error' : ''}`}
              value={form.month}
              onChange={handleChange}
            >
              <option value="">Select month...</option>
              {MONTH_NAMES.slice(1).map((m, i) => (
                <option key={i+1} value={i+1}>{m}</option>
              ))}
            </select>
            {errors.month && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.month}</span>}
          </div>

          {/* Year Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="year-input">Year</label>
            <input
              id="year-input"
              type="number"
              name="year"
              className={`form-control ${errors.year ? 'error' : ''}`}
              value={form.year}
              onChange={handleChange}
              min="2020"
              max="2030"
              placeholder="2024"
            />
            {errors.year && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.year}</span>}
          </div>

        </div>

        <button
          id="predict-btn"
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', padding: '14px' }}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Predicting...
            </>
          ) : (
            <>⚡ Predict Price</>
          )}
        </button>
      </form>
    </div>
  );
}
