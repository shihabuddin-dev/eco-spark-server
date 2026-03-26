import { Router } from 'express';
import { CategoryController } from './category.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { CategoryValidation } from './category.validation';

const router = Router();

// Public
router.get('/', CategoryController.getAllCategories);

// Admin only
router.post('/', checkAuth('ADMIN'), validateRequest(CategoryValidation.createCategoryValidation), CategoryController.createCategory);
router.patch('/:id', checkAuth('ADMIN'), validateRequest(CategoryValidation.updateCategoryValidation), CategoryController.updateCategory);
router.delete('/:id', checkAuth('ADMIN'), CategoryController.deleteCategory);

export const CategoryRoutes = router;
