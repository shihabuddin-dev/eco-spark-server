import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import AppError from '../errorHelpers/AppError';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";

export const checkAuth = (...requiredRoles: string[]) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            });

            if (!session || !session.user) {
                throw new AppError(status.UNAUTHORIZED, 'You are not authorized. Please login.');
            }

            const userRole = (session.user as any).role || 'MEMBER';

            if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
                throw new AppError(status.FORBIDDEN, 'You do not have permission to perform this action.');
            }

            req.user = {
                userId: session.user.id,
                role: userRole,
                email: session.user.email,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};
