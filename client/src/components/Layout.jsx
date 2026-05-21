import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { path: '/notes', label: 'Notes', icon: '📚' },
  { path: '/market', label: 'Market', icon: '🛒' },
  { path: '/lostfound', label: 'Lost & Found', icon: '🔍' },
  { path: '/confessions', label: 'Confessions', icon: '💬' },
  { path: '/placement', label: 'Placement', icon: '💼' },
  { path: '/chat', label: 'Chat', icon: '✉️' },
];

// Bottom nav shows only 5 most important links
const BOTTOM_NAV = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/notes', label: 'Notes', icon: '📚' },
  { path: '/market', label: 'Market', icon: '🛒' },
  { path: '/confessions', label: 'Confess', icon: '💬' },
  { path: '/placement', label: 'Jobs', icon: '💼' },
];

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ---- TOP NAVBAR ---- */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">🎓 CampusConnect</Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path}
              className={`nav-link ${isActive(l.path) ? 'active' : ''}`}>
              {l.icon} {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggle} title="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'transparent', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.75rem',
                  cursor: 'pointer', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600
                }}>
                <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.7rem' }}>▼</span>
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                  minWidth: 160, overflow: 'hidden', zIndex: 300
                }}>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '0.65rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: 'var(--text)' }}
                    className="nav-link">
                    👤 Profile
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '0.65rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: 'var(--text)' }}
                      className="nav-link">
                      ⚙️ Admin
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '0.65rem 1rem', fontSize: '0.875rem', border: 'none',
                      background: 'transparent', color: 'var(--danger)', cursor: 'pointer',
                      borderTop: '1px solid var(--border)'
                    }}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* ---- MAIN CONTENT ---- */}
      <main className="page-wrapper">
        {children}
      </main>

      {/* ---- BOTTOM NAV (MOBILE) ---- */}
      <nav className="bottom-nav">
        {BOTTOM_NAV.map(l => (
          <Link key={l.path} to={l.path}
            className={`bottom-nav-item ${isActive(l.path) ? 'active' : ''}`}>
            <span className="icon">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
