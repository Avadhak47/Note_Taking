import express from 'express';
import { body } from 'express-validator';
import {
  signup,
  verifyOTP,
  login,
  resendOTP,
  googleAuth,
  googleCallback,
  getProfile,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authSimple.js';

const router = express.Router();

// Validation rules
const signupValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const otpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
];

const emailValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/verify-otp', otpValidation, verifyOTP);
router.post('/login', loginValidation, login);
router.post('/resend-otp', emailValidation, resendOTP);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
