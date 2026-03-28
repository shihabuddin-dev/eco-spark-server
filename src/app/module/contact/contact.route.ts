import { Router } from 'express';
import { ContactController } from './contact.controller';

const router = Router();

router.post('/', ContactController.handleContactInquiry);

export const ContactRoutes = router;
