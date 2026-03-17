import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            return next(new AppError(400, errorMessage));
        }
        return next(error);
    }
};
