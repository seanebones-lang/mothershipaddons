#!/bin/bash

# ELCA Blockbusters - Backend Deployment Helper
# This script helps prepare backend for Render deployment

set -e

echo "🚀 ELCA Blockbusters - Backend Deployment Preparation"
echo "===================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo "❌ Error: Please run this script from the project root"
    exit 1
fi

# Check if requirements.txt exists
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: backend/requirements.txt not found"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Verify all dependencies
echo "📦 Verifying backend dependencies..."
cd backend
source venv/bin/activate

# Test imports
python -c "import fastapi; import uvicorn; import sqlalchemy; import openai; import anthropic" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ All core dependencies importable"
else
    echo "⚠️  Some dependencies missing - running pip install"
    pip install -r requirements.txt
fi

# Test database initialization
echo ""
echo "🗄️  Testing database initialization..."
python -c "from shared.models import init_db; import asyncio; asyncio.run(init_db())" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database initialization successful"
else
    echo "❌ Database initialization failed"
    exit 1
fi

# Test FastAPI app loads
echo ""
echo "🧪 Testing FastAPI application..."
python -c "from main import app; print(f'✅ FastAPI app loaded: {app.title}')"

cd ..

echo ""
echo "===================================================="
echo "✅ Backend is ready for Render deployment!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repo: mothershipaddons"
echo "4. Configure:"
echo "   - Name: elca-blockbusters-api"
echo "   - Runtime: Python 3"
echo "   - Build Command: pip install -r backend/requirements.txt"
echo "   - Start Command: cd backend && gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:\$PORT"
echo "   - Health Check: /health"
echo ""
echo "5. Add Environment Variables:"
echo "   - PYTHON_VERSION=3.11.0"
echo "   - OPENAI_API_KEY=your_key"
echo "   - ANTHROPIC_API_KEY=your_key"
echo "   - XAI_API_KEY=your_key"
echo "   - DATABASE_URL=sqlite+aiosqlite:///./elca_blockbusters.db"
echo "   - APP_ENV=production"
echo ""
echo "6. Click 'Create Web Service'"
echo ""
echo "Your backend will be live at:"
echo "https://elca-blockbusters-api.onrender.com"
echo ""
echo "===================================================="

