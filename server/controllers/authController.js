const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendCollegeVerificationEmail } = require('../utils/sendEmail');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

// College email regex, e.g. yourcollege.edu
const isCollegeEmail = email =>
  /@([a-zA-Z0-9\-]+\.)?(ac|edu)\.in$/.test(email) || email.endsWith('@yourcollege.edu');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, college } = req.body;
    if (!isCollegeEmail(email)) return res.status(400).json({ error: 'College email required.' });
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email exists.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, college, isVerified: false });
    // Send verification email
    await sendCollegeVerificationEmail(user);
    res.status(201).json({ message: 'Registered. Check your mail for a verification link.' });
  } catch (err) { next(err); }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification link.' });
    user.isVerified = true;
    await user.save();
    res.redirect(process.env.FRONTEND_URL + '/login?verified=1');
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });
    if (!user.isVerified) return res.status(401).json({ error: 'Email not verified.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials.' });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, avatar: user.avatar } });
  } catch (err) { next(err); }
};

// Google Signup/Login Demo (Extend with actual Firebase client on FE)
exports.googleLogin = async (req, res, next) => {
  try {
    // Assumes frontend verifies the Google ID token using Firebase JS SDK and provides a profile
    const { googleId, email, name, avatar } = req.body;
    if (!isCollegeEmail(email)) return res.status(400).json({ error: 'College email required.' });
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ googleId, email, name, avatar, isVerified: true });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email, isAdmin: user.isAdmin, avatar } });
  } catch (err) { next(err); }
};