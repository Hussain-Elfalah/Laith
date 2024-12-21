import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import { mealValidation } from '../middlewares/Validation.js';
import {
    createMeal,
    getMeals,
    updateMeal,
    deleteMeal
} from '../controllers/mealsController.js';

const router = express.Router();

router.post('/', authenticateJWT, mealValidation, createMeal);
router.get('/', authenticateJWT, getMeals);
router.patch('/:meal_id', authenticateJWT, mealValidation, updateMeal);
router.delete('/:meal_id', authenticateJWT, deleteMeal);

export default router;