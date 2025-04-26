const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');

// Configuration
const port = process.env.SERVER_PORT || process.env.PORT || 25572;
const domain = 'icbc.jmfhosting.com';
const BUILD_DIR = path.join(__dirname, 'build');
const JWT_SECRET = process.env.JWT_SECRET || 'icbc-study-hub-jwt-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/icbc-study-hub';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for compatibility with React
  crossOriginEmbedderPolicy: false,
}));

// Static file serving
app.use(express.static(BUILD_DIR));

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Running without database support'); 
  });

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progress: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

// User model
const User = mongoose.model('User', userSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ $or: [{ email: username }, { username }] });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// User data routes
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { progress } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { progress },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API routes for questions
const questionService = require('./src/data/questionService');
app.get('/api/questions', (req, res) => {
  const questions = questionService.getAllQuestions();
  res.json(questions);
});

app.get('/api/questions/categories', (req, res) => {
  const categories = questionService.getCategories();
  res.json(categories);
});

app.get('/api/questions/signs', (req, res) => {
  const signs = questionService.getSigns();
  res.json(signs);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`
=== ICBC Study Hub Server ===
Server running on: http://0.0.0.0:${port}
Public URL: https://${domain}
Environment: ${process.env.NODE_ENV || 'development'}
Time: ${new Date().toISOString()}
Database: ${MONGODB_URI}
Build directory: ${BUILD_DIR}
===========================
  `);
}); 