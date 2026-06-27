import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import type { ICreateProductPayload, IUpdateProductPayload, IUpdateProductVariantPayload } from './product.interface';

const createProduct = async (payload: ICreateProductPayload) => {
  const { variants, ...productData } = payload;

  const result = await prisma.product.create({
    data: {
      ...productData,
      variants: {
        create: variants
      }
    },
    include: {
      variants: true,
      category: true,
      tag: true
    }
  });

  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['name', 'description'])
    .filter()
    .sort()
    .paginate();

  const products = await prisma.product.findMany({
    ...queryBuilder.build(),
    include: {
      variants: true,
      category: true,
      tag: true
    }
  });

  const total = await prisma.product.count({
    where: queryBuilder.build().where
  });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    },
    data: products
  };
};

const getProductById = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      category: true,
      tag: true
    }
  });

  if (!result) {
    throw new AppError(404, 'Product not found.');
  }

  return result;
};

const updateProduct = async (id: string, payload: IUpdateProductPayload) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, 'Product not found.');
  }

  const result = await prisma.product.update({
    where: { id },
    data: payload,
    include: {
      variants: true,
      category: true,
      tag: true
    }
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(404, 'Product not found.');
  }

  await prisma.product.delete({ where: { id } });
  return null;
};

const updateProductVariant = async (variantId: string, payload: IUpdateProductVariantPayload) => {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) {
    throw new AppError(404, 'Product variant not found.');
  }

  const result = await prisma.productVariant.update({
    where: { id: variantId },
    data: payload
  });

  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductVariant
};
