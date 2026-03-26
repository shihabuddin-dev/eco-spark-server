import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.createComment(req.user.userId, req.params.ideaId as string, req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: 'Comment added successfully',
        data: result,
    });
});

const getCommentsByIdeaId = catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.getCommentsByIdeaId(req.params.ideaId as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Comments retrieved successfully',
        data: result,
    });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.updateComment(req.params.id as string, req.user.userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Comment updated successfully',
        data: result,
    });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.deleteComment(req.params.id as string, req.user.userId, req.user.role);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Comment deleted successfully',
        data: result,
    });
});

export const CommentController = {
    createComment,
    getCommentsByIdeaId,
    updateComment,
    deleteComment,
};
