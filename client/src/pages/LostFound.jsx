import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/api';
import LostFoundCard from '../components/LostFound/LostFoundCard';
import LostFoundFormModal from '../components/LostFound/LostFoundFormModal';
import { AuthContext } from '../context/AuthContext';

export default function LostFound() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'lost' | 'found'
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/lostfound');
      setPosts(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter);

  return (
    <div className="container-main">
      <div className="page-header">
        <h1 className="page-title">🔍 Lost & Found</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            + Report Item
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: '1.25rem', maxWidth: 320 }}>
        {[['all', 'All Items'], ['lost', '🚨 Lost'], ['found', '✅ Found']].map(([val, label]) => (
          <button key={val} className={`tab ${filter === val ? 'active' : ''}`}
            onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="icon">🔍</span>
          <p>{filter === 'all' ? 'No items reported yet.' : `No ${filter} items yet.`}</p>
          {user && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setModalOpen(true)}>Report an Item</button>}
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map(p => <LostFoundCard key={p._id} post={p} onResolve={fetchPosts} />)}
        </div>
      )}

      {modalOpen && <LostFoundFormModal onClose={() => { setModalOpen(false); fetchPosts(); }} />}
    </div>
  );
}