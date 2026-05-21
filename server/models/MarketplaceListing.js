const mongoose = require('mongoose');

const MarketplaceListingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isSold: { type: Boolean, default: false },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
}, { timestamps: true });

module.exports = mongoose.model('MarketplaceListing', MarketplaceListingSchema);