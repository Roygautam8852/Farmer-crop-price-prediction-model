// src/pages/About.jsx
// About page describing the project, tech stack, and team
import React from 'react';

const TECH = [
  { name: 'React.js',        role: 'Frontend UI',             icon: '⚛️',  color: '#61dafb' },
  { name: 'Node.js + Express', role: 'REST API Backend',      icon: '🟢',  color: '#68a063' },
  { name: 'scikit-learn',    role: 'ML Model (Python)',        icon: '🤖',  color: '#f7931e' },
  { name: 'MongoDB',         role: 'Database',                 icon: '🍃',  color: '#4db33d' },
  { name: 'Chart.js',        role: 'Data Visualization',       icon: '📊',  color: '#ff6384' },
  { name: 'Docker',          role: 'Containerization',         icon: '🐳',  color: '#2496ed' },
  { name: 'GitHub Actions',  role: 'CI Pipeline',              icon: '🔄',  color: '#2088ff' },
  { name: 'Jenkins',         role: 'CD Pipeline',              icon: '🏗️',  color: '#d33833' },
];

const CROPS_INFO = [
  { name: 'Rice',   season: 'Kharif',     avg: '₹1,800–2,400', icon: '🍚' },
  { name: 'Wheat',  season: 'Rabi',       avg: '₹1,700–2,200', icon: '🌾' },
  { name: 'Tomato', season: 'Kharif/Rabi',avg: '₹1,000–2,700', icon: '🍅' },
  { name: 'Onion',  season: 'Kharif/Rabi',avg: '₹700–2,000',   icon: '🧅' },
  { name: 'Potato', season: 'Rabi',       avg: '₹600–1,000',   icon: '🥔' },
  { name: 'Maize',  season: 'Kharif',     avg: '₹1,300–1,800', icon: '🌽' },
];

export default function About() {
  return (
    <div className="page-enter" style={{ position: 'relative', zIndex: 1 }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div className="badge badge-green" style={{ marginBottom: '20px' }}>About This Project</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '20px' }}>
          Empowering Farmers with <span className="text-gradient">AI Insights</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '680px', margin: '0 auto' }}>
          The <strong style={{ color: 'var(--color-text-primary)' }}>Farmer Crop Price Predictor</strong> is a production-ready 
          full-stack application built to help Indian farmers make data-driven decisions about when to sell their crops. 
          It combines real historical market data with state-of-the-art ML to provide price forecasts for 20+ major crops 
          across 25+ Indian states.
        </p>
      </section>

      {/* ── Problem & Solution ────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card" style={{ borderColor: 'rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>😟 The Problem</h3>
            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, paddingLeft: '20px', fontSize: '0.9rem' }}>
              <li>Farmers lack market intelligence when deciding to sell</li>
              <li>Middlemen exploit information asymmetry</li>
              <li>Price volatility causes significant income losses</li>
              <li>No accessible tool exists for small-scale farmers</li>
            </ul>
          </div>
          <div className="card" style={{ borderColor: 'rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.04)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>✅ Our Solution</h3>
            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, paddingLeft: '20px', fontSize: '0.9rem' }}>
              <li>ML model trained on 3+ years of APMC market data</li>
              <li>Instant price predictions with confidence ranges</li>
              <li>Mobile-friendly web app accessible to all</li>
              <li>Open-source, free to use, CI/CD automated</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── ML Architecture ───────────────────────────────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '60px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
            🤖 ML Model Architecture
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '40px', fontSize: '0.9rem' }}>
            Five distinct models trained and compared — ensemble evaluation for maximum accuracy
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              {
                name: 'Random Forest',
                icon: '🌲',
                desc: 'Ensemble of 200 decision trees. Captures non-linear seasonal patterns.',
                pros: ['High accuracy', 'Handles seasonality', 'Robust to outliers'],
                color: '#4ade80',
                selected: true,
              },
              {
                name: 'Gradient Boosting',
                icon: '🚀',
                desc: 'Optimized sequential learning. Learns from previous model errors.',
                pros: ['Extreme precision', 'Excellent for trends', 'Very powerful'],
                color: '#f59e0b',
              },
              {
                name: 'Linear Regression',
                icon: '📈',
                desc: 'Baseline statistical model. Good for general price trajectories.',
                pros: ['Interpretable', 'Fast training', 'Low memory'],
                color: '#60a5fa',
              },
              {
                name: 'Decision Tree',
                icon: '🌿',
                desc: 'Clear decision pathways. Excellent for simple category splits.',
                pros: ['Fast inference', 'Zero assumptions', 'Visual logic'],
                color: '#a78bfa',
              },
              {
                name: 'KNN',
                icon: '🔍',
                desc: 'K-Nearest Neighbors. Finds similar historic periods for prediction.',
                pros: ['No training required', 'Data driven', 'Local patterns'],
                color: '#f472b6',
              },
            ].map(m => (
              <div key={m.name} className="card" style={{
                border: m.selected ? '1px solid rgba(74,222,128,0.4)' : undefined,
                position: 'relative',
              }}>
                {m.selected && (
                  <span className="badge badge-green" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.7rem' }}>✓ Selected</span>
                )}
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{m.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: m.color }}>{m.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '12px', lineHeight: 1.6 }}>{m.desc}</p>
                <ul style={{ paddingLeft: '16px' }}>
                  {m.pros.map(p => (
                    <li key={p} style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.8 }}>
                      <span style={{ color: '#4ade80' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Features used */}
          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>📋 Feature Engineering</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['Crop Type (Label Encoded)', 'State/Region (Label Encoded)', 'Season (Label Encoded)', 'Month (Numeric)', 'Year (Numeric)'].map(f => (
                <span key={f} className="badge badge-blue" style={{ fontSize: '0.8rem' }}>{f}</span>
              ))}
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '12px' }}>
              Target: <strong style={{ color: 'var(--color-green-primary)' }}>Modal Price</strong> (₹/quintal) — 
              the most frequent transaction price at APMC mandis.
            </p>
          </div>
        </div>
      </section>

      {/* ── Crops Covered ─────────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>
          🌾 Crops Covered
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {CROPS_INFO.map(c => (
            <div key={c.name} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{c.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{c.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{c.season}</p>
              <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>{c.avg}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--color-border)', padding: '60px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>
            🛠️ Technology Stack
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {TECH.map(t => (
              <div key={t.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
                <span style={{ fontSize: '1.6rem' }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: t.color }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        <p>🌾 FarmPrice AI — Open Source · Built with ❤️ for Indian Farmers</p>
        <p style={{ marginTop: '6px' }}>Predictions are estimates based on historical APMC data. Not financial advice.</p>
      </footer>
    </div>
  );
}
