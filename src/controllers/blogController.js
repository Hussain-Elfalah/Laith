import pool from '../models/db.js';

// Create a new blog post
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const author_id = req.user.user_id;

        const result = await pool.query(
            'INSERT INTO BlogPosts (author_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [author_id, title, content]
        );

        res.status(201).json({
            success: true,
            post: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all blog posts with author information
export const getAllPosts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                b.post_id,
                b.title,
                b.content,
                b.created_at,
                b.updated_at,
                u.username as author_name,
                u.user_id as author_id
             FROM BlogPosts b
             JOIN Users u ON b.author_id = u.user_id
             ORDER BY b.created_at DESC`
        );

        res.json({
            success: true,
            posts: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get a single blog post by ID
export const getPostById = async (req, res) => {
    try {
        const { post_id } = req.params;

        const result = await pool.query(
            `SELECT 
                b.post_id,
                b.title,
                b.content,
                b.created_at,
                b.updated_at,
                u.username as author_name,
                u.user_id as author_id
             FROM BlogPosts b
             JOIN Users u ON b.author_id = u.user_id
             WHERE b.post_id = $1`,
            [post_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }

        res.json({
            success: true,
            post: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update a blog post
export const updatePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { title, content } = req.body;
        const user_id = req.user.user_id;

        // Check if user is the author or an admin
        const authorCheck = await pool.query(
            'SELECT author_id FROM BlogPosts WHERE post_id = $1',
            [post_id]
        );

        if (authorCheck.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }

        if (authorCheck.rows[0].author_id !== user_id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this post' 
            });
        }

        const result = await pool.query(
            'UPDATE BlogPosts SET title = $1, content = $2 WHERE post_id = $3 RETURNING *',
            [title, content, post_id]
        );

        res.json({
            success: true,
            post: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a blog post
export const deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const user_id = req.user.user_id;

        // Check if user is the author or an admin
        const authorCheck = await pool.query(
            'SELECT author_id FROM BlogPosts WHERE post_id = $1',
            [post_id]
        );

        if (authorCheck.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }

        if (authorCheck.rows[0].author_id !== user_id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this post' 
            });
        }

        await pool.query(
            'DELETE FROM BlogPosts WHERE post_id = $1',
            [post_id]
        );

        res.json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get posts by user
export const getUserPosts = async (req, res) => {
    try {
        const { user_id } = req.params;

        const result = await pool.query(
            `SELECT 
                b.post_id,
                b.title,
                b.content,
                b.created_at,
                b.updated_at,
                u.username as author_name
             FROM BlogPosts b
             JOIN Users u ON b.author_id = u.user_id
             WHERE b.author_id = $1
             ORDER BY b.created_at DESC`,
            [user_id]
        );

        res.json({
            success: true,
            posts: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Search posts
export const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;

        const result = await pool.query(
            `SELECT 
                b.post_id,
                b.title,
                b.content,
                b.created_at,
                b.updated_at,
                u.username as author_name,
                u.user_id as author_id
             FROM BlogPosts b
             JOIN Users u ON b.author_id = u.user_id
             WHERE 
                b.title ILIKE $1 OR 
                b.content ILIKE $1
             ORDER BY b.created_at DESC`,
            [`%${query}%`]
        );

        res.json({
            success: true,
            posts: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};