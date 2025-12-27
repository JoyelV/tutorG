import User from '../models/Instructor'; 
import { IInstructor } from '../entities/IInstructor';
import Course from '../models/Course';

export const instructorRepository = {
  async createUser(username: string, email: string, password: string): Promise<void> {
    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log("newUser in userrepo - vERIFTY OTP",newUser);
  },
  async findCoursesByInstructor(instructorId: string) {
    return await Course.find({ instructorId });
  },
  async findUserByEmail(email: string): Promise<IInstructor | null> {
    return await User.findOne({ email });
  },
  async updateUserPassword (email: string, newPassword: string): Promise<IInstructor | null> {
    const user = await User.findOne({ email });
    if (!user) return null;

    user.password = newPassword;
    return await user.save();
  },
  findUserById: async (userId: string): Promise<IInstructor | null> => {
    return await User.findById(userId);
  },
  async updateUser(userId: string, updates: Partial<IInstructor>): Promise<IInstructor | null> {
    return User.findByIdAndUpdate(userId, updates, { new: true });
  },
  async save(user: IInstructor): Promise<IInstructor> {
    return user.save();
  },
  async updatePassword(userId: string, hashedPassword: string): Promise<IInstructor | null> {
    return User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  },
  async updateUserOtp(email: string, otp:string, otpExpiry:Date) {
  return await User.updateOne({ email }, { otp, otpExpiry });
  },
  async getAllInstructors(): Promise<any> {
    try {
      return await User.find({});
    } catch (error) {
      throw new Error('Error fetching instructors');
    }
  },
  async changeTutorStatus(id: string) {
    try {
       const instructor = await User.findOne({ _id: id });
       if (!instructor) {
         throw new Error('Student not found'); 
       }
       instructor.isBlocked = !instructor.isBlocked;
       await instructor.save();
       return instructor;
    } catch (error) {
       throw error; 
    }
  },
  async updateOnlineStatus(userId: string, status: boolean): Promise<void> {
    await User.findByIdAndUpdate(userId, { onlineStatus: status }, { new: true });
  },
  async updateTutorStatus(tutorId: string, isBlocked: boolean) {
    return await User.findByIdAndUpdate(tutorId, { isBlocked }, { new: true });
  },
  async createTutor(tutorData: any) {
    const newTutor = new User(tutorData);
    return await newTutor.save();
  },
  async getTopTutors(limit: number) {
    return await User.find()
      .sort({ averageRating: -1 })
      .limit(limit)
      .select('username headline areasOfExpertise image averageRating numberOfRatings')
      .exec();
  },
};

