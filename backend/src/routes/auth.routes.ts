import { Router } from 'express';
import { signup } from '../controllers/auth.controller';
import { login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import { env } from '../config/env';

const router = Router();

const signupSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
});

router.post('/signup', validate(signupSchema), async (req, res, next) => {
    try {
        await signup(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
    try {
        await login(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        domain: env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
    });
    return res.json({ message: 'Logged out successfully' });
});

export default router;
