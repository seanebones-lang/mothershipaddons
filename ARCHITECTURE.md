# ELCA Blockbusters - Split Repository Architecture

**Microservices architecture with separate repositories for frontend and backend**

---

## Repository Structure

### Backend Repository (This Repo)
**Repository:** https://github.com/seanebones-lang/mothershipaddons  
**Purpose:** FastAPI backend with AI agents and ELCA ontology

```
mothershipaddons/
├── backend/                      # Backend application
│   ├── main.py                  # FastAPI app with 3 agents
│   ├── elca_ontology_manager.py # ELCA values & beliefs
│   ├── shared/
│   │   ├── models.py           # Database models
│   │   └── elca_ai_providers.py # Multi-provider AI
│   ├── requirements.txt        # Python dependencies
│   └── venv/                   # Virtual environment
├── render.yaml                  # Render deployment config
├── DEPLOY_NOW.md               # Deployment guide
└── Documentation files         # All guides
```

### Frontend Repository (Separate)
**Repository:** https://github.com/seanebones-lang/eclathree  
**Purpose:** Next.js frontend with 3 AI agent dashboards

```
eclathree/
├── app/                        # Next.js 16 app directory
│   ├── page.tsx               # Main dashboard
│   ├── layout.tsx             # Root layout
│   ├── error.tsx              # Error boundary
│   └── api/                   # Optional API routes
├── components/                 # React components
│   ├── sermon_generator.tsx   # Pastoral agent UI
│   ├── genz_dashboard.tsx     # Youth engagement UI
│   └── miracles_dashboard.tsx # Mission coordination UI
├── lib/                       # Utilities
│   └── api-client.ts         # Backend integration
├── package.json               # Node dependencies
├── vercel.json                # Vercel deployment config
└── README.md                  # Frontend documentation
```

---

## Why Split Repositories?

### Advantages

**1. Independent Development**
- Frontend team works in eclathree repo
- Backend team works in mothershipaddons repo
- No merge conflicts between teams

**2. Separate Deployment**
- Deploy frontend without touching backend
- Deploy backend without frontend rebuild
- Faster CI/CD pipelines

**3. Better Security**
- API keys only in backend repo
- Frontend is public-facing (no secrets)
- Easier security audits

**4. Clear Ownership**
- Frontend: UI/UX developers
- Backend: AI/ML engineers
- Ontology: ELCA compliance team

**5. Scaling**
- Frontend scales to millions of users (Vercel CDN)
- Backend scales for AI compute (Render workers)
- Different hosting strategies for different needs

---

## Communication Between Repos

### Backend → Frontend
Frontend calls backend via REST API:

```typescript
// In eclathree/lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Production
NEXT_PUBLIC_API_URL=https://elca-blockbusters-api.onrender.com
```

### API Contract
Both repos agree on API schema:
- **Agents:** GET /api/agents
- **Tasks:** POST /api/tasks, GET /api/tasks/recent
- **Ontology:** GET /api/ontology/values, GET /api/ontology/beliefs

---

## Local Development

### Option 1: Clone Both Repos

```bash
# Backend
git clone https://github.com/seanebones-lang/mothershipaddons.git
cd mothershipaddons/backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend (separate terminal)
git clone https://github.com/seanebones-lang/eclathree.git
cd eclathree
npm install
npm run dev
```

### Option 2: Use This Repo (Has Frontend Folder)

```bash
# This repo still has frontend/ folder for local dev
./start-local.sh
# Runs both backend and frontend locally
```

---

## Production Deployment

### Backend (Render)
1. Connect Render to: https://github.com/seanebones-lang/mothershipaddons
2. Use `render.yaml` configuration
3. Deploy to: https://elca-blockbusters-api.onrender.com

### Frontend (Vercel)
1. Connect Vercel to: https://github.com/seanebones-lang/eclathree
2. Use `vercel.json` configuration
3. Deploy to: https://elca-blockbusters.vercel.app

---

## Environment Variables

### Backend (mothershipaddons)
Set in Render dashboard:
```env
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
XAI_API_KEY=xxx
DATABASE_URL=sqlite+aiosqlite:///./elca_blockbusters.db
APP_ENV=production
```

### Frontend (eclathree)
Set in Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://elca-blockbusters-api.onrender.com
```

---

## Versioning Strategy

### Backend Versioning
- **Repo:** mothershipaddons
- **Version:** 1.0.0 → 1.1.0 → 2.0.0
- **Tags:** `backend-v1.0.0`, `backend-v1.1.0`

### Frontend Versioning
- **Repo:** eclathree
- **Version:** 1.0.0 → 1.1.0 → 2.0.0
- **Tags:** `frontend-v1.0.0`, `frontend-v1.1.0`

### API Contract Versioning
- Documented in backend repo
- Breaking changes require coordination
- Use `/api/v1/`, `/api/v2/` for major versions

---

## CI/CD Pipeline

### Backend (mothershipaddons)
```yaml
# .github/workflows/backend.yml
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      
jobs:
  test:
    - pytest backend/
  deploy:
    - Deploy to Render
```

### Frontend (eclathree)
```yaml
# .github/workflows/frontend.yml
on:
  push:
    branches: [main]
      
jobs:
  test:
    - npm run build
    - npm run lint
  deploy:
    - Deploy to Vercel (automatic)
```

---

## Team Workflow

### Frontend Developer
1. Clone eclathree repo
2. Run backend locally or use production API
3. Make UI changes
4. Push to eclathree → Auto-deploy to Vercel

### Backend Developer
1. Clone mothershipaddons repo
2. Make API/agent changes
3. Update API docs
4. Push to mothershipaddons → Auto-deploy to Render

### Full-Stack Developer (You)
1. Have both repos cloned
2. Use start-local.sh in mothershipaddons
3. Work on both simultaneously
4. Push to each repo independently

---

## Repository URLs

| Component | Repository | Hosting | Production URL |
|-----------|-----------|---------|----------------|
| **Frontend** | [eclathree](https://github.com/seanebones-lang/eclathree) | Vercel | https://elca-blockbusters.vercel.app |
| **Backend** | [mothershipaddons](https://github.com/seanebones-lang/mothershipaddons) | Render | https://elca-blockbusters-api.onrender.com |

---

## Migration Complete ✅

**Frontend is now live at:**
https://github.com/seanebones-lang/eclathree

**Backend remains at:**
https://github.com/seanebones-lang/mothershipaddons

**Both repos are production-ready and independently deployable!**

---

## Next Steps

1. **Deploy Backend:** Go to Render → Connect mothershipaddons repo
2. **Deploy Frontend:** Go to Vercel → Connect eclathree repo
3. **Verify:** Both services communicate correctly
4. **Update Docs:** Add production URLs to README files

---

**This architecture is enterprise-grade, scalable, and ready for your Bishop demo!**

