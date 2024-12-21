import pool from '../models/db.js';

export const createWorkout = async (req, res) => {
    try {
        const { workout_type, duration_minutes, calories_burned, notes } = req.body;
        const user_id = req.user.user_id;
        const workout_date = new Date();

        const result = await pool.query(
            'INSERT INTO Workouts (user_id, workout_date, workout_type, duration_minutes, calories_burned, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user_id, workout_date, workout_type, duration_minutes, calories_burned, notes]
        );

        res.status(201).json({
            success: true,
            workout: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getWorkouts = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const result = await pool.query(
            'SELECT * FROM Workouts WHERE user_id = $1 ORDER BY workout_date DESC',
            [user_id]
        );

        res.json({
            success: true,
            workouts: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateWorkout = async (req, res) => {
    try {
        const { workout_id } = req.params;
        const { workout_type, duration_minutes, calories_burned, notes } = req.body;
        const user_id = req.user.user_id;

        const result = await pool.query(
            'UPDATE Workouts SET workout_type = $1, duration_minutes = $2, calories_burned = $3, notes = $4 WHERE workout_id = $5 AND user_id = $6 RETURNING *',
            [workout_type, duration_minutes, calories_burned, notes, workout_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }

        res.json({
            success: true,
            workout: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteWorkout = async (req, res) => {
    try {
        const { workout_id } = req.params;
        const user_id = req.user.user_id;

        const result = await pool.query(
            'DELETE FROM Workouts WHERE workout_id = $1 AND user_id = $2 RETURNING *',
            [workout_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }

        res.json({
            success: true,
            message: 'Workout deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};