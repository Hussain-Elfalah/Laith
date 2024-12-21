import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import { workoutValidation } from '../middlewares/Validation.js';
import {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout
} from '../controllers/workoutController.js';

const router = express.Router();

router.post('/', authenticateJWT, workoutValidation, createWorkout);
router.get('/', authenticateJWT, getWorkouts);
router.patch('/:workout_id', authenticateJWT, workoutValidation, updateWorkout);
router.delete('/:workout_id', authenticateJWT, deleteWorkout);

export default router;