import { Router } from 'express';
import { CommentController } from './comment.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { CommentValidation } from './comment.validation';

const router: Router = Router();

// Public — get comments for an idea
router.get('/ideas/:ideaId', CommentController.getCommentsByIdeaId);

// Protected — add comment to idea
router.post('/ideas/:ideaId', checkAuth('MEMBER', 'ADMIN'), validateRequest(CommentValidation.createCommentValidation), CommentController.createComment);

// Protected — update own comment
router.patch('/:id', checkAuth('MEMBER', 'ADMIN'), validateRequest(CommentValidation.updateCommentValidation), CommentController.updateComment);

// Protected — delete comment (own or admin can delete any)
router.delete('/:id', checkAuth('MEMBER', 'ADMIN'), CommentController.deleteComment);

export const CommentRoutes = router;
