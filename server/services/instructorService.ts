import bcrypt from 'bcrypt';
import { otpRepository } from '../repositories/otpRepository';
import { instructorRepository } from '../repositories/instructorRepository';
import jwt from 'jsonwebtoken';
import { IInstructor } from '../entities/IInstructor';

export const verifyOTP = async (email: string, otp: string): Promise<string> => {
  const storedEntry = otpRepository.getOtp(email);
  if (!storedEntry) {
    throw new Error('OTP expired or not sent');
  }

  const expirationTime = 1 * 60 * 1000;
  const currentTime = new Date().getTime();
  const otpCreatedTime = new Date(storedEntry.createdAt).getTime();

  if (currentTime - otpCreatedTime > expirationTime) {
    otpRepository.deleteOtp(email);
    throw new Error('OTP has expired');
  }

  if (storedEntry.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  const hashedPassword = await bcrypt.hash(storedEntry.password, 10);
  await instructorRepository.createUser(storedEntry.username, email, hashedPassword);

  otpRepository.deleteOtp(email);

  return 'User registered successfully';
}

export const loginService = async (
  email: string,
  password: string
): Promise<{ token: string; refreshToken: string; user: Partial<IInstructor> }> => {
  const user = await instructorRepository.findUserByEmail(email);
  if (!user) {
      throw new Error('User not found');
  }

  if(user?.isBlocked){
    throw new Error('User Blocked');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      throw new Error('Invalid credentials');
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT secrets are not set');
  }

  await instructorRepository.updateUser(user._id.toString(), { onlineStatus: true });

  const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } 
  );

  const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } 
  );

  return {
      token,
      refreshToken,
      user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
      },
  };
};

export const resetPasswordService = async (token: string, newPassword: string): Promise<string> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await instructorRepository.findUserByEmail(decoded.email.toLowerCase());
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await instructorRepository.updateUserPassword(decoded.email.toLowerCase(), hashedPassword);
    if (!updatedUser) {
      throw new Error('Failed to update password');
    }

    return 'Password reset successful';
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

//Profile Service management
export const getUserProfileService = async (userId: string): Promise<IInstructor> => {
  try {
    const user = await instructorRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occured');
    }
  }
};

export const updateUserProfile = async (userId: string, userData: Partial<IInstructor>): Promise<IInstructor | null> => {
  const user = await instructorRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  Object.assign(user, userData);
  return instructorRepository.save(user);
}

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await instructorRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await instructorRepository.updatePassword(userId, hashedPassword);
}

export const uploadUserImage = async (userId: string, imageUrl: string): Promise<IInstructor | null> => {
  const user = await instructorRepository.updateUser(userId, { image: imageUrl });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export const logoutService = async (userId: string): Promise<void> =>{
  await instructorRepository.updateOnlineStatus(userId, false);
}

export const toggleTutorStatusService = async (tutorId: string, isBlocked: boolean): Promise<IInstructor | null> => {
  if (!tutorId) {
    throw new Error('Missing tutorId in request parameters');
  }

  if (typeof isBlocked !== 'boolean') {
    throw new Error('Invalid or missing isBlocked value');
  }

  const updatedUser = await instructorRepository.updateTutorStatus(tutorId, isBlocked);

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
}

export const addTutorService = async (tutorData: any, file: Express.Multer.File | undefined): Promise<IInstructor | null>  =>{
  const {
    username,
    email,
    phone,
    password,
    headline,
    areasOfExpertise,
    bio,
    highestQualification,
    website,
    facebook,
    linkedin,
    twitter,
    instagram,
    github,
    isBlocked,
    tutorRequest,
  } = tutorData;

  if (!file) {
    throw new Error('No file uploaded');
  }

  if (!username || !email || !phone || !password) {
    throw new Error('Required fields are missing');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const tutor = await instructorRepository.createTutor({
    username,
    email,
    phone,
    password: hashedPassword,
    headline,
    image: file.path,
    areasOfExpertise,
    bio,
    highestQualification,
    website,
    facebook,
    linkedin,
    twitter,
    instagram,
    github,
    isBlocked,
    tutorRequest,
  });

  return tutor;
}

export const  getTopTutorsService = async () =>{
  return await instructorRepository.getTopTutors(5);
}

export const getInstructorByIdService = async (instructorId: string)=> {
  const instructor = await instructorRepository.findUserById(instructorId);
  if (!instructor) {
    throw new Error('Instructor not found');
  }

  const courses = await instructorRepository.findCoursesByInstructor(instructorId);
  const totalCourses = courses.length;

  // Collect unique student IDs
  const uniqueStudentIds = new Set<string>();
  courses.forEach(course => {
    course.students.forEach(studentId => {
      uniqueStudentIds.add(studentId.toString());
    });
  });

  const totalStudents = uniqueStudentIds.size;

  return {
    username: instructor.username,
    email: instructor.email,
    image: instructor.image,
    bio: instructor.bio,
    about: instructor.about,
    headline: instructor.headline,
    areasOfExpertise: instructor.areasOfExpertise,
    highestQualification: instructor.highestQualification,
    averageRating: instructor.averageRating,
    numberOfRatings: instructor.numberOfRatings,
    website: instructor.website,
    facebook: instructor.facebook,
    twitter: instructor.twitter,
    linkedin: instructor.linkedin,
    instagram: instructor.instagram,
    github: instructor.github,
    totalStudents,
    totalCourses,
  };
}

export const getUserByEmail = async (email: string)=> {
  if (!email) {
    throw new Error('Email is required');
  }

  // Return user from the repository
  const user = await instructorRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}