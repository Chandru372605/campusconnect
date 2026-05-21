const mongoose = require('mongoose');

const LostAndFoundSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact: String,
  status: { type: String, enum: ['lost', 'found'], default: 'lost' },
  isResolved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('LostAndFound', LostAndFoundSchema);