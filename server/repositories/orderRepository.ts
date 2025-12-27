import orderModel from "../models/Orders";

export class OrderRepository {
  async findOrdersByUserId(userId: string) {
    return await orderModel.find({ studentId: userId }).populate("courseId", "title thumbnail courseFee level");
  }

  async findEnrolledOrders(userId: string, page: number, limit: number, sortBy: string, sortDirection: string) {
    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;

    return await orderModel.find({ studentId: userId })
      .populate('courseId', 'title')
      .populate('tutorId', 'username')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
  }

  async countOrdersByUserId(userId: string) {
    return await orderModel.countDocuments({ studentId: userId });
  }

  async findOrders(page: number, limit: number) {
    return await orderModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("studentId", "username")
      .populate("tutorId", "username")
      .populate("courseId", "title category");
  }

  async countAllOrders() {
    return await orderModel.countDocuments();
  }

  async countTotalOrders() {
    return await orderModel.find();
  }

  async findOrderById(orderId: string) {
    return await orderModel
      .findById(orderId)
      .populate("studentId", "username email image")
      .populate("courseId", "title subtitle subCategory language thumbnail description")
      .populate("tutorId", "username email image");
  }

  async findOrdersBySessionId(sessionId: string) {
    return await orderModel
      .find({ sessionId })
      .populate("studentId", "username email image")
      .populate("courseId", "title subtitle subCategory language thumbnail description")
      .populate("tutorId", "username email image");
  }

  async getOrdersByStudentId(studentId: string) {
    return await orderModel
      .find({ studentId })
      .populate('tutorId', 'username image onlineStatus')
      .exec();
  }
}

