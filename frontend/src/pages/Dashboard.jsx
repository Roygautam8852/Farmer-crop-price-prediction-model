// src/pages/Dashboard.jsx
// Shows prediction history from MongoDB + multi-crop charts
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PriceChart from '../components/PriceChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MONTH_NAMES = [
  '', 'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

export default function Dashboard() {
  const [history,      setHistory]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [selectedState,setSelectedState]= useState('Punjab');
  const [error,        setError]        = useState(null);
  const [crops,        setCrops]        = useState(['Rice','Wheat','Tomato','Onion','Potato','Maize']);
  const [states,       setStates]       = useState(['Punjab','Uttar Pradesh','Maharashtra','Karnataka','Madhya Pradesh']);

  // ── Fetch available crop/state options ────────────────────────────────
  useEffect(() => {
    axios.get(`${API_BASE}/api/crops`)
      .then(res => {
        if (res.data.success) {
          setCrops(res.data.crops || []);
          setStates(res.data.states || []);
          // Set default selects to first items returned
          if (res.data.crops?.length)  setSelectedCrop(res.data.crops[0]);
          if (res.data.states?.length) setSelectedState(res.data.states[0]);
        }
      })
      .catch(() => { /* use defaults */ });
  }, []);

  // ── Fetch prediction history ─────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/api/history`)
      .then(res => {
        if (res.data.success) setHistory(res.data.predictions);
      })
      .catch(() => setError('Failed to load history. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  // ── Build bar chart from history ─────────────────────────────────────────
  const barData = {
    labels: history.slice(0, 8).map(h => `${h.crop} (${MONTH_NAMES[h.month]})`),
    datasets: [{
      label: 'Predicted Price (₹/quintal)',
      data: history.slice(0, 8).map(h => h.predicted_price),
      backgroundColor: 'rgba(74,222,128,0.7)',
      borderColor: '#4ade80',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
      tooltip: {
        backgroundColor: '#0d1528',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(74,222,128,0.3)',
        borderWidth: 1,
        callbacks: { label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}` },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', callback: (v) => `₹${v.toLocaleString('en-IN')}` },
      },
    },
  };

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>📊 Analytics Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Prediction history and price trend analysis
        </p>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Predictions', value: history.length,  color: 'var(--color-green-primary)', icon: '⚡' },
          { label: 'Avg Price',         value: history.length ? `₹${Math.round(history.reduce((a,b)=>a+b.predicted_price,0)/history.length).toLocaleString('en-IN')}` : '—', color: '#fbbf24', icon: '💰' },
          { label: 'Crops Predicted',   value: new Set(history.map(h=>h.crop)).size || 0, color: '#60a5fa', icon: '🌾' },
          { label: 'States Covered',    value: new Set(history.map(h=>h.state)).size || 0, color: '#a78bfa', icon: '🗺️' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Bar Chart (recent predictions) ──────────────────────── */}
      {history.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Recent Predictions</h3>
          <div style={{ height: '240px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      )}

      {/* ── Crop Trend Selector ──────────────────────────────────── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Price Trend Explorer</h3>
          <select
            className="form-control"
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            style={{ width: 'auto', padding: '8px 32px 8px 12px' }}
            id="dashboard-crop-select"
          >
            {crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="form-control"
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{ width: 'auto', padding: '8px 32px 8px 12px' }}
            id="dashboard-state-select"
          >
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <PriceChart crop={selectedCrop} state={selectedState} />
      </div>

      {/* ── History Table ────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🕒 Prediction History</h3>
          <span className="badge badge-green">{history.length} records</span>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            Loading history...
          </div>
        ) : error ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#f87171' }}>{error}</div>
        ) : history.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No predictions yet. Go to <strong>Home</strong> to make your first prediction!
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>State</th>
                  <th>Season</th>
                  <th>Month / Year</th>
                  <th>Predicted (₹)</th>
                  <th>Range</th>
                  <th>Model</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={h._id || i}>
                    <td><span className="badge badge-green">{h.crop}</span></td>
                    <td>{h.state}</td>
                    <td><span className="badge badge-amber">{h.season}</span></td>
                    <td>{MONTH_NAMES[h.month]} {h.year}</td>
                    <td style={{ color: 'var(--color-green-primary)', fontWeight: 600 }}>
                      ₹{h.predicted_price?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                      ₹{Math.round(h.min_range)?.toLocaleString('en-IN')} – ₹{Math.round(h.max_range)?.toLocaleString('en-IN')}
                    </td>
                    <td><span className="badge badge-blue">{h.model_used}</span></td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(h.timestamp || h.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
