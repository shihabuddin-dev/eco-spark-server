import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { VoteService } from './vote.service';

const toggleVote = catchAsync(async (req: Request, res: Response) => {
    const { voteType } = req.body;
    const result = await VoteService.toggleVote(req.user.userId, req.params.ideaId as string, voteType);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: result.message,
        data: result,
    });
});

const removeVote = catchAsync(async (req: Request, res: Response) => {
    const result = await VoteService.removeVote(req.user.userId, req.params.ideaId as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Vote removed successfully',
        data: result,
    });
});

export const VoteController = {
    toggleVote,
    removeVote,
};
