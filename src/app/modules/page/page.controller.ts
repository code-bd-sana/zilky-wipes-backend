import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PageService } from './page.service';

const createPage: RequestHandler = catchAsync(async (req, res) => {
  const result = await PageService.createPage(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Page created successfully',
    data: result
  });
});

const getAllPages: RequestHandler = catchAsync(async (req, res) => {
  const result = await PageService.getAllPages();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pages retrieved successfully',
    data: result
  });
});

const getPageBySlug: RequestHandler = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await PageService.getPageBySlug(slug as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Page retrieved successfully',
    data: result
  });
});

const upsertSection: RequestHandler = catchAsync(async (req, res) => {
  const { slug, sectionKey } = req.params;
  const { content } = req.body;
  
  const result = await PageService.upsertSection(slug as string, sectionKey as string, content);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Section updated successfully',
    data: result
  });
});

export const PageController = {
  createPage,
  getAllPages,
  getPageBySlug,
  upsertSection
};
