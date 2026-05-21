import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

export default function PlacementCommentsModal({ post, onClose }) {
  const { user, token } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`/placement/${post._id}/comment`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(prev => [...prev, { ...data, user: { name: user?.name, avatar: user?.avatar } }]);
      setText('');
    } catch (_) {}
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">💬 Discussion</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{post.title}</p>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Comments List */}
          <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: '1rem' }}>
            {comments.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem 0' }}>
                <span className="icon" style={{ fontSize: '1.5rem' }}>💬</span>
                <p style={{ fontSize: '0.875rem' }}>No comments yet. Start the discussion!</p>
              </div>
            ) : comments.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.85rem', alignItems: 'flex-start' }}>
                <div className="avatar avatar-sm">
                  {c.user?.avatar
                    ? <img src={c.user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : c.user?.name?.[0] || '?'
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{c.user?.name || 'Anonymous'}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text)' }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          {user ? (
            <form onSubmit={addComment} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="input" style={{ flex: 1 }}
                value={text} onChange={e => setText(e.target.value)}
                required placeholder="Write a comment..."
              />
              <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
                {loading ? '...' : 'Post'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Login to add a comment
            </div>
          )}
        </div>
      </div>
    </div>
  );
}