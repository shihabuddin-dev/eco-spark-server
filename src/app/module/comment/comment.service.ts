import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';

const createComment = async (userId: string, ideaId: string, payload: { content: string; parentId?: string }) => {
    // Verify idea exists and is approved
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }
    if (idea.status !== 'APPROVED') {
        throw new AppError(status.BAD_REQUEST, 'You can only comment on approved ideas');
    }

    // If parentId provided, verify parent comment exists and belongs to same idea
    if (payload.parentId) {
        const parentComment = await prisma.comment.findUnique({ where: { id: payload.parentId } });
        if (!parentComment) {
            throw new AppError(status.NOT_FOUND, 'Parent comment not found');
        }
        if (parentComment.ideaId !== ideaId) {
            throw new AppError(status.BAD_REQUEST, 'Parent comment does not belong to this idea');
        }
    }

    const comment = await prisma.comment.create({
        data: {
            content: payload.content,
            userId,
            ideaId,
            parentId: payload.parentId || null,
        },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
    });

    return comment;
};

const getCommentsByIdeaId = async (ideaId: string) => {
    const comments = await prisma.comment.findMany({
        where: { ideaId, parentId: null },
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
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return comments;
};

const updateComment = async (commentId: string, userId: string, payload: { content: string }) => {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw new AppError(status.NOT_FOUND, 'Comment not found');
    }
    if (comment.userId !== userId) {
        throw new AppError(status.FORBIDDEN, 'You can only edit your own comments');
    }

    const updated = await prisma.comment.update({
        where: { id: commentId },
        data: { content: payload.content },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
    });

    return updated;
};

const deleteComment = async (commentId: string, userId: string, userRole: string) => {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw new AppError(status.NOT_FOUND, 'Comment not found');
    }

    // Admin can delete any comment, members can only delete their own
    if (userRole !== 'ADMIN' && comment.userId !== userId) {
        throw new AppError(status.FORBIDDEN, 'You can only delete your own comments');
    }

    // Delete all child replies recursively
    await deleteCommentWithReplies(commentId);

    return { message: 'Comment deleted successfully' };
};

const deleteCommentWithReplies = async (commentId: string) => {
    // Find all replies
    const replies = await prisma.comment.findMany({ where: { parentId: commentId } });

    // Recursively delete replies
    for (const reply of replies) {
        await deleteCommentWithReplies(reply.id);
    }

    // Delete the comment itself
    await prisma.comment.delete({ where: { id: commentId } });
};

export const CommentService = {
    createComment,
    getCommentsByIdeaId,
    updateComment,
    deleteComment,
};
