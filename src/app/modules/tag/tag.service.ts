import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import type { ICreateTagPayload, IUpdateTagPayload } from './tag.interface';

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const createTag = async (payload: ICreateTagPayload) => {
  const slug = generateSlug(payload.name);
  
  const existingTag = await prisma.tag.findUnique({
    where: { slug }
  });

  if (existingTag) {
    throw new AppError(409, 'Tag with this name already exists.');
  }

  const result = await prisma.tag.create({
    data: {
      ...payload,
      slug
    }
  });

  return result;
};

const getAllTags = async () => {
  const result = await prisma.tag.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

const getTagById = async (id: string) => {
  const result = await prisma.tag.findUnique({
    where: { id }
  });

  if (!result) {
    throw new AppError(404, 'Tag not found.');
  }

  return result;
};

const updateTag = async (id: string, payload: IUpdateTagPayload) => {
  const tag = await prisma.tag.findUnique({
    where: { id }
  });

  if (!tag) {
    throw new AppError(404, 'Tag not found.');
  }

  let slug = tag.slug;
  if (payload.name) {
    slug = generateSlug(payload.name);
    const existingTag = await prisma.tag.findFirst({
      where: { slug, id: { not: id } }
    });

    if (existingTag) {
      throw new AppError(409, 'Tag with this name already exists.');
    }
  }

  const result = await prisma.tag.update({
    where: { id },
    data: {
      ...payload,
      ...(payload.name && { slug })
    }
  });

  return result;
};

const deleteTag = async (id: string) => {
  const tag = await prisma.tag.findUnique({
    where: { id }
  });

  if (!tag) {
    throw new AppError(404, 'Tag not found.');
  }

  await prisma.tag.delete({
    where: { id }
  });

  return null;
};

export const TagService = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag
};
