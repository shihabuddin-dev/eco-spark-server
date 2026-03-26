import { Router } from 'express';
import { AdminRoutes } from '../module/admin/admin.route';
import { AuthRoutes } from '../module/auth/auth.route';
import { CategoryRoutes } from '../module/category/category.route';
import { IdeaRoutes } from '../module/idea/idea.route';
import { VoteRoutes } from '../module/vote/vote.route';
import { CommentRoutes } from '../module/comment/comment.route';
import { PaymentRoutes } from '../module/payment/payment.route';
import { NewsletterRoutes } from '../module/newsletter/newsletter.route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/categories', CategoryRoutes);
router.use('/ideas', IdeaRoutes);
router.use('/votes', VoteRoutes);
router.use('/comments', CommentRoutes);
router.use('/payments', PaymentRoutes);
router.use('/newsletter', NewsletterRoutes);
router.use('/admin', AdminRoutes);

export const IndexRoutes = router;