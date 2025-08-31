import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { AuthRequest, GoogleProfile } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/api/auth/google/callback',
  passReqToCallback: false,
}, async (accessToken, refreshToken, profile: any, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with the same email
    const email = profile.emails[0]?.value;
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.isVerified = true;
        if (profile.photos[0]?.value) {
          user.profilePicture = profile.photos[0].value;
        }
        await user.save();
        return done(null, user);
      }
    }

    // Create new user
    user = new User({
      email,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      googleId: profile.id,
      isVerified: true,
      profilePicture: profile.photos[0]?.value,
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error as Error, undefined);
  }
}));

// Middleware to protect routes
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to check if user is verified
export const requireVerification = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isVerified) {
    return res.status(403).json({ error: 'Email verification required' });
  }
  next();
};
