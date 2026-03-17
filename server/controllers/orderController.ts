import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/orderService";
import { AuthenticatedRequest } from "../utils/VerifyToken";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getUserOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(404, "No user found");
    }
    const orders = await this.orderService.getUserOrders(userId);
    if (!orders || orders.length === 0) {
      throw new AppError(404, "No orders found for this user");
    }
    res.status(200).json(new ApiResponse(200, orders));
  });

  getEnrolledOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const sortBy = req.query.sort as string || 'createdAt';
    const sortDirection = req.query.direction as string || 'desc';

    if (!userId) {
      throw new AppError(404, "No user found");
    }

    const orders = await this.orderService.getEnrolledOrders(userId, page, limit, sortBy, sortDirection);
    const totalOrders = await this.orderService.countUserOrders(userId);
    const totalPages = Math.ceil(totalOrders / limit);

    if (orders.length === 0) {
      res.status(200).json(new ApiResponse(204, { orders: [], currentPage: page, totalPages: 0 }, "No purchase history found"));
      return;
    }

    res.status(200).json(new ApiResponse(200, {
      orders,
      currentPage: page,
      totalPages: totalPages,
    }));
  });

  getOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const orders = await this.orderService.getOrders(page, limit);
    const totalOrders = await this.orderService.countTotalOrders();
    const total = await this.orderService.countTotal();
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json(new ApiResponse(200, {
      orders,
      totalPages: totalPages,
      currentPage: page,
      total
    }));
  });

  getOrderDetail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const order = await this.orderService.getOrderDetail(orderId);
    if (!order) {
      throw new AppError(404, "Order not found");
    }
    res.status(200).json(new ApiResponse(200, { order }));
  });

  getOrdersBySessionId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { session_id } = req.query;
    if (!session_id) {
      throw new AppError(400, "Session ID is required");
    }

    const orders = await this.orderService.getOrdersBySessionId(session_id as string);
    if (!orders || orders.length === 0) {
      throw new AppError(404, "No orders found for the given session ID");
    }
    res.status(200).json(new ApiResponse(200, { orders }));
  });
}
