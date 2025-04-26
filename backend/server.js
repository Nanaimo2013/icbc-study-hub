const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const questionRoutes = require('./src/routes/question.routes');
const progressRoutes = require('./src/routes/progress.routes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 25574;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:25572',
  credentials: true
}));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/icbc-study-hub')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Running without database support');
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
=== ICBC Study Hub Backend Server ===
Server running on: http://0.0.0.0:${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Time: ${new Date().toISOString()}
Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:25572'}
===========================
  `);
}); 