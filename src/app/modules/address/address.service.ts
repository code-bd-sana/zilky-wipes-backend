import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import type { ICreateAddressPayload, IUpdateAddressPayload } from './address.interface';

const createAddress = async (userId: string, payload: ICreateAddressPayload) => {
  const addressCount = await prisma.address.count({
    where: { userId }
  });

  let isDefault = payload.isDefault || false;
  
  // If this is the user's first address, force it to be default
  if (addressCount === 0) {
    isDefault = true;
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  const result = await prisma.address.create({
    data: {
      ...payload,
      isDefault,
      userId
    }
  });

  return result;
};

const getMyAddresses = async (userId: string) => {
  const result = await prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

const updateAddress = async (userId: string, addressId: string, payload: IUpdateAddressPayload) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId }
  });

  if (!address) {
    throw new AppError(404, 'Address not found');
  }

  if (address.userId !== userId) {
    throw new AppError(403, 'You do not have permission to update this address');
  }

  if (payload.isDefault) {
    await prisma.address.updateMany({
      where: { userId, id: { not: addressId } },
      data: { isDefault: false }
    });
  }

  const result = await prisma.address.update({
    where: { id: addressId },
    data: payload
  });

  return result;
};

const deleteAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId }
  });

  if (!address) {
    throw new AppError(404, 'Address not found');
  }

  if (address.userId !== userId) {
    throw new AppError(403, 'You do not have permission to delete this address');
  }

  await prisma.address.delete({
    where: { id: addressId }
  });

  // If the deleted address was the default, make the most recently created remaining address the default
  if (address.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true }
      });
    }
  }

  return null;
};

export const AddressService = {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress
};
