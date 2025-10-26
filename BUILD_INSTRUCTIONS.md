# ELCA Blockbusters - Local Build Instructions

## Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **API Keys** for OpenAI, Anthropic, and X.ai Grok

## Quick Start

### Option 1: Automated Startup (Recommended)

```bash
chmod +x start-local.sh
./start-local.sh
```

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Activate virtual environment**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies** (if not already done)
   ```bash
   pip install -r requirements.txt
   pip install greenlet  # Required for async SQLAlchemy
   ```

4. **Configure environment variables**
   ```bash
   # Edit backend/.env and add your API keys:
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   XAI_API_KEY=your_key_here
   ```

5. **Initialize database**
   ```bash
   python -c "from shared.models import init_db; import asyncio; asyncio.run(init_db())"
   ```

6. **Start backend server**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Ensure frontend/.env.local exists with:
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

## Access Points

Once both servers are running:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)
- **Health Check**: http://localhost:8000/health

## Available Features

### 1. Pastoral Agent (AI Pastor)
- 90-second sermon generation
- Scripture search and exegesis
- Devotional content creation
- ELCA-compliant theological content

### 2. Gen-Z Engagement Engine
- Social media content for Instagram/TikTok
- Youth journey creation
- Authentic Gen-Z voice with ELCA values
- Event planning assistance

### 3. Miracle Finder (Mission Coordination)
- Volunteer deployment optimization
- Mission opportunity discovery
- Resource allocation planning
- Community outreach coordination

## Development Commands

### Backend
```bash
# Run backend with auto-reload
uvicorn main:app --reload

# Run with specific host/port
uvicorn main:app --host 0.0.0.0 --port 8000

# View logs
tail -f backend/logs/app.log  # If logging to file
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Database Management

The application uses SQLite for local development:

- **Database file**: `backend/elca_blockbusters.db`
- **Reset database**: Delete the `.db` file and run initialization again
- **View tables**: Use any SQLite browser or CLI

```bash
# SQLite CLI
sqlite3 backend/elca_blockbusters.db
.tables
.schema
```

## Troubleshooting

### Backend Issues

1. **"No module named 'greenlet'"**
   ```bash
   pip install greenlet
   ```

2. **"Database is locked"**
   - Stop all running backend instances
   - Delete `elca_blockbusters.db-journal` if exists

3. **"API Key not found"**
   - Ensure `backend/.env` exists and contains valid API keys
   - Source the virtual environment: `source venv/bin/activate`

### Frontend Issues

1. **"Module not found"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **"Cannot connect to backend"**
   - Verify backend is running: `curl http://localhost:8000/health`
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`

3. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

## Production Build

### Backend (for deployment to Render)
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (for deployment to Vercel)
```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm run start
```

## Architecture Overview

```
mothershipaddons/
├── backend/                   # FastAPI backend
│   ├── main.py               # Main application with agent endpoints
│   ├── elca_ontology_manager.py  # ELCA values & beliefs
│   ├── shared/
│   │   ├── models.py         # SQLite database models
│   │   └── elca_ai_providers.py  # Multi-provider AI integration
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (API keys)
│
├── frontend/                  # Next.js 15 frontend
│   ├── app/                  # Next.js app directory
│   │   ├── page.tsx          # Main dashboard with 3 tabs
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── sermon_generator.tsx
│   │   ├── genz_dashboard.tsx
│   │   └── miracles_dashboard.tsx
│   ├── lib/                  # Utilities
│   │   └── api-client.ts     # Backend API client
│   └── .env.local            # Frontend environment variables
│
└── start-local.sh            # Automated startup script
```

## ELCA 2025 AI Guidelines Compliance

This application is built to comply with ELCA 2025 AI Guidelines:

- ✅ **Radical Hospitality**: Inclusive language and welcoming tone
- ✅ **Grace-Centered Faith**: Theological grounding in Gospel
- ✅ **Justice & Advocacy**: Amplifying marginalized voices
- ✅ **Human Dignity**: Supporting human discernment
- ✅ **Transparency**: Clear AI assistance disclosure
- ✅ **Stewardship**: Environmentally conscious AI choices

## Support

For issues or questions:
- Check the troubleshooting section above
- Review API documentation at http://localhost:8000/docs
- Check console/terminal logs for errors

## Next Steps

After local testing:
1. Deploy backend to Render: See `DEPLOYMENT_GUIDE.md`
2. Deploy frontend to Vercel: See `VERCEL_DEPLOYMENT_STEPS.md`
3. Configure production environment variables
4. Set up monitoring and logging

---

**Built with cutting-edge 2025 technologies for ELCA congregations**

