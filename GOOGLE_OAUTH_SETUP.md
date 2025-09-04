# 🔧 Google OAuth Setup Guide

## Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**: Create new project or select existing
3. **Enable APIs**: 
   - Go to "APIs & Services" → "Library"
   - Search and enable "Google+ API" or "Google Identity Services API"

## Step 2: Create OAuth Credentials

1. **Go to Credentials**: APIs & Services → Credentials
2. **Create Credentials**: Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Configure OAuth Consent Screen** (if first time):
   - User Type: External
   - App name: "Notes App"
   - User support email: your email
   - Authorized domains: localhost (for testing)

## Step 3: OAuth Client Configuration

**Application type**: Web application
**Name**: Notes App Backend

**Authorized redirect URIs** (Add both):
- `http://localhost:5000/api/auth/google/callback`
- `http://127.0.0.1:5000/api/auth/google/callback`

## Step 4: Update Environment Variables

Copy the Client ID and Client Secret to your `.env` files:

**backend/.env**:
```
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

## Step 5: Test the Integration

1. Restart your backend server
2. Click "Continue with Google" button
3. Should redirect to Google OAuth flow

## Production Setup

For production, add your production domain to:
- Authorized redirect URIs: `https://yourdomain.com/api/auth/google/callback`
- OAuth consent screen authorized domains

