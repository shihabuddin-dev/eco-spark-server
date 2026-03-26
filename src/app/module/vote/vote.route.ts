import { Router } from 'express';
import { VoteController } from './vote.controller';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

// Member only
router.post('/:ideaId/vote', checkAuth('MEMBER', 'ADMIN'), VoteController.toggleVote);
router.delete('/:ideaId/vote', checkAuth('MEMBER', 'ADMIN'), VoteController.removeVote);

export const VoteRoutes = router;
