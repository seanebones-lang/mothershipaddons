# Vercel Deployment Troubleshooting Guide

## Current Issue
Vercel is using old commit `e36b1cb` instead of latest commit `e2feea13` with our fixes.

## Immediate Actions

### 1. Check Vercel Project Settings
1. Go to: https://vercel.com/dashboard
2. Click on your project (elca-blockbusters or mothershipaddons)
3. Go to Settings → General
4. Verify:
   - **Root Directory**: `elca-blockbusters/frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (NOT `out`)
   - **Install Command**: `npm install`

### 2. Force Fresh Deployment
If Vercel still uses old commit:
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Or manually trigger: Go to Settings → Git → "Redeploy"

### 3. Clear Vercel Cache
1. Go to Deployments
2. Click three dots on latest deployment
3. Select "Redeploy" with "Use existing Build Cache" UNCHECKED

## What Should Happen Now
- Vercel should detect commit `e2feea13`
- Build should show standard Next.js process (no static export)
- No "detected next export" warning
- Runtime API calls should work

## Verification
After deployment, check:
- ✅ No "Application error" messages
- ✅ AI Agent Dashboard loads with 3 tabs
- ✅ Real-time data from backend API
- ✅ Working AI content generation

## If Issues Persist
1. Check Vercel build logs for specific errors
2. Verify Root Directory is exactly: `elca-blockbusters/frontend`
3. Ensure Output Directory is `.next` not `out`
4. Check that Framework Preset is Next.js (not Static)
