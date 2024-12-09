import { Request, Response, NextFunction } from 'express';
import WishListModel from '../models/wishlist';
import { AuthenticatedRequest } from '../utils/VerifyToken';

export const addToWishlist = async(req:Request, res:Response,next: NextFunction):Promise<void> =>{
    try {
        const { userId, courseId } = req.body; 
        const itemExisted = await WishListModel.findOne({user:userId,course:courseId})
        if(itemExisted){
             res.status(200).json({message:"Course already existed in Wishlist"})
             return
        } 
        else{
            const newItem = new WishListModel({user:userId,course:courseId});
            await newItem.save();
            res.status(201).json({message:"Course added to wishlist successfully"})
            return 
        }
    } catch (error) {
        console.error("Error Occur while Adding to wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const  getWishlistItems = async(req:AuthenticatedRequest, res:Response,next: NextFunction):Promise<void> =>{
    const studentId = req.userId;

    console.log(studentId,"........................");
    
    try {
        const wishlistItems = await WishListModel.find({ user: studentId }).populate("course");

        wishlistItems.forEach(item => {
            console.log('Populated Course:', item.course); 
        });
        
    console.log(wishlistItems, "items");

    res.status(200).json(wishlistItems);
    } catch (error) {
        console.error("Error fetching cart Items", error);
        res.status(500).json({ error: "Internal server Error" });
    }
}

export const removeWishlistItem = async(req:Request, res:Response,next: NextFunction):Promise<void> =>{
    try {
        const wishlistItemId = req.params.wishlistItemId;
        const removedItem = await WishListModel.findByIdAndDelete({_id:wishlistItemId})
        if (!removedItem) {
            res.status(404).json({ error: "Wishlist item not found" });
            return ;
          }
          res.status(200).json({ message: "Course removed from the wishlist" });
    } catch (error) {
        console.error("Error removing course from wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}