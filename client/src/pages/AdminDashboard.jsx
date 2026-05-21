import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportedConfs, setReportedConfs] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!user?.isAdmin) return;
    Promise.all([
      axios.get('/admin/users', headers).then(r => setUsers(r.data)),
      axios.get('/admin/confessions/reported', headers).then(r => setReportedConfs(r.data)),
      axios.get('/admin/analytics', headers).then(r => setAnalytics(r.data)),
      axios.get('/admin/reports', headers).then(r => setReports(r.data)),
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const approveConf = async (id) => {
    await axios.patch(`/admin/confessions/${id}/approve`, {}, headers);
    setReportedConfs(c => c.filter(x => x._id !== id));
  };
  const deleteConf = async (id) => {
    await axios.delete(`/admin/confessions/${id}`, headers);
    setReportedConfs(c => c.filter(x => x._id !== id));
  };

  if (!user?.isAdmin) {
    return (
      <div className="container-main" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
        <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>This page is for admins only.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const STAT_CARDS = [
    { label: 'Total Users', value: analytics.users ?? '—', icon: '👥', color: '#6366f1' },
    { label: 'Confessions', value: analytics.confessions ?? '—', icon: '💬', color: '#8b5cf6' },
    { label: 'Notes', value: analytics.notes ?? '—', icon: '📚', color: '#06b6d4' },
    { label: 'Market Items', value: analytics.listings ?? '—', icon: '🛒', color: '#10b981' },
  ];

  return (
    <div className="container-main">
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <span className="badge badge-danger">Admin</span>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {[['overview', '📊 Overview'], ['users', '👥 Users'], ['moderation', '🛡️ Moderation'], ['reports', '🚨 Reports']].map(([val, label]) => (
          <button key={val} className={`tab ${activeTab === val ? 'active' : ''}`} onClick={() => setActiveTab(val)}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <>
          {/* ---- OVERVIEW ---- */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid-cards" style={{ marginBottom: '1.5rem' }}>
                {STAT_CARDS.map(s => (
                  <div key={s.label} className="card card-body" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="card card-body">
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>⚠️ Pending Moderation</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>{reportedConfs.length}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reported Confessions</div>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,0.08)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>{reports.length}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open Reports</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- USERS ---- */}
          {activeTab === 'users' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(99,102,241,0.06)', borderBottom: '1px solid var(--border)' }}>
                      {['User', 'Email', 'College', 'Verified', 'Role', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <div className="user-row">
                            <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                              {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : u.name?.[0]}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem' }}>{u.college || '—'}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span className={`badge ${u.isVerified ? 'badge-success' : 'badge-warning'}`}>
                            {u.isVerified ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          {u.isAdmin ? <span className="badge badge-danger">Admin</span> : <span className="badge badge-info">Student</span>}
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <div className="empty-state"><p>No users yet</p></div>}
              </div>
            </div>
          )}

          {/* ---- MODERATION ---- */}
          {activeTab === 'moderation' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🚩 Reported Confessions</h3>
              {reportedConfs.length === 0 ? (
                <div className="empty-state"><span className="icon">✅</span><p>No reported confessions. All clear!</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reportedConfs.map(conf => (
                    <div key={conf._id} className="card card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ marginBottom: '0.25rem' }}>{conf.text}</p>
                        <small style={{ color: 'var(--text-muted)' }}>{new Date(conf.createdAt).toLocaleString()}</small>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button className="btn btn-success btn-sm" onClick={() => approveConf(conf._id)}>✓ Keep</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteConf(conf._id)}>✕ Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- REPORTS ---- */}
          {activeTab === 'reports' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🚨 User Reports</h3>
              {reports.length === 0 ? (
                <div className="empty-state"><span className="icon">✅</span><p>No reports. Community is healthy!</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reports.map(r => (
                    <div key={r._id} className="card card-body">
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-warning">{r.postType}</span>
                        <span style={{ flex: 1, fontSize: '0.875rem' }}>{r.reason}</span>
                        <small style={{ color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}