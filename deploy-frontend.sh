#!/bin/bash

# ELCA Blockbusters - Frontend Deployment Helper
# This script helps prepare frontend for Vercel deployment

set -e

echo "🚀 ELCA Blockbusters - Frontend Deployment Preparation"
echo "===================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v)
echo "📦 Node.js version: $NODE_VERSION"

# Install dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Dependency installation failed"
    exit 1
fi

# Test build
echo ""
echo "🏗️  Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    exit 1
fi

# Check vercel.json exists
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configuration found"
else
    echo "⚠️  vercel.json not found in frontend directory"
fi

cd ..

echo ""
echo "===================================================="
echo "✅ Frontend is ready for Vercel deployment!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to https://vercel.com"
echo "2. Click 'Add New...' → 'Project'"
echo "3. Import your GitHub repo: mothershipaddons"
echo "4. Configure:"
echo "   - Framework: Next.js (auto-detected)"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm run build (auto-detected)"
echo "   - Output Directory: .next (auto-detected)"
echo ""
echo "5. Add Environment Variable:"
echo "   - NEXT_PUBLIC_API_URL=https://elca-blockbusters-api.onrender.com"
echo "   (Use YOUR actual Render backend URL from Part 1)"
echo ""
echo "6. Click 'Deploy'"
echo ""
echo "Your frontend will be live at:"
echo "https://elca-blockbusters.vercel.app"
echo "(Vercel will assign a random subdomain)"
echo ""
echo "===================================================="
echo ""
echo "💡 Pro Tip: After both are deployed, update the backend URL in Vercel"
echo "if it's different from https://elca-blockbusters-api.onrender.com"
echo ""

