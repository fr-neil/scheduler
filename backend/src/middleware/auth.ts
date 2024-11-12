import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../lib/jwt';
import { db } from '../lib/db';

interface JwtPayload {
    userId: string;
}

export interface RequestWithUser extends Request {
    user?: {
        id: string;
        role?: string;
    };
}

export async function authenticateToken(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const payload = verifyJwt<JwtPayload>(token);

        if (!payload) {
            res.clearCookie('token');
            return res
                .status(401)
                .json({ message: 'Invalid or expired token' });
        }

        // Get user from database
        const user = await db.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, role: true },
        });

        if (!user) {
            res.clearCookie('token');
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        next(error);
    }
}
