// src/pages/Home.jsx
// Main landing + prediction page
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PredictForm from '../components/PredictForm';
import ResultCard  from '../components/ResultCard';
import PriceChart  from '../components/PriceChart';

const STATS = [
  { label: 'Crops Covered',    value: '20+',   icon: '🌾' },
  { label: 'States Covered',   value: '25+',   icon: '🗺️' },
  { label: 'ML Accuracy',      value: '94%',  icon: '🤖' },
  { label: 'Predictions Made', value: '10K+', icon: '⚡' },
];

export default function Home() {
  const [result,    setResult]    = useState(null);

  const handleResult = (data, errorMsg) => {
    if (errorMsg) {
      toast.error(errorMsg);
      setResult(null);
    } else {
      setResult(data);
      toast.success('✅ Prediction complete!');
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="page-enter" style={{ position: 'relative', zIndex: 1 }}>
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Glowing orb decoration */}
        <div style={{
          position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="badge badge-green" style={{ marginBottom: '20px', fontSize: '0.8rem', padding: '6px 16px' }}>
          🇮🇳 Built for Indian Farmers · Powered by AI
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
          Predict Crop Prices with{' '}
          <span className="text-gradient">Machine Learning</span>
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '580px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Get accurate price predictions for Rice, Wheat, Tomato, Onion, Potato & Maize.
          Make smarter selling decisions with AI-powered insights.
        </p>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          maxWidth: '700px',
          margin: '0 auto 60px',
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              transition: 'var(--transition)',
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: 'var(--color-green-primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Predict Section ────────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>

          {/* Left — Form */}
          <div>
            <PredictForm onResult={handleResult} onLoading={() => {}} />

            {/* Show chart below form once we have a result crop+state */}
            {result && (
              <div style={{ marginTop: '24px' }}>
                <PriceChart crop={result.form.crop} state={result.form.state} />
              </div>
            )}
          </div>

          {/* Right — Result */}
          {result && (
            <div id="result-section">
              <ResultCard result={result} />
            </div>
          )}
        </div>

        {/* Show chart before any prediction (show default) */}
        {!result && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
              📊 Sample Price Trends
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              <PriceChart crop="Rice"  state="Punjab" />
              <PriceChart crop="Wheat" state="Punjab" />
            </div>
          </div>
        )}
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--color-border)', padding: '60px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>How It Works</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px' }}>
            Three simple steps to get your prediction
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', icon: '📝', title: 'Enter Details', desc: 'Select your crop, state, season, and target month/year' },
              { step: '02', icon: '🤖', title: '5-Model Analysis', desc: 'Our system runs 5 distinct ML models (Random Forest, Gradient Boosting, etc.) simultaneously for maximum precision.' },
              { step: '03', icon: '📊', title: 'Compare & Decide', desc: 'View side-by-side results from all models with accuracy metrics to make the most informed selling decision.' },
            ].map(item => (
              <div key={item.step} className="card" style={{ textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '2.5rem', fontWeight: 800, color: 'rgba(74,222,128,0.06)', fontFamily: 'Outfit,sans-serif' }}>{item.step}</div>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
