import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';

const subscribe = async (email: string) => {
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
        throw new AppError(status.CONFLICT, 'This email is already subscribed to the newsletter');
    }

    const subscription = await prisma.newsletter.create({
        data: { email },
    });

    return subscription;
};

const getAllSubscribers = async () => {
    const subscribers = await prisma.newsletter.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return subscribers;
};

export const NewsletterService = {
    subscribe,
    getAllSubscribers,
};
