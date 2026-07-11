import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
import { ReviewService } from './review.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const router = Router();

router.post(
  '/debug',
  auth('USER', 'ADMIN'),
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;
    const { productId } = req.body;
    const eligibility = await ReviewService.checkEligibility(userId, productId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Debug info',
      data: { userId, productId, eligibility }
    });
  })
);

// Public routes
router.get('/product/:productId', ReviewController.getProductReviews);
router.get('/product/:productId/stats', ReviewController.getProductReviewStats);

// Auth routes
router.get('/eligibility/:productId', auth('USER', 'ADMIN'), ReviewController.checkEligibility);

router.post(
  '/',
  auth('USER', 'ADMIN'),
  validateRequest(ReviewValidation.createReview),
  ReviewController.createReview
);

export const ReviewRoutes = router;
