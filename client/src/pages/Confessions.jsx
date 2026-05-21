import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/api';
import ConfessionCard from '../components/Confessions/ConfessionCard';
import ConfessionFormModal from '../components/Confessions/ConfessionFormModal';
import { AuthContext } from '../context/AuthContext';

export default function Confessions() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [confs, setConfs] = useState([]);
  const [tab, setTab] = useState('recent'); // 'recent' | 'trending'
  const [loading, setLoading] = useState(true);

  const fetchConfs = async () => {
    setLoading(true);
    try {
      const url = tab === 'trending' ? '/confessions?trending=true' : '/confessions';
      const { data } = await axios.get(url);
      setConfs(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // eslint-disable-next-line
  useEffect(() => { fetchConfs(); }, [tab]);

  return (
    <div className="container-main" style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1 className="page-title">🤫 Confessions</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Confess
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.25rem' }}>
        <button className={`tab ${tab === 'recent' ? 'active' : ''}`} onClick={() => setTab('recent')}>
          🕐 Recent
        </button>
        <button className={`tab ${tab === 'trending' ? 'active' : ''}`} onClick={() => setTab('trending')}>
          🔥 Trending
        </button>
      </div>

      {/* Info */}
      <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
        🔒 All confessions are completely anonymous. Your identity is never revealed.
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : confs.length === 0 ? (
        <div className="empty-state">
          <span className="icon">🤫</span>
          <p>No confessions yet. Be brave, share yours!</p>
          {user && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(true)}>Share Anonymously</button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {confs.map(conf => (
            <ConfessionCard key={conf._id} confession={conf} onAction={fetchConfs} />
          ))}
        </div>
      )}

      {showModal && (
        <ConfessionFormModal onClose={() => { setShowModal(false); fetchConfs(); }} />
      )}
    </div>
  );
}