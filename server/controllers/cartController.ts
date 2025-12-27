import { Request, Response, NextFunction } from 'express';
import CartService from '../services/cartService';
import { AuthenticatedRequest } from '../utils/VerifyToken';

export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, courseId } = req.body;
        const response = await CartService.addToCart(userId, courseId);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        console.error("Error adding course to cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getCartItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const studentId = req.userId;
        if(studentId){
            const cartItems = await CartService.getCartItems(studentId);
            res.status(200).json(cartItems);
        }
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const cartItemId = req.params.cartItemId;
        const response = await CartService.removeCartItem(cartItemId);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        console.error("Error removing course from cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
