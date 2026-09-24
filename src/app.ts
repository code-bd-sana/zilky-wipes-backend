import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import sendResponse from './app/utils/sendResponse';
import { generateSwaggerDocs } from './app/utils/swagger';

const app: Application = express();
app.set('trust proxy', 1);

const rawCorsOrigin = config.corsOrigin;
const allowedOrigins =
  rawCorsOrigin === '*'
    ? '*'
    : rawCorsOrigin
        .split(',')
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // In development or if wildcard '*' is configured, reflect the request origin
    // so credentials: true is fully compliant with the browser CORS specification
    if (allowedOrigins === '*' || config.nodeEnv === 'development') {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');
    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    const frontendOrigin = config.stripe.frontendUrl?.replace(/\/$/, '');
    if (frontendOrigin && normalizedOrigin === frontendOrigin) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie']
};

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({
  limit: '1mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Setup Swagger Docs
const swaggerDocs = generateSwaggerDocs();
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  '/api',
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.'
    }
  })
);

app.get('/health', (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Server is healthy.',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

app.use('/uploads', express.static('uploads'));
app.use('/api/v1', router);
app.use(notFound);
app.use(globalErrorHandler);

export default app;
