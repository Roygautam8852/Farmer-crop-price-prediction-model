// src/components/ResultCard.jsx
// Displays the ML prediction result with animated price reveal and multi-model comparison
import React, { useEffect, useState } from 'react';
import ModelComparisonCards from './ModelComparisonCards';

const MONTH_NAMES = [
  '', 'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// ── Animated counter hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

export default function ResultCard({ result }) {
  const animatedPrice = useCountUp(result.predicted_price);

  const confidence = (
    ((result.max_range - result.min_range) / result.predicted_price) * 100
  ).toFixed(0);

  return (
    <div className="card result-card page-enter" style={{
      background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(96,165,250,0.06) 100%)',
      border: '1px solid rgba(74,222,128,0.25)',
      boxShadow: '0 0 48px rgba(74,222,128,0.1)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="badge badge-green" style={{ marginBottom: '8px' }}>✅ Prediction Ready</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {result.form.crop} · {result.form.state}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            {MONTH_NAMES[result.form.month]} {result.form.year} · {result.form.season} Season
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="badge badge-blue">🤖 Best: {result.model_used}</span>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>5 Models Analyzed</p>
        </div>
      </div>

      {/* Main Price */}
      <div style={{ textAlign: 'center', marginBottom: '28px', padding: '28px', background: 'rgba(74,222,128,0.05)', borderRadius: '16px', border: '1px solid rgba(74,222,128,0.1)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Best Estimated Modal Price
        </p>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'Outfit,sans-serif', background: 'linear-gradient(135deg, #4ade80, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1 }}>
          ₹{animatedPrice.toLocaleString('en-IN')}
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>per quintal (100 kg)</p>
      </div>

      {/* Tip */}
      <div style={{ padding: '16px', background: 'rgba(96,165,250,0.07)', borderRadius: '12px', border: '1px solid rgba(96,165,250,0.15)', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '28px' }}>
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--color-blue)' }}>Sell Advisory:</strong> If current market price is below ₹{Math.round(result.predicted_price * 0.95).toLocaleString('en-IN')}, consider storing for better returns. Prices are generated using ensemble learning techniques.
        </p>
      </div>

      {/* Multi-Model Comparison */}
      <ModelComparisonCards allModels={result.all_models} />
    </div>
  );
}
