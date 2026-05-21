import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

const CATEGORIES = ['Books', 'Electronics', 'Cycle / Bike', 'Hostel Supplies', 'Clothing', 'Sports', 'Stationery', 'Others'];

export default function ProductFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', price: '', description: '', category: 'Books', images: [] });
  const [imgPreviews, setImgPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const handleFiles = e => {
    const files = [...e.target.files].slice(0, 4);
    set('images', files);
    setImgPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('price', form.price);
    form.images.forEach(f => fd.append('images', f));
    try {
      await axios.post('/market', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Error listing product. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">🛒 List an Item</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="label">Item Title *</label>
              <input className="input" required placeholder="e.g. Data Structures Textbook" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Price (₹) *</label>
                <input className="input" required type="number" min="0" placeholder="e.g. 350" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Category</label>
                <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="label">Description *</label>
              <textarea className="textarea" required placeholder="Condition, details, why you're selling..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Photos (up to 4)</label>
              <input type="file" accept="image/*" multiple onChange={handleFiles}
                style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text)' }} />
              {imgPreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {imgPreviews.map((img, i) => (
                    <img key={i} src={img} alt="preview"
                      style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border)' }} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Listing...' : '🛒 List Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}