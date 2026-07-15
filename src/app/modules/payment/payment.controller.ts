import type { Request, Response } from 'express';
import { PaymentService } from './payment.service';

const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  
  try {
    // We use req.rawBody which was populated by the express.json verify function in app.ts
    const result = await PaymentService.handleWebhook(signature, (req as any).rawBody);
    console.log(`[Webhook] Successfully processed event.`);
    res.status(200).json(result);
  } catch (err: any) {
    console.error('[Webhook Error]:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export const PaymentController = {
  handleWebhook
};
