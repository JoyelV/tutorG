import Admin from '../models/Admin';
import User from '../models/User';
import Course from '../models/Course';
import orderModel from '../models/Orders';
import Instructor from '../models/Instructor';
import { IAdmin } from '../entities/IAdmin';

export interface IAdminRepository {
  createUser(username: string, email: string, password: string): Promise<void>;
  findUserByEmail(email: string): Promise<IAdmin | null>;
  findUserById(userId: string): Promise<IAdmin | null>;
  updateUser(userId: string, updates: Partial<IAdmin>): Promise<IAdmin | null>;
  updateUserPassword(email: string, newPassword: string): Promise<IAdmin | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<IAdmin | null>;
  updateUserOtp(email: string, otp: string, otpExpiry: Date): Promise<any>;
  getOverallStats(): Promise<any>;
  getRevenueAnalytics(): Promise<any>;
  getCategoryDistribution(): Promise<any>;
  getTopCourses(): Promise<any>;
}

export const adminRepository: IAdminRepository = {
  async createUser(username, email, password) {
    const newUser = new Admin({ username, email, password });
    await newUser.save();
  },

  async findUserByEmail(email) {
    return Admin.findOne({ email });
  },

  async findUserById(userId) {
    return Admin.findById(userId);
  },

  async updateUser(userId, updates) {
    return Admin.findByIdAndUpdate(userId, updates, { new: true });
  },

  async updateUserPassword(email, newPassword) {
    return Admin.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );
  },

  async updatePassword(userId, hashedPassword) {
    return Admin.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  },

  async updateUserOtp(email, otp, otpExpiry) {
    return Admin.updateOne({ email }, { otp, otpExpiry });
  },

  async getOverallStats() {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalInstructors = await Instructor.countDocuments();
    const orders = await orderModel.find({ status: 'completed' });
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    return {
      totalUsers,
      totalCourses,
      totalInstructors,
      totalRevenue,
      totalOrders: orders.length
    };
  },

  async getRevenueAnalytics() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return await orderModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
  },

  async getCategoryDistribution() {
    return await Course.aggregate([
      {
        $group: {
          _id: "$category",
          courseCount: { $sum: 1 },
          avgRating: { $avg: "$averageRating" }
        }
      },
      { $sort: { courseCount: -1 } }
    ]);
  },

  async getTopCourses() {
    return await orderModel.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: "$courseId",
          salesCount: { $sum: 1 },
          totalRevenue: { $sum: "$amount" }
        }
      },
      { $sort: { salesCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo"
        }
      },
      { $unwind: "$courseInfo" },
      {
        $project: {
          title: "$courseInfo.title",
          category: "$courseInfo.category",
          thumbnail: "$courseInfo.thumbnail",
          salesCount: 1,
          totalRevenue: 1
        }
      }
    ]);
  }
};
