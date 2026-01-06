/**
 * Module: StudyGenie Backend Server
 * Responsibility: Main Express server with authentication, AI routes, and database operations
 * Inputs: HTTP requests, environment variables
 * Outputs: JSON API responses
 * Notes: Includes real AI responses using OpenRouter client
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const axios = require('axios');
const OpenRouterClient = require('./openRouterClient');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Initialize OpenRouter client
const openRouterClient = new OpenRouterClient();

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to get user history context
const getUserHistoryContext = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT id, feature_name, prompt, response, created_at FROM history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching user history:', error);
    return [];
  }
};

// Helper function to save history
const saveHistory = async (userId, featureName, prompt, response) => {
  try {
    await pool.query(
      'INSERT INTO history (user_id, feature_name, prompt, response) VALUES ($1, $2, $3, $4)',
      [userId, featureName, JSON.stringify(prompt), JSON.stringify(response)]
    );
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

// Auth Routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    res.status(201).json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user
    const result = await pool.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// History Routes
app.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, feature_name, prompt, response, created_at FROM history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
      [req.user.userId]
    );

    res.json({ history: result.rows });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Routes
app.post('/ai/study-style', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    
    const response = await openRouterClient.analyzeStudyStyle(answers);
    await saveHistory(req.user.userId, 'study-style', { answers }, response);
    res.json(response);
  } catch (error) {
    console.error('Study style error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/ai/stress', authenticateToken, async (req, res) => {
  try {
    const { lifestyle } = req.body;
    
    const response = await openRouterClient.analyzeStress(lifestyle);
    await saveHistory(req.user.userId, 'stress', { lifestyle }, response);
    res.json(response);
  } catch (error) {
    console.error('Stress analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/ai/genieguide', authenticateToken, async (req, res) => {
  try {
    const { courseInfo, weeklyHours } = req.body;
    
    const response = await openRouterClient.generateStudyRoadmap(courseInfo, weeklyHours);
    await saveHistory(req.user.userId, 'genieguide', { courseInfo, weeklyHours }, response);
    res.json(response);
  } catch (error) {
    console.error('GenieGuide error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const historyContext = await getUserHistoryContext(req.user.userId);
    
    const response = await openRouterClient.provideChatResponse(message, historyContext);
    await saveHistory(req.user.userId, 'chat', { message }, response);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/ai/support', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await openRouterClient.provideSupportResponse(message);
    await saveHistory(req.user.userId, 'support', { message }, response);
    res.json(response);
  } catch (error) {
    console.error('Support error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/ai/image-analyze', upload.single('image'), authenticateToken, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/resnet-50',
      req.file.buffer,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/octet-stream'
        }
      }
    );

    await saveHistory(req.user.userId, 'image-analyze', { filename: req.file.originalname }, response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 StudyGenie Backend running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`🤖 OpenRouter: ${openRouterClient.isAvailable() ? 'Enabled' : 'Mock mode'}`);
  console.log(`🖼️  HuggingFace: ${process.env.HF_API_KEY ? 'Enabled' : 'Mock mode'}`);
});
