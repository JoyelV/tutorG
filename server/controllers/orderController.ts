import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/orderService";
import { AuthenticatedRequest } from "../utils/VerifyToken";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      if(!userId){
        res.status(404).json({ message: "No user found" });
        return ;
      }
      const orders = await this.orderService.getUserOrders(userId);
      
      if (!orders || orders.length === 0) {
        res.status(404).json({ message: "No orders found for this user" });
        return ;
      }

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getEnrolledOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const sortBy = req.query.sort as string || 'createdAt';
      const sortDirection = req.query.direction as string || 'desc';

      if(!userId){
        res.status(404).json({ message: "No user found" });
        return ;
      }

      const orders = await this.orderService.getEnrolledOrders(userId, page, limit, sortBy, sortDirection);
      const totalOrders = await this.orderService.countUserOrders(userId);
      const totalPages = Math.ceil(totalOrders / limit);

      if (orders.length === 0) {
        res.status(204).json({ message: 'No purchase history found' });
        return ;
      }

      res.status(200).json({
        orders,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const orders = await this.orderService.getOrders(page, limit);
      const totalOrders = await this.orderService.countTotalOrders();
      const total = await this.orderService.countTotal();
      const totalPages = Math.ceil(totalOrders / limit);

      res.status(200).json({
        orders,
        totalPages: totalPages,
        currentPage: page,
        total
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getOrderDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await this.orderService.getOrderDetail(orderId);

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return ;
      }

      res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  }

  async getOrdersBySessionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        res.status(400).json({ message: "Session ID is required" });
        return ;
      }

      const orders = await this.orderService.getOrdersBySessionId(session_id as string);

      if (!orders || orders.length === 0) {
        res.status(404).json({ message: "No orders found for the given session ID" });
        return ;
      }

      res.status(200).json({ orders });
    } catch (error: any) {
      next(error);
    }
  }
}