import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import type { ICreateProductPayload, IUpdateProductPayload, IUpdateProductVariantPayload, ICreateProductVariantPayload } from './product.interface';

const createProduct = async (payload: ICreateProductPayload) => {
  const { variants, categoryIds, tagIds, ...productData } = payload;

  const result = await prisma.product.create({
    data: {
      ...productData,
      variants: {
        create: variants
      },
      categories: {
        connect: categoryIds.map((id) => ({ id }))
      },
      ...(tagIds && tagIds.length > 0 && {
        tags: {
          connect: tagIds.map((id) => ({ id }))
        }
      })
    },
    include: {
      variants: true,
      categories: true,
      tags: true
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
      categories: true,
      tags: true
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
      categories: true,
      tags: true
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

  const { categoryIds, tagIds, variants, ...updateData } = payload;

  const result = await prisma.product.update({
    where: { id },
    data: {
      ...updateData,
      ...(categoryIds && {
        categories: {
          set: categoryIds.map((catId) => ({ id: catId }))
        }
      }),
      ...(tagIds && {
        tags: {
          set: tagIds.map((tId) => ({ id: tId }))
        }
      }),
      ...(variants && {
        variants: {
          deleteMany: {
            id: { notIn: variants.map(v => v.id).filter(Boolean) as string[] }
          },
          upsert: variants.map(v => ({
            where: { id: v.id || 'non_existent_id' },
            create: {
              name: v.name!,
              price: v.price!,
              stock: v.stock!,
              subscriptionEligible: v.subscriptionEligible,
              subscriptionDiscount: v.subscriptionDiscount
            },
            update: {
              name: v.name,
              price: v.price,
              stock: v.stock,
              subscriptionEligible: v.subscriptionEligible,
              subscriptionDiscount: v.subscriptionDiscount
            }
          }))
        }
      })
    },
    include: {
      variants: true,
      categories: true,
      tags: true
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

const addProductVariant = async (productId: string, payload: ICreateProductVariantPayload) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError(404, 'Product not found.');
  }

  const result = await prisma.productVariant.create({
    data: {
      ...payload,
      productId
    }
  });

  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductVariant,
  addProductVariant
};
