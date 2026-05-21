import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';

const FIELDS = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
  { key: 'email', label: 'College Email', type: 'email', placeholder: 'you@college.edu' },
  { key: 'college', label: 'College / University', type: 'text', placeholder: 'e.g. IIT Madras' },
  { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
  { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', college: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/register', {
        name: form.name, email: form.email, college: form.college, password: form.password
      });
      setSuccess(data.message || 'Registered! Check your email to verify your account.');
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.06))'
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>Join CampusConnect</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Create your campus account in seconds
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && (
              <div className="alert alert-success">
                ✅ {success}<br />
                <small>Redirecting to login in a moment...</small>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit}>
                {FIELDS.map(f => (
                  <div key={f.key} className="form-group">
                    <label className="label">{f.label}</label>
                    <input
                      type={f.type} required
                      className="input"
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  {loading ? 'Creating account...' : 'Create Account 🚀'}
                </button>
              </form>
            )}

            <div className="divider" />
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          Only college email addresses (.edu, .ac.in) are accepted
        </p>
      </div>
    </div>
  );
}
