import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import passport from '../config/passport.js';
import { registerValidation, loginValidation } from '../middlewares/Validation.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();


// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', authenticateJWT, logout);

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