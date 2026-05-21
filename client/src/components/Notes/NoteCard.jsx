import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../services/api';

export default function NoteCard({ note, onAction }) {
  const { user, token } = useContext(AuthContext);
  const [votes, setVotes] = useState(note.upvotes?.length || 0);
  const [preview, setPreview] = useState(false);
  const [voting, setVoting] = useState(false);

  const upvote = async () => {
    if (!user) return alert('Login to upvote');
    setVoting(true);
    try {
      await axios.post(`/notes/${note._id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uid = user._id || user.id;
      setVotes(v => note.upvotes?.includes(uid) ? v - 1 : v + 1);
      onAction?.();
    } catch (_) {}
    setVoting(false);
  };

  const download = () => window.open(note.fileUrl, '_blank');

  return (
    <div className="card card-body">
      {/* Header */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{note.title}</h3>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {note.branch && <span className="badge badge-primary">{note.branch}</span>}
            {note.semester && <span className="badge badge-info">Sem {note.semester}</span>}
            {note.subject && <span className="badge badge-secondary">{note.subject}</span>}
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Description */}
      {note.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
          {note.description}
        </p>
      )}

      {/* PDF Preview */}
      {preview && note.fileUrl && (
        <div style={{ marginBottom: '0.75rem' }}>
          <iframe
            src={note.fileUrl}
            title="PDF Preview"
            style={{ width: '100%', height: 240, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-primary btn-sm" onClick={download}>
          ⬇️ Download PDF
        </button>
        {note.fileUrl && (
          <button className="btn btn-outline btn-sm" onClick={() => setPreview(p => !p)}>
            {preview ? '🙈 Hide' : '👁️ Preview'}
          </button>
        )}
        <button
          className="btn btn-ghost btn-sm" onClick={upvote} disabled={voting}
          style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 700 }}>
          👍 {votes}
        </button>
      </div>

      {/* Uploader */}
      {note.uploader && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}
          className="user-row">
          <div className="avatar avatar-sm">
            {note.uploader.avatar
              ? <img src={note.uploader.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : note.uploader.name?.[0]
            }
          </div>
          <div>
            <div className="user-name">{note.uploader.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}