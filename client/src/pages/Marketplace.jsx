import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../services/api';
import MarketplaceCard from '../components/Marketplace/MarketplaceCard';
import ProductDetailModal from '../components/Marketplace/ProductDetailModal';
import ProductFormModal from '../components/Marketplace/ProductFormModal';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Cycle / Bike', 'Hostel Supplies', 'Clothing', 'Sports', 'Stationery', 'Others'];

export default function Marketplace() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/market');
      setProducts(data);
      setFiltered(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [products, search, category]);

  return (
    <div className="container-main">
      <div className="page-header">
        <h1 className="page-title">🛒 Marketplace</h1>
        {token && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + List Item
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <span>🔍</span>
          <input
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="btn-icon" onClick={() => setSearch('')}>✕</button>}
        </div>
        <select className="select" style={{ width: 'auto' }} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="icon">🛒</span>
          <p>{search || category !== 'All' ? 'No items match your search.' : 'No listings yet. Be the first!'}</p>
          {token && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowForm(true)}>List an Item</button>}
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map(p => (
            <div key={p._id} onClick={() => setSelectedProduct(p)}>
              <MarketplaceCard product={p} />
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
      {showForm && (
        <ProductFormModal onClose={() => { setShowForm(false); fetchProducts(); }} />
      )}
    </div>
  );
}