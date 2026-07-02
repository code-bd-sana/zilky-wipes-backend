import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionService } from './subscription.service';

const createSubscription: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const result = await SubscriptionService.createSubscription(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Subscription created successfully',
    data: result
  });
});

const getMySubscriptions: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const result = await SubscriptionService.getMySubscriptions(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscriptions retrieved successfully',
    data: result
  });
});

const getAllSubscriptions: RequestHandler = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getAllSubscriptions(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All subscriptions retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getSubscriptionById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const role = req.user?.role;
  
  const result = await SubscriptionService.getSubscriptionById(id as string, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription retrieved successfully',
    data: result
  });
});

const updateSubscriptionStatus: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubscriptionService.updateSubscriptionStatus(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription status updated successfully',
    data: result
  });
});

const pauseSubscription: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const result = await SubscriptionService.pauseSubscription(id as string, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription paused successfully',
    data: result
  });
});

const resumeSubscription: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const result = await SubscriptionService.resumeSubscription(id as string, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription resumed successfully',
    data: result
  });
});

export const SubscriptionController = {
  createSubscription,
  getMySubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionStatus,
  pauseSubscription,
  resumeSubscription
};
