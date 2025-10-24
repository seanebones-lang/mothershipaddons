# Vercel Deployment - Quick Fix Guide

## The Problem
Vercel was showing 404 errors because:
1. The build was failing due to Next.js 16 Turbopack bugs
2. The Root Directory setting was incorrect

## The Solution (2 Steps)

### Step 1: Update Vercel Project Settings

**YOU MUST DO THIS BEFORE THE DEPLOYMENT WILL WORK**

1. Go to: https://vercel.com/dashboard
2. Click on your `elca-blockbusters` or `mothershipaddons` project
3. Click "Settings" in the top menu
4. Click "General" in the left sidebar
5. Scroll down to "Build & Development Settings"
6. Update the following:
   - **Root Directory**: `elca-blockbusters/frontend` (click "Edit" and enter this)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `out` (default)
   - **Install Command**: `npm install` (default)
7. Click "Save" at the bottom

### Step 2: Trigger Redeploy

The code has already been pushed to GitHub. Vercel should automatically start a new deployment.

To check deployment status:
1. Go to your Vercel dashboard
2. Click on your project
3. Click "Deployments" tab
4. You should see a new deployment in progress

**Expected Timeline:**
- Build time: 2-3 minutes
- Total deployment: 3-5 minutes

## What Was Fixed in the Code

1. **Downgraded Next.js** from 16.0.0 to 15.1.3 (stable)
2. **Fixed vercel.json** configuration
3. **Added `"use client"`** directive to Alert component
4. **Removed invalid config** from next.config.js
5. **Added .vercelignore** for optimized deployments

## Verification

Once deployed, visit your Vercel URL and you should see:
- The main dashboard with 3 tabs
- Sermon Generator
- Gen-Z Translator
- Miracles Finder

## Troubleshooting

If you still see 404 after updating settings:
1. Check that Root Directory is exactly: `elca-blockbusters/frontend`
2. Go to Deployments → Latest Deployment → View Build Logs
3. Look for any errors in the build process
4. If needed, manually trigger a redeploy:
   - Go to Deployments
   - Click the three dots on the latest deployment
   - Click "Redeploy"

## Support

If issues persist, check:
- Vercel build logs for specific errors
- Browser console for JavaScript errors
- Ensure backend API is running on Render

## Files Modified

- `frontend/package.json` - Downgraded Next.js
- `frontend/next.config.js` - Fixed configuration
- `frontend/vercel.json` - Fixed Vercel settings
- `frontend/components/ui/alert.tsx` - Added "use client"
- `frontend/.vercelignore` - New file
- `vercel.json` - New root-level config

All changes have been committed and pushed to GitHub.

