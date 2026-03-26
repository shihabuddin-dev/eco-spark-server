import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { IdeaService } from './idea.service';

const createIdea = catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.createIdea(req.user.userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: 'Idea created successfully',
        data: result,
    });
});

const getAllApprovedIdeas = catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.getAllApprovedIdeas(req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Ideas retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const getIdeaById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await IdeaService.getIdeaById(req.params.id as string, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Idea retrieved successfully',
        data: result,
    });
});

const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.getMyIdeas(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'My ideas retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const updateIdea = catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.updateIdea(req.params.id as string, req.user.userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Idea updated successfully',
        data: result,
    });
});

const deleteIdea = catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.deleteIdea(req.params.id as string, req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Idea deleted successfully',
        data: result,
    });
});

const submitForReview = catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.submitForReview(req.params.id as string, req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Idea submitted for review successfully',
        data: result,
    });
});

const getTopVotedIdeas = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
    const result = await IdeaService.getTopVotedIdeas(limit);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Top voted ideas retrieved successfully',
        data: result,
    });
});

const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.getUserStats(req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'User stats retrieved successfully',
        data: result,
    });
});

export const IdeaController = {
    createIdea,
    getAllApprovedIdeas,
    getIdeaById,
    getMyIdeas,
    updateIdea,
    deleteIdea,
    submitForReview,
    getTopVotedIdeas,
    getUserStats,
};
