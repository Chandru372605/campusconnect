import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../services/api';
import MarketplaceCard from '../components/Marketplace/MarketplaceCard';
import ProductDetailModal from '../components/Marketplace/ProductDetailModal';
import ProductFormModal from '../components/Marketplace/ProductFormModal';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/market');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-indigo-600 text-sm">← Home</Link>
          <h1 className="text-xl font-bold text-indigo-600">🛒 Marketplace</h1>
        </div>
        {token && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            + List Item
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">No listings yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p._id} onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                <MarketplaceCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onChat={() => {
            window.location.href = `/chat?seller=${selectedProduct.seller?._id}&product=${selectedProduct._id}`;
          }}
        />
      )}
      {showForm && (
        <ProductFormModal
          onClose={() => { setShowForm(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}