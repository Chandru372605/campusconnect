import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../services/api';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-blue-500/30 to-indigo-600/30 dark:from-gray-900 dark:to-gray-950">
      <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-indigo-600">CampusConnect</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">Sign in to your campus account</p>
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College Email</label>
            <input
              type="email" required
              placeholder="you@college.edu"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password" required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}