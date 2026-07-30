import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';

// Check if user is eligible to review a product
const checkEligibility = async (userId: string, productId: string) => {
  // 1. Has the user already reviewed this product?
  const existingReview = await prisma.review.findUnique({
    where: {
      productId_userId: {
        productId,
        userId,
      },
    },
  });

  if (existingReview) {
    return { eligible: false, alreadyReviewed: true };
  }

  // 2. Fetch all orders for this user and check in memory (foolproof)
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { productVariant: true }
      }
    }
  });

  const validOrderStatuses = ['PROCESSING', 'PAID', 'SHIPPED', 'DELIVERED'];
  const hasValidOrder = orders.some(order => 
    validOrderStatuses.includes(order.status) && 
    order.items.some(item => item.productVariant?.productId === productId)
  );

  console.log("[checkEligibility] hasValidOrder:", hasValidOrder);

  if (hasValidOrder) {
    return { eligible: true, alreadyReviewed: false };
  }

  // 3. Fetch all subscriptions for this user and check in memory
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    include: { productVariant: true }
  });

  const validSubStatuses = ['ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'];
  const hasValidSub = subscriptions.some(sub => 
    validSubStatuses.includes(sub.status) && 
    sub.productVariant?.productId === productId
  );

  console.log("[checkEligibility] hasValidSub:", hasValidSub);

  if (hasValidSub) {
    return { eligible: true, alreadyReviewed: false };
  }

  console.log("[checkEligibility] Neither order nor subscription found. Falsifying.");
  // Neither order nor subscription found
  return { eligible: false, alreadyReviewed: false };
};

const createReview = async (
  userId: string,
  payload: {
    productId: string;
    rating: number;
    comment?: string;
    images?: string[];
  }
) => {
  // Verify eligibility
  const eligibility = await checkEligibility(userId, payload.productId);

  if (!eligibility.eligible) {
    if (eligibility.alreadyReviewed) {
      throw new AppError(400, 'You have already reviewed this product.');
    }
    throw new AppError(403, 'You must purchase this product to leave a review.');
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      userId,
      productId: payload.productId,
      rating: payload.rating,
      comment: payload.comment,
      images: payload.images,
      isVerifiedPurchase: true,
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    }
  });

  return review;
};

const getProductReviews = async (productId: string, query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await prisma.review.findMany({
    where: { productId },
    skip,
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const total = await prisma.review.count({ where: { productId } });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: reviews,
  };
};

const getProductReviewStats = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        '5': 0, '4': 0, '3': 0, '2': 0, '1': 0
      }
    };
  }

  let totalStars = 0;
  const distribution = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

  reviews.forEach(r => {
    totalStars += r.rating;
    if (distribution[r.rating.toString() as keyof typeof distribution] !== undefined) {
      distribution[r.rating.toString() as keyof typeof distribution]++;
    }
  });

  const averageRating = Number((totalStars / totalReviews).toFixed(1));

  return {
    averageRating,
    totalReviews,
    ratingDistribution: distribution
  };
};

export const ReviewService = {
  checkEligibility,
  createReview,
  getProductReviews,
  getProductReviewStats
};
