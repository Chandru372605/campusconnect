import React from "react";

export default function ProductDetailModal({ product, onClose, onChat }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button className="absolute top-2 right-2 btn btn-sm" onClick={onClose}>✕</button>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0 w-full md:w-1/2 flex flex-col gap-2">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-full rounded border object-cover h-52"
              />
            ))}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <div className="flex gap-2 items-center text-xs mb-2">
              <span className="badge badge-info">{product.category}</span>
              {product.isSold && <span className="badge badge-error">Sold</span>}
            </div>
            <div className="font-bold text-blue-700 dark:text-blue-200 text-xl mb-2">₹{product.price}</div>
            <div className="mb-3 text-gray-700 dark:text-gray-200">{product.description}</div>
            <div className="flex gap-2 items-center">
              {product.seller?.avatar && (
                <img src={product.seller.avatar} alt="" className="w-10 h-10 rounded-full" />
              )}
              <span>{product.seller?.name || "Seller"}</span>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={onChat}
              disabled={product.isSold}
            >
              Chat with Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}