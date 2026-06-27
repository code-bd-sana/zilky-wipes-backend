import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = Router();

// Create order can be accessed by guest (unauthenticated) or user
router.post(
  '/',
  validateRequest(OrderValidation.createOrder),
  OrderController.createOrder
);

// My orders
router.get('/me', auth('USER', 'ADMIN'), OrderController.getMyOrders);

// Admin operations
router.get('/', auth('ADMIN'), OrderController.getAllOrders);
router.get('/:id', auth('USER', 'ADMIN'), OrderController.getOrderById);

router.patch(
  '/:id/status',
  auth('ADMIN'),
  validateRequest(OrderValidation.updateOrderStatus),
  OrderController.updateOrderStatus
);

router.patch(
  '/:id/tracking',
  auth('ADMIN'),
  validateRequest(OrderValidation.updateOrderTracking),
  OrderController.updateOrderTracking
);

export const OrderRoutes = router;
