import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { ContactService } from './contact.service';

const handleContactInquiry = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactService.handleContactInquiry(req.body);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: result.message,
    });
});

export const ContactController = {
    handleContactInquiry,
};
