const mongoose = require('mongoose');

const PlacementPostSchema = new mongoose.Schema({
  title: String,
  body: String,
  company: String,
  tags: [String],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  postedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PlacementPost', PlacementPostSchema);