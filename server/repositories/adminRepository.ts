import Admin from '../models/Admin';
import { IAdmin } from '../entities/IAdmin';

export interface IAdminRepository {
  createUser(username: string, email: string, password: string): Promise<void>;
  findUserByEmail(email: string): Promise<IAdmin | null>;
  findUserById(userId: string): Promise<IAdmin | null>;
  updateUser(userId: string, updates: Partial<IAdmin>): Promise<IAdmin | null>;
  updateUserPassword(email: string, newPassword: string): Promise<IAdmin | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<IAdmin | null>;
  updateUserOtp(email: string, otp: string, otpExpiry: Date): Promise<any>;
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
};
