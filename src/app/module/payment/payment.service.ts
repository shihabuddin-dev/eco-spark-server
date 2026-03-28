import status from 'http-status';
import Stripe from 'stripe';
import AppError from '../../errorHelpers/AppError';
import { envVars } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { EmailService } from '../email/email.service';
import { EmailTemplate } from '../email/email.template';

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

const createCheckoutSession = async (userId: string, ideaId?: string, isProPlan?: boolean) => {
    let amount: number = 0;
    let name: string = '';
    let description: string = '';
    let metadata: any = { userId };

    if (isProPlan) {
        amount = 15; // Pro Plan is $15
        name = 'EcoSpark Pro Plan';
        description = 'Unlimited idea submissions & advanced analytics';
        metadata.type = 'PLAN_UPGRADE';
        metadata.planName = 'Pro';
    } else if (ideaId) {
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

        amount = idea.price;
        name = idea.title;
        description = `Access to paid idea by ${idea.author.name}`;
        metadata.ideaId = ideaId;
    } else {
        throw new AppError(status.BAD_REQUEST, 'Please provide an ideaId or select a plan.');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name,
                        description,
                    },
                    unit_amount: Math.round(amount * 100), // Convert to cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment-cancel`,
        metadata,
    });

    // Create payment record
    await prisma.payment.create({
        data: {
            amount,
            stripeSessionId: session.id,
            status: 'PENDING',
            userId,
            ideaId: ideaId ?? undefined,
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
        const updatedPayment = await prisma.payment.update({
            where: { id: payment.id as string },
            data: { status: 'COMPLETED' },
            include: { user: true, idea: true },
        });

        // Send Success Email
        const itemName = updatedPayment.idea?.title || 'EcoSpark Pro Plan';
        const html = EmailTemplate.paymentSuccessTemplate(
            updatedPayment.user.name || 'User',
            updatedPayment.amount,
            itemName,
            updatedPayment.stripeSessionId
        );

        // Prioritize Stripe checkout email
        const recipientEmail = session.customer_details?.email || updatedPayment.user.email;

        await EmailService.sendEmail(
            recipientEmail,
            `Receipt for your purchase: ${itemName}`,
            html
        );

        return { status: 'COMPLETED', message: 'Payment verified and email sent' };
    } else {
        await prisma.payment.update({
            where: { id: payment.id as string },
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
