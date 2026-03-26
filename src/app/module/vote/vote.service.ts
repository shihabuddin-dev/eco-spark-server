import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';

const toggleVote = async (userId: string, ideaId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    // Verify idea exists and is approved
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }
    if (idea.status !== 'APPROVED') {
        throw new AppError(status.BAD_REQUEST, 'You can only vote on approved ideas');
    }

    // Check existing vote
    const existingVote = await prisma.vote.findUnique({
        where: { userId_ideaId: { userId, ideaId } },
    });

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            // Same vote type — remove vote (toggle off)
            await prisma.vote.delete({
                where: { id: existingVote.id },
            });
            return { message: 'Vote removed', action: 'removed' };
        } else {
            // Different vote type — switch vote
            const updated = await prisma.vote.update({
                where: { id: existingVote.id },
                data: { voteType },
            });
            return { message: `Vote changed to ${voteType}`, action: 'switched', vote: updated };
        }
    }

    // No existing vote — create new
    const vote = await prisma.vote.create({
        data: { userId, ideaId, voteType },
    });

    return { message: `Successfully ${voteType.toLowerCase()}d`, action: 'created', vote };
};

const removeVote = async (userId: string, ideaId: string) => {
    const existingVote = await prisma.vote.findUnique({
        where: { userId_ideaId: { userId, ideaId } },
    });

    if (!existingVote) {
        throw new AppError(status.NOT_FOUND, 'You have not voted on this idea');
    }

    await prisma.vote.delete({ where: { id: existingVote.id } });
    return { message: 'Vote removed successfully' };
};

export const VoteService = {
    toggleVote,
    removeVote,
};
