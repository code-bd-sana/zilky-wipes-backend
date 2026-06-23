import { Router } from 'express';

import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { PageRoutes } from '../modules/page/page.routes';
import { UploadRoutes } from '../modules/upload/upload.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { TagRoutes } from '../modules/tag/tag.routes';

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
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
