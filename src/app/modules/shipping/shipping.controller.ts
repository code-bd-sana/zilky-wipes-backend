import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ShippingService } from './shipping.service';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';

const estimateShipping = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingService.getEstimate(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping estimated successfully',
    data: result
  });
});

// Basic CRUD for Methods
const createMethod = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.shippingMethod.create({ data: req.body });
  sendResponse(res, { statusCode: 201, success: true, message: 'Shipping method created', data: result });
});

const getAllMethods = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.shippingMethod.findMany({ include: { rules: true } });
  sendResponse(res, { statusCode: 200, success: true, message: 'Methods retrieved', data: result });
});

const updateMethod = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await prisma.shippingMethod.update({ where: { id }, data: req.body });
  sendResponse(res, { statusCode: 200, success: true, message: 'Method updated', data: result });
});

const deleteMethod = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await prisma.shippingMethod.delete({ where: { id } });
  sendResponse(res, { statusCode: 200, success: true, message: 'Method deleted', data: result });
});

// Basic CRUD for Rules
const createRule = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.shippingRule.create({ data: req.body });
  sendResponse(res, { statusCode: 201, success: true, message: 'Shipping rule created', data: result });
});

const getAllRules = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.shippingRule.findMany({ include: { method: true } });
  sendResponse(res, { statusCode: 200, success: true, message: 'Rules retrieved', data: result });
});

const updateRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await prisma.shippingRule.update({ where: { id }, data: req.body });
  sendResponse(res, { statusCode: 200, success: true, message: 'Rule updated', data: result });
});

const deleteRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await prisma.shippingRule.delete({ where: { id } });
  sendResponse(res, { statusCode: 200, success: true, message: 'Rule deleted', data: result });
});

export const ShippingController = {
  estimateShipping,
  createMethod,
  getAllMethods,
  updateMethod,
  deleteMethod,
  createRule,
  getAllRules,
  updateRule,
  deleteRule
};
