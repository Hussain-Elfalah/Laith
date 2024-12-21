import pool from '../models/db.js';

export const createMeal = async (req, res) => {
    try {
        const { meal_description, food_id } = req.body;
        const user_id = req.user.user_id;
        const meal_date = new Date();

        const result = await pool.query(
            'INSERT INTO Meals (user_id, meal_date, meal_description, food_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, meal_date, meal_description, food_id]
        );

        res.status(201).json({
            success: true,
            meal: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getMeals = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const result = await pool.query(
            `SELECT m.*, f.food_name, f.calories, f.protein, f.carbs, f.fats 
             FROM Meals m 
             LEFT JOIN FoodDatabase f ON m.food_id = f.food_id 
             WHERE m.user_id = $1 
             ORDER BY m.meal_date DESC`,
            [user_id]
        );

        res.json({
            success: true,
            meals: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateMeal = async (req, res) => {
    try {
        const { meal_id } = req.params;
        const { meal_description, food_id } = req.body;
        const user_id = req.user.user_id;

        const result = await pool.query(
            'UPDATE Meals SET meal_description = $1, food_id = $2 WHERE meal_id = $3 AND user_id = $4 RETURNING *',
            [meal_description, food_id, meal_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Meal not found' });
        }

        res.json({
            success: true,
            meal: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteMeal = async (req, res) => {
    try {
        const { meal_id } = req.params;
        const user_id = req.user.user_id;

        const result = await pool.query(
            'DELETE FROM Meals WHERE meal_id = $1 AND user_id = $2 RETURNING *',
            [meal_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Meal not found' });
        }

        res.json({
            success: true,
            message: 'Meal deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};