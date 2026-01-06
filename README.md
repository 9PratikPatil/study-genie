# StudyGenie - AI-Powered Study Companion

StudyGenie is a comprehensive web application that helps students optimize their learning experience through AI-powered tools and wellness features.

## Features

- **Study Style Quiz**: Discover your learning preferences with personalized recommendations
- **Stress Check**: Monitor stress levels and get coping strategies
- **GenieGuide**: Generate personalized study roadmaps and mindmaps
- **NOVA Chat**: AI study assistant for Q&A and explanations
- **Support Coach**: Emotional support and guidance (educational, non-clinical)
- **Rehab Tools**: Breathing exercises and personal journaling
- **Image Analysis**: AI-powered image recognition and labeling

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- Optional: OpenAI API key and Hugging Face API key (app works in mock mode without them)

### Running the Application

1. **Clone and navigate to the project:**
   ```bash
   cd StudyGenie
   ```

2. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env file with your API keys if you have them
   ```

3. **Start the application:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### First Time Setup

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to create a new account
3. Start exploring the features!

## Architecture

### Services

- **PostgreSQL Database** (Port 5432): Stores users and history
- **Node.js/Express Backend** (Port 5000): API server with AI integrations
- **React/Vite Frontend** (Port 5173): User interface

### Database Schema

- **users**: id, username, password_hash, created_at
- **history**: id, user_id, feature_name, prompt, response, created_at

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user
- `POST /auth/login` - User login

### History
- `GET /history` - Get user history (last 100 items)

### AI Features
- `POST /ai/study-style` - Learning style analysis
- `POST /ai/stress` - Stress level assessment
- `POST /ai/genieguide` - Study roadmap generation
- `POST /ai/chat` - NOVA chat assistant
- `POST /ai/support` - Support coach responses
- `POST /ai/image-analyze` - Image analysis

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for text AI features | No (mock mode) |
| `HF_API_KEY` | Hugging Face API key for image analysis | No (mock mode) |
| `DATABASE_URL` | PostgreSQL connection string | Yes (auto-set) |
| `JWT_SECRET` | JWT signing secret | Yes (auto-set) |
| `NODE_ENV` | Node environment | Yes (auto-set) |
| `VITE_API_URL` | Backend API URL for frontend | Yes (auto-set) |

## Mock Mode

StudyGenie works fully without API keys by providing deterministic mock responses:

- **Study Style**: Returns sample learning style analysis
- **Stress Check**: Returns sample stress assessment
- **GenieGuide**: Returns sample study roadmap
- **NOVA Chat**: Returns helpful study tips
- **Support Coach**: Returns supportive responses
- **Image Analysis**: Returns sample object labels

## Development

### Project Structure
```
StudyGenie/
├── docker-compose.yml
├── .env.example
├── README.md
├── database/
│   ├── Dockerfile
│   └── init.sql
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   └── Navbar.jsx
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── StudyStyleQuiz.jsx
            ├── StressCheck.jsx
            ├── GenieGuide.jsx
            ├── NovaChat.jsx
            ├── SupportCoach.jsx
            ├── Rehab.jsx
```

### Making Changes

1. Edit files in the respective service directories
2. Restart services: `docker compose restart [service-name]`
3. For frontend changes: `docker compose restart frontend`
4. For backend changes: `docker compose restart backend`

### Logs

View logs for debugging:
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

## Data Persistence

- Database data persists in Docker volume `postgres_data`
- Journal entries are stored in browser localStorage
- User sessions use JWT tokens in localStorage

## Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords for database in production
- API keys are optional but enable full AI functionality
- All user passwords are hashed with bcrypt

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5173, 5000, and 5432 are available
2. **Database connection**: Wait for postgres service to fully start
3. **API errors**: Check if backend service is running
4. **Build failures**: Run `docker compose down` then `docker compose up --build`

### Reset Everything
```bash
docker compose down -v
docker compose up --build
```

## Support

This is an educational tool. The Support Coach feature includes appropriate disclaimers and is not a substitute for professional mental health care.

## License

MIT License - feel free to use and modify for educational purposes.
