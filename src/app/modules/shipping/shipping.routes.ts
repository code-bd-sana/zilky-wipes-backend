import { Router } from 'express';
import { ShippingController } from './shipping.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ShippingValidation } from './shipping.validation';

const router = Router();

// Public endpoint for checkout estimation
router.post('/estimate', ShippingController.estimateShipping);

// Admin endpoints for Methods
router.post('/methods', auth('ADMIN'), validateRequest(ShippingValidation.createMethod), ShippingController.createMethod);
router.get('/methods', auth('ADMIN'), ShippingController.getAllMethods);
router.patch('/methods/:id', auth('ADMIN'), validateRequest(ShippingValidation.updateMethod), ShippingController.updateMethod);
router.delete('/methods/:id', auth('ADMIN'), ShippingController.deleteMethod);

// Admin endpoints for Rules
router.post('/rules', auth('ADMIN'), validateRequest(ShippingValidation.createRule), ShippingController.createRule);
router.get('/rules', auth('ADMIN'), ShippingController.getAllRules);
router.patch('/rules/:id', auth('ADMIN'), validateRequest(ShippingValidation.updateRule), ShippingController.updateRule);
router.delete('/rules/:id', auth('ADMIN'), ShippingController.deleteRule);

export const ShippingRoutes = router;
