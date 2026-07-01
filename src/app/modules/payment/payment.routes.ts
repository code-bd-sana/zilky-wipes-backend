import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

// Webhook endpoint (Raw body parser is already applied in app.ts for this route)
router.post('/webhook', PaymentController.handleWebhook);

export const PaymentRoutes = router;
