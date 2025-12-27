import { Request, Response } from 'express';
import ReviewService from '../services/reviewService';

export const addReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, material, comment } = req.body;
        const { courseId } = req.params;

        const response = await ReviewService.addReview(title, material, comment, courseId);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error while submitting review' });
    }
};

export const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const reviews = await ReviewService.getReviews(courseId);
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
};
