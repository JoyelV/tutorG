import { OrderRepository } from "../repositories/orderRepository";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getUserOrders(userId: string) {
    if (!userId) throw new Error("User ID is required");
    return await this.orderRepository.findOrdersByUserId(userId);
  }

  async getEnrolledOrders(userId: string, page: number, limit: number, sortBy: string, sortDirection: string) {
    return await this.orderRepository.findEnrolledOrders(userId, page, limit, sortBy, sortDirection);
  }

  async getOrders(page: number, limit: number) {
    return await this.orderRepository.findOrders(page, limit);
  }

  async getOrderDetail(orderId: string) {
    return await this.orderRepository.findOrderById(orderId);
  }

  async getOrdersBySessionId(sessionId: string) {
    return await this.orderRepository.findOrdersBySessionId(sessionId);
  }

  async countUserOrders(userId: string) {
    return await this.orderRepository.countOrdersByUserId(userId);
  }

  async countTotalOrders() {
    return await this.orderRepository.countAllOrders();
  }

  async countTotal() {
    return await this.orderRepository.countTotalOrders();
  }

  async getMyTutorsService(studentId: string) {
    const orders = await this.orderRepository.getOrdersByStudentId(studentId);

    const uniqueOrders = orders.filter((order, index, self) =>
      index === self.findIndex((o) => o.tutorId.toString() === order.tutorId.toString())
    );

    return uniqueOrders;
  }
}