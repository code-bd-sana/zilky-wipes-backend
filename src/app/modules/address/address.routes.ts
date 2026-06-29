import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AddressController } from './address.controller';
import { AddressValidation } from './address.validation';

const router = Router();

router.post(
  '/',
  auth('USER', 'ADMIN'),
  validateRequest(AddressValidation.createAddress),
  AddressController.createAddress
);

router.get('/', auth('USER', 'ADMIN'), AddressController.getMyAddresses);

router.patch(
  '/:id',
  auth('USER', 'ADMIN'),
  validateRequest(AddressValidation.updateAddress),
  AddressController.updateAddress
);

router.delete('/:id', auth('USER', 'ADMIN'), AddressController.deleteAddress);

export const AddressRoutes = router;
