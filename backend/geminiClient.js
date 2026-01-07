/**
 * Module: Google Gemini AI Client
 * Responsibility: Handle AI interactions using Google Gemini API
 * Inputs: User messages and prompts
 * Outputs: AI-generated responses
 * Notes: Replaces OpenRouter for NOVA Chat functionality
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiClient {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      this.client = null;
    } else {
      this.client = new GoogleGenerativeAI(this.apiKey);
      console.log('✅ Gemini AI client initialized successfully');
    }
  }

  async provideChatResponse(message, historyContext = []) {
    if (!this.client) {
      console.log('⚠️ Gemini client not available, using fallback response');
      return this.getFallbackChatResponse(message);
    }

    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

      // Build context from history
      let contextPrompt = '';
      if (historyContext.length > 0) {
        contextPrompt = '\nPrevious conversation context:\n';
        historyContext.slice(-5).forEach(item => {
          contextPrompt += `- ${item.feature_name}: "${item.prompt?.message || 'Feature used'}"\n`;
        });
        contextPrompt += '\n';
      }

      const prompt = `You are NOVA, an AI study assistant for StudyGenie. You help students with their learning journey, provide study advice, answer academic questions, and offer motivational support.

${contextPrompt}Current question: ${message}

Please provide a helpful, encouraging, and informative response. Keep it conversational and supportive.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log('✅ Gemini chat response generated successfully');
      return {
        response: text,
        model: 'gemini-1.5-flash-latest',
        usage: {
          prompt_tokens: prompt.length,
          completion_tokens: text.length,
          total_tokens: prompt.length + text.length
        }
      };

    } catch (error) {
      console.error('❌ Gemini API error:', error.message);
      return this.getFallbackChatResponse(message);
    }
  }

  getFallbackChatResponse(message) {
    const fallbackResponses = [
      "I'm here to help you with your studies! While I'm having some technical difficulties right now, I can still offer some general study advice. What specific topic are you working on?",
      "Great question! Even though I'm running in demo mode, I'd suggest breaking down complex topics into smaller, manageable chunks. What subject are you focusing on today?",
      "I appreciate you reaching out! While my AI capabilities are temporarily limited, I can remind you that consistent study habits and active learning techniques often work best. What's your current study challenge?",
      "Thanks for using NOVA Chat! I'm experiencing some connectivity issues, but here's a quick tip: try the Pomodoro technique - 25 minutes of focused study followed by a 5-minute break. What are you studying?",
      "Hello! I'm your study companion NOVA. Though I'm in fallback mode right now, remember that asking questions and staying curious is key to learning. What would you like to explore today?"
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      response: randomResponse,
      model: 'fallback',
      fallback: true
    };
  }
}

module.exports = GeminiClient;
