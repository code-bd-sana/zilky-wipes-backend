import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PageController } from './page.controller';
import { PageValidation } from './page.validation';

const router = Router();

router.get('/', PageController.getAllPages);
router.get('/:slug', PageController.getPageBySlug);

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(PageValidation.createPageZodSchema),
  PageController.createPage
);

router.put(
  '/:slug/sections/:sectionKey',
  auth('ADMIN'),
  validateRequest(PageValidation.upsertSectionZodSchema),
  PageController.upsertSection
);

export const PageRoutes = router;
