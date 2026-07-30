import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import type { ICreateCouponPayload, IUpdateCouponPayload } from './coupon.interface';

const createCoupon = async (payload: ICreateCouponPayload) => {
  const isExist = await prisma.coupon.findFirst({ 
    where: { code: { equals: payload.code, mode: 'insensitive' } } 
  });
  if (isExist) {
    throw new AppError(400, 'Coupon code already exists');
  }

  const result = await prisma.coupon.create({
    data: payload
  });

  return result;
};

const getAllCoupons = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['code'])
    .filter()
    .sort()
    .paginate();

  const coupons = await prisma.coupon.findMany(queryBuilder.build() as any);
  const total = await prisma.coupon.count({ where: queryBuilder.build().where });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    },
    data: coupons
  };
};

const getCouponById = async (id: string) => {
  const result = await prisma.coupon.findUnique({ where: { id } });
  if (!result) {
    throw new AppError(404, 'Coupon not found');
  }
  return result;
};

const getCouponByCode = async (code: string) => {
  const result = await prisma.coupon.findFirst({ 
    where: { code: { equals: code, mode: 'insensitive' } } 
  });
  if (!result) {
    throw new AppError(404, 'Coupon not found');
  }
  return result;
};

const updateCoupon = async (id: string, payload: IUpdateCouponPayload) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    throw new AppError(404, 'Coupon not found');
  }

  if (payload.code && payload.code !== coupon.code) {
    const isExist = await prisma.coupon.findFirst({ 
      where: { code: { equals: payload.code, mode: 'insensitive' } } 
    });
    if (isExist) {
      throw new AppError(400, 'Coupon code already exists');
    }
  }

  const result = await prisma.coupon.update({
    where: { id },
    data: payload
  });

  return result;
};

const deleteCoupon = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    throw new AppError(404, 'Coupon not found');
  }

  const result = await prisma.coupon.delete({ where: { id } });
  return result;
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon
};
