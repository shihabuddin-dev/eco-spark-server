/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../../generated/prisma/client';

// ========== IDEA MANAGEMENT ==========

const getAllIdeas = async (query: any) => {
    const {
        status: ideaStatus,
        searchTerm,
        page = '1',
        limit = '10',
    } = query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.IdeaWhereInput = {};

    if (ideaStatus) {
        where.status = ideaStatus;
    }

    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
            include: {
                category: true,
                author: {
                    select: { id: true, name: true, email: true, image: true },
                },
                _count: { select: { votes: true, comments: true } },
            },
        }),
        prisma.idea.count({ where }),
    ]);

    return {
        data: ideas,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

const approveIdea = async (ideaId: string) => {
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    if (idea.status !== 'UNDER_REVIEW') {
        throw new AppError(status.BAD_REQUEST, 'Only ideas under review can be approved');
    }

    const updated = await prisma.idea.update({
        where: { id: ideaId },
        data: { status: 'APPROVED', adminFeedback: null },
        include: {
            category: true,
            author: { select: { id: true, name: true, email: true } },
        },
    });

    return updated;
};

const rejectIdea = async (ideaId: string, feedback: string) => {
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    if (idea.status !== 'UNDER_REVIEW') {
        throw new AppError(status.BAD_REQUEST, 'Only ideas under review can be rejected');
    }

    if (!feedback || feedback.trim().length === 0) {
        throw new AppError(status.BAD_REQUEST, 'Feedback is required when rejecting an idea');
    }

    const updated = await prisma.idea.update({
        where: { id: ideaId },
        data: { status: 'REJECTED', adminFeedback: feedback },
        include: {
            category: true,
            author: { select: { id: true, name: true, email: true } },
        },
    });

    return updated;
};

const deleteIdea = async (ideaId: string) => {
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    // Delete related data first
    await prisma.vote.deleteMany({ where: { ideaId } });
    await prisma.comment.deleteMany({ where: { ideaId } });
    await prisma.payment.deleteMany({ where: { ideaId } });
    await prisma.idea.delete({ where: { id: ideaId } });

    return { message: 'Idea and all related data deleted successfully' };
};

// ========== USER MANAGEMENT ==========

const getAllUsers = async (query: any) => {
    const { searchTerm, role, status: userStatus, page = '1', limit = '10' } = query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.UserWhereInput = {};

    if (searchTerm) {
        where.OR = [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }

    if (role) {
        where.role = role;
    }

    if (userStatus) {
        where.status = userStatus;
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                image: true,
                createdAt: true,
                _count: { select: { ideas: true, comments: true } },
            },
        }),
        prisma.user.count({ where }),
    ]);

    return {
        data: users,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

const updateUserStatus = async (userId: string, newStatus: 'ACTIVE' | 'DEACTIVATED') => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { status: newStatus },
        select: { id: true, name: true, email: true, role: true, status: true },
    });

    return updated;
};

const updateUserRole = async (userId: string, newRole: 'MEMBER' | 'ADMIN') => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: { id: true, name: true, email: true, role: true, status: true },
    });

    return updated;
};

// ========== DASHBOARD STATS ==========

const getDashboardStats = async () => {
    const [
        totalUsers,
        totalIdeas,
        approvedIdeas,
        pendingIdeas,
        rejectedIdeas,
        totalCategories,
        totalPayments,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.idea.count(),
        prisma.idea.count({ where: { status: 'APPROVED' } }),
        prisma.idea.count({ where: { status: 'UNDER_REVIEW' } }),
        prisma.idea.count({ where: { status: 'REJECTED' } }),
        prisma.category.count(),
        prisma.payment.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
        totalUsers,
        totalIdeas,
        approvedIdeas,
        pendingIdeas,
        rejectedIdeas,
        totalCategories,
        totalPayments,
    };
};

export const AdminService = {
    getAllIdeas,
    approveIdea,
    rejectIdea,
    deleteIdea,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    getDashboardStats,
};