import { body } from 'express-validator';

export const signupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name should only contain letters'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name should only contain letters'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const otpValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be exactly 6 digits'),
];

export const noteValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content is required and must be less than 10000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean'),
];
