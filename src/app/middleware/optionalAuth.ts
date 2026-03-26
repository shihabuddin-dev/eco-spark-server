import { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (session && session.user) {
            req.user = {
                userId: session.user.id,
                role: (session.user as any).role || 'MEMBER',
                email: session.user.email,
            };
        }
    } catch {
        // Continue without user
    }
    next();
};
