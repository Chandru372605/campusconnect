import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailModal({ product, onClose }) {
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ fontSize: '1rem' }}>{product.title}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Image Gallery */}
            {images.length > 0 && (
              <div>
                <div style={{
                  width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden', background: 'var(--border)', marginBottom: '0.5rem'
                }}>
                  <img src={images[activeImg]} alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
                    {images.map((img, i) => (
                      <img key={i} src={img} alt=""
                        onClick={() => setActiveImg(i)}
                        style={{
                          width: 64, height: 64, objectFit: 'cover',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer', flexShrink: 0,
                          border: `2px solid ${i === activeImg ? 'var(--primary)' : 'var(--border)'}`,
                          transition: 'border-color 0.15s'
                        }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.category && <span className="badge badge-info">{product.category}</span>}
                {product.isSold && <span className="badge badge-danger">Sold</span>}
              </div>

              {product.description && (
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)', marginBottom: '1rem' }}>
                  {product.description}
                </p>
              )}

              {/* Seller */}
              {product.seller && (
                <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.06)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>SELLER</div>
                  <div className="user-row">
                    <div className="avatar">
                      {product.seller.avatar
                        ? <img src={product.seller.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        : product.seller.name?.[0]
                      }
                    </div>
                    <div>
                      <div className="user-name">{product.seller.name}</div>
                      <div className="user-sub">{product.seller.college}</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}
                  disabled={product.isSold}
                  onClick={() => navigate(`/chat?seller=${product.seller?._id}&product=${product._id}`)}>
                  💬 Chat with Seller
                </button>
                <button className="btn btn-ghost" onClick={onClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}