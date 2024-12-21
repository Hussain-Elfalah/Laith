import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import { progressValidation } from '../middlewares/Validation.js';
import {
    recordProgress,
    getProgress,
    getProgressStats,
    updateProgress
} from '../controllers/progressController.js';

const router = express.Router();

router.post('/', authenticateJWT, progressValidation, recordProgress);
router.get('/', authenticateJWT, getProgress);
router.get('/stats', authenticateJWT, getProgressStats);
router.patch('/:progress_id', authenticateJWT, progressValidation, updateProgress);

export default router;