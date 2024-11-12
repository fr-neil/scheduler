import { config } from 'dotenv';

config();

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    JWT_SECRET:
        process.env.JWT_SECRET ||
        (() => {
            throw new Error('JWT_SECRET is required');
        })(),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
