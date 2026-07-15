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

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

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

  // 1. Fetch subscription from Stripe to get metadata
  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const localSubscriptionId = stripeSubscription.metadata?.subscriptionId;

  if (!localSubscriptionId) {
    console.error(`No local subscriptionId found in Stripe subscription ${stripeSubscriptionId} metadata.`);
    // Try falling back to stripeSubscriptionId in case it was already set by checkout.session.completed
    const existing = await prisma.subscription.findUnique({ where: { stripeSubscriptionId } });
    if (!existing) return;
  }

  // 2. Update subscription status to ACTIVE
  const subscription = await prisma.subscription.update({
    where: localSubscriptionId ? { id: localSubscriptionId } : { stripeSubscriptionId },
    data: {
      status: 'ACTIVE',
      stripeSubscriptionId: stripeSubscriptionId
    },
    include: {
      productVariant: true
    }
  });

  // 2. Prevent duplicate order creation for the initial subscription payment
  // Stripe sends invoice.payment_succeeded for the very first payment too, 
  // but we might not want to create a standard order if the first payment 
  // is handled differently, or maybe we DO want to create an order for the first payment!
  // Yes, we DO want an order for every successful invoice, so the admin sees it and ships it.

  // 3. Find the user's default address for shipping
  const defaultAddress = await prisma.address.findFirst({
    where: { userId: subscription.userId, isDefault: true }
  });

  if (!defaultAddress) {
    console.error(`No default address found for user ${subscription.userId}. Cannot create auto-order for subscription ${subscription.id}`);
    return;
  }

  // 4. Calculate pricing
  const quantity = 1; // Subscriptions are typically for 1 unit of the variant
  const subtotal = subscription.productVariant.price * quantity;
  
  let shippingCost = 0; // Default shipping cost for subscriptions, should be calculated via rules engine in future
  const total = subtotal + shippingCost;

  // Generate order number
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  const orderNumber = `#ORD-${timestamp}-${random}`;

  // 5. Create the Order
  await prisma.order.create({
    data: {
      orderNumber,
      userId: subscription.userId,
      subtotal,
      shippingCost,
      total,
      status: 'PAID', // It's already paid via the invoice
      paymentIntentId: (invoice as any).payment_intent as string,
      shippingFirstName: defaultAddress.firstName,
      shippingLastName: defaultAddress.lastName,
      shippingStreetAddress: defaultAddress.streetAddress,
      shippingCity: defaultAddress.city,
      shippingState: defaultAddress.state,
      shippingPostalCode: defaultAddress.postalCode,
      shippingCountry: defaultAddress.country,
      shippingPhone: defaultAddress.phone,
      items: {
        create: [{
          productVariantId: subscription.productVariant.id,
          quantity,
          price: subscription.productVariant.price
        }]
      }
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
