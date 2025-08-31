import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { generateOTP, sendOTPEmail } from '../utils/email.js';
import { createError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      otp,
      otpExpires,
      isVerified: false,
    });

    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Continue with signup even if email fails
    }

    res.status(201).json({
      message: 'User created successfully. Please check your email for verification code.',
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken({ userId: user._id, email: user.email });

    res.status(200).json({
      message: 'Email verified successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email first' });
    }

    const isPasswordValid = user.comparePassword ? await user.comparePassword(password) : false;
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user._id, email: user.email });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      res.status(500).json({ error: 'Failed to send OTP email' });
    }
  } catch (error) {
    next(error);
  }
};

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
    }

    const token = generateToken({ userId: user._id, email: user.email });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  })(req, res, next);
};

export const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};
