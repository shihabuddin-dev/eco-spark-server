import status from 'http-status';
import Stripe from 'stripe';
import AppError from '../../errorHelpers/AppError';
import { envVars } from '../../config/env';
import { prisma } from '../../lib/prisma';

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

const createCheckoutSession = async (userId: string, ideaId: string) => {
    // Verify idea exists and is paid
    const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
        include: { author: { select: { name: true } } },
    });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    if (!idea.isPaid || !idea.price) {
        throw new AppError(status.BAD_REQUEST, 'This idea is free. No payment needed.');
    }

    if (idea.authorId === userId) {
        throw new AppError(status.BAD_REQUEST, 'You cannot purchase your own idea.');
    }

    // Check if already purchased
    const existingPayment = await prisma.payment.findFirst({
        where: { userId, ideaId, status: 'COMPLETED' },
    });

    if (existingPayment) {
        throw new AppError(status.BAD_REQUEST, 'You have already purchased this idea.');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: idea.title,
                        description: `Access to paid idea by ${idea.author.name}`,
                    },
                    unit_amount: Math.round(idea.price * 100), // Convert to cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
        metadata: {
            userId,
            ideaId,
        },
    });

    // Create payment record
    await prisma.payment.create({
        data: {
            amount: idea.price,
            stripeSessionId: session.id,
            status: 'PENDING',
            userId,
            ideaId,
        },
    });

    return { sessionId: session.id, url: session.url };
};

const verifyPayment = async (sessionId: string) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const payment = await prisma.payment.findUnique({
        where: { stripeSessionId: sessionId },
    });

    if (!payment) {
        throw new AppError(status.NOT_FOUND, 'Payment record not found');
    }

    if (session.payment_status === 'paid') {
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'COMPLETED' },
        });
        return { status: 'COMPLETED', message: 'Payment verified successfully' };
    } else {
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' },
        });
        return { status: 'FAILED', message: 'Payment not completed' };
    }
};

const getMyPayments = async (userId: string) => {
    const payments = await prisma.payment.findMany({
        where: { userId },
        include: {
            idea: {
                select: { id: true, title: true, isPaid: true, price: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return payments;
};

const checkAccess = async (userId: string, ideaId: string) => {
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

    if (!idea) {
        throw new AppError(status.NOT_FOUND, 'Idea not found');
    }

    // Free ideas are accessible to everyone
    if (!idea.isPaid) {
        return { hasAccess: true, reason: 'free' };
    }

    // Author always has access
    if (idea.authorId === userId) {
        return { hasAccess: true, reason: 'author' };
    }

    // Check for completed payment
    const payment = await prisma.payment.findFirst({
        where: { userId, ideaId, status: 'COMPLETED' },
    });

    if (payment) {
        return { hasAccess: true, reason: 'purchased' };
    }

    return { hasAccess: false, reason: 'not_purchased', price: idea.price };
};

export const PaymentService = {
    createCheckoutSession,
    verifyPayment,
    getMyPayments,
    checkAccess,
};
