import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TagController } from './tag.controller';
import { TagValidation } from './tag.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(TagValidation.createTag),
  TagController.createTag
);

router.get('/', TagController.getAllTags);
router.get('/:id', TagController.getTagById);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(TagValidation.updateTag),
  TagController.updateTag
);

router.delete('/:id', auth('ADMIN'), TagController.deleteTag);

export const TagRoutes = router;
