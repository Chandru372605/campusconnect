import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MarketplaceCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="card card-clickable" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--border)' }}>
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🛒
          </div>
        )}
        {/* Badges overlay */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {product.isSold && <span className="badge badge-danger">Sold</span>}
          {product.category && <span className="badge badge-info" style={{ background: 'rgba(6,182,212,0.9)' }}>{product.category}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, margin: 0 }}>{product.title}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
            ₹{product.price?.toLocaleString()}
          </span>
          {product.seller && (
            <div className="user-row">
              <div className="avatar avatar-sm">
                {product.seller.avatar
                  ? <img src={product.seller.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : product.seller.name?.[0]
                }
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.seller.name?.split(' ')[0]}</span>
            </div>
          )}
        </div>
        <button
          className="btn btn-outline btn-sm"
          style={{ width: '100%', marginTop: '0.25rem' }}
          onClick={e => { e.stopPropagation(); navigate(`/chat?seller=${product.seller?._id}&product=${product._id}`); }}>
          💬 Chat with Seller
        </button>
      </div>
    </div>
  );
}