import Admin from '../models/Admin'; 
import { IAdmin } from '../entities/IAdmin';

export const adminRepository = {
  async createUser(username: string, email: string, password: string): Promise<void> {
    const newUser = new Admin({ username, email, password });
    await newUser.save();
    console.log("newUser in userrepo - vERIFTY OTP",newUser);
  },
  async findUserByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  },
  async updateUserPassword (email: string, newPassword: string): Promise<IAdmin | null> {
    const user = await Admin.findOne({ email });
    if (!user) return null;

    user.password = newPassword;
    return await user.save();
  },
  findUserById: async (userId: string): Promise<IAdmin | null> => {
    return await Admin.findById(userId);
  },
  async updateUser(userId: string, updates: Partial<IAdmin>): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(userId, updates, { new: true });
  },
  async save(user: IAdmin): Promise<IAdmin> {
    return user.save();
  },
  async updatePassword(userId: string, hashedPassword: string): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  },
  async updateUserOtp(email: string, otp:string, otpExpiry:Date) {
  return await Admin.updateOne({ email }, { otp, otpExpiry });
  },
};

