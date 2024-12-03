import { Request, Response,NextFunction } from 'express';
import CartModel from '../models/Cart';
import orderModel from '../models/Orders';

export const addToCart = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const { userId, courseId } = req.body; 
        
        const alreadyEnrolled = await orderModel.findOne({ courseId: courseId, studentId: userId });
        if (alreadyEnrolled) {
             res.status(400).json({ message: "Student is already enrolled in this course" });
             return;
        }
        const cartItemExisted = await CartModel.findOne({ user: userId, course: courseId });
        if (cartItemExisted) {
            res.status(400).json({ message: "Course already exists in the cart" });
            return ;
        } 
        const newCartItem = new CartModel({ user: userId, course: courseId });
        await newCartItem.save();
        
        res.status(200).json({ message: "Course added to cart successfully" });
        return ;
        
    } catch (error) {
        console.error("Error occurred while adding to cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getCartItems = async (req: Request, res: Response) => {
    const { studentId } = req.params;
    console.log(studentId, "........................");
    
    try {
        const cartItems = await CartModel.find({ user: studentId })
            .populate('course')  
            .lean(); 

        cartItems.forEach(item => {
            console.log('Populated Course:', item.course); 
        });
        
        console.log('cartItems Course:', cartItems); 
        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart items", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const removeCartItem = async(req:Request,res:Response):Promise<void> =>{
    try {
        const cartItemId = req.params.cartItemId;
        const removedItem = await CartModel.findByIdAndDelete({_id:cartItemId})
        if (!removedItem) {
            res.status(404).json({ error: "Cart item not found" });
            return ;
          }
          res.status(200).json({ message: "Course removed from the cart" });
    } catch (error) {
        console.error("Error removing course from cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}