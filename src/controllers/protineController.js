import pool from '../models/db.js';

export const recordProteinIntake = async (req, res) => {
    try {
        const { protein_amount } = req.body;
        const user_id = req.user.user_id;
        const intake_date = new Date();

        const result = await pool.query(
            'INSERT INTO ProteinIntake (user_id, intake_date, protein_amount) VALUES ($1, $2, $3) RETURNING *',
            [user_id, intake_date, protein_amount]
        );

        res.status(201).json({
            success: true,
            proteinIntake: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getProteinIntake = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { startDate, endDate } = req.query;

        let query = 'SELECT * FROM ProteinIntake WHERE user_id = $1';
        const queryParams = [user_id];

        if (startDate && endDate) {
            query += ' AND intake_date BETWEEN $2 AND $3';
            queryParams.push(startDate, endDate);
        }

        query += ' ORDER BY intake_date DESC';

        const result = await pool.query(query, queryParams);

        res.json({
            success: true,
            proteinIntake: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateProteinIntake = async (req, res) => {
    try {
        const { intake_id } = req.params;
        const { protein_amount } = req.body;
        const user_id = req.user.user_id;

        const result = await pool.query(
            'UPDATE ProteinIntake SET protein_amount = $1 WHERE intake_id = $2 AND user_id = $3 RETURNING *',
            [protein_amount, intake_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Protein intake record not found' });
        }

        res.json({
            success: true,
            proteinIntake: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};