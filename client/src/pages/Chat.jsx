import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from '../services/api';

export default function Chat() {
  const { user, token } = useContext(AuthContext);
  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('seller');
  const productId = searchParams.get('product');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    const init = async () => {
      if (productId) {
        try {
          const { data } = await axios.get(`/market/${productId}`);
          setProduct(data);
        } catch (_) {}
      }
      if (productId && sellerId && token) {
        try {
          const resp = await axios.get(`/chat/${productId}/${sellerId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(resp.data.messages || []);
        } catch (_) {}
      }
      setLoading(false);
    };
    init();

    if (socket && productId && user) {
      const room = `${productId}-${user._id || user.id}-${sellerId}`;
      socket.emit('joinRoom', { room });
      socket.on('receiveMessage', (msg) => setMessages(m => [...m, msg]));
    }
    return () => { if (socket) socket.off('receiveMessage'); };
    // eslint-disable-next-line
  }, [socket, productId, sellerId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const uid = user._id || user.id;
    const room = `${productId}-${uid}-${sellerId}`;
    const msg = { content: input, sender: uid, room };
    socket.emit('sendMessage', msg);
    setMessages(prev => [...prev, { ...msg, createdAt: new Date() }]);
    setInput('');
    try {
      await axios.post(`/chat/${productId}/${sellerId}`,
        { content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (_) {}
  };

  if (!user) {
    return (
      <div className="container-main" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Please login to use chat</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (!productId || !sellerId) {
    return (
      <div className="container-main" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
        <p style={{ color: 'var(--text-muted)' }}>
          Open a chat from the Marketplace by clicking "Chat with Seller" on a product.
        </p>
        <Link to="/market" className="btn btn-outline" style={{ marginTop: '1rem' }}>Browse Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="chat-wrapper">
      {/* Header */}
      <div className="card" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '0.85rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/market" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {loading ? 'Loading...' : product?.title || 'Chat'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Chat with seller
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : messages.length === 0 ? (
          <div className="empty-state" style={{ margin: 'auto' }}>
            <span className="icon">💬</span>
            <p>Start the conversation!</p>
          </div>
        ) : messages.map((msg, idx) => {
          const uid = user._id || user.id;
          const isMe = msg.sender === uid || msg.sender?._id === uid;
          return (
            <div key={idx} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}>
                {msg.content}
                <div style={{ fontSize: '0.7rem', opacity: 0.65, marginTop: '0.2rem', textAlign: isMe ? 'right' : 'left' }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="chat-input-bar" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="input"
          placeholder="Type a message..."
          style={{ borderRadius: 99, flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: 99, padding: '0.55rem 1.2rem' }}>
          Send ➤
        </button>
      </form>
    </div>
  );
}