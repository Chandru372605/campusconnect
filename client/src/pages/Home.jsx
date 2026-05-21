import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FEATURES = [
  { path: '/notes', icon: '📚', label: 'Notes', desc: 'Share & download study notes by branch and semester', color: '#6366f1' },
  { path: '/market', icon: '🛒', label: 'Marketplace', desc: 'Buy & sell textbooks, gadgets and campus gear', color: '#8b5cf6' },
  { path: '/lostfound', icon: '🔍', label: 'Lost & Found', desc: 'Report or recover lost items on campus', color: '#06b6d4' },
  { path: '/confessions', icon: '🤫', label: 'Confessions', desc: 'Share anonymous thoughts with your campus community', color: '#f59e0b' },
  { path: '/placement', icon: '💼', label: 'Placement Hub', desc: 'Job openings, internships & placement experiences', color: '#10b981' },
  { path: '/chat', icon: '✉️', label: 'Chat', desc: 'Real-time messaging with classmates and sellers', color: '#ef4444' },
];

const STATS = [
  { label: 'Students', value: '10K+', icon: '👥' },
  { label: 'Notes Shared', value: '5K+', icon: '📄' },
  { label: 'Items Listed', value: '2K+', icon: '🛍️' },
  { label: 'Colleges', value: '50+', icon: '🏫' },
];

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container-main">
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-title">Your Campus, Connected</div>
        <p className="hero-sub">
          Notes, marketplace, confessions, placements & real-time chat —<br />
          everything your college life needs, in one place.
        </p>
        {user ? (
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/notes" className="btn btn-primary">Browse Notes 📚</Link>
            <Link to="/market" className="btn btn-outline">Visit Market 🛒</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">Get Started Free 🚀</Link>
            <Link to="/login" className="btn btn-outline">Sign In</Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {STATS.map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>
        EXPLORE FEATURES
      </h2>
      <div className="grid-cards">
        {FEATURES.map(f => (
          <Link key={f.path} to={f.path} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-name">{f.label}</div>
            <div className="feature-desc">{f.desc}</div>
            <div style={{ color: f.color, fontSize: '0.8rem', fontWeight: 600, marginTop: 'auto' }}>
              Explore →
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Banner */}
      {!user && (
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: 'var(--radius)',
          padding: '2rem',
          textAlign: 'center',
          marginTop: '2rem',
          color: '#fff'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Ready to connect with your campus?
          </h3>
          <p style={{ opacity: 0.9, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            Join thousands of students already using CampusConnect
          </p>
          <Link to="/register" style={{
            background: '#fff',
            color: 'var(--primary)',
            padding: '0.65rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>
            Join Now — It's Free
          </Link>
        </div>
      )}
    </div>
  );
}
