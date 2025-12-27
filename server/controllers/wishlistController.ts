import { Request, Response, NextFunction } from 'express';
import WishlistService from '../services/wishlistService';
import { AuthenticatedRequest } from '../utils/VerifyToken';

export const addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, courseId } = req.body;
        const response = await WishlistService.addToWishlist(userId, courseId);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        console.error("Error Occurred while Adding to Wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getWishlistItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const studentId = req.userId;
        if(studentId){
            const wishlistItems = await WishlistService.getWishlistItems(studentId);
            res.status(200).json(wishlistItems);
        }
    } catch (error) {
        console.error("Error Fetching Wishlist Items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeWishlistItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const wishlistItemId = req.params.wishlistItemId;
        const response = await WishlistService.removeWishlistItem(wishlistItemId);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        console.error("Error Removing Wishlist Item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
