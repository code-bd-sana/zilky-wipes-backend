import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(ProductValidation.createProduct),
  ProductController.createProduct
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(ProductValidation.updateProduct),
  ProductController.updateProduct
);

router.delete('/:id', auth('ADMIN'), ProductController.deleteProduct);

router.patch(
  '/variants/:variantId',
  auth('ADMIN'),
  validateRequest(ProductValidation.updateProductVariant),
  ProductController.updateProductVariant
);

router.post(
  '/:id/variants',
  auth('ADMIN'),
  validateRequest(ProductValidation.addProductVariant),
  ProductController.addProductVariant
);

export const ProductRoutes = router;
