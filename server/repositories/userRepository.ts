import User from '../models/User'; 
import { IUser } from '../entities/IUser';

export const userRepository = {
  async createUser(username: string, email: string, password: string): Promise<void> {
    const newUser = new User({ username, email, password });
    await newUser.save();
  },
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  },
  async updateUserPassword (email: string, newPassword: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    if (!user) return null;

    user.password = newPassword;
    return await user.save();
  },
  findUserById: async (userId: string): Promise<IUser | null> => {
    return await User.findById(userId);
  },
  async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updates, { new: true });
  },
  async save(user: IUser): Promise<IUser> {
    return user.save();
  },
  async updatePassword(userId: string, hashedPassword: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  },
  async updateUserOtp(email: string, otp:string, otpExpiry:Date) {
  return await User.updateOne({ email }, { otp, otpExpiry });
  },
  async getAllUsers(): Promise<any> {
    try {
      return await User.find({}, 'image username email phone gender role isBlocked');
    } catch (error) {
      throw new Error('Error fetching users');
    }
  },
};

