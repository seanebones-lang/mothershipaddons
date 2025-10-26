# ELCA Blockbusters - Backend API

**FastAPI 0.120.0 backend with 3 specialized ELCA AI agents**

---

## Tech Stack

- **Framework:** FastAPI 0.120.0
- **Python:** 3.11+
- **Database:** SQLite + SQLAlchemy (async)
- **AI Providers:**
  - OpenAI GPT-4 Turbo
  - Anthropic Claude Sonnet 4.5 (Primary)
  - X.ai Grok
- **Server:** Uvicorn + Gunicorn
- **Logging:** Structlog (JSON structured logs)

---

## Features

### 3 Specialized AI Agents

1. **Pastoral Agent** (`pastoral_care`)
   - Sermon generation (90 seconds)
   - Scripture search and exegesis
   - Devotional content creation
   - Liturgy planning support
   - Pastoral counseling assistance

2. **Youth Engagement Agent** (`youth_engagement`)
   - Social media content (Instagram, TikTok)
   - Youth journey creation
   - Authentic Gen-Z voice
   - Event planning
   - Peer mentorship support

3. **Miracle Finder Agent** (`mission_coordination`)
   - Volunteer deployment optimization
   - Mission opportunity discovery
   - Resource allocation planning
   - Community outreach coordination
   - Administrative automation

### ELCA Ontology System
- 8 core ELCA values
- 8 operational beliefs
- Content validation against ELCA 2025 AI Guidelines
- Bias detection and mitigation
- Transparency and accountability tracking

---

## Quick Start

### Prerequisites
- Python 3.11+
- API keys (OpenAI, Anthropic, X.ai)

### Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys to .env

# Initialize database
python -c "from shared.models import init_db; import asyncio; asyncio.run(init_db())"

# Start server
uvicorn main:app --reload

# Server runs at http://localhost:8000
# API docs at http://localhost:8000/docs
```

---

## Environment Variables

Create `.env` file:

```env
# AI Provider API Keys (Required)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
XAI_API_KEY=your_xai_key

# Database
DATABASE_URL=sqlite+aiosqlite:///./elca_blockbusters.db

# Application
APP_ENV=development
LOG_LEVEL=INFO
```

---

## API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /ready` - Readiness check with AI provider status
- `GET /api/ai/status` - Detailed AI provider status

### Agents
- `GET /api/agents` - List all registered agents
- `GET /api/agents/{agent_id}` - Get specific agent details

### Tasks
- `POST /api/tasks` - Create and execute AI task
- `GET /api/tasks/recent?limit=10` - Get recent tasks

### Ontology
- `GET /api/ontology/values` - Get ELCA values
- `GET /api/ontology/beliefs` - Get ELCA beliefs
- `GET /api/ontology/summary` - Get summary statistics

**Interactive API Documentation:** http://localhost:8000/docs

---

## Project Structure

```
backend/
├── main.py                      # FastAPI application entry point
├── elca_ontology_manager.py     # ELCA values & beliefs management
├── shared/
│   ├── models.py               # SQLAlchemy database models
│   └── elca_ai_providers.py    # Multi-provider AI integration
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## Database Schema

### Tables

**values** - ELCA core values
- id, name, description, tenant_id
- 8 values: Radical Hospitality, Grace-Centered Faith, etc.

**beliefs** - ELCA operational beliefs
- id, name, description, related_values, tenant_id
- 8 beliefs: AI-Assisted Not Replaced, Bias Detection, etc.

**agents** - AI agent registry
- id, name, agent_type, capabilities, status
- 3 agents: Pastoral, Youth, Mission

**tasks** - Task execution history
- id, user_id, agent_id, input_data, output_data, status

---

## AI Provider Configuration

### Primary Provider: Claude Sonnet 4.5
- Best for theological content
- Nuanced understanding
- ELCA values alignment
- Cost-effective

### Fallback Providers
1. OpenAI GPT-4 Turbo
2. X.ai Grok

### Cost Optimization
- Automatic provider selection based on use case
- Usage tracking and monitoring
- Token limit enforcement

---

## ELCA 2025 AI Guidelines Compliance

Every AI-generated response is:
1. ✅ Validated against ELCA values
2. ✅ Checked for theological appropriateness
3. ✅ Audited for inclusivity and accessibility
4. ✅ Screened for bias
5. ✅ Marked as requiring human review

---

## Production Deployment

### Deploy to Render

**Automatic (via GitHub integration):**
1. Connect Render to this repository
2. Render auto-detects `render.yaml` (in parent repo)
3. Environment variables set in Render dashboard
4. Auto-deploys on git push

**Manual:**
```bash
# Install Render CLI
npm install -g @render/cli

# Deploy
render deploy
```

**Production URL:** https://elca-blockbusters-api.onrender.com

### Environment Variables (Render Dashboard)
```
PYTHON_VERSION=3.11.0
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
XAI_API_KEY=your_key
DATABASE_URL=sqlite+aiosqlite:///./elca_blockbusters.db
APP_ENV=production
LOG_LEVEL=INFO
```

---

## Testing

### Test Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Get agents
curl http://localhost:8000/api/agents

# Create sermon task
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "pastoral_agent_id",
    "input_data": {
      "type": "sermon",
      "topic": "God'\''s Grace",
      "scripture": "John 3:16",
      "length": "short"
    }
  }'

# Get ELCA values
curl http://localhost:8000/api/ontology/values

# AI provider status
curl http://localhost:8000/api/ai/status
```

---

## Dependencies

### Core Framework
- `fastapi==0.120.0` - Web framework
- `uvicorn[standard]==0.38.0` - ASGI server
- `pydantic==2.12.3` - Data validation
- `gunicorn==23.0.0` - Production server

### Database
- `sqlalchemy==2.0.44` - ORM
- `aiosqlite==0.21.0` - Async SQLite driver
- `greenlet==3.2.4` - Async support

### AI/ML
- `openai==2.6.1` - OpenAI SDK
- `anthropic==0.71.0` - Anthropic Claude SDK
- `httpx==0.28.1` - HTTP client for Grok

### Utilities
- `python-dotenv==1.2.1` - Environment management
- `structlog==25.4.0` - Structured logging
- `python-jose[cryptography]==3.5.0` - JWT handling
- `passlib[bcrypt]==1.7.4` - Password hashing

**All versions:** October 2025 latest stable

---

## Monitoring

### Logging
Structured JSON logs with:
- Request ID tracking
- Performance metrics
- Error details
- AI provider usage stats

### Health Checks
- `/health` - Basic health
- `/ready` - Readiness with dependencies
- Auto-healing on failures

---

## Security

- ✅ API keys in environment variables only
- ✅ CORS configured for frontend domain
- ✅ Input validation with Pydantic
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Rate limiting ready (add in production)
- ✅ HTTPS enforced in production

---

## Frontend Integration

**Frontend Repository:** https://github.com/seanebones-lang/eclathree

The backend serves the frontend via REST API. CORS is configured to allow:
- `http://localhost:3000` (local development)
- `https://elca-blockbusters.vercel.app` (production)

---

## License

See LICENSE file in repository.

---

## Support

- **API Documentation:** http://localhost:8000/docs (interactive)
- **Repository:** https://github.com/seanebones-lang/eclabackthree
- **Frontend Repo:** https://github.com/seanebones-lang/eclathree
- **Main Documentation:** See parent repo for deployment guides

---

**Built for ELCA congregations with cutting-edge 2025 AI technology**

*AI should assist human ministry, not replace human discernment.* - ELCA 2025 AI Guidelines

