// src/components/PriceChart.jsx
// Dynamic Chart.js line chart — fetches real monthly price trend data
// from the backend API for any crop/state combination (all 25 crops, 25 states)
import React, { useMemo, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Fallback: generate a plausible price curve if API has no data ─────────────
function generateFallbackData(crop, state) {
  // Use crop+state string to produce a deterministic but varied seed
  const seed = (crop + state).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base  = 800 + (seed % 4000);   // base price between 800–4800
  return Array.from({ length: 12 }, (_, i) => {
    const seasonal = Math.sin((i / 11) * Math.PI) * base * 0.18;
    const noise    = ((seed * (i + 7)) % 200) - 100;
    return Math.max(200, Math.round(base + seasonal + noise));
  });
}

export default function PriceChart({ crop, state }) {
  const [trendData, setTrendData] = useState(null);   // { labels, modal, min, max }
  const [loading,   setLoading]   = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // ── Fetch monthly trend from backend ────────────────────────────────────────
  useEffect(() => {
    if (!crop || !state) return;
    setLoading(true);
    setIsFallback(false);

    axios.get(`${API_BASE}/api/trend`, { params: { crop, state } })
      .then(res => {
        if (res.data.success && res.data.trend && res.data.trend.length > 0) {
          // Build month-indexed arrays (indices 0–11)
          const modal = new Array(12).fill(null);
          const min   = new Array(12).fill(null);
          const max   = new Array(12).fill(null);
          res.data.trend.forEach(row => {
            const idx = row.month - 1;
            modal[idx] = row.avg_modal;
            min[idx]   = row.avg_min;
            max[idx]   = row.avg_max;
          });
          setTrendData({ labels: MONTH_LABELS, modal, min, max });
        } else {
          // No data for this crop/state combo → use fallback
          const fallback = generateFallbackData(crop, state);
          setTrendData({ labels: MONTH_LABELS, modal: fallback, min: null, max: null });
          setIsFallback(true);
        }
      })
      .catch(() => {
        // Backend offline → generate deterministic fallback
        const fallback = generateFallbackData(crop, state);
        setTrendData({ labels: MONTH_LABELS, modal: fallback, min: null, max: null });
        setIsFallback(true);
      })
      .finally(() => setLoading(false));
  }, [crop, state]);

  // ── Build Chart.js datasets ──────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (!trendData) return { labels: MONTH_LABELS, datasets: [] };

    const datasets = [
      {
        label: `${crop} — Modal Price (₹/quintal)`,
        data: trendData.modal,
        borderColor: '#4ade80',
        backgroundColor: (ctx) => {
          if (!ctx.chart.ctx) return 'rgba(74,222,128,0.1)';
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(74,222,128,0.25)');
          gradient.addColorStop(1, 'rgba(74,222,128,0.02)');
          return gradient;
        },
        borderWidth: 2.5,
        pointBackgroundColor: '#4ade80',
        pointBorderColor: '#0a0f1e',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
        spanGaps: true,
      },
    ];

    // Min and Max lines removed as per user request to only show Modal Price.

    return { labels: trendData.labels, datasets };
  }, [trendData, crop, isFallback]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#0d1528',
        borderColor: 'rgba(74,222,128,0.3)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            return val != null ? ` ₹${val.toLocaleString('en-IN')} / quintal` : ' No data';
          },
        },
      },
    },
    scales: {
      x: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
          callback: (v) => `₹${v.toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📈 Price Trend</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
            {isFallback
              ? 'Estimated seasonal pattern (connect backend for real data)'
              : `Monthly average ₹/quintal — ${state}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isFallback && (
            <span style={{ fontSize: '0.7rem', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(251,191,36,0.3)' }}>
              ⚠ Estimated
            </span>
          )}
          <span className="badge badge-green">{crop}</span>
        </div>
      </div>

      <div style={{ height: '240px', position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
            <div className="spinner" style={{ marginRight: '10px' }} />
            Loading trend data...
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
