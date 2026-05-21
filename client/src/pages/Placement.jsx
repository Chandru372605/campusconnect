import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/api';
import PlacementCard from '../components/Placement/PlacementCard';
import PlacementFormModal from '../components/Placement/PlacementFormModal';
import { AuthContext } from '../context/AuthContext';

export default function Placement() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/placement?company=${encodeURIComponent(company)}&q=${encodeURIComponent(search)}`
      );
      setPosts(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // eslint-disable-next-line
  useEffect(() => { fetchPosts(); }, [company]);

  return (
    <div className="container-main" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <h1 className="page-title">💼 Placement Hub</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            + Share Experience
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, minWidth: 180 }}>
          <span>🔍</span>
          <input
            placeholder="Search by role, skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchPosts()}
          />
        </div>
        <input
          className="input"
          style={{ width: 'auto', minWidth: 130 }}
          placeholder="Filter by company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          onBlur={fetchPosts}
        />
        <button className="btn btn-outline btn-sm" onClick={fetchPosts}>Search</button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <span className="icon">💼</span>
          <p>No placement posts yet. Share your experience!</p>
          {user && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setModal(true)}>Share Experience</button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(p => <PlacementCard key={p._id} post={p} />)}
        </div>
      )}

      {modal && <PlacementFormModal onClose={() => { setModal(false); fetchPosts(); }} />}
    </div>
  );
}