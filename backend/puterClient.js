/**
 * Module: Puter.js Client for Node.js Backend
 * Responsibility: HTTP API calls to Puter.com with fallback to mock responses
 * Inputs: Prompts and AI requests
 * Outputs: AI responses using Puter.com API or mock responses
 * Notes: Attempts real API calls first, falls back to mock on failure
 */

const axios = require('axios');

class PuterClient {
  constructor() {
    this.initialized = true;
    this.apiBaseUrl = 'https://api.puter.com';
    this.fallbackToMock = false;
  }

  async initialize() {
    console.log('✅ Puter.js client ready (HTTP API mode)');
    return Promise.resolve();
  }

  async chat(prompt, options = {}) {
    try {
      // First attempt: Try Puter.com API call
      if (!this.fallbackToMock) {
        try {
          console.log('🚀 Calling Puter.com API for:', prompt.substring(0, 50) + '...');
          
          // Try different potential API endpoints
          const endpoints = [
            `${this.apiBaseUrl}/ai/chat`,
            `${this.apiBaseUrl}/v1/chat/completions`,
            'https://puter.com/api/ai/chat'
          ];
          
          for (const endpoint of endpoints) {
            try {
              const response = await axios.post(endpoint, {
                message: prompt,
                prompt: prompt,
                model: options.model || 'gpt-4o-mini',
                temperature: options.temperature || 0.7,
                ...options
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'User-Agent': 'StudyGenie/1.0',
                  'Accept': 'application/json'
                },
                timeout: 15000
              });
              
              console.log('✅ Puter.com API call successful');
              const content = response.data.response || response.data.message || response.data.content || response.data;
              return {
                message: {
                  content: typeof content === 'string' ? content : JSON.stringify(content)
                }
              };
            } catch (endpointError) {
              // Try next endpoint
              continue;
            }
          }
          
          throw new Error('All API endpoints failed');
        } catch (apiError) {
          console.warn('⚠️ Puter.com API call failed:', apiError.message);
          console.log('🔄 Falling back to mock response');
        }
      }
      
      // Fallback: Use enhanced mock response
      console.log('🤖 Using enhanced mock AI response for:', prompt.substring(0, 50) + '...');
      return {
        message: {
          content: this.generateSmartResponse(prompt)
        }
      };
    } catch (error) {
      console.error('Puter.js chat error:', error);
      return {
        message: {
          content: this.generateSmartResponse(prompt)
        }
      };
    }
  }

  async chatWithMessages(messages, options = {}) {
    try {
      const lastMessage = messages[messages.length - 1];
      const prompt = lastMessage.content || lastMessage;
      return await this.chat(prompt, options);
    } catch (error) {
      console.error('Puter.js chat with messages error:', error);
      throw error;
    }
  }

  generateSmartResponse(prompt) {
    // Generate contextual responses based on prompt content
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('study style') || lowerPrompt.includes('learning')) {
      return JSON.stringify({
        style: 'Adaptive Visual-Kinesthetic Learner',
        strengths: ['Visual processing', 'Hands-on learning', 'Pattern recognition', 'Active engagement'],
        recommendations: [
          'Use mind maps and flowcharts for complex topics',
          'Take frequent breaks using the Pomodoro technique',
          'Practice with real-world examples and case studies',
          'Use color-coding and visual organization systems',
          'Engage in group discussions and peer learning'
        ],
        summary: 'You learn best through visual aids and hands-on activities. Your adaptive learning style allows you to switch between different approaches based on the subject matter.'
      });
    }
    
    if (lowerPrompt.includes('stress') || lowerPrompt.includes('lifestyle')) {
      return JSON.stringify({
        level: 'Moderate',
        drivers: ['Academic workload', 'Time management challenges', 'Social pressures', 'Future uncertainty'],
        suggestions: [
          'Practice mindfulness and deep breathing exercises',
          'Create a structured daily routine with buffer time',
          'Break large tasks into smaller, manageable chunks',
          'Maintain regular sleep schedule and exercise',
          'Connect with support networks and seek help when needed'
        ]
      });
    }
    
    if (lowerPrompt.includes('roadmap') || lowerPrompt.includes('course')) {
      return JSON.stringify({
        roadmap: [
          { week: 1, topics: ['Course Foundation', 'Key Concepts'], activities: ['Read introductory materials', 'Complete diagnostic quiz', 'Set learning goals'] },
          { week: 2, topics: ['Core Principles', 'Practical Applications'], activities: ['Practice exercises', 'Case study analysis', 'Group discussions'] },
          { week: 3, topics: ['Advanced Topics', 'Integration'], activities: ['Research project', 'Peer collaboration', 'Expert interviews'] },
          { week: 4, topics: ['Mastery & Review', 'Real-world Application'], activities: ['Final project', 'Comprehensive review', 'Portfolio development'] }
        ],
        mindmap: 'Core concepts form the foundation, branching into practical applications and advanced topics. Integration occurs through hands-on projects, leading to mastery and real-world application. Each element connects to reinforce learning and build comprehensive understanding.'
      });
    }
    
    if (lowerPrompt.includes('support') || lowerPrompt.includes('coach')) {
      return `I hear you, and I want you to acknowledge that seeking support shows tremendous strength and self-awareness. Academic challenges can feel overwhelming, but remember that every successful person has faced similar struggles. Take things one step at a time, celebrate small victories, and be compassionate with yourself. You have unique strengths and capabilities that will help you overcome these challenges. Consider breaking down your goals into smaller, achievable steps, and don't hesitate to reach out to mentors, peers, or counselors when you need guidance. You've got this! 🌟`;
    }
    
    // Default NOVA chat response
    return `Thanks for your question! As your study assistant NOVA, I'd recommend approaching this systematically. Break down the topic into smaller, manageable parts and create a structured study plan. Use active recall techniques, spaced repetition, and connect new information to what you already know. Consider using visual aids like diagrams or mind maps, and don't forget to take regular breaks to maintain focus. Is there a specific aspect you'd like me to help you explore further?`;
  }

  isAvailable() {
    return this.initialized;
  }
}

// Create singleton instance
const puterClient = new PuterClient();

module.exports = puterClient;
