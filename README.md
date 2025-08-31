# Notes App - Full Stack Application

A modern, responsive note-taking application built with React TypeScript frontend and Node.js TypeScript backend.

## Features

- 📝 Create, edit, and delete notes
- 📌 Pin important notes
- 🏷️ Tag notes for organization
- 🔍 Search through notes
- 👤 User authentication with email/OTP and Google OAuth
- 📱 Mobile-friendly responsive design
- 🔒 JWT-based authorization
- ✅ Input validation and error handling

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Styled Components** for styling
- **React Hook Form** for form handling
- **Yup** for validation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Passport.js** for Google OAuth
- **Bcrypt** for password hashing
- **Nodemailer** for OTP emails
- **Express Validator** for input validation

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Gmail account (for OTP emails)
- Google Cloud Console project (for Google OAuth)

## Quick Start

### Using Docker (Recommended)

1. **Clone and start the application:**
```bash
git clone <repository-url>
cd notes-app
docker-compose up --build
```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Setup

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd notes-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas by updating MONGODB_URI in backend/.env
```

### 5. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend/.env

### 6. Email Setup (For OTP)

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Update `EMAIL_USER`, `EMAIL_PASSWORD`, and `EMAIL_FROM` in backend/.env

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

1. Build the backend:
```bash
cd backend
npm run build
npm start
```

2. Build the frontend:
```bash
cd frontend
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/profile` - Get user profile

### Notes
- `GET /api/notes` - Get user notes (with pagination and search)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/toggle-pin` - Toggle note pin status

## Project Structure

```
notes-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── types/
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   └── App.tsx
│   ├── .env
│   └── package.json
└── README.md
```

## Features in Detail

### Authentication
- Email and password registration with OTP verification
- Google OAuth integration
- JWT-based session management
- Secure password hashing with bcrypt

### Notes Management
- Create notes with title, content, and tags
- Pin important notes to the top
- Search notes by title and content
- Responsive grid layout
- Real-time updates

### Security
- JWT token authentication
- Rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers

### User Experience
- Modern, clean UI design
- Mobile-responsive layout
- Real-time notifications
- Loading states and error handling
- Keyboard shortcuts and accessibility

## Deployment

### Backend Deployment (Heroku example)

1. Create a Heroku app:
```bash
heroku create your-notes-app-backend
```

2. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-production-jwt-secret
# ... set other environment variables
```

3. Deploy:
```bash
git subtree push --prefix backend heroku main
```

### Frontend Deployment (Netlify/Vercel example)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to your hosting service
3. Update environment variables with production API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository.
