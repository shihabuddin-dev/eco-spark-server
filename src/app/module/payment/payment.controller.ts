import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { PaymentService } from './payment.service';

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const { ideaId, isProPlan } = req.body;
    const result = await PaymentService.createCheckoutSession(req.user.userId, ideaId, isProPlan);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Checkout session created successfully',
        data: result,
    });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.verifyPayment(req.params.sessionId as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: result.message,
        data: result,
    });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getMyPayments(req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Payments retrieved successfully',
        data: result,
    });
});

const checkAccess = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.checkAccess(req.user.userId, req.params.ideaId as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Access check completed',
        data: result,
    });
});

export const PaymentController = {
    createCheckoutSession,
    verifyPayment,
    getMyPayments,
    checkAccess,
};
