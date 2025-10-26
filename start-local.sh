#!/bin/bash

# ELCA Blockbusters - Local Development Startup Script
# This script starts both backend and frontend servers

set -e

echo "🚀 Starting ELCA Blockbusters Local Development Environment"
echo "============================================================"

# Check if API keys are set
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file found"
else
    echo "⚠️  Backend .env file not found - creating template"
    cat > backend/.env << 'EOF'
# ELCA Blockbusters Backend Environment Configuration
# Add your API keys here

# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
XAI_API_KEY=your_xai_grok_api_key_here

# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./elca_blockbusters.db

# Application Settings
APP_ENV=development
LOG_LEVEL=INFO
EOF
fi

# Start Backend
echo ""
echo "📦 Starting Backend (FastAPI on port 8000)..."
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start Frontend
echo ""
echo "🎨 Starting Frontend (Next.js on port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 5

echo ""
echo "============================================================"
echo "✅ ELCA Blockbusters is now running locally!"
echo ""
echo "📍 Access Points:"
echo "   - Frontend:  http://localhost:3000"
echo "   - Backend:   http://localhost:8000"
echo "   - API Docs:  http://localhost:8000/docs"
echo ""
echo "🛑 To stop all services, press Ctrl+C"
echo "============================================================"
echo ""

# Wait for user interrupt
wait

