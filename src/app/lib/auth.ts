import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVars } from "../config/env";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "MEMBER",
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "ACTIVE",
            },
        },
    },
    secret: envVars.BETTER_AUTH_SECRET,
    baseURL: envVars.BETTER_AUTH_URL,
    trustedOrigins: [envVars.FRONTEND_URL],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },
    advanced: {
      callbackURL: envVars.FRONTEND_URL,
      cookiePrefix: "better-auth",
      useSecureCookies: true, // Mandatory for SameSite=None
      crossSubDomainCookies: {
        enabled: false,
      },
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
      disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
    },
});

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export interface JwtPayload {
    userId: string;
    role: string;
    email: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, envVars.JWT_SECRET, {
        expiresIn: envVars.JWT_EXPIRES_IN as any,
    });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, envVars.JWT_SECRET) as JwtPayload;
};
