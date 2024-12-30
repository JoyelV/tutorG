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

export const getEnrolledOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;

    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 8; 
    const sortBy = req.query.sort as string || 'createdAt'; 
    const sortDirection = req.query.direction as string || 'desc'; 

    const skip = (page - 1) * limit;

    const sortOptions: any = {};
    sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1; 

    const orders = await orderModel.find({ studentId: userId })
      .populate('courseId', 'title')
      .populate('tutorId', 'username')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalOrders = await orderModel.countDocuments({ studentId: userId });

    const totalPages = Math.ceil(totalOrders / limit);

    if (orders.length === 0) {
      res.status(204).json({ message: 'No purchase history found' });
      return;
    }

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all orders with pagination
 * @route GET /api/orders
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  try {
    const [orders, totalOrders] = await Promise.all([
      orderModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("studentId", "username")
        .populate("tutorId", "username")
        .populate("courseId", "title category"),
      orderModel.countDocuments(),
    ]);
    const total = await orderModel.find();
    res.status(200).json({
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      total
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
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

export const getOrdersBySessionId = async (req: Request, res: Response): Promise<void> => {
  const { session_id } = req.query;

  if (!session_id) {
    res.status(400).json({ message: "Session ID is required." });
    return ;
  }

  try {
    const orders = await orderModel
    .find({ sessionId: session_id })
    .populate("studentId", "username email image") 
    .populate("courseId", "title subtitle subCategory language thumbnail description") 
    .populate("tutorId", "username email image"); 

    if (!orders.length) {
      res.status(404).json({ message: "No orders found for the given session ID." });
      return ;
    }

    res.status(200).json({ orders });
  } catch (error:any) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
