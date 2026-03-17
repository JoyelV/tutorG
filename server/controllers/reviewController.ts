import { Request, Response } from 'express';
import ReviewService from '../services/reviewService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const addReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { title, material, comment } = req.body;
    const { courseId } = req.params;
    if (!courseId) {
        throw new AppError(400, 'Course ID is required');
    }

    const response = await ReviewService.addReview(title, material, comment, courseId);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
});

export const getReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!courseId) {
        throw new AppError(400, 'Course ID is required');
    }
    const reviews = await ReviewService.getReviews(courseId);
    res.status(200).json(new ApiResponse(200, reviews));
});
