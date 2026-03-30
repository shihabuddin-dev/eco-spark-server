/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../../generated/prisma/client';

const createIdea = async (authorId: string, payload: any) => {
    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!category) {
        throw new AppError(status.NOT_FOUND, 'Category not found');
    }

    // If paid, price is required
    if (payload.isPaid && (!payload.price || payload.price <= 0)) {
        throw new AppError(status.BAD_REQUEST, 'Price is required for paid ideas and must be greater than 0');
    }

    const idea = await prisma.idea.create({
        data: {
            title: payload.title,
            problemStatement: payload.problemStatement,
            proposedSolution: payload.proposedSolution,
            description: payload.description,
            images: payload.images || [],
            isPaid: payload.isPaid || false,
            price: payload.isPaid ? payload.price : null,
            categoryId: payload.categoryId,
            authorId,
            status: 'DRAFT',
        },
        include: {
            category: true,
            author: {
                select: { id: true, name: true, email: true, image: true },
            },
        },
    });

    return idea;
};

const getAllApprovedIdeas = async (query: any) => {
    const {
        searchTerm,
        category,
        categoryId,
        isPaid,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = '1',
        limit = '12',
        minVotes,
        author,
    } = query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.IdeaWhereInput = {
        status: 'APPROVED',
    };

    // Search by title or description
    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { problemStatement: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }

    // Filter by category
    const targetCategory = category || categoryId;
    if (targetCategory) {
        where.categoryId = targetCategory;
    }

    // Filter by paid status
    if (isPaid !== undefined) {
        where.isPaid = isPaid === 'true';
    }

    // Filter by author
    if (author) {
        where.authorId = author;
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    const validSortBy = sortBy && sortBy !== "" ? sortBy : 'createdAt';
    const validSortOrder = sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc';

    if (validSortBy === 'votes') {
        orderBy = { votes: { _count: validSortOrder } };
    } else if (validSortBy === 'comments') {
        orderBy = { comments: { _count: validSortOrder } };
    } else {
        orderBy = { [validSortBy as string]: validSortOrder };
    }

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            orderBy,
            skip,
            take: limitNum,
            include: {
                category: true,
                author: {
                    select: { id: true, name: true, image: true },
                },
                _count: {
                    select: { votes: true, comments: true },
                },
                votes: {
                    select: { voteType: true },
                },
            },
        }),
        prisma.idea.count({ where }),
    ]);

    // Calculate net votes (upvotes - downvotes)
    const ideasWithVoteCount = ideas.map((idea) => {
        const upvotes = idea.votes.filter((v) => v.voteType === 'UPVOTE').length;
        const downvotes = idea.votes.filter((v) => v.voteType === 'DOWNVOTE').length;
        const { votes, ...rest } = idea;
        return {
            ...rest,
            upvotes,
            downvotes,
            netVotes: upvotes - downvotes,
        };
    });

    // Filter by minimum votes if specified
    let filteredIdeas = ideasWithVoteCount;
    if (minVotes) {
        const minVotesNum = parseInt(minVotes as string, 10);
        filteredIdeas = ideasWithVoteCount.filter((idea) => idea.upvotes >= minVotesNum);
    }

    return {
        data: filteredIdeas,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

const getIdeaById = async (id: string, userId?: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
        include: {
            category: true,
            author: {
                select: { id: true, name: true, email: true, image: true },
            },
            votes: {
                select: { id: true, voteType: true, userId: true },
            },
            comments: {
                where: { parentId: null },
                include: {
                    user: {
                        select: { id: true, name: true, image: true },
                    },
                    replies: {
                        include: {
                            user: {
                                select: { id: true, name: true, image: true },
                            },
                            replies: {
                                include: {
                                    user: {
                                        select: { id: true, name: true, image: true },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
            _count: {
                select: { votes: true, comments: true },
            },
        },
    });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    // Calculate vote counts
    const upvotes = idea.votes.filter((v) => v.voteType === 'UPVOTE').length;
    const downvotes = idea.votes.filter((v) => v.voteType === 'DOWNVOTE').length;
    const netVotes = upvotes - downvotes;
    const userVote = userId ? idea.votes.find((v) => v.userId === userId) : null;

    // If idea is paid and user is not author, check payment
    if (idea.isPaid && idea.authorId !== userId) {
        let hasPaid = false;

        if (userId) {
            // Check if user has paid for this idea
            const payment = await prisma.payment.findFirst({
                where: {
                    userId,
                    ideaId: id,
                    status: 'COMPLETED',
                },
            });
            if (payment) hasPaid = true;
        }

        if (!hasPaid) {
            // Return info for unauthenticated or non-paying users
            return {
                id: idea.id,
                title: idea.title,
                problemStatement: idea.problemStatement,
                proposedSolution: idea.proposedSolution,
                description: idea.description,
                images: idea.images,
                category: idea.category,
                author: idea.author,
                isPaid: idea.isPaid,
                price: idea.price,
                status: idea.status,
                adminFeedback: idea.adminFeedback,
                createdAt: idea.createdAt,
                updatedAt: idea.updatedAt,
                upvotes,
                downvotes,
                netVotes,
                _count: idea._count,
                isPaidContent: true,
                message: 'This is a paid idea. Purchase to support and unlock discussions.',
            };
        }
    }

    const { votes, ...ideaData } = idea;

    return {
        ...ideaData,
        upvotes,
        downvotes,
        netVotes,
        userVote: userVote ? userVote.voteType : null,
        isPaidContent: false,
    };
};

const getMyIdeas = async (authorId: string, query: any) => {
    const { status: ideaStatus, page = '1', limit = '12' } = query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.IdeaWhereInput = { authorId };
    if (ideaStatus) {
        where.status = ideaStatus;
    }

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
            include: {
                category: true,
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

const updateIdea = async (id: string, authorId: string, payload: any) => {
    const idea = await prisma.idea.findUnique({ where: { id } });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(status.FORBIDDEN, 'You can only edit your own ideas');
    }

    if (idea.status !== 'DRAFT' && idea.status !== 'REJECTED') {
        throw new AppError(status.BAD_REQUEST, 'You can only edit ideas that are in Draft or Rejected status');
    }

    if (payload.categoryId) {
        const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
        if (!category) {
            throw new AppError(status.NOT_FOUND, 'Category not found');
        }
    }

    // If switching to paid, validate price
    if (payload.isPaid && (!payload.price || payload.price <= 0)) {
        throw new AppError(status.BAD_REQUEST, 'Price is required for paid ideas');
    }

    // If rejected, reset status to DRAFT on edit
    const updateData: any = { ...payload };
    if (idea.status === 'REJECTED') {
        updateData.status = 'DRAFT';
        updateData.adminFeedback = null;
    }

    const updated = await prisma.idea.update({
        where: { id },
        data: updateData,
        include: {
            category: true,
            author: {
                select: { id: true, name: true, email: true, image: true },
            },
        },
    });

    return updated;
};

const deleteIdea = async (id: string, authorId: string) => {
    const idea = await prisma.idea.findUnique({ where: { id } });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(status.FORBIDDEN, 'You can only delete your own ideas');
    }

    if (idea.status !== 'DRAFT' && idea.status !== 'REJECTED') {
        throw new AppError(status.BAD_REQUEST, 'You can only delete ideas that are in Draft or Rejected status');
    }

    await prisma.idea.delete({ where: { id } });
    return { message: 'Idea deleted successfully' };
};

const submitForReview = async (id: string, authorId: string) => {
    const idea = await prisma.idea.findUnique({ where: { id } });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(status.FORBIDDEN, 'You can only submit your own ideas');
    }

    if (idea.status !== 'DRAFT') {
        throw new AppError(status.BAD_REQUEST, 'Only draft ideas can be submitted for review');
    }

    const updated = await prisma.idea.update({
        where: { id },
        data: { status: 'UNDER_REVIEW' },
        include: {
            category: true,
            author: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    return updated;
};

const getTopVotedIdeas = async (limitNum = 3) => {
    const ideas = await prisma.idea.findMany({
        where: { status: 'APPROVED' },
        include: {
            category: true,
            author: {
                select: { id: true, name: true, image: true },
            },
            votes: {
                select: { voteType: true },
            },
            _count: {
                select: { votes: true, comments: true },
            },
        },
    });

    // Calculate net votes and sort
    const ideasWithVotes = ideas.map((idea) => {
        const upvotes = idea.votes.filter((v) => v.voteType === 'UPVOTE').length;
        const downvotes = idea.votes.filter((v) => v.voteType === 'DOWNVOTE').length;
        const { votes, ...rest } = idea;
        return { ...rest, upvotes, downvotes, netVotes: upvotes - downvotes };
    });

    ideasWithVotes.sort((a, b) => b.netVotes - a.netVotes);

    return ideasWithVotes.slice(0, limitNum);
};

const getUserStats = async (authorId: string) => {
    const [totalIdeas, approvedIdeas, pendingIdeas] = await Promise.all([
        prisma.idea.count({ where: { authorId } }),
        prisma.idea.count({ where: { authorId, status: 'APPROVED' } }),
        prisma.idea.count({ where: { authorId, status: 'UNDER_REVIEW' } })
    ]);

    return { totalIdeas, approvedIdeas, pendingIdeas };
};

export const IdeaService = {
    createIdea,
    getAllApprovedIdeas,
    getIdeaById,
    getMyIdeas,
    updateIdea,
    deleteIdea,
    submitForReview,
    getTopVotedIdeas,
    getUserStats,
};
