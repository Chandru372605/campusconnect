import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import SocketProvider from './context/SocketContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Marketplace from './pages/Marketplace';
import LostFound from './pages/LostFound';
import Confessions from './pages/Confessions';
import Placement from './pages/Placement';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/market" element={<Marketplace />} />
                <Route path="/lostfound" element={<LostFound />} />
                <Route path="/confessions" element={<Confessions />} />
                <Route path="/placement" element={<Placement />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Layout>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;