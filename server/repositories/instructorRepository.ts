import User from "../models/Instructor";
import { IInstructor } from "../entities/IInstructor";
import Course from "../models/Course";

export const instructorRepository = {
  async createUser(username: string, email: string, password: string): Promise<void> {
    const newUser = new User({ username, email, password });
    await newUser.save();
  },

  async findCoursesByInstructor(instructorId: string) {
    return Course.find({ instructorId });
  },

  async findUserByEmail(email: string): Promise<IInstructor | null> {
    return User.findOne({ email });
  },

  async updateUserPassword(email: string, newPassword: string): Promise<IInstructor | null> {
    return User.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );
  },

  async findUserById(userId: string): Promise<IInstructor | null> {
    return User.findById(userId);
  },

  async updateUser(userId: string, updates: Partial<IInstructor>): Promise<IInstructor | null> {
    return User.findByIdAndUpdate(userId, updates, { new: true });
  },

  async updatePassword(userId: string, hashedPassword: string): Promise<IInstructor | null> {
    return User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  },

  async updateUserOtp(email: string, otp: string, otpExpiry: Date) {
    return User.updateOne({ email }, { otp, otpExpiry });
  },

  async getAllInstructors() {
    return User.find({});
  },

  async changeTutorStatus(id: string) {
    const instructor = await User.findById(id);
    if (!instructor) throw new Error("Instructor not found");

    return User.findByIdAndUpdate(
      id,
      { isBlocked: !instructor.isBlocked },
      { new: true }
    );
  },

  async updateOnlineStatus(userId: string, status: boolean): Promise<void> {
    await User.findByIdAndUpdate(userId, { onlineStatus: status });
  },

  async updateTutorStatus(tutorId: string, isBlocked: boolean) {
    return User.findByIdAndUpdate(tutorId, { isBlocked }, { new: true });
  },

  async createTutor(tutorData: any) {
    const newTutor = new User(tutorData);
    return newTutor.save();
  },

  async getTopTutors(limit: number) {
    return User.find()
      .sort({ averageRating: -1 })
      .limit(limit)
      .select("username headline areasOfExpertise image averageRating numberOfRatings");
  },
};
