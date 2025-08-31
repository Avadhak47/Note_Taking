#!/bin/bash

# Deployment script for Notes App
set -e

echo "🚀 Starting deployment process..."

# Build backend
echo "📦 Building backend..."
cd backend
npm run build
cd ..

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build completed successfully!"

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker found. You can now run:"
    echo "   docker-compose up --build"
    echo ""
    echo "Or deploy individual services:"
    echo "   docker build -t notes-app-backend ./backend"
    echo "   docker build -t notes-app-frontend ./frontend"
else
    echo "⚠️  Docker not found. Manual deployment:"
    echo "   1. Set up MongoDB"
    echo "   2. Configure environment variables"
    echo "   3. Run: cd backend && npm start"
    echo "   4. Serve frontend build folder"
fi

echo ""
echo "📝 Don't forget to:"
echo "   1. Set up environment variables (.env files)"
echo "   2. Configure Google OAuth credentials"
echo "   3. Set up email service for OTP"
echo "   4. Update CORS settings for production"

echo ""
echo "🌐 For cloud deployment, consider:"
echo "   - Frontend: Netlify, Vercel, or AWS S3"
echo "   - Backend: Heroku, Railway, or AWS EC2"
echo "   - Database: MongoDB Atlas"
