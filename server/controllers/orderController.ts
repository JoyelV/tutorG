import { Request, Response,NextFunction } from "express";
import orderModel from "../models/Orders";
import { AuthenticatedRequest } from "../utils/VerifyToken";

export const getUserOrders = async (req: AuthenticatedRequest, res: Response,next: NextFunction):Promise<void> =>{
  const userId = req.userId;

 console.log(userId,"userId");
 
  try {
    if (!userId) {
      res.status(400).json({ message: "User ID is required and must be a string" });
      return ;
    }

    const orders = await orderModel.find({ 
        studentId
        :userId }).populate("courseId", "title thumbnail courseFee level");
    console.log(orders,"orders");

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found for this user" });
      return ;
    }

    res.status(200).json(orders);
    return ;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error" });
    return ;
  }
};


export const getEnrolledOrders = async (req: AuthenticatedRequest, res: Response,next: NextFunction):Promise<void> =>{
try {
    const userId = req.userId;

    const orders = await orderModel.find({ studentId: userId })
      .populate('courseId', 'title') 
      .populate('tutorId', 'username') 
      .sort({ createdAt: -1 }); 

    if (orders.length === 0) {
      res.status(404).json({ message: 'No purchase history found' });
      return ;
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}