import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'MBA', 'MCA'];

export default function NoteUploadModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', description: '', branch: 'CSE', semester: '1', subject: '', file: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (!form.file) { setError('Please select a PDF file.'); return; }
    setError('');
    setLoading(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('branch', form.branch);
    fd.append('semester', form.semester);
    fd.append('subject', form.subject);
    fd.append('file', form.file);
    try {
      await axios.post('/notes', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Error uploading note.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">📤 Upload Note (PDF)</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="label">Title *</label>
              <input className="input" required placeholder="e.g. Data Structures Unit 3" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Subject</label>
              <input className="input" placeholder="e.g. Data Structures & Algorithms" value={form.subject} onChange={e => set('subject', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="textarea" placeholder="Brief description of the notes..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Branch</label>
                <select className="select" value={form.branch} onChange={e => set('branch', e.target.value)}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Semester</label>
                <select className="select" value={form.semester} onChange={e => set('semester', e.target.value)}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="label">PDF File *</label>
              <input
                type="file" accept="application/pdf" required
                onChange={e => set('file', e.target.files[0])}
                style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text)' }}
              />
              {form.file && <small style={{ color: 'var(--success)' }}>✓ {form.file.name}</small>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : '⬆️ Upload Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}