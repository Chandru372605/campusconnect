import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

const TYPES = [
  { value: 'on-campus', label: '🏫 On Campus' },
  { value: 'off-campus', label: '🌐 Off Campus' },
  { value: 'internship', label: '💡 Internship' },
  { value: 'ppo', label: '⭐ PPO' },
];

export default function PlacementFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: '', body: '', company: '', type: 'on-campus', package: '', tags: '', applyLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      await axios.post('/placement', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to post. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">💼 Share Placement Experience</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="label">Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                {TYPES.map(t => (
                  <button
                    key={t.value} type="button"
                    className={`btn btn-sm ${form.type === t.value ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => set('type', t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Company *</label>
                <input className="input" required placeholder="e.g. Google" value={form.company} onChange={e => set('company', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Package (LPA)</label>
                <input className="input" placeholder="e.g. 12" type="number" min="0" value={form.package} onChange={e => set('package', e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="label">Title *</label>
              <input className="input" required placeholder="e.g. My Google SDE1 Interview Experience" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Details *</label>
              <textarea className="textarea" required placeholder="Share your experience, tips, interview process..." rows={5}
                value={form.body} onChange={e => set('body', e.target.value)} style={{ minHeight: 120 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Tags</label>
                <input className="input" placeholder="dsa, system-design, hr" value={form.tags} onChange={e => set('tags', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Apply Link</label>
                <input className="input" type="url" placeholder="https://..." value={form.applyLink} onChange={e => set('applyLink', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : '🚀 Post Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}