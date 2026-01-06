/**
 * Module: StudyGenie Backend Server
 * Responsibility: Main Express server with authentication, AI routes, and database operations
 * Inputs: HTTP requests, environment variables
 * Outputs: JSON API responses
 * Notes: Includes mock AI responses when API keys not provided
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const axios = require('axios');
const puterClient = require('./puterClient');
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

// Check API keys and log mode
const hasHuggingFace = !!process.env.HF_API_KEY;

if (!hasHuggingFace) {
  console.log('⚠️  HF_API_KEY not found - running in mock mode for image analysis');
}

// Initialize Puter.js
console.log('🚀 Initializing Puter.js for AI capabilities...');
puterClient.initialize().catch(err => {
  console.error('Failed to initialize Puter.js:', err);
});

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
    let response;

    // Try external API first, fallback to mock on failure
    try {
      if (puterClient.isAvailable()) {
        console.log('🤖 Attempting Puter.js API call for study-style analysis...');
        const prompt = `You are an educational AI that analyzes study style preferences. Based on the user's responses to a 5-point Likert scale questionnaire (1=Strongly Disagree, 5=Strongly Agree), provide a detailed analysis of their learning style, strengths, and personalized study recommendations. Return your response as a JSON object with fields: style (main learning style), strengths (array of strengths), recommendations (array of specific study tips), and summary (brief overview).\n\nPlease analyze these study style responses: ${JSON.stringify(answers)}`;
        
        const puterResponse = await puterClient.chat(prompt, { temperature: 0.7 });
        response = JSON.parse(puterResponse.message.content);
        console.log('✅ Puter.js API call successful');
      } else {
        throw new Error('Puter.js not available');
      }
    } catch (apiError) {
      console.log('⚠️ External API failed, using mock response:', apiError.message);
      // Mock response when external API fails
      response = {
        style: 'Visual-Kinesthetic Learner',
        strengths: ['Visual processing', 'Hands-on learning', 'Pattern recognition'],
        recommendations: [
          'Use mind maps and diagrams for complex topics',
          'Take frequent breaks during study sessions',
          'Practice with real-world examples and case studies',
          'Use color-coding for different subjects or topics'
        ],
        summary: 'You learn best through visual aids and hands-on activities. Incorporate diagrams, charts, and practical exercises into your study routine.'
      };
    }

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
    let response;

    // Try external API first, fallback to mock on failure
    try {
      if (puterClient.isAvailable()) {
        console.log('🤖 Attempting Puter.js API call for stress analysis...');
        const prompt = `You are a stress level analyzer. Return JSON with: level (Low/Medium/High), drivers (array of strings), suggestions (array of strings).\n\nAnalyze stress level from lifestyle data: ${JSON.stringify(lifestyle)}`;
        
        const puterResponse = await puterClient.chat(prompt, { temperature: 0.7 });
        response = JSON.parse(puterResponse.message.content);
        console.log('✅ Puter.js API call successful');
      } else {
        throw new Error('Puter.js not available');
      }
    } catch (apiError) {
      console.log('⚠️ External API failed, using mock response:', apiError.message);
      // Mock response when external API fails
      response = {
        level: 'Medium',
        drivers: ['Academic workload', 'Time management', 'Social pressures'],
        suggestions: [
          'Practice deep breathing exercises daily',
          'Create a structured study schedule',
          'Take regular breaks during study sessions',
          'Consider talking to a counselor or trusted friend'
        ]
      };
    }

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
    let response;

    // Try external API first, fallback to mock on failure
    try {
      if (puterClient.isAvailable()) {
        console.log('🤖 Attempting Puter.js API call for GenieGuide...');
        const prompt = `Create a study roadmap. Return JSON with: roadmap (array of week objects with week number, topics, activities), mindmap (string describing connections between topics).\n\nCreate roadmap for: ${courseInfo}, ${weeklyHours} hours/week`;
        
        const puterResponse = await puterClient.chat(prompt, { temperature: 0.7 });
        response = JSON.parse(puterResponse.message.content);
        console.log('✅ Puter.js API call successful');
      } else {
        throw new Error('Puter.js not available');
      }
    } catch (apiError) {
      console.log('⚠️ External API failed, using mock response:', apiError.message);
      // Mock response when external API fails
      response = {
        roadmap: [
          { week: 1, topics: ['Course Overview', 'Basic Concepts'], activities: ['Read chapters 1-2', 'Complete intro quiz'] },
          { week: 2, topics: ['Core Principles', 'Practical Applications'], activities: ['Practice problems', 'Group discussion'] },
          { week: 3, topics: ['Advanced Topics', 'Case Studies'], activities: ['Research project', 'Peer review'] },
          { week: 4, topics: ['Integration', 'Review'], activities: ['Final project', 'Comprehensive review'] }
        ],
        mindmap: 'Core concepts connect to practical applications, which branch into case studies and real-world examples. Advanced topics build upon basic principles, leading to integrated understanding and mastery.'
      };
    }

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
    let response;

    // Try external API first, fallback to mock on failure
    try {
      if (puterClient.isAvailable()) {
        console.log('🤖 Attempting Puter.js API call for NOVA chat...');
        const contextMessage = historyContext.length > 0 
          ? `User's recent activity: ${JSON.stringify(historyContext.slice(0, 3))}`
          : 'No recent activity available.';

        const prompt = `You are NOVA, a helpful study assistant. Provide educational support and study guidance. ${contextMessage}\n\nUser question: ${message}`;
        
        const puterResponse = await puterClient.chat(prompt, { temperature: 0.7 });
        response = { answer: puterResponse.message.content };
        console.log('✅ Puter.js API call successful');
      } else {
        throw new Error('Puter.js not available');
      }
    } catch (apiError) {
      console.log('⚠️ External API failed, using mock response:', apiError.message);
      // Mock response when external API fails
      response = {
        answer: `Thanks for your question about "${message}". As your study assistant NOVA, I'd recommend breaking this topic down into smaller parts and creating a study plan. Consider using active recall techniques and spaced repetition for better retention.`
      };
    }

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
    let response;

    // Try external API first, fallback to mock on failure
    try {
      if (puterClient.isAvailable()) {
        console.log('🤖 Attempting Puter.js API call for support coach...');
        const prompt = `You are a supportive educational coach. Provide empathetic, encouraging responses. Always include a disclaimer that this is educational support, not medical care.\n\nUser message: ${message}`;
        
        const puterResponse = await puterClient.chat(prompt, { temperature: 0.8 });
        response = {
          response: puterResponse.message.content,
          disclaimer: 'This is a supportive educational tool, not medical care. If you are in crisis, please seek local emergency help or contact a mental health professional.'
        };
        console.log('✅ Puter.js API call successful');
      } else {
        throw new Error('Puter.js not available');
      }
    } catch (apiError) {
      console.log('⚠️ External API failed, using mock response:', apiError.message);
      // Mock response when external API fails
      response = {
        response: `I hear you, and I want you to know that what you're feeling is valid. Academic challenges can be overwhelming, but remember that seeking support shows strength. Take things one step at a time, and be kind to yourself. You've got this!`,
        disclaimer: 'This is a supportive educational tool, not medical care. If you are in crisis, please seek local emergency help or contact a mental health professional.'
      };
    }

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

    let response;

    // Try external API first, fallback to mock on failure
    try {
      if (hasHuggingFace) {
        console.log('🤖 Attempting HuggingFace API call for image analysis...');
        const hfResponse = await axios.post(
          'https://api-inference.huggingface.co/models/microsoft/resnet-50',
          req.file.buffer,
          {
            headers: {
              'Authorization': `Bearer ${process.env.HF_API_KEY}`,
              'Content-Type': 'application/octet-stream'
            }
          }
        );

        response = { labels: hfResponse.data };
        console.log('✅ HuggingFace API call successful');
      } else {
        throw new Error('HuggingFace API key not available');
      }
    } catch (apiError) {
      console.log('⚠️ External API failed, using mock response:', apiError.message);
      // Mock response when external API fails
      response = {
        labels: [
          { label: 'book', score: 0.85 },
          { label: 'notebook', score: 0.72 },
          { label: 'pen', score: 0.68 },
          { label: 'desk', score: 0.45 },
          { label: 'study materials', score: 0.38 }
        ]
      };
    }

    await saveHistory(req.user.userId, 'image-analyze', { filename: req.file.originalname }, response);
    res.json(response);
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
  console.log(`🤖 Puter.js: ${puterClient.isAvailable() ? 'Enabled' : 'Initializing...'}`);
  console.log(`🖼️  HuggingFace: ${hasHuggingFace ? 'Enabled' : 'Mock mode'}`);
});
