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

router.post(
  '/market-research',
  validateRequest(FeedbackValidation.createMarketResearch),
  FeedbackController.createMarketResearch
);

router.get('/market-research', auth('ADMIN'), FeedbackController.getAllMarketResearch);

export const FeedbackRoutes = router;
