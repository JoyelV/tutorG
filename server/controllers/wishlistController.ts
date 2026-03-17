import { Request, Response, NextFunction } from 'express';
import WishlistService from '../services/wishlistService';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const addToWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
        throw new AppError(400, 'User ID and Course ID are required');
    }
    const response = await WishlistService.addToWishlist(userId, courseId);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
});

export const getWishlistItems = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const studentId = req.userId;
    if (!studentId) {
        throw new AppError(401, 'Unauthorized');
    }
    const wishlistItems = await WishlistService.getWishlistItems(studentId);
    res.status(200).json(new ApiResponse(200, wishlistItems));
});

export const removeWishlistItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const wishlistItemId = req.params.wishlistItemId;
    if (!wishlistItemId) {
        throw new AppError(400, 'Wishlist item ID is required');
    }
    const response = await WishlistService.removeWishlistItem(wishlistItemId);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
});
