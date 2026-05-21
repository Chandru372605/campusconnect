import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

export default function ConfessionFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const maxLen = 500;

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (text.length > maxLen) { setError(`Max ${maxLen} characters allowed.`); return; }
    setLoading(true);
    setError('');
    try {
      await axios.post('/confessions', { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not post confession. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">🤫 Share Anonymously</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
              🔒 Your identity is completely anonymous. No personal data is stored.
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="label">Your Confession</label>
              <textarea
                className="textarea"
                required
                placeholder="What's on your mind? Share it anonymously with your campus community..."
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ minHeight: 140 }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: text.length > maxLen ? 'var(--danger)' : 'var(--text-muted)' }}>
                {text.length}/{maxLen}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !text.trim()}>
              {loading ? 'Posting...' : '🤫 Post Anonymously'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}