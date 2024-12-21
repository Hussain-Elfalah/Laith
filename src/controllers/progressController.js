import pool from '../models/db.js';

export const recordProgress = async (req, res) => {
    try {
        const { weight, body_fat_percentage, muscle_mass_percentage } = req.body;
        const user_id = req.user.user_id;
        const record_date = new Date();

        const result = await pool.query(
            'INSERT INTO Progress (user_id, record_date, weight, body_fat_percentage, muscle_mass_percentage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, record_date, weight, body_fat_percentage, muscle_mass_percentage]
        );

        res.status(201).json({
            success: true,
            progress: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getProgress = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const result = await pool.query(
            'SELECT * FROM Progress WHERE user_id = $1 ORDER BY record_date DESC',
            [user_id]
        );

        res.json({
            success: true,
            progress: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getProgressStats = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const stats = await pool.query(
            `SELECT 
                MIN(weight) as lowest_weight,
                MAX(weight) as highest_weight,
                AVG(weight) as average_weight,
                MIN(body_fat_percentage) as lowest_body_fat,
                MAX(muscle_mass_percentage) as highest_muscle_mass
             FROM Progress 
             WHERE user_id = $1`,
            [user_id]
        );

        res.json({
            success: true,
            stats: stats.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { progress_id } = req.params;
        const { weight, body_fat_percentage, muscle_mass_percentage } = req.body;
        const user_id = req.user.user_id;

        const result = await pool.query(
            'UPDATE Progress SET weight = $1, body_fat_percentage = $2, muscle_mass_percentage = $3 WHERE progress_id = $4 AND user_id = $5 RETURNING *',
            [weight, body_fat_percentage, muscle_mass_percentage, progress_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Progress record not found' });
        }

        res.json({
            success: true,
            progress: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};