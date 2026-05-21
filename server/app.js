const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/market', require('./routes/market'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/confessions', require('./routes/confessions'));
app.use('/api/placement', require('./routes/placement'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));

// Error handling
app.use(errorHandler);

module.exports = app;