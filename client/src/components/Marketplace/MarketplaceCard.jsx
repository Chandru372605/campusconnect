import React from "react";

export default function MarketplaceCard({ product }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg flex flex-col relative group transition hover:shadow-2xl">
      {product.images?.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <span className="font-bold text-blue-600 dark:text-blue-300">₹{product.price}</span>
        </div>
        <div className="text-gray-700 dark:text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</div>
        <span className="inline-block bg-blue-100 dark:bg-blue-700 text-xs rounded-full px-3 py-1 text-blue-700 dark:text-white mb-2">
          {product.category}
        </span>
        <div className="flex gap-1 items-center mt-auto text-xs text-gray-600 dark:text-gray-300">
          {product.seller?.avatar && (
            <img src={product.seller.avatar} alt="" className="w-6 h-6 rounded-full" />
          )}
          {product.seller?.name || "Seller"}
        </div>
      </div>
      <div className="absolute top-2 right-2">
        {product.isSold && <span className="badge badge-error">Sold</span>}
      </div>
      {/* Add "Chat with Seller" button here */}
    </div>
  );
}