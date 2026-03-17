import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import compression from 'compression';
import connectCloudinary from './config/cloudinary';
import { validateEnv } from './config/env';
import { logger } from './utils/logger';
import { socketService } from './utils/socketService';

// Validate environment variables at startup before any other imports that might depend on them
validateEnv();

import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import instructorRoutes from './routes/instructorRoutes';
import { handleStripeWebhook } from './controllers/paymentController';
import { refreshAccessToken } from './utils/VerifyToken';
import { generalRateLimiter } from './middlewares/rateLimiter';
import Message from './models/Message';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

socketService.init(io);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(generalRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

connectCloudinary();

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.post('/api/refresh-token', refreshAccessToken);
app.use(errorHandler);

const PORT = process.env.PORT;
server.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}`));
