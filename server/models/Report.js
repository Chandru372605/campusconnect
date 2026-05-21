const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  postType: String, // "confession", "market", etc.
  postId: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);