import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="container-main" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You need to be logged in to view your profile.</p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="container-main" style={{ maxWidth: 480 }}>
      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>👤 My Profile</h1>

      {/* Profile Card */}
      <div className="card card-body" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2rem', fontWeight: 800, color: '#fff', overflow: 'hidden'
        }}>
          {user.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initial
          }
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>{user.name}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{user.email}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user.college && <span className="badge badge-info">🏫 {user.college}</span>}
          {user.isAdmin && <span className="badge badge-danger">⚙️ Admin</span>}
          {user.isVerified && <span className="badge badge-success">✓ Verified</span>}
        </div>
      </div>

      {/* Quick Links */}
      <div className="card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
        {[
          { to: '/notes', icon: '📚', label: 'My Notes' },
          { to: '/market', icon: '🛒', label: 'My Listings' },
          { to: '/confessions', icon: '🤫', label: 'Confessions' },
          ...(user.isAdmin ? [{ to: '/admin', icon: '⚙️', label: 'Admin Dashboard' }] : []),
        ].map((item, idx, arr) => (
          <Link key={item.to} to={item.to} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.9rem 1.25rem',
            textDecoration: 'none', color: 'var(--text)',
            borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none',
            transition: 'background 0.15s',
            fontSize: '0.9rem', fontWeight: 500
          }}
            className="nav-link" style2={{ borderRadius: 0 }}>
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            {item.label}
            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>›</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
        🚪 Logout
      </button>
    </div>
  );
}
