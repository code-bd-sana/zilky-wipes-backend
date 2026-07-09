import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionValidation } from './subscription.validation';

const router = Router();

router.post(
  '/',
  auth('USER', 'ADMIN'),
  validateRequest(SubscriptionValidation.createSubscription),
  SubscriptionController.createSubscription
);

router.get('/me', auth('USER', 'ADMIN'), SubscriptionController.getMySubscriptions);

router.get('/', auth('ADMIN'), SubscriptionController.getAllSubscriptions);
router.get('/:id', auth('USER', 'ADMIN'), SubscriptionController.getSubscriptionById);

router.patch(
  '/:id/status',
  auth('ADMIN'), // Subscriptions status are typically managed via Stripe Webhook or Admin, but allowing admin manual override here
  validateRequest(SubscriptionValidation.updateSubscriptionStatus),
  SubscriptionController.updateSubscriptionStatus
);
router.post('/:id/pause', auth('USER', 'ADMIN'), SubscriptionController.pauseSubscription);
router.post('/:id/resume', auth('USER', 'ADMIN'), SubscriptionController.resumeSubscription);
router.delete('/:id', auth('USER', 'ADMIN'), SubscriptionController.deleteSubscription);

export const SubscriptionRoutes = router;
