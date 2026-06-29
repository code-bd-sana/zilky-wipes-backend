import bcrypt from 'bcryptjs';

import config from '../src/app/config';
import { logger } from '../src/app/utils/logger';
import prisma from '../src/app/utils/prisma';

async function main() {
  logger.info('Start seeding...');

  const adminEmail = config.admin.email;
  const adminPassword = config.admin.password;

  const hashedPassword = await bcrypt.hash(adminPassword, config.bcryptSaltRounds);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      username: adminEmail,
      firstName: 'System',
      lastName: 'Admin'
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      username: adminEmail,
      firstName: 'System',
      lastName: 'Admin'
    }
  });

  logger.info(`Admin user ensured in database: ${adminUser.email}`);

  // Seed Categories
  const categoriesToSeed = [
    { name: 'Starter Kits', slug: 'starter-kits', description: 'Everything you need to get started with ZilkyWipes.' },
    { name: 'Refills', slug: 'refills', description: 'Keep the freshness going with our refill packs.' },
    { name: 'Accessories', slug: 'accessories', description: 'Enhance your bathroom experience.' },
  ];

  for (const cat of categoriesToSeed) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  logger.info(`Seeded ${categoriesToSeed.length} categories.`);

  // Seed Tags
  const tagsToSeed = [
    { name: 'Eco-Friendly', slug: 'eco-friendly' },
    { name: 'Best Seller', slug: 'best-seller' },
    { name: 'New Arrival', slug: 'new-arrival' },
    { name: 'Subscription Eligible', slug: 'subscription-eligible' }
  ];

  for (const tag of tagsToSeed) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }
  logger.info(`Seeded ${tagsToSeed.length} tags.`);
  logger.info('Seeding finished.');
}

main()
  .catch((e) => {
    logger.error('Error during seeding', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
