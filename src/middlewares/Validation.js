import { validationResult } from 'express-validator';
import { body } from 'express-validator';

// Middleware to check for validation errors
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validations
export const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores and dashes'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
    validateRequest
];

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required'),
    validateRequest
];

// Workout validations
export const workoutValidation = [
    body('workout_type')
        .trim()
        .notEmpty()
        .withMessage('Workout type is required'),
    body('duration_minutes')
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive number'),
    body('calories_burned')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Calories burned must be a positive number'),
    validateRequest
];

// Meal validations
export const mealValidation = [
    body('meal_description')
        .trim()
        .notEmpty()
        .withMessage('Meal description is required'),
    body('food_id')
        .optional()
        .isInt()
        .withMessage('Invalid food ID'),
    validateRequest
];

// Progress validations
export const progressValidation = [
    body('weight')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Weight must be a positive number'),
    body('body_fat_percentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Body fat percentage must be between 0 and 100'),
    body('muscle_mass_percentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Muscle mass percentage must be between 0 and 100'),
    validateRequest
];

// Blog post validations
export const blogPostValidation = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
    body('content')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),
    validateRequest
];

// Protein intake validations
export const proteinIntakeValidation = [
    body('protein_amount')
        .isFloat({ min: 0 })
        .withMessage('Protein amount must be a positive number'),
    validateRequest
];