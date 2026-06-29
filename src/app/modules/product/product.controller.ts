import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.createProduct(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: result
  });
});

const getAllProducts: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getProductById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.getProductById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: result
  });
});

const updateProduct: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.updateProduct(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data: result
  });
});

const deleteProduct: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ProductService.deleteProduct(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
    data: null
  });
});

const updateProductVariant: RequestHandler = catchAsync(async (req, res) => {
  const { variantId } = req.params;
  const result = await ProductService.updateProductVariant(variantId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product variant updated successfully',
    data: result
  });
});

const addProductVariant: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.addProductVariant(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Variant added to product successfully',
    data: result
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductVariant,
  addProductVariant
};
