import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { NewsletterValidation } from './newsletter.validation';

const router: Router = Router();

// Public — subscribe
router.post('/subscribe', validateRequest(NewsletterValidation.subscribeValidation), NewsletterController.subscribe);

// Admin — view subscribers
router.get('/subscribers', checkAuth('ADMIN'), NewsletterController.getAllSubscribers);

export const NewsletterRoutes = router;
