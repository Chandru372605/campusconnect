import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/api';
import NoteCard from '../components/Notes/NoteCard';
import NoteUploadModal from '../components/Notes/NoteUploadModal';
import { AuthContext } from '../context/AuthContext';

const BRANCHES = ['', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'MBA', 'MCA'];
const SEMESTERS = ['', '1', '2', '3', '4', '5', '6', '7', '8'];

export default function Notes() {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/notes?branch=${encodeURIComponent(branch)}&semester=${encodeURIComponent(semester)}&q=${encodeURIComponent(q)}`
      );
      setNotes(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // eslint-disable-next-line
  useEffect(() => { fetchNotes(); }, [branch, semester]);

  return (
    <div className="container-main">
      <div className="page-header">
        <h1 className="page-title">📚 Notes Sharing</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            + Upload Note
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, minWidth: 180 }}>
          <span>🔍</span>
          <input
            placeholder="Search notes..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchNotes()}
          />
          {q && <button className="btn-icon" onClick={() => { setQ(''); fetchNotes(); }}>✕</button>}
        </div>
        <select className="select" style={{ width: 'auto' }} value={branch} onChange={e => setBranch(e.target.value)}>
          {BRANCHES.map(b => <option key={b} value={b}>{b || 'All Branches'}</option>)}
        </select>
        <select className="select" style={{ width: 'auto' }} value={semester} onChange={e => setSemester(e.target.value)}>
          {SEMESTERS.map(s => <option key={s} value={s}>{s ? `Sem ${s}` : 'All Semesters'}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={fetchNotes}>Search</button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <span className="icon">📭</span>
          <p>No notes found. Be the first to upload!</p>
          {user && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setModal(true)}>Upload Note</button>}
        </div>
      ) : (
        <div className="grid-cards-2">
          {notes.map(note => <NoteCard key={note._id} note={note} onAction={fetchNotes} />)}
        </div>
      )}

      {modal && <NoteUploadModal onClose={() => { setModal(false); fetchNotes(); }} />}
    </div>
  );
}