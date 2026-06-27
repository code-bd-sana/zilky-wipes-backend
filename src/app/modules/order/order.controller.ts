import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderService } from './order.service';

const createOrder: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await OrderService.createOrder(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully',
    data: result
  });
});

const getMyOrders: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await OrderService.getMyOrders(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders retrieved successfully',
    data: result
  });
});

const getAllOrders: RequestHandler = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrders(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getOrderById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const role = req.user?.role;
  
  const result = await OrderService.getOrderById(id, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully',
    data: result
  });
});

const updateOrderStatus: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderService.updateOrderStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order status updated successfully',
    data: result
  });
});

const updateOrderTracking: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderService.updateOrderTracking(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order tracking updated successfully',
    data: result
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderTracking
};
