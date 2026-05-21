import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  const features = [
    { title: 'Notes', path: '/notes', icon: '📚', desc: 'Share & download study notes' },
    { title: 'Marketplace', path: '/market', icon: '🛒', desc: 'Buy & sell campus items' },
    { title: 'Lost & Found', path: '/lostfound', icon: '🔍', desc: 'Post lost or found items' },
    { title: 'Confessions', path: '/confessions', icon: '💬', desc: 'Anonymous campus confessions' },
    { title: 'Placements', path: '/placement', icon: '💼', desc: 'Job & internship opportunities' },
    { title: 'Chat', path: '/chat', icon: '💬', desc: 'Real-time campus chat' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">CampusConnect</h1>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-indigo-600 hover:underline">Profile</Link>
              <Link to="/admin" className="text-sm font-medium text-gray-500 hover:underline">Admin</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-indigo-600 hover:underline">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center py-20 px-4">
        <h2 className="text-5xl font-extrabold text-indigo-600 mb-4">Your Campus Hub</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Notes, marketplace, confessions, placements & real-time chat — all in one place for college students.
        </p>
        {!user && (
          <Link to="/register" className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition">
            Get Started 🚀
          </Link>
        )}
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(f => (
          <Link key={f.path} to={f.path}
            className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold mb-1">{f.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
