import React, { useEffect, useState, useContext } from "react";
import axios from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportedConfs, setReportedConfs] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    if (!user?.isAdmin) return;
    axios.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }).then(r => setUsers(r.data));
    axios.get("/admin/confessions/reported", { headers: { Authorization: `Bearer ${token}` } }).then(r => setReportedConfs(r.data));
    axios.get("/admin/analytics", { headers: { Authorization: `Bearer ${token}` } }).then(r => setAnalytics(r.data));
    axios.get("/admin/reports", { headers: { Authorization: `Bearer ${token}` } }).then(r => setReports(r.data));
    // eslint-disable-next-line
  }, []);

  const approveConf = async (id) => {
    await axios.patch(`/admin/confessions/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setReportedConfs(reportedConfs.filter(c => c._id !== id));
  };

  const deleteConf = async (id) => {
    await axios.delete(`/admin/confessions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setReportedConfs(reportedConfs.filter(c => c._id !== id));
  };

  if (!user?.isAdmin) {
    return <div className="p-8 text-center text-red-600">Admins only</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
          <div className="font-bold text-lg">Analytics</div>
          <div className="mt-2">
            <div>Users: {analytics.users}</div>
            <div>Confessions: {analytics.confessions}</div>
            {/* Add more metrics */}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
          <div className="font-bold text-lg">Recent Users</div>
          <ul>
            {users.slice(0, 8).map(u =>
              <li key={u._id}>
                {u.avatar && <img src={u.avatar} alt="" className="w-5 h-5 rounded-full inline mr-1" />}
                {u.name} · {u.email}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="mb-8">
        <div className="font-bold text-xl">Reported Confessions</div>
        {reportedConfs.length === 0 && <div className="text-gray-600">None</div>}
        {reportedConfs.map(conf => (
          <div key={conf._id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded my-2 flex justify-between items-center">
            <div className="flex-1">{conf.text}</div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-success" onClick={() => approveConf(conf._id)}>Approve</button>
              <button className="btn btn-sm btn-error" onClick={() => deleteConf(conf._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="font-bold text-xl">Reports</div>
        {reports.length === 0 && <div className="text-gray-600">No reports yet</div>}
        {reports.map(r => (
          <div key={r._id} className="bg-gray-50 dark:bg-gray-800 p-2 rounded mb-2">
            <div>
              <b>{r.postType}</b> &mdash; {r.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}