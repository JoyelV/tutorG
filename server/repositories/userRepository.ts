import User from '../models/User'; 
import { IUser } from '../entities/IUser';
import Course from '../models/Course';
import Instructor from '../models/Instructor';
import Order from '../models/Orders';
import Message from '../models/Message';

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
  async logoutRepository (userId: string){
    try {
      await User.findByIdAndUpdate(
        userId,
        { onlineStatus: false },
        { new: true }
      );
    } catch (error) {
      throw new Error('Database error');
    }
  },
};

export const toggleUserStatusRepository = async (userId: string, isBlocked: boolean) => {
  return User.findByIdAndUpdate(
    userId,
    { isBlocked },
    { new: true }
  );
};

export const getStudentsByInstructorRepository = async (instructorId: string, page: string, limit: string) => {
  const skip = (Number(page) - 1) * Number(limit);
  const totalStudents = await Order.countDocuments({
    tutorId: instructorId,
    studentId: { $ne: null },
  });

  const students = await Order.find({
    tutorId: instructorId,
    studentId: { $ne: null },
  })
    .populate('studentId', 'username email phone image gender')
    .populate('courseId', 'title level')
    .skip(skip)
    .limit(Number(limit));

  return {
    students,
    totalStudents,
    currentPage: Number(page),
    totalPages: Math.ceil(totalStudents / Number(limit)),
  };
};

export const getStudentsChatRepository = async (instructorId: string) => {
  return Order.find({
    tutorId: instructorId,
    studentId: { $ne: null },
  })
    .populate('studentId', 'username email phone image gender onlineStatus')
    .populate('courseId', 'title level');
};

export const getMyMessagesRepository = async (senderId: string | undefined, receiverId: string | undefined) => {
  return Message.find({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  }).sort({ createdAt: 1 });
};

export const getStatsCountsRepository = async () => {
  const [studentCount, courseCount, tutorCount] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Instructor.countDocuments(),
  ]);

  return {
    students: studentCount,
    courses: courseCount,
    tutors: tutorCount,
  };
};
