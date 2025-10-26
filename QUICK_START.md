# ELCA Blockbusters - Quick Start Reference

## Current Status: ✅ RUNNING LOCALLY

### Active Services

| Service | Status | URL | Port |
|---------|--------|-----|------|
| **Frontend** | 🟢 Running | http://localhost:3000 | 3000 |
| **Backend API** | 🟢 Running | http://localhost:8000 | 8000 |
| **API Docs** | 🟢 Available | http://localhost:8000/docs | 8000 |

### Registered Agents

The following ELCA AI agents are active and ready:

1. **Pastoral Agent** (`pastoral_care`)
   - Sermon generation
   - Scripture search
   - Devotional creation
   - Liturgy planning
   - Pastoral counseling support

2. **Youth Engagement Agent** (`youth_engagement`)
   - Social media content
   - Youth journey creation
   - Gen-Z outreach
   - Event planning
   - Peer mentorship

3. **Miracle Finder Agent** (`mission_coordination`)
   - Volunteer deployment
   - Mission coordination
   - Resource allocation
   - Community outreach
   - Administrative automation

## Quick Commands

### Start Development Servers

```bash
# Automated (recommended)
./start-local.sh

# Manual - Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Manual - Frontend
cd frontend && npm run dev
```

### API Testing

```bash
# Health check
curl http://localhost:8000/health

# Get all agents
curl http://localhost:8000/api/agents

# Get ELCA values
curl http://localhost:8000/api/ontology/values

# Get ELCA beliefs
curl http://localhost:8000/api/ontology/beliefs

# Interactive API documentation
open http://localhost:8000/docs
```

### Frontend Access

```bash
# Open in browser
open http://localhost:3000

# View build output
cd frontend && npm run build

# Test production build
cd frontend && npm run build && npm run start
```

## Environment Configuration

### Backend (.env)

Located at: `backend/.env`

```env
# Required API Keys
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
XAI_API_KEY=your_key_here

# Database
DATABASE_URL=sqlite+aiosqlite:///./elca_blockbusters.db

# App Settings
APP_ENV=development
LOG_LEVEL=INFO
```

### Frontend (.env.local)

Located at: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database

- **Type**: SQLite (async)
- **Location**: `backend/elca_blockbusters.db`
- **Tables**: 
  - `values` - ELCA core values
  - `beliefs` - ELCA operational beliefs
  - `agents` - Registered AI agents
  - `tasks` - Task execution history

### Database Reset

```bash
cd backend
rm elca_blockbusters.db
python -c "from shared.models import init_db; import asyncio; asyncio.run(init_db())"
```

## Tech Stack

### Backend
- **Framework**: FastAPI 0.119.1
- **Database**: SQLite + SQLAlchemy (async)
- **AI Providers**: 
  - OpenAI (GPT-4)
  - Anthropic (Claude Sonnet 4.5) - Primary
  - X.ai (Grok)
- **Server**: Uvicorn with hot reload
- **Python**: 3.9+

### Frontend
- **Framework**: Next.js 15.1.3
- **React**: 19.2.0
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **State**: TanStack Query
- **Node**: 18+

## Development Workflow

### Make Changes to Backend

1. Edit files in `backend/`
2. Server auto-reloads (via `--reload` flag)
3. Check terminal for errors
4. Test at http://localhost:8000/docs

### Make Changes to Frontend

1. Edit files in `frontend/`
2. Next.js auto-reloads via Fast Refresh
3. Check browser console for errors
4. View at http://localhost:3000

### Add New Dependencies

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install package_name
pip freeze > requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install package_name
```

## ELCA Compliance Features

✅ All AI content validated against ELCA 2025 AI Guidelines
✅ 8 core ELCA values integrated
✅ 8 operational beliefs enforced
✅ Bias detection and mitigation
✅ Transparent AI decision-making
✅ Privacy and data protection
✅ Accessibility-first design
✅ Environmental responsibility (Claude Sonnet 4.5 primary)

## Troubleshooting

### Backend Won't Start

```bash
# Check if port 8000 is in use
lsof -ti:8000 | xargs kill -9

# Reinstall dependencies
cd backend
pip install -r requirements.txt
```

### Frontend Won't Start

```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Errors

```bash
# Reset database
cd backend
rm elca_blockbusters.db
python -c "from shared.models import init_db; import asyncio; asyncio.run(init_db())"
```

### Missing API Keys

1. Ensure `backend/.env` exists
2. Add valid API keys
3. Restart backend server

## Production Deployment

See detailed deployment guides:
- Backend: `DEPLOYMENT_GUIDE.md`
- Frontend: `VERCEL_DEPLOYMENT_STEPS.md`
- Full setup: `BUILD_INSTRUCTIONS.md`

## Key Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /api/ai/status` - AI provider status

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/{id}` - Get specific agent

### Tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/recent` - Recent tasks

### Ontology
- `GET /api/ontology/values` - ELCA values
- `GET /api/ontology/beliefs` - ELCA beliefs
- `GET /api/ontology/summary` - Summary stats

## Support Resources

- **API Documentation**: http://localhost:8000/docs
- **Repository**: /Users/seanmcdonnell/Desktop/Motherfucker/mothershipaddons
- **Build Instructions**: BUILD_INSTRUCTIONS.md
- **Deployment Guide**: DEPLOYMENT_GUIDE.md

---

**Built for ELCA congregations with cutting-edge 2025 AI technology**

*AI should assist human ministry, not replace human discernment, especially in pastoral care, worship leadership, and spiritual guidance.* - ELCA 2025 AI Guidelines

