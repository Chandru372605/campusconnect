const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // hashed (if not Google auth)
  avatar: { type: String, default: '' },
  college: String,
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  googleId: { type: String },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);