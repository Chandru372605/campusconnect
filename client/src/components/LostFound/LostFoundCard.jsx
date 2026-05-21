import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

export default function LostFoundCard({ post, onResolve }) {
  const { user, token } = useContext(AuthContext);
  const uid = user?._id || user?.id;
  const isOwner = uid && post.postedBy?._id === uid;
  const isLost = post.status === 'lost';

  const handleResolve = async () => {
    if (window.confirm('Mark this item as resolved/found?')) {
      try {
        await axios.patch(`/lostfound/${post._id}/resolve`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onResolve?.();
      } catch (_) {}
    }
  };

  return (
    <div className="card" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      {post.image && (
        <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Status badges */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className={`badge ${isLost ? 'badge-danger' : 'badge-success'}`}>
            {isLost ? '🚨 LOST' : '✅ FOUND'}
          </span>
          {post.isResolved && <span className="badge badge-secondary">✓ Resolved</span>}
          {post.location && <span className="badge badge-info">📍 {post.location}</span>}
        </div>

        <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{post.title}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', flex: 1, lineHeight: 1.5 }}>
          {post.description}
        </p>

        {/* Footer */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          {post.contact && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              📞 {post.contact}
            </div>
          )}
          {post.postedBy && (
            <div className="user-row" style={{ marginBottom: isOwner && !post.isResolved ? '0.75rem' : 0 }}>
              <div className="avatar avatar-sm">
                {post.postedBy.avatar
                  ? <img src={post.postedBy.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : post.postedBy.name?.[0]
                }
              </div>
              <div>
                <div className="user-name">{post.postedBy.name}</div>
                <div className="user-sub">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          )}
          {isOwner && !post.isResolved && (
            <button className="btn btn-success btn-sm" style={{ width: '100%' }} onClick={handleResolve}>
              ✓ Mark as Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
}