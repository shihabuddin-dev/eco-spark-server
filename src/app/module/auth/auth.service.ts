import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { comparePassword, generateToken, hashPassword } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

const register = async (payload: { name: string; email: string; password: string; profileImage?: string }) => {
    const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });

    if (existingUser) {
        throw new AppError(status.CONFLICT, 'User with this email already exists');
    }

    const hashedPassword = await hashPassword(payload.password);

    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            image: payload.profileImage ?? null,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            image: true,
            createdAt: true,
        },
    });

    const token = generateToken({
        userId: user.id,
        role: user.role,
        email: user.email,
    });

    return { user, token };
};

const login = async (payload: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'No user found with this email');
    }

    if (user.status === 'DEACTIVATED') {
        throw new AppError(status.FORBIDDEN, 'Your account has been deactivated. Contact admin.');
    }

    const isPasswordMatch = await comparePassword(payload.password, user.password as string);

    if (!isPasswordMatch) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
    }

    const token = generateToken({
        userId: user.id,
        role: user.role,
        email: user.email,
    });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            image: user.image,
        },
        token,
    };
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    return user;
};

const changePassword = async (userId: string, payload: { currentPassword: string; newPassword: string }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const isPasswordMatch = await comparePassword(payload.currentPassword, user.password as string);

    if (!isPasswordMatch) {
        throw new AppError(status.UNAUTHORIZED, 'Current password is incorrect');
    }

    const hashedPassword = await hashPassword(payload.newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
};

export const AuthService = {
    register,
    login,
    getMe,
    changePassword,
};
