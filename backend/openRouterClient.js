/**
 * Module: OpenRouter AI Client
 * Responsibility: Handle AI API calls using OpenRouter
 * Inputs: API key, prompts, model preferences
 * Outputs: AI responses for various StudyGenie features
 * Notes: Replaces mock responses with real AI capabilities
 */

const axios = require('axios');

class OpenRouterClient {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.siteUrl = process.env.SITE_URL || 'http://localhost:5173';
    this.siteName = process.env.SITE_NAME || 'StudyGenie';
    this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    if (!this.apiKey || this.apiKey === 'your-openrouter-api-key-here') {
      console.warn('⚠️  OpenRouter API key not configured - AI features will use fallback responses');
      this.available = false;
    } else {
      this.available = true;
      console.log('✅ OpenRouter client initialized');
    }
  }

  isAvailable() {
    return this.available;
  }

  async generateResponse(prompt, model = 'xiaomi/mimo-v2-flash:free') {
    if (!this.isAvailable()) {
      throw new Error('OpenRouter client not available');
    }

    try {
      const response = await axios.post(this.baseUrl, {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': this.siteUrl,
          'X-Title': this.siteName,
          'Content-Type': 'application/json',
        },
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }

  async analyzeStudyStyle(answers) {
    const prompt = `Analyze the following study style quiz answers and provide a detailed learning style assessment:

Quiz Answers: ${JSON.stringify(answers)}

Please provide a JSON response with:
1. primary: The main learning style (visual, auditory, or kinesthetic)
2. secondary: A secondary learning style if applicable
3. probabilities: Percentage breakdown of each style
4. tips: Array of 5-7 personalized study tips based on the analysis

Focus on practical, actionable advice for effective studying.`;

    try {
      const response = await this.generateResponse(prompt, 'xiaomi/mimo-v2-flash:free');
      return JSON.parse(response);
    } catch (error) {
      console.error('Study style analysis error:', error);
      // Fallback response
      return {
        primary: 'visual',
        secondary: 'kinesthetic',
        probabilities: { visual: 45, auditory: 25, kinesthetic: 30 },
        tips: [
          'Use visual aids like diagrams and charts',
          'Create mind maps for complex topics',
          'Take regular breaks during study sessions',
          'Practice active recall techniques',
          'Use color coding for organization'
        ]
      };
    }
  }

  async analyzeStress(lifestyle) {
    const prompt = `Analyze the following stress assessment data and provide personalized recommendations:

Lifestyle Data: ${JSON.stringify(lifestyle)}

Please provide a JSON response with:
1. level: Stress level (Low, Medium, High, Severe)
2. score: Numerical score (0-100)
3. drivers: Array of main stress factors identified
4. suggestions: Array of 5-7 specific stress management recommendations

Focus on practical, evidence-based stress reduction strategies.`;

    try {
      const response = await this.generateResponse(prompt, 'xiaomi/mimo-v2-flash:free');
      return JSON.parse(response);
    } catch (error) {
      console.error('Stress analysis error:', error);
      // Fallback response
      return {
        level: 'Medium',
        score: 65,
        drivers: ['Academic pressure', 'Time management', 'Sleep quality'],
        suggestions: [
          'Establish a consistent sleep schedule',
          'Practice deep breathing exercises',
          'Break large tasks into smaller steps',
          'Schedule regular physical activity',
          'Consider mindfulness meditation'
        ]
      };
    }
  }

  async generateStudyRoadmap(courseInfo, weeklyHours) {
    const prompt = `Create a personalized study roadmap based on the following information:

Course Information: ${JSON.stringify(courseInfo)}
Weekly Study Hours: ${weeklyHours}

Please provide a JSON response with:
1. roadmap: Array of week objects, each with:
   - week: Week number (1, 2, 3, etc.)
   - topics: Array of topics to cover that week
   - activities: Array of specific activities/exercises for that week
2. mindmap: String describing the connections between topics and overall course structure

Focus on creating a realistic, achievable weekly study plan with specific actionable items.`;

    try {
      const response = await this.generateResponse(prompt, 'xiaomi/mimo-v2-flash:free');
      return JSON.parse(response);
    } catch (error) {
      console.error('Roadmap generation error:', error);
      // Fallback response
      return {
        roadmap: [
          {
            week: 1,
            topics: ['Course Introduction', 'Basic Concepts', 'Terminology'],
            activities: ['Read introductory materials', 'Complete vocabulary exercises', 'Take initial assessment']
          },
          {
            week: 2,
            topics: ['Fundamental Principles', 'Core Theory'],
            activities: ['Study core concepts', 'Practice basic exercises', 'Join study group']
          },
          {
            week: 3,
            topics: ['Applied Knowledge', 'Practical Examples'],
            activities: ['Work on practice problems', 'Complete assignments', 'Review progress']
          }
        ],
        mindmap: 'The course structure flows from foundational concepts in weeks 1-2, building to applied knowledge in week 3 and beyond. Core principles connect to practical applications, with regular assessment and review cycles to reinforce learning.'
      };
    }
  }

  async provideChatResponse(message, historyContext = []) {
    const contextMessage = historyContext.length > 0 
      ? `User's recent activity: ${JSON.stringify(historyContext.slice(0, 3))}`
      : 'No recent activity available.';

    const prompt = `You are NOVA, a helpful AI study assistant for StudyGenie. Provide educational support and study guidance.

${contextMessage}

User question: ${message}

Provide a helpful, encouraging response focused on study assistance, learning strategies, and academic support.`;

    try {
      const response = await this.generateResponse(prompt, 'xiaomi/mimo-v2-flash:free');
      return { response };
    } catch (error) {
      console.error('Chat response error:', error);
      // Fallback response
      return {
        response: "I'm here to help with your studies! While I'm having some technical difficulties right now, I'd be happy to assist you with study strategies, time management, or any academic questions you have. What specific topic would you like help with?"
      };
    }
  }

  async provideSupportResponse(message) {
    const prompt = `You are a supportive AI coach for StudyGenie. Provide empathetic, encouraging support for students dealing with academic stress and challenges.

User message: ${message}

Provide a compassionate, helpful response that:
1. Acknowledges their feelings
2. Offers practical support strategies
3. Encourages positive coping mechanisms
4. Maintains appropriate boundaries (not medical advice)

Keep the tone warm, understanding, and professionally supportive.`;

    try {
      const response = await this.generateResponse(prompt, 'xiaomi/mimo-v2-flash:free');
      return { response };
    } catch (error) {
      console.error('Support response error:', error);
      // Fallback response
      return {
        response: "I understand you're going through a challenging time. Remember that it's completely normal to feel overwhelmed sometimes. Take things one step at a time, and don't hesitate to reach out to friends, family, or counseling services when you need support. You're stronger than you think, and this difficult period will pass."
      };
    }
  }
}

module.exports = OpenRouterClient;
