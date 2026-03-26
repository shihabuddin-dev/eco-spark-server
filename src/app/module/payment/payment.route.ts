import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

// Protected routes
router.post('/create-checkout', checkAuth('MEMBER', 'ADMIN'), PaymentController.createCheckoutSession);
router.get('/verify/:sessionId', checkAuth('MEMBER', 'ADMIN'), PaymentController.verifyPayment);
router.get('/my-payments', checkAuth('MEMBER', 'ADMIN'), PaymentController.getMyPayments);
router.get('/check-access/:ideaId', checkAuth('MEMBER', 'ADMIN'), PaymentController.checkAccess);

export const PaymentRoutes = router;
