const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postType: String, // e.g., "confession", "placement", etc.
  postId: String,   // for direct reference
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);