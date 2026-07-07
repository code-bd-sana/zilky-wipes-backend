import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FeedbackController } from './feedback.controller';
import { FeedbackValidation } from './feedback.validation';

const router = Router();

router.post(
  '/general',
  validateRequest(FeedbackValidation.createGeneralFeedback),
  FeedbackController.createGeneralFeedback
);

router.get('/general', auth('ADMIN'), FeedbackController.getAllGeneralFeedbacks);

export const FeedbackRoutes = router;
