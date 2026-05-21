import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

export default function ConfessionCard({ confession, onAction }) {
  const { user, token } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(confession.likes?.length || 0);
  const [liked, setLiked] = useState(confession.likes?.includes(user?._id || user?.id));
  const [loading, setLoading] = useState(false);

  const like = async () => {
    if (!user) { alert('Please login to like confessions'); return; }
    setLoading(true);
    try {
      await axios.post(`/confessions/${confession._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikeCount(l => liked ? l - 1 : l + 1);
      setLiked(l => !l);
      onAction?.();
    } catch (_) {}
    setLoading(false);
  };

  const report = async () => {
    if (!user) { alert('Please login to report'); return; }
    if (window.confirm('Report this confession for moderation?')) {
      try {
        await axios.post(`/confessions/${confession._id}/report`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Reported. Our moderators will review this confession.');
        onAction?.();
      } catch (_) {}
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="card card-body">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', flexShrink: 0
        }}>🎭</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Anonymous</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo(confession.createdAt)}</div>
        </div>
      </div>

      {/* Text */}
      <p style={{ fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1rem', color: 'var(--text)' }}>
        {confession.text}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
        <button
          className="btn btn-sm" disabled={loading}
          onClick={like}
          style={{
            background: liked ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: liked ? 'var(--primary)' : 'var(--text-muted)',
            border: '1px solid var(--border)'
          }}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button
          className="btn btn-sm btn-ghost"
          onClick={report}
          style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}
          title="Report">
          🚩 Report
        </button>
      </div>
    </div>
  );
}