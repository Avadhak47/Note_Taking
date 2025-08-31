# Deployment Guide

This guide covers various deployment options for the Notes App.

## Prerequisites

Before deploying, ensure you have:
- MongoDB database (local or MongoDB Atlas)
- Google OAuth credentials (optional)
- Email service configuration (for OTP)

## Local Development

1. **Install dependencies:**
```bash
npm run install-all
```

2. **Set up environment variables:**
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
   - Update the values with your configuration

3. **Start development servers:**
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000).

## Cloud Deployment

### Option 1: Heroku + Netlify (Recommended)

#### Backend on Heroku

1. **Create Heroku app:**
```bash
heroku create your-notes-app-backend
```

2. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-production-jwt-secret
heroku config:set GOOGLE_CLIENT_ID=your-google-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-google-client-secret
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set EMAIL_FROM=your-email@gmail.com
heroku config:set FRONTEND_URL=https://your-frontend-url.netlify.app
```

3. **Deploy:**
```bash
git subtree push --prefix backend heroku main
```

#### Frontend on Netlify

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Deploy to Netlify:**
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

3. **Set environment variables in Netlify:**
   - `REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api`

### Option 2: Railway

Railway provides easy deployment for both frontend and backend:

1. **Connect your GitHub repository to Railway**
2. **Create two services: backend and frontend**
3. **Set environment variables for each service**
4. **Railway will automatically deploy on git push**

### Option 3: Vercel + PlanetScale

1. **Deploy backend to Vercel:**
```bash
cd backend
vercel
```

2. **Deploy frontend to Vercel:**
```bash
cd frontend
vercel
```

3. **Use PlanetScale for MySQL database** (alternative to MongoDB)

### Option 4: Docker Deployment

1. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

2. **For production, use:**
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at https://cloud.mongodb.com/
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string and update `MONGODB_URI`

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/notes-app` as `MONGODB_URI`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-backend-url/api/auth/google/callback`
6. Update environment variables with client ID and secret

## Email Configuration

### Gmail (Recommended)

1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASSWORD`

### SendGrid (Alternative)

1. Create SendGrid account
2. Get API key
3. Update email service configuration in backend

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-app
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
GENERATE_SOURCEMAP=false
```

## Security Considerations

1. **Use strong JWT secrets** (minimum 32 characters)
2. **Enable HTTPS** in production
3. **Set secure CORS origins**
4. **Use environment variables** for all secrets
5. **Enable rate limiting** (already configured)
6. **Regular security updates**

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Log aggregation

## Scaling

For high traffic:
- Use Redis for session storage
- Implement caching
- Use CDN for static assets
- Database indexing and optimization
- Load balancing
