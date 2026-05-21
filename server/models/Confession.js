const mongoose = require('mongoose');

const ConfessionSchema = new mongoose.Schema({
  text: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  postedAt: { type: Date, default: Date.now },
  isReported: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Confession', ConfessionSchema);