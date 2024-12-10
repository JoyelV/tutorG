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

/**
 * Get all orders with pagination
 * @route GET /api/orders
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;

    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 }) 
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    
    console.log(orders,"orders......");

    const totalOrders = await orderModel.countDocuments();
    const totalPages = Math.ceil(totalOrders / limitNumber);
    console.log(totalOrders,"totalOrders......");

    res.status(200).json({
      success: true,
      orders,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error:any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getOrderDetail = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;

  try {
    const order = await orderModel
    .findById(orderId)
    .populate("studentId", "username email image") 
    .populate("courseId", "title subtitle subCategory language thumbnail description") 
    .populate("tutorId", "username email image"); 
  console.log(order,"order......");

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return ;
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};