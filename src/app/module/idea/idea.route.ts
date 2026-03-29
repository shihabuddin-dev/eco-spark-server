import { Router } from 'express';
import { IdeaController } from './idea.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { IdeaValidation } from './idea.validation';
import { optionalAuth } from '../../middleware/optionalAuth';

const router: Router = Router();

// Public routes
router.get('/', IdeaController.getAllApprovedIdeas);
router.get('/top-voted', IdeaController.getTopVotedIdeas);
router.get('/:id', optionalAuth, IdeaController.getIdeaById);

// Member routes (protected)
router.get('/user/stats', checkAuth('MEMBER', 'ADMIN'), IdeaController.getUserStats);
router.get('/user/my-ideas', checkAuth('MEMBER', 'ADMIN'), IdeaController.getMyIdeas);
router.post('/', checkAuth('MEMBER', 'ADMIN'), validateRequest(IdeaValidation.createIdeaValidation), IdeaController.createIdea);
router.patch('/:id', checkAuth('MEMBER', 'ADMIN'), validateRequest(IdeaValidation.updateIdeaValidation), IdeaController.updateIdea);
router.delete('/:id', checkAuth('MEMBER', 'ADMIN'), IdeaController.deleteIdea);
router.patch('/:id/submit', checkAuth('MEMBER', 'ADMIN'), IdeaController.submitForReview);

export const IdeaRoutes = router;
