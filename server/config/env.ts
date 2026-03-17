import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().transform(Number),
    MONGO_URI: z.string().url(),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    CLIENT_URL: z.string().url().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    EMAIL_USER: z.string().email(),
    EMAIL_PASS: z.string().min(1),
});

export const validateEnv = () => {
    try {
        const env = envSchema.parse(process.env);
        logger.info('Environment variables validated successfully.');
        return env;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ');
            logger.error(`❌ Invalid or missing environment variables: ${missingVars}`);
            process.exit(1);
        }
        throw error;
    }
};
