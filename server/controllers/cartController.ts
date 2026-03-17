import { Request, Response, NextFunction } from 'express';
import CartService from '../services/cartService';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const addToCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
        throw new AppError(400, 'User ID and Course ID are required');
    }
    const response = await CartService.addToCart(userId, courseId);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
});

export const getCartItems = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const studentId = req.userId;
    if (!studentId) {
        throw new AppError(400, 'User ID is missing');
    }
    const cartItems = await CartService.getCartItems(studentId);
    res.status(200).json(new ApiResponse(200, cartItems));
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cartItemId = req.params.cartItemId;
    if (!cartItemId) {
        throw new AppError(400, 'Cart item ID is required');
    }
    const response = await CartService.removeCartItem(cartItemId);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
});
