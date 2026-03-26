import { Router } from 'express';
import { AuthController } from './auth.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post('/register', validateRequest(AuthValidation.registerValidation), AuthController.register);
router.post('/login', validateRequest(AuthValidation.loginValidation), AuthController.login);
router.get('/me', checkAuth('MEMBER', 'ADMIN'), AuthController.getMe);
router.patch('/change-password', checkAuth('MEMBER', 'ADMIN'), validateRequest(AuthValidation.changePasswordValidation), AuthController.changePassword);

export const AuthRoutes = router;
