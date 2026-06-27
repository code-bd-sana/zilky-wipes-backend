import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AddressService } from './address.service';

const createAddress: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const result = await AddressService.createAddress(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Address created successfully',
    data: result
  });
});

const getMyAddresses: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const result = await AddressService.getMyAddresses(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Addresses retrieved successfully',
    data: result
  });
});

const updateAddress: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const addressId = req.params.id;
  const result = await AddressService.updateAddress(userId, addressId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Address updated successfully',
    data: result
  });
});

const deleteAddress: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const addressId = req.params.id;
  await AddressService.deleteAddress(userId, addressId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Address deleted successfully',
    data: null
  });
});

export const AddressController = {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress
};
