import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FeedbackService } from './feedback.service';

const createGeneralFeedback: RequestHandler = catchAsync(async (req, res) => {
  const result = await FeedbackService.createGeneralFeedback(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Feedback submitted successfully.',
    data: result,
  });
});

const getAllGeneralFeedbacks: RequestHandler = catchAsync(async (req, res) => {
  const result = await FeedbackService.getAllGeneralFeedbacks(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedbacks retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const createMarketResearch: RequestHandler = catchAsync(async (req, res) => {
  const result = await FeedbackService.createMarketResearch(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Market research submitted successfully.',
    data: result,
  });
});

const getAllMarketResearch: RequestHandler = catchAsync(async (req, res) => {
  const result = await FeedbackService.getAllMarketResearch(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Market research data retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

export const FeedbackController = {
  createGeneralFeedback,
  getAllGeneralFeedbacks,
  createMarketResearch,
  getAllMarketResearch,
};
