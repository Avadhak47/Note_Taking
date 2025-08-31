import express from 'express';
import { body } from 'express-validator';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
} from '../controllers/notesController.js';
import { authenticateToken, requireVerified } from '../middleware/authSimple.js';

const router = express.Router();

// Validation rules
const noteValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('content').trim().isLength({ min: 1, max: 10000 }).withMessage('Content is required and must be less than 10000 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPinned').optional().isBoolean().withMessage('isPinned must be a boolean'),
];

// Apply authentication and verification to all routes
router.use(authenticateToken);
router.use(requireVerified);

// Routes
router.post('/', noteValidation, createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', noteValidation, updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/toggle-pin', togglePin);

export default router;
