// src/App.js — Root Application Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home      from './pages/Home';
import Dashboard from './pages/Dashboard';
import About     from './pages/About';

// ── Navbar Component ─────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="logo-icon">🌾</div>
          FarmPrice AI
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/"          className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/about"     className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about"     element={<About />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </Router>
  );
}

export default App;
