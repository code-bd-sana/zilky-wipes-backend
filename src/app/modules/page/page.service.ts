import { Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';

const createPage = async (payload: Prisma.PageCreateInput) => {
  return await prisma.page.create({
    data: payload
  });
};

const getAllPages = async () => {
  return await prisma.page.findMany();
};

const getPageBySlug = async (slug: string) => {
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: true }
  });

  if (!page) {
    throw new AppError(404, 'Page not found');
  }

  return page;
};

const upsertSection = async (slug: string, sectionKey: string, content: any) => {
  const page = await prisma.page.findUnique({ where: { slug } });
  
  if (!page) {
    throw new AppError(404, 'Page not found');
  }

  const section = await prisma.section.upsert({
    where: {
      pageId_sectionKey: {
        pageId: page.id,
        sectionKey
      }
    },
    update: {
      content
    },
    create: {
      pageId: page.id,
      sectionKey,
      content
    }
  });

  return section;
};

export const PageService = {
  createPage,
  getAllPages,
  getPageBySlug,
  upsertSection
};
