import { OpenApiGeneratorV3, OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { registerAuthSwagger } from '../modules/auth/auth.swagger';
import { registerUserSwagger } from '../modules/user/user.swagger';
import { registerCategorySwagger } from '../modules/category/category.swagger';
import { registerTagSwagger } from '../modules/tag/tag.swagger';
import { registerAddressSwagger } from '../modules/address/address.swagger';
import { registerProductSwagger } from '../modules/product/product.swagger';
import { registerOrderSwagger } from '../modules/order/order.swagger';
import { registerSubscriptionSwagger } from '../modules/subscription/subscription.swagger';
import { registerUploadSwagger } from '../modules/upload/upload.swagger';

// Extend Zod to support OpenAPI
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// Register Bearer Auth
const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
});

// Register Module Routes
registerAuthSwagger(registry, bearerAuth);
registerUserSwagger(registry, bearerAuth);
registerCategorySwagger(registry, bearerAuth);
registerTagSwagger(registry, bearerAuth);
registerAddressSwagger(registry, bearerAuth);
registerProductSwagger(registry, bearerAuth);
registerOrderSwagger(registry, bearerAuth);
registerSubscriptionSwagger(registry, bearerAuth);
registerUploadSwagger(registry, bearerAuth);

export const generateSwaggerDocs = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Backend API Boilerplate',
      description: 'API Documentation for the backend boilerplate.'
    },
    servers: [{ url: '/' }]
  });
};
