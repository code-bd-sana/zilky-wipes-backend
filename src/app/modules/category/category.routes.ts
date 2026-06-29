import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(CategoryValidation.createCategory),
  CategoryController.createCategory
);

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(CategoryValidation.updateCategory),
  CategoryController.updateCategory
);

router.delete('/:id', auth('ADMIN'), CategoryController.deleteCategory);

export const CategoryRoutes = router;
