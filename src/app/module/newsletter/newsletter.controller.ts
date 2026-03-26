import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { NewsletterService } from './newsletter.service';

const subscribe = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterService.subscribe(req.body.email);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: result,
    });
});

const getAllSubscribers = catchAsync(async (_req: Request, res: Response) => {
    const result = await NewsletterService.getAllSubscribers();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Subscribers retrieved successfully',
        data: result,
    });
});

export const NewsletterController = {
    subscribe,
    getAllSubscribers,
};
