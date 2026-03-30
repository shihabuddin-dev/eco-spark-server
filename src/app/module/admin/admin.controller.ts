import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminService } from "./admin.service";

// ========== IDEA MANAGEMENT ==========

const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllIdeas(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Ideas retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const approveIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.approveIdea(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea approved successfully",
    data: result,
  });
});

const rejectIdea = catchAsync(async (req: Request, res: Response) => {
  const { feedback } = req.body;
  const result = await AdminService.rejectIdea(req.params.id as string, feedback);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea rejected with feedback",
    data: result,
  });
});

const deleteIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteIdea(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result,
  });
});

const changeIdeaStatus = catchAsync(async (req: Request, res: Response) => {
  const { status: newStatus, feedback } = req.body;
  const result = await AdminService.changeIdeaStatus(req.params.id as string, newStatus, feedback);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `Idea status changed to ${newStatus}`,
    data: result,
  });
});

const updateIdeaData = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateIdeaData(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea updated successfully",
    data: result,
  });
});

// ========== USER MANAGEMENT ==========

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { status: newStatus } = req.body;
  const result = await AdminService.updateUserStatus(req.params.id as string, newStatus);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `User ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`,
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.body;
  const result = await AdminService.updateUserRole(req.params.id as string, role);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

// ========== DASHBOARD ==========

const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  getAllIdeas,
  approveIdea,
  rejectIdea,
  deleteIdea,
  changeIdeaStatus,
  updateIdeaData,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getDashboardStats,
};
