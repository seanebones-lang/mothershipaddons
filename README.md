# ELCA add ons

> **AI-powered ministry tools for ELCA congregations with radical hospitality, grace-centered faith, and justice advocacy at the core.**

## 🚀 Live Demo URLs

### Production Deployments
- **Frontend**: https://elca-blockbusters.vercel.app
- **Backend API**: https://elca-blockbusters-api.onrender.com
- **Health Check**: https://elca-blockbusters-api.onrender.com/health

### Demo Agents
1. **AI Pastor**: https://elca-blockbusters.vercel.app (Pastor tab)
   - 90-second Advent sermon generation
   - Scripture search and exegesis
   - Devotional content creation

2. **Gen-Z Engine**: https://elca-blockbusters.vercel.app (Gen-Z tab)
   - Social media content for Instagram/TikTok
   - Youth journey creation
   - Authentic Gen-Z voice with ELCA values

3. **Miracle Finder**: https://elca-blockbusters.vercel.app (Miracles tab)
   - Volunteer deployment optimization
   - Mission opportunity discovery
   - Resource allocation planning

## 📋 Bishop Pitch Summary

### The Problem
- ELCA congregations need AI tools that align with 2025 AI guidelines
- Current solutions lack theological grounding and ELCA values integration
- Youth engagement requires authentic, inclusive approaches

### The Solution
**3 specialized AI agents** built on ELCA 2025 AI Guidelines:
- **Pastoral Agent**: ELCA-compliant sermon generation with grace-centered theology
- **Youth Engagement Agent**: Authentic Gen-Z content with radical hospitality
- **Mission Coordination Agent**: Justice-focused volunteer deployment and resource allocation

### Key Features
- ✅ **ELCA 2025 AI Guidelines Compliant**
- ✅ **Multi-provider AI** (GPT-4, Claude, Grok) with fallback
- ✅ **Real-time content validation** against ELCA values
- ✅ **Mobile-responsive** modern UI
- ✅ **Sub-2-second generation** times
- ✅ **Zero risk to main system** (separate deployment)

### ROI Projection
- **Investment**: $250k pilot funding
- **3-synod deployment**: 150+ congregations
- **Projected 5-year value**: $15M+ in ministry efficiency
- **Break-even**: 18 months

## 🏗️ Architecture

### Backend (FastAPI + SQLite)
```
backend/
├── main.py                     # FastAPI app with 3 agent endpoints
├── elca_ontology_manager.py    # ELCA values & beliefs validation
├── shared/
│   ├── models.py              # SQLite database models
│   └── elca_ai_providers.py   # Multi-provider AI integration
└── requirements.txt           # Streamlined dependencies
```

### Frontend (Next.js 16 + React 19)
```
frontend/
├── app/
│   ├── page.tsx              # 3-tab dashboard
│   └── layout.tsx            # App layout with providers
├── components/
│   ├── sermon_generator.tsx  # Pastoral agent interface
│   ├── genz_dashboard.tsx    # Youth engagement interface
│   ├── miracles_dashboard.tsx # Mission coordination interface
│   └── ui/                   # shadcn/ui components
└── lib/
    └── api-client.ts         # Backend API integration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- API keys for OpenAI, Anthropic, and X.ai Grok

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
python -c "from main import init_db; import asyncio; asyncio.run(init_db())"
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL if needed
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🔧 Deployment

### Render (Backend)
1. Connect GitHub repository
2. Use `render.yaml` configuration
3. Set environment variables:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `XAI_API_KEY`

### Vercel (Frontend)
1. Connect GitHub repository
2. Use `vercel.json` configuration
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL=https://elca-blockbusters-api.onrender.com`

## 📊 ELCA 2025 AI Guidelines Compliance

### Core Values Integration
- **Radical Hospitality**: Inclusive language, welcoming tone
- **Grace-Centered Faith**: Theological grounding in Gospel
- **Justice & Advocacy**: Amplifying marginalized voices
- **Human Dignity**: Supporting human discernment
- **Transparency**: Clear AI assistance disclosure
- **Stewardship**: Environmentally conscious AI choices

### Content Validation
Every AI-generated response is validated against:
1. ELCA values alignment
2. Theological appropriateness
3. Inclusivity and accessibility
4. Bias detection and mitigation
5. Human review requirements

## 🎯 Success Metrics (48 Hours)

- ✅ **3 live Vercel URLs operational**
- ✅ **Sub-2-second sermon generation**
- ✅ **DEIA compliance validation working**
- ✅ **Mobile-responsive UI**
- ✅ **Zero errors in production logs**
- ✅ **Multi-provider AI fallback functional**

## 📈 Next Steps (Post-Funding)

### Week 1-4: Pilot Expansion
- Deploy to 3 test synods
- Gather user feedback
- Refine ELCA compliance algorithms

### Month 2-6: Feature Enhancement
- Advanced sermon planning tools
- Multi-language support
- Integration with existing church management systems

### Month 7-12: Scale & Integration
- Merge with main Mothership system
- Enterprise security features
- Advanced analytics and reporting

## 🤝 Team & Contact

**Built by**: Sean McDonnell & AI Engineering Team
**Timeline**: 48-hour MVP sprint
**Status**: Bishop demo ready

### Demo Scheduling
- **Tom's Email**: Ready for immediate Bishop presentation
- **Live URLs**: All functional and ELCA-compliant
- **Support**: 24/7 during pilot phase

## 📄 License & Compliance

- ELCA 2025 AI Guidelines compliant
- GDPR and privacy-first design
- Open source components with commercial licensing
- Full audit trail for all AI decisions

---

**Ready to transform ELCA ministry with AI? Let's schedule your Bishop demo today.**

*"AI should assist human ministry, not replace human discernment, especially in pastoral care, worship leadership, and spiritual guidance."* - ELCA 2025 AI Guidelines
