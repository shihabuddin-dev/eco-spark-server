import { Router } from 'express';
import { AdminController } from './admin.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { AdminValidation } from './admin.validation';

const router = Router();

// All admin routes are protected — ADMIN only
router.use(checkAuth('ADMIN'));

// Dashboard
router.get('/dashboard', AdminController.getDashboardStats);

// Idea Management
router.get('/ideas', AdminController.getAllIdeas);
router.patch('/ideas/:id/approve', AdminController.approveIdea);
router.patch('/ideas/:id/reject', validateRequest(AdminValidation.rejectIdeaValidation), AdminController.rejectIdea);
router.delete('/ideas/:id', AdminController.deleteIdea);

// User Management
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/status', validateRequest(AdminValidation.updateUserStatusValidation), AdminController.updateUserStatus);
router.patch('/users/:id/role', validateRequest(AdminValidation.updateUserRoleValidation), AdminController.updateUserRole);

export const AdminRoutes = router;