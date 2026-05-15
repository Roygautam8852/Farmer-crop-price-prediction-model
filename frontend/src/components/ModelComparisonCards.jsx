// src/components/ModelComparisonCards.jsx
// Displays side-by-side prediction results from all 5 ML models
import React, { useEffect, useState } from 'react';

// ── Animated counter hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 1000, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
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
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

// ── R² quality label ──────────────────────────────────────────────────────
function r2Quality(r2) {
  if (r2 >= 0.9) return { label: 'Excellent', color: '#4ade80' };
  if (r2 >= 0.75) return { label: 'Good',     color: '#60a5fa' };
  if (r2 >= 0.5)  return { label: 'Fair',     color: '#f59e0b' };
  return              { label: 'Low',      color: '#f87171' };
}

// ── Single Model Card ─────────────────────────────────────────────────────
function ModelCard({ model, index, isBest }) {
  const animatedPrice = useCountUp(model.predicted_price, 900, index * 120);
  const quality = r2Quality(model.r2 || 0);

  return (
    <div
      style={{
        background: isBest
          ? `linear-gradient(135deg, ${model.color}18 0%, ${model.color}08 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isBest ? model.color + '55' : 'var(--color-border)'}`,
        borderRadius: '16px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        animation: `fadeInUp 0.5s ease ${index * 0.08}s both`,
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 32px ${model.color}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Best badge */}
      {isBest && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: model.color,
          color: '#000',
          fontSize: '0.6rem',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '20px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          ★ BEST
        </div>
      )}

      {/* Background watermark number */}
      <div style={{
        position: 'absolute', bottom: '-8px', right: '8px',
        fontSize: '5rem', fontWeight: 900,
        color: model.color,
        opacity: 0.05,
        fontFamily: 'Outfit,sans-serif',
        lineHeight: 1,
        pointerEvents: 'none',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Header: Icon + Model Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <span style={{ fontSize: '1.4rem' }}>{model.icon}</span>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: model.color }}>
            {model.model_label}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '1px' }}>
            ML Model #{index + 1}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: `${model.color}22`, marginBottom: '14px' }} />

      {/* Predicted Price */}
      <div style={{ marginBottom: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: `1px solid ${model.color}15` }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
          Model Price
        </div>
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          fontFamily: 'Outfit,sans-serif',
          color: model.color,
          lineHeight: 1,
        }}>
          ₹{animatedPrice.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
          per quintal
        </div>
      </div>

      {/* Metrics: MAE + R² */}
      {(model.mae > 0 || model.r2 > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {model.mae > 0 && (
            <div style={{
              fontSize: '0.75rem',
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Accuracy (MAE):</span>
              <strong style={{ color: 'var(--color-text)' }}>₹{model.mae.toLocaleString('en-IN')}</strong>
            </div>
          )}
          {model.r2 != null && (
            <div style={{
              fontSize: '0.75rem',
              padding: '6px 10px',
              background: quality.color + '12',
              borderRadius: '8px',
              color: quality.color,
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Confidence:</span>
              <span>{(model.r2 * 100).toFixed(1)}% ({quality.label})</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Comparison Grid ──────────────────────────────────────────────────
export default function ModelComparisonCards({ allModels }) {
  if (!allModels || allModels.length === 0) return null;

  // Best model = first (sorted by lowest MAE in Python)
  const bestKey = allModels[0]?.model_key;

  return (
    <div style={{ marginTop: '28px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: '4px', height: '24px',
          background: 'linear-gradient(180deg, #4ade80, #60a5fa)',
          borderRadius: '2px',
        }} />
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Model Comparison
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Predictions from all 5 ML models — ranked by accuracy (MAE)
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '14px',
      }}>
        {allModels.map((model, idx) => (
          <ModelCard
            key={model.model_key}
            model={model}
            index={idx}
            isBest={model.model_key === bestKey}
          />
        ))}
      </div>

      {/* Legend note */}
      <p style={{
        fontSize: '0.72rem',
        color: 'var(--color-text-muted)',
        marginTop: '12px',
        textAlign: 'center',
      }}>
        ★ Best model selected based on lowest Mean Absolute Error (MAE) on test data.
        R² shows how well each model explains price variance.
      </p>
    </div>
  );
}
