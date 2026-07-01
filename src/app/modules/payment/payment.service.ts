import Stripe from 'stripe';
import prisma from '../../utils/prisma';
import config from '../../config';
import stripe from '../../utils/stripe';

const handleWebhook = async (signature: string, rawBody: Buffer) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret
    );
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(invoice);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
};

const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  // Check metadata to see if it's an order or a subscription
  const orderId = session.metadata?.orderId;
  const subscriptionId = session.metadata?.subscriptionId;

  if (orderId) {
    // It's a standard one-time order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paymentIntentId: session.payment_intent as string
      }
    });
  } else if (subscriptionId) {
    // It's a subscription checkout
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'ACTIVE',
        stripeSubscriptionId: session.subscription as string
      }
    });
  }
};

const handleInvoicePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  const stripeSubscriptionId = (invoice as any).subscription as string;
  if (!stripeSubscriptionId) return;

  // Update subscription next billing date or status if needed
  await prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: {
      status: 'ACTIVE'
    }
  });
};

const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const stripeSubscriptionId = (invoice as any).subscription as string;
  if (!stripeSubscriptionId) return;

  await prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: {
      status: 'PAST_DUE'
    }
  });
};

export const PaymentService = {
  handleWebhook
};
