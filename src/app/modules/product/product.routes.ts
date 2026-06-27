import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import { upload } from '../../utils/fileUpload';

const router = Router();

const setUploadParams = (pageName: string) => (req: Request, res: Response, next: NextFunction) => {
  req.params.pageName = pageName;
  next();
};

const parseProductFormData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    try {
      const parsedData = JSON.parse(req.body.data);
      req.body = parsedData;
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid JSON in data field' });
      return;
    }
  }

  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    const fileUrls = files.map(file => {
      const normalizedPath = file.path.replace(/\\/g, '/');
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${normalizedPath}`;
    });
    req.body.images = req.body.images ? [...req.body.images, ...fileUrls] : fileUrls;
  }

  next();
};

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

router.post(
  '/',
  auth('ADMIN'),
  setUploadParams('products'),
  upload.array('images', 10),
  parseProductFormData,
  validateRequest(ProductValidation.createProduct),
  ProductController.createProduct
);

router.patch(
  '/:id',
  auth('ADMIN'),
  setUploadParams('products'),
  upload.array('images', 10),
  parseProductFormData,
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
