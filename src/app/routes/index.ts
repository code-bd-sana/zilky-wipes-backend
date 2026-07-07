import { Router } from 'express';

import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { PageRoutes } from '../modules/page/page.routes';
import { UploadRoutes } from '../modules/upload/upload.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { TagRoutes } from '../modules/tag/tag.routes';
import { AddressRoutes } from '../modules/address/address.routes';
import { ProductRoutes } from '../modules/product/product.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { SubscriptionRoutes } from '../modules/subscription/subscription.routes';
import { CouponRoutes } from '../modules/coupon/coupon.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { FeedbackRoutes } from '../modules/Feedback/feedback.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/users',
    route: UserRoutes
  },
  {
    path: '/pages',
    route: PageRoutes
  },
  {
    path: '/upload',
    route: UploadRoutes
  },
  {
    path: '/categories',
    route: CategoryRoutes
  },
  {
    path: '/tags',
    route: TagRoutes
  },
  {
    path: '/addresses',
    route: AddressRoutes
  },
  {
    path: '/products',
    route: ProductRoutes
  },
  {
    path: '/orders',
    route: OrderRoutes
  },
  {
    path: '/subscriptions',
    route: SubscriptionRoutes
  },
  {
    path: '/coupons',
    route: CouponRoutes
  },
  {
    path: '/payments',
    route: PaymentRoutes
  },
  {
    path: '/feedbacks',
    route: FeedbackRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
