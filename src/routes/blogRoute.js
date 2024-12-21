import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import { blogPostValidation } from '../middlewares/Validation.js';
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getUserPosts,
    searchPosts
} from '../controllers/blogController.js';

const router = express.Router();

// Public routes
router.get('/posts', getAllPosts);
router.get('/posts/search', searchPosts);
router.get('/posts/:post_id', getPostById);
router.get('/users/:user_id/posts', getUserPosts);

// Protected routes
router.post('/posts', authenticateJWT, blogPostValidation, createPost);
router.patch('/posts/:post_id', authenticateJWT, blogPostValidation, updatePost);
router.delete('/posts/:post_id', authenticateJWT, deletePost);

export default router;