import pkg from 'passport-jwt';
const { Strategy: JwtStrategy, ExtractJwt } = pkg;
import passport from 'passport';
import pool from '../models/db.js';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            // Find user by id from jwt_payload
            const result = await pool.query(
                'SELECT user_id, username, email, role FROM users WHERE user_id = $1',
                [jwt_payload.id]
            );

            const user = result.rows[0];

            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;