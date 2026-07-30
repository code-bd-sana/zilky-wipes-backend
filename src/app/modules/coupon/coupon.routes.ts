import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CouponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(CouponValidation.createCoupon),
  CouponController.createCoupon
);

router.get('/', auth('ADMIN'), CouponController.getAllCoupons);
router.get('/code/:code', CouponController.getCouponByCode);
router.get('/:id', auth('ADMIN'), CouponController.getCouponById);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(CouponValidation.updateCoupon),
  CouponController.updateCoupon
);

router.delete('/:id', auth('ADMIN'), CouponController.deleteCoupon);

export const CouponRoutes = router;
