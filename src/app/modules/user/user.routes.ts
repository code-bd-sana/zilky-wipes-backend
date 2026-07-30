import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router.get('/me', auth('USER', 'ADMIN'), UserController.getMe);
router.patch(
  '/me',
  auth('USER', 'ADMIN'),
  validateRequest(UserValidation.updateProfile),
  UserController.updateProfile
);
router.get('/customers', auth('ADMIN'), UserController.getCustomers);
router.get('/', auth('ADMIN'), UserController.getAllUsers);
router.patch(
  '/:id/role',
  auth('ADMIN'),
  validateRequest(UserValidation.changeRole),
  UserController.changeRole
);
router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(UserValidation.updateUserByAdmin),
  UserController.updateUserByAdmin
);
router.patch(
  '/:id/password',
  auth('ADMIN'),
  validateRequest(UserValidation.updateUserPassword),
  UserController.updateUserPassword
);
router.delete('/:id', auth('ADMIN'), UserController.deleteUser);

export const UserRoutes = router;
