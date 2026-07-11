import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const checkEligibility: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const { productId } = req.params;
  
  const result = await ReviewService.checkEligibility(userId, productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Eligibility checked successfully',
    data: result
  });
});

const createReview: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const result = await ReviewService.createReview(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result
  });
});

const getProductReviews: RequestHandler = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ReviewService.getProductReviews(productId as string, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getProductReviewStats: RequestHandler = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ReviewService.getProductReviewStats(productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review stats retrieved successfully',
    data: result
  });
});

export const ReviewController = {
  checkEligibility,
  createReview,
  getProductReviews,
  getProductReviewStats
};
