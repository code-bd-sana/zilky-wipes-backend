import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponService } from './coupon.service';

const createCoupon: RequestHandler = catchAsync(async (req, res) => {
  const result = await CouponService.createCoupon(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Coupon created successfully',
    data: result
  });
});

const getAllCoupons: RequestHandler = catchAsync(async (req, res) => {
  const result = await CouponService.getAllCoupons(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupons retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getCouponById: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CouponService.getCouponById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result
  });
});

const getCouponByCode: RequestHandler = catchAsync(async (req, res) => {
  const code = req.params.code as string;
  const result = await CouponService.getCouponByCode(code);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result
  });
});

const updateCoupon: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CouponService.updateCoupon(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon updated successfully',
    data: result
  });
});

const deleteCoupon: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CouponService.deleteCoupon(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coupon deleted successfully',
    data: result
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon
};
