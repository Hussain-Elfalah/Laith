import express from 'express';
import { register, login } from '../controllers/authController.js';
import passport from '../config/passport.js';
import { registerValidation, loginValidation } from '../middlewares/Validation.js';

const router = express.Router();


// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Test route to verify user's token
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        user: {
            id: req.user.user_id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

export default router;