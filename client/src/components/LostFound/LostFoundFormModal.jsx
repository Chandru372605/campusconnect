import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

export default function LostFoundFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', description: '', contact: '', location: '', status: 'lost', image: null });
  const [imgPrev, setImgPrev] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) { set('image', file); setImgPrev(URL.createObjectURL(file)); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('contact', form.contact);
    fd.append('location', form.location);
    fd.append('status', form.status);
    if (form.image) fd.append('image', form.image);
    try {
      await axios.post('/lostfound', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Error reporting item.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">🔍 Report Item</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            {/* Lost / Found toggle */}
            <div className="form-group">
              <label className="label">Type</label>
              <div className="tabs">
                <button type="button" className={`tab ${form.status === 'lost' ? 'active' : ''}`} onClick={() => set('status', 'lost')}>🚨 I Lost It</button>
                <button type="button" className={`tab ${form.status === 'found' ? 'active' : ''}`} onClick={() => set('status', 'found')}>✅ I Found It</button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Item Title *</label>
              <input className="input" required placeholder="e.g. Blue water bottle" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Description *</label>
              <textarea className="textarea" required placeholder="Describe the item (color, brand, distinguishing features...)" value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Location</label>
                <input className="input" placeholder="e.g. Library Block A" value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Contact</label>
                <input className="input" placeholder="Phone / Instagram" value={form.contact} onChange={e => set('contact', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="label">Photo (optional)</label>
              <input type="file" accept="image/*" onChange={handleFile}
                style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text)' }} />
              {imgPrev && (
                <img src={imgPrev} alt="preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', border: '2px solid var(--border)' }} />
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Reporting...' : '📢 Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}