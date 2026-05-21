import React, { useState } from 'react';
import PlacementCommentsModal from './PlacementCommentsModal';

const CTYPES = {
  'on-campus': { label: 'On Campus', color: 'badge-success' },
  'off-campus': { label: 'Off Campus', color: 'badge-warning' },
  'internship': { label: 'Internship', color: 'badge-info' },
  'ppo': { label: 'PPO', color: 'badge-secondary' },
};

export default function PlacementCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const type = CTYPES[post.type] || { label: post.type, color: 'badge-primary' };

  return (
    <div className="card card-body">
      {/* Header */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        {post.creator?.avatar ? (
          <img src={post.creator.avatar} alt="" className="avatar" style={{ flexShrink: 0, width: 40, height: 40 }} />
        ) : (
          <div className="avatar" style={{ flexShrink: 0 }}>
            {post.creator?.name?.[0] || '?'}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{post.creator?.name || 'Anonymous'}</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
            <span className="badge badge-primary" style={{ fontWeight: 700 }}>🏢 {post.company}</span>
            <span className={`badge ${type.color}`}>{type.label}</span>
            {post.package && <span className="badge badge-success">💰 {post.package} LPA</span>}
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title & Body */}
      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{post.title}</h3>
      {post.body && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>
          {post.body}
        </p>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {post.tags.map((t, i) => (
            <span key={i} className="badge badge-secondary">#{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowComments(true)}>
          💬 Comments ({post.comments?.length || 0})
        </button>
        {post.applyLink && (
          <a href={post.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
            Apply →
          </a>
        )}
      </div>

      {showComments && (
        <PlacementCommentsModal post={post} onClose={() => setShowComments(false)} />
      )}
    </div>
  );
}