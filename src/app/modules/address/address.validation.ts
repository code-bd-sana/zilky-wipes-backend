import { z } from 'zod';

const createAddress = z.object({
  body: z.object({
    firstName: z.string({ message: 'First name is required' }),
    lastName: z.string({ message: 'Last name is required' }),
    streetAddress: z.string({ message: 'Street address is required' }),
    city: z.string({ message: 'City is required' }),
    state: z.string({ message: 'State is required' }),
    postalCode: z.string({ message: 'Postal code is required' }),
    country: z.string({ message: 'Country is required' }),
    phone: z.string().optional(),
    isDefault: z.boolean().optional()
  })
});

const updateAddress = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    streetAddress: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    isDefault: z.boolean().optional()
  })
});

export const AddressValidation = {
  createAddress,
  updateAddress
};
