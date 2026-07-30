import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TagService } from './tag.service';

const createTag: RequestHandler = catchAsync(async (req, res) => {
  const result = await TagService.createTag(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Tag created successfully.',
    data: result
  });
});

const getAllTags: RequestHandler = catchAsync(async (req, res) => {
  const result = await TagService.getAllTags();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tags retrieved successfully.',
    data: result
  });
});

const getTagById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TagService.getTagById(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tag retrieved successfully.',
    data: result
  });
});

const updateTag: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TagService.updateTag(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tag updated successfully.',
    data: result
  });
});

const deleteTag: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  await TagService.deleteTag(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tag deleted successfully.',
    data: null
  });
});

export const TagController = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag
};
