import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import type { ICreateCategoryPayload, IUpdateCategoryPayload } from './category.interface';

// Helper function to create slug from name
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const createCategory = async (payload: ICreateCategoryPayload) => {
  const slug = generateSlug(payload.name);
  
  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });

  if (existingCategory) {
    throw new AppError(409, 'Category with this name already exists.');
  }

  const result = await prisma.category.create({
    data: {
      ...payload,
      slug
    }
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: { id }
  });

  if (!result) {
    throw new AppError(404, 'Category not found.');
  }

  return result;
};

const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    throw new AppError(404, 'Category not found.');
  }

  let slug = category.slug;
  if (payload.name) {
    slug = generateSlug(payload.name);
    const existingCategory = await prisma.category.findFirst({
      where: { slug, id: { not: id } }
    });

    if (existingCategory) {
      throw new AppError(409, 'Category with this name already exists.');
    }
  }

  const result = await prisma.category.update({
    where: { id },
    data: {
      ...payload,
      ...(payload.name && { slug })
    }
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    throw new AppError(404, 'Category not found.');
  }

  await prisma.category.delete({
    where: { id }
  });

  return null;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
