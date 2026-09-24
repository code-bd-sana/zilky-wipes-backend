import { logger } from '../src/app/utils/logger';
import prisma from '../src/app/utils/prisma';

export const faqSeedData = {
  hero: {
    title: 'Everything you need to know.',
    subtitle: 'Find answers to common questions about ZilkyWipes, your subscription, shipping, and more.',
  },
  cta: {
    title: 'Still have questions?',
    subtitle: 'Our support team is here to help Monday–Friday, 9am–5pm EST',
  },
  faqs: {
    topics: [
      {
        name: 'Product & Formula',
        questions: [
          {
            id: 'prod-1',
            question: 'What are ZilkyWipes made of?',
            answer:
              'ZilkyWipes are crafted from 100% natural plant-based biodegradable cellulose fibers. They are infused with 99% purified water and soothing botanicals like aloe vera and chamomile. Completely free from alcohol, parabens, phthalates, and harsh chemicals.',
          },
          {
            id: 'prod-2',
            question: 'Are ZilkyWipes safe for sensitive skin?',
            answer:
              'Yes! ZilkyWipes are hypoallergenic, pH-balanced, and clinically tested by dermatologists. They are formulated to be extra gentle and non-irritating on all skin types, including sensitive skin and intimate areas.',
          },
          {
            id: 'prod-3',
            question: 'Do ZilkyWipes contain any synthetic fragrances or scents?',
            answer:
              'No. ZilkyWipes are fragrance-free with zero artificial scents or dyes, making them safe and comfortable for everyday use.',
          },
          {
            id: 'prod-4',
            question: 'How are ZilkyWipes different from traditional wet wipes?',
            answer:
              'Unlike conventional wet wipes that contain synthetic plastic fibers and chemical binders, ZilkyWipes are 100% plastic-free, truly biodegradable, and engineered to disperse rapidly in water without harming plumbing or the environment.',
          },
        ],
      },
      {
        name: 'Plumbing & Flushability',
        questions: [
          {
            id: 'flush-1',
            question: 'Are ZilkyWipes truly flushable?',
            answer:
              'Yes. ZilkyWipes pass rigorous industry flushability standards (INDA/EDANA GD4 guidelines). They begin breaking down within minutes of flushing and disperse completely in moving water within 24 hours, similar to high-grade toilet paper.',
          },
          {
            id: 'flush-2',
            question: 'Are they safe for septic tanks and older plumbing?',
            answer:
              'Yes, when used as directed (one wipe per flush). Because they contain no plastic or non-woven synthetic binders, they will not accumulate in septic tanks or cause pipe blockages.',
          },
          {
            id: 'flush-3',
            question: 'Can I flush more than one wipe at a time?',
            answer:
              'For optimal plumbing flow and best wastewater practices, we recommend flushing only one wipe at a time.',
          },
        ],
      },
      {
        name: 'Subscription & Flexibility',
        questions: [
          {
            id: 'sub-1',
            question: 'How does the ZilkyWipes subscription work?',
            answer:
              'Choose your favorite pack size and your preferred delivery cadence (every 1, 2, or 3 months). We deliver fresh packs directly to your door automatically, and you enjoy a 15% discount on every shipment.',
          },
          {
            id: 'sub-2',
            question: 'Can I pause, reschedule, or cancel my subscription?',
            answer:
              'Yes, at any time! You have complete freedom in your Account Dashboard to pause, skip a delivery, adjust your frequency, or cancel with one click and zero fees or commitments.',
          },
          {
            id: 'sub-3',
            question: 'When will my subscription renew and charge my card?',
            answer:
              'Your card is charged on your scheduled renewal date before each shipment. You will receive an automated email notification 3 days prior so you always know what to expect.',
          },
          {
            id: 'sub-4',
            question: 'Can I change my delivery address or payment method?',
            answer:
              'Yes. Simply log into your account settings to update your shipping address, card details, or delivery preferences anytime before an order ships.',
          },
        ],
      },
      {
        name: 'Shipping & Delivery',
        questions: [
          {
            id: 'ship-1',
            question: 'How long does shipping take?',
            answer:
              'Orders are processed within 1-2 business days. Standard US shipping takes approximately 3-5 business days. Expedited delivery options are also available during checkout.',
          },
          {
            id: 'ship-2',
            question: 'Do you offer free shipping?',
            answer:
              'Yes! All recurring subscription deliveries and one-time orders over $35 include 100% free standard shipping.',
          },
          {
            id: 'ship-3',
            question: 'How can I track my shipment?',
            answer:
              'As soon as your order leaves our warehouse, we will send you a confirmation email with your carrier tracking number and direct tracking link. You can also view real-time status on the Track Order page.',
          },
          {
            id: 'ship-4',
            question: 'Do you ship internationally?',
            answer:
              'Currently we ship across the contiguous United States, Alaska, and Hawaii. We are expanding to Canada and international markets very soon!',
          },
        ],
      },
      {
        name: 'Returns & Guarantee',
        questions: [
          {
            id: 'ret-1',
            question: 'What is your return policy?',
            answer:
              'We stand behind our quality with a 30-Day Happiness Guarantee. If you are not completely satisfied with your order, contact us within 30 days of delivery for a replacement or full refund.',
          },
          {
            id: 'ret-2',
            question: 'How do I contact customer support?',
            answer:
              'You can email our customer care team at support@zilkywipes.com or reach out via our contact form on the About page. We respond to all inquiries within 24 business hours, Monday through Friday.',
          },
        ],
      },
    ],
  },
};

export async function seedFaq() {
  logger.info('Starting FAQ page and question seeding...');

  // 1. Ensure page exists
  const page = await prisma.page.upsert({
    where: { slug: 'faq' },
    update: {
      title: 'FAQ',
      description: 'Frequently Asked Questions about ZilkyWipes',
    },
    create: {
      slug: 'faq',
      title: 'FAQ',
      description: 'Frequently Asked Questions about ZilkyWipes',
    },
  });

  logger.info(`FAQ Page record ensured with ID: ${page.id}`);

  // 2. Upsert 'hero' section
  await prisma.section.upsert({
    where: {
      pageId_sectionKey: {
        pageId: page.id,
        sectionKey: 'hero',
      },
    },
    update: {
      content: faqSeedData.hero,
    },
    create: {
      pageId: page.id,
      sectionKey: 'hero',
      content: faqSeedData.hero,
    },
  });
  logger.info('FAQ Hero section upserted.');

  // 3. Upsert 'cta' section
  await prisma.section.upsert({
    where: {
      pageId_sectionKey: {
        pageId: page.id,
        sectionKey: 'cta',
      },
    },
    update: {
      content: faqSeedData.cta,
    },
    create: {
      pageId: page.id,
      sectionKey: 'cta',
      content: faqSeedData.cta,
    },
  });
  logger.info('FAQ CTA section upserted.');

  // 4. Upsert 'faqs' section with all topics & questions
  await prisma.section.upsert({
    where: {
      pageId_sectionKey: {
        pageId: page.id,
        sectionKey: 'faqs',
      },
    },
    update: {
      content: faqSeedData.faqs,
    },
    create: {
      pageId: page.id,
      sectionKey: 'faqs',
      content: faqSeedData.faqs,
    },
  });
  const totalQuestions = faqSeedData.faqs.topics.reduce(
    (sum, t) => sum + t.questions.length,
    0,
  );
  logger.info(
    `FAQ topics and questions upserted: ${faqSeedData.faqs.topics.length} topics, ${totalQuestions} questions.`,
  );
  logger.info('FAQ seeding completed successfully!');
}

// Allow direct CLI execution: tsx prisma/seed-faq.ts
if (require.main === module) {
  seedFaq()
    .catch((err) => {
      logger.error('Error seeding FAQ:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
