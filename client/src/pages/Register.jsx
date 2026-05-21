import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/register', form);
      setSuccess(data.message || 'Registered! Check your email to verify your account.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500/30 to-purple-600/30 dark:from-gray-900 dark:to-gray-950">
      <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-indigo-600">Join CampusConnect</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">Create your campus account</p>
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your Name' },
            { label: 'College Email', key: 'email', type: 'email', placeholder: 'you@college.edu' },
            { label: 'College / University', key: 'college', type: 'text', placeholder: 'Your College Name' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
              <input
                type={f.type} required placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
