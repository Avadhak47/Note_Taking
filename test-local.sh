#!/bin/bash

# Local testing script for Notes App
set -e

echo "🧪 Testing Notes App locally..."

# Check if MongoDB is running (optional)
if command -v mongosh &> /dev/null; then
    echo "📊 Checking MongoDB connection..."
    if mongosh --eval "db.runCommand('ping')" --quiet; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB not accessible. Make sure it's running or use MongoDB Atlas."
    fi
else
    echo "⚠️  MongoDB CLI not found. Assuming MongoDB Atlas or remote connection."
fi

# Test backend build
echo "🔧 Testing backend build..."
cd backend
npm run build
echo "✅ Backend builds successfully"

# Test frontend build  
echo "🔧 Testing frontend build..."
cd ../frontend
npm run build
echo "✅ Frontend builds successfully"

cd ..

echo ""
echo "🎉 All tests passed! Your application is ready."
echo ""
echo "To start development:"
echo "   npm run dev"
echo ""
echo "To start production:"
echo "   1. Start MongoDB"
echo "   2. cd backend && npm start"
echo "   3. Serve frontend/build folder"
echo ""
echo "To deploy with Docker:"
echo "   docker-compose up --build"
