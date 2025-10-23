# ELCA Blockbusters Deployment Guide

## 🚀 48-Hour Deployment Strategy

### Phase 1: Backend Deployment (Render)

#### 1. Prepare Repository
```bash
# Ensure all files are committed
git add .
git commit -m "ELCA Blockbusters MVP ready for deployment"
git push origin main
```

#### 2. Deploy to Render
1. **Create Render Account**: https://render.com
2. **Connect GitHub**: Link your repository
3. **Create New Web Service**:
   - Repository: `elca-blockbusters`
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### 3. Environment Variables (Render)
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=xai-...
PYTHON_VERSION=3.11.0
```

#### 4. Database Setup
- Render will auto-create PostgreSQL database
- Connection string auto-injected as `DATABASE_URL`

### Phase 2: Frontend Deployment (Vercel)

#### 1. Deploy to Vercel
```bash
cd frontend
npx vercel --prod
```

#### 2. Configure Environment Variables
```
NEXT_PUBLIC_API_URL=https://elca-blockbusters-api.onrender.com
```

#### 3. Custom Domain (Optional)
- Add custom domain in Vercel dashboard
- Update DNS records as instructed

### Phase 3: Testing & Validation

#### 1. Health Checks
```bash
# Backend health
curl https://elca-blockbusters-api.onrender.com/health

# Frontend accessibility
curl https://elca-blockbusters.vercel.app
```

#### 2. Agent Testing
1. **Pastoral Agent**: Generate a test sermon
2. **Youth Agent**: Create social media content
3. **Mission Agent**: Plan volunteer deployment

#### 3. ELCA Compliance Validation
- Verify all content includes ELCA values
- Check bias detection is working
- Confirm human review requirements are displayed

## 🔧 Production Configuration

### Backend Security
```python
# main.py - Production settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://elca-blockbusters.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Frontend Security
```json
// vercel.json - Security headers
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## 📊 Monitoring & Observability

### Backend Monitoring (Render)
- **Health Endpoint**: `/health`
- **Readiness Check**: `/ready`
- **Metrics**: Built-in Render monitoring
- **Logs**: Accessible via Render dashboard

### Frontend Monitoring (Vercel)
- **Analytics**: Vercel Analytics enabled
- **Performance**: Core Web Vitals tracking
- **Error Tracking**: Automatic error reporting

### Custom Monitoring
```python
# Add to main.py for custom metrics
@app.get("/metrics")
async def get_metrics():
    return {
        "agents_active": len(active_agents),
        "tasks_completed": completed_tasks_count,
        "elca_compliance_rate": compliance_percentage
    }
```

## 🔐 Security Checklist

### API Security
- ✅ CORS properly configured
- ✅ API keys stored as environment variables
- ✅ Input validation on all endpoints
- ✅ Rate limiting implemented
- ✅ HTTPS enforced

### Data Protection
- ✅ No sensitive data in logs
- ✅ Database connections encrypted
- ✅ User data anonymized
- ✅ GDPR compliance ready

### ELCA Compliance
- ✅ All AI content validated
- ✅ Human review requirements displayed
- ✅ Bias detection active
- ✅ Transparency about AI assistance

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs in Render dashboard
# Common fixes:
1. Verify Python version (3.11.0)
2. Check requirements.txt syntax
3. Ensure all environment variables set
4. Verify database connection
```

#### Frontend Build Fails
```bash
# Check Vercel build logs
# Common fixes:
1. Verify Node.js version (18+)
2. Check package.json dependencies
3. Ensure API_URL is set correctly
4. Clear build cache and redeploy
```

#### AI Providers Not Working
```bash
# Check API keys are valid
# Test each provider:
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
curl -H "x-api-key: $ANTHROPIC_API_KEY" https://api.anthropic.com/v1/messages
curl -H "Authorization: Bearer $XAI_API_KEY" https://api.x.ai/v1/chat/completions
```

### Performance Optimization

#### Backend Performance
```python
# Add to main.py
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Enable caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
```

#### Frontend Performance
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['elca-blockbusters-api.onrender.com'],
  },
}
```

## 📈 Scaling Strategy

### Horizontal Scaling
1. **Backend**: Render auto-scaling enabled
2. **Frontend**: Vercel edge functions
3. **Database**: Render PostgreSQL with connection pooling

### Vertical Scaling
1. **Render Plan**: Upgrade to Standard for more resources
2. **Vercel Plan**: Pro plan for advanced features
3. **Database**: Scale up PostgreSQL instance

### Multi-Region Deployment
1. **Render**: Deploy to multiple regions
2. **Vercel**: Automatic edge deployment
3. **CDN**: Cloudflare for global distribution

## 🎯 Go-Live Checklist

### Pre-Launch (T-24 hours)
- [ ] All environment variables configured
- [ ] Health checks passing
- [ ] ELCA compliance validated
- [ ] Performance testing completed
- [ ] Security scan passed

### Launch Day (T-0)
- [ ] DNS updated (if custom domain)
- [ ] Monitoring alerts configured
- [ ] Team notified of live URLs
- [ ] Bishop demo materials prepared
- [ ] Support channels ready

### Post-Launch (T+24 hours)
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Validate ELCA compliance in production
- [ ] Gather initial user feedback
- [ ] Document any issues

## 📞 Support & Maintenance

### 24/7 Support During Pilot
- **Primary**: Sean McDonnell
- **Backup**: AI Engineering Team
- **Escalation**: Technical Leadership

### Regular Maintenance
- **Weekly**: Performance review
- **Monthly**: Security updates
- **Quarterly**: ELCA compliance audit
- **Annually**: Full system review

---

**Deployment Timeline: 4-6 hours total**
- Backend deployment: 1-2 hours
- Frontend deployment: 30 minutes
- Testing & validation: 2-3 hours
- Documentation & handoff: 1 hour

**Ready for Bishop demo in 48 hours! 🚀**
