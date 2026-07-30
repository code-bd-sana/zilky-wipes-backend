import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const createCategory: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully.',
    data: result
  });
});

const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategories();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully.',
    data: result
  });
});

const getCategoryById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.getCategoryById(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category retrieved successfully.',
    data: result
  });
});

const updateCategory: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategory(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully.',
    data: result
  });
});

const deleteCategory: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CategoryService.deleteCategory(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category deleted successfully.',
    data: null
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
