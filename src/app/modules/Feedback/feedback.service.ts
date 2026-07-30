import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';

const createGeneralFeedback = async (payload: any) => {
  const result = await prisma.generalFeedback.create({
    data: payload,
  });
  return result;
};

const getAllGeneralFeedbacks = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['firstName', 'lastName', 'email', 'message'])
    .filter()
    .sort()
    .paginate();

  const feedbacks = await prisma.generalFeedback.findMany({
    ...(queryBuilder.build() as any),
  });

  const total = await prisma.generalFeedback.count({
    where: (queryBuilder.build() as any).where,
  });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    },
    data: feedbacks,
  };
};

const createMarketResearch = async (payload: any) => {
  const result = await prisma.marketResearch.create({
    data: payload,
  });
  return result;
};

const getAllMarketResearch = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['fullName', 'email', 'improvementSuggest', 'issuesEncountered', 'additionalComments'])
    .filter()
    .sort()
    .paginate();

  const researches = await prisma.marketResearch.findMany({
    ...(queryBuilder.build() as any),
  });

  const total = await prisma.marketResearch.count({
    where: (queryBuilder.build() as any).where,
  });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    },
    data: researches,
  };
};

export const FeedbackService = {
  createGeneralFeedback,
  getAllGeneralFeedbacks,
  createMarketResearch,
  getAllMarketResearch,
};
