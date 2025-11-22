import jwt from 'jsonwebtoken';
import { User } from '../../models/User.model.js';
import { logger } from '../../utils/logger.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/* -------------------------
        SIGN UP
-------------------------- */
export const registerUser = async (req, res, next) => {
    try {
        logger.log('Incoming REGISTER request');

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            logger.warn('REGISTER failed: missing fields');
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        logger.log(`Checking existing user for email: ${email}`);

        const existing = await User.findOne({ email });
        if (existing) {
            logger.warn(`REGISTER failed: user already exists → ${email}`);
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        logger.log(`Creating new user: ${email}`);

        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);

        logger.log(`Setting auth cookie for user ${user._id}`);

        res.cookie('token', token, cookieOptions);

        logger.log(`REGISTER successful for ${email}`);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        logger.error('REGISTER error:', err.message);
        next(err);
    }
};

/* -------------------------
          LOGIN
-------------------------- */
export const loginUser = async (req, res, next) => {
    try {
        logger.log('Incoming LOGIN request');

        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn('LOGIN failed: missing fields');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        logger.log(`Looking for user: ${email}`);

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            logger.warn(`LOGIN failed: user not found → ${email}`);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        logger.log(`Validating password for user ${user._id}`);

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            logger.warn(`LOGIN failed: invalid password for ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);

        logger.log(`Setting auth cookie for user ${user._id}`);

        res.cookie('token', token, cookieOptions);

        logger.log(`LOGIN successful for ${email}`);

        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        logger.error('LOGIN error:', err.message);
        next(err);
    }
};
