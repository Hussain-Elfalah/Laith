import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import { proteinIntakeValidation } from '../middlewares/Validation.js';
import {
    recordProteinIntake,
    getProteinIntake,
    updateProteinIntake
} from '../controllers/protineController.js';

const router = express.Router();

router.post('/', authenticateJWT, proteinIntakeValidation, recordProteinIntake);
router.get('/', authenticateJWT, getProteinIntake);
router.patch('/:intake_id', authenticateJWT, proteinIntakeValidation, updateProteinIntake);

export default router;