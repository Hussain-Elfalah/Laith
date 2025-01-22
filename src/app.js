import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import './config/passport.js'; 

// Import routes
import authRoutes from './routes/authRoute.js';
import workoutRoutes from './routes/workoutsRoute.js';
import mealRoutes from './routes/mealsRoute.js';
import proteinRoutes from './routes/protineRoute.js';
import progressRoutes from './routes/progressRoute.js';
import blogRoutes from './routes/blogRoute.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/protein', proteinRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/blog', blogRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server launched successfully! API is ready at http://localhost:${PORT}`);
  // console.log(`📝 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`⚡️ Environment: ${process.env.NODE_ENV || 'development'}`);
});