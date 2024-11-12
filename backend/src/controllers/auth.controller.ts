import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { db } from '../lib/db';
import { signJwt } from '../lib/jwt';
import { env } from '../config/env';
import { CreateUserInput, UserRole } from '../types';

export async function signup(
    req: Request<unknown, unknown, CreateUserInput>,
    res: Response,
) {
    try {
        const { email, password, name } = req.body;

        // Use a transaction for atomic operations
        const result = await db.$transaction(async (tx) => {
            // Check for existing user with index
            const existingUser = await tx.user.findUnique({
                where: { email },
                select: { id: true }, // Only select needed fields
            });

            if (existingUser) {
                throw new Error('Email already registered');
            }

            const hashedPassword = await hash(password, 12);

            return tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'PATIENT',
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
        });

        return res.status(201).json({
            message: 'User created successfully',
            user: result,
        });
    } catch (error) {
        console.error('Signup error:', error);
        if (error instanceof Error) {
            return res.status(500).json({
                message: 'Internal server error',
                error:
                    process.env.NODE_ENV === 'development'
                        ? error.message
                        : undefined,
            });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function login(
    req: Request<unknown, unknown, { email: string; password: string }>,
    res: Response,
) {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // Verify password
        const isValidPassword = await hash(password, 12);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // Generate JWT
        const token = signJwt({ userId: user.id });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.COOKIE_MAX_AGE,
            path: '/',
            domain:
                env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
        });

        return res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
            return res.status(500).json({
                message: 'Internal server error',
                error:
                    process.env.NODE_ENV === 'development'
                        ? error.message
                        : undefined,
            });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}
