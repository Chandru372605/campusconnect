import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">You are not logged in.</p>
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mx-auto mb-4 text-4xl">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : '👤'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user.email}</p>
        {user.isAdmin && (
          <span className="inline-block mt-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
            Admin
          </span>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/" className="w-full py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 transition">
            🏠 Home
          </Link>
          {user.isAdmin && (
            <Link to="/admin" className="w-full py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 transition">
              ⚙️ Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
