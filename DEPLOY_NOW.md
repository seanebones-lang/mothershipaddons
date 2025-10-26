# Deploy ELCA Blockbusters to Production

**Split architecture deployment to Render (backend) + Vercel (frontend)**

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ GitHub account with this repo pushed
2. ✅ Render account (https://render.com - free signup)
3. ✅ Vercel account (https://vercel.com - free signup)
4. ✅ API keys ready:
   - OpenAI API key
   - Anthropic API key
   - X.ai Grok API key

---

## Part 1: Deploy Backend to Render (5 minutes)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `mothershipaddons`
3. Configure:
   - **Name:** `elca-blockbusters-api`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** Leave blank
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - **Plan:** Free (or Starter $7/month for better performance)

### Step 3: Add Environment Variables
In the Render dashboard, add these environment variables:

```
PYTHON_VERSION=3.11.0
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
XAI_API_KEY=your_xai_key_here
DATABASE_URL=sqlite+aiosqlite:///./elca_blockbusters.db
APP_ENV=production
LOG_LEVEL=INFO
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build
3. Your backend will be live at: `https://elca-blockbusters-api.onrender.com`

### Step 5: Verify Backend
```bash
curl https://elca-blockbusters-api.onrender.com/health
# Should return: {"status":"healthy","service":"elca-blockbusters"}

curl https://elca-blockbusters-api.onrender.com/api/agents
# Should return: JSON array of 3 agents
```

**Backend URL:** Copy this URL - you'll need it for Vercel!

---

## Part 2: Deploy Frontend to Vercel (3 minutes)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import `mothershipaddons` repository
3. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 3: Add Environment Variable
1. Go to **"Environment Variables"** section
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://elca-blockbusters-api.onrender.com
   ```
   (Use the URL from Part 1, Step 5)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your frontend will be live at: `https://elca-blockbusters.vercel.app`
   (Vercel assigns a random URL initially)

### Step 5: Verify Frontend
1. Visit your Vercel URL
2. You should see the ELCA AI Platform dashboard
3. Check that agent counts load (may take 30 seconds for Render to wake up)
4. Test generating a sermon or social media content

---

## Alternative: One-Click Deploy

### Backend (Render)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/seanebones-lang/mothershipaddons)

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seanebones-lang/mothershipaddons&project-name=elca-blockbusters&root-directory=frontend&env=NEXT_PUBLIC_API_URL)

---

## Post-Deployment Configuration

### Update Frontend Backend URL (if needed)

If your Render backend URL is different:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your actual Render URL
3. Redeploy: Deployments → Three dots → Redeploy

### Custom Domains (Optional)

**Backend:**
1. Render dashboard → Your service → Settings → Custom Domain
2. Add: `api.elcablockbusters.org` (or your domain)
3. Update DNS records as instructed

**Frontend:**
1. Vercel dashboard → Your project → Settings → Domains
2. Add: `elcablockbusters.org` (or your domain)
3. Update DNS records as instructed

---

## Costs

### Free Tier (Development/Testing)
- **Render Free:** Backend sleeps after 15 min inactivity
- **Vercel Free:** 100GB bandwidth, unlimited deployments
- **Total: $0/month**

### Recommended Tier (Production)
- **Render Starter:** $7/month (always on, better performance)
- **Vercel Pro:** $20/month (advanced analytics, priority support)
- **Total: $27/month**

### Enterprise Tier (Multiple Synods)
- **Render Standard:** $25/month (high availability)
- **Vercel Enterprise:** Custom pricing (white-label, SLA)
- **Total: $50-200/month depending on scale**

---

## Monitoring & Maintenance

### Health Checks
- **Backend:** https://your-backend.onrender.com/health
- **Backend Readiness:** https://your-backend.onrender.com/ready
- **Frontend:** Just visit the URL

### Logs
- **Render:** Dashboard → Logs (real-time)
- **Vercel:** Dashboard → Deployments → View Logs

### Auto-Deploy
Both platforms will auto-deploy on git push to main:
```bash
git add .
git commit -m "Update feature"
git push origin main
# ✅ Auto-deploys to both Render and Vercel
```

---

## Troubleshooting

### Backend Issues

**"Service Unavailable"**
- Render free tier sleeps - first request takes 30-60 seconds
- Upgrade to Starter plan for always-on

**"Database Error"**
- SQLite file not persisting on Render free tier
- Upgrade to paid plan with persistent disk
- Or migrate to Postgres (see DATABASE_MIGRATION.md)

**"Missing API Keys"**
- Check Render environment variables
- Redeploy after adding keys

### Frontend Issues

**"Failed to fetch agents"**
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is running (check health endpoint)
- Check CORS settings in backend

**"Build Failed"**
- Check Vercel build logs
- Ensure all dependencies in package.json
- Verify Node version compatibility

**"API calls work locally but not in production"**
- Update frontend vercel.json with correct backend URL
- Check backend CORS allows your Vercel domain

---

## Success Checklist

After deployment, verify:

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads with all styling
- [ ] Agent counts display (3 active agents)
- [ ] Can generate a sermon
- [ ] Can create social media content
- [ ] Can plan volunteer deployment
- [ ] Recent tasks appear in dashboard
- [ ] ELCA values display correctly

---

## Production URLs (After Deployment)

Update these in your documentation:

**Backend API:**
- Production: `https://elca-blockbusters-api.onrender.com`
- Health: `https://elca-blockbusters-api.onrender.com/health`
- Docs: `https://elca-blockbusters-api.onrender.com/docs`

**Frontend:**
- Production: `https://elca-blockbusters.vercel.app`
- (Or your custom domain)

---

## Quick Deploy Commands

### Deploy Backend via Render CLI (Optional)
```bash
# Install Render CLI
npm install -g @render/cli

# Deploy
render deploy --service elca-blockbusters-api
```

### Deploy Frontend via Vercel CLI (Optional)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

---

## Support

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **This Project:** See BUILD_INSTRUCTIONS.md and QUICK_START.md

---

**Ready to deploy? Start with Part 1 (Render backend) then Part 2 (Vercel frontend)!**

