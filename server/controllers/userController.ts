import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sendOTPEmail } from '../utils/emailService';
import { generateOTP } from '../utils/otpGenerator';
import { verifyOTP, loginService, resetPasswordService, googleLoginService } from '../services/authService';
import { otpService } from '../services/otpService';
import { otpRepository } from '../repositories/otpRepository';
import orderModel from '../models/Orders';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { updateUserProfile, updatePassword, uploadUserImage, getUserProfileService } from '../services/userService';
import User from '../models/User'
import Message from '../models/Message';
import Course from '../models/Course';
import Instructor from '../models/Instructor';
import { userRepository } from 'repositories/userRepository';
dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    const emailLowerCase = email.toLowerCase();

    const existingUser  = await userRepository.findUserByEmail(emailLowerCase);
    if(existingUser){
      res.status(409).json({message:'Email already exists'});
      return;
    }

    const otp = generateOTP();
    otpRepository.saveOtp(emailLowerCase, { otp, username, password, createdAt: new Date() });
    await sendOTPEmail(emailLowerCase, otp);

    res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Resend OTP to the student email for registration.
 */
export const resendOtp = async (req:Request, res:Response,next: NextFunction) => {
  const { username, email, password } = req.body;
  const emailLowerCase = email.toLowerCase();

  try {
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const otp = generateOTP();
    otpRepository.saveOtp(emailLowerCase, { otp, username, password, createdAt: new Date() });
    await sendOTPEmail(emailLowerCase, otp);
    
    res.status(200).json({ message: 'OTP resend to your email. Please verify.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const verifyRegisterOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const emailLowerCase = email.toLowerCase();

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }
    
    const message = await verifyOTP(emailLowerCase, otp);
    res.status(201).json({ message });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  const emailLowerCase = email.toLowerCase();

  try {
    const { token, refreshToken ,user } = await loginService(emailLowerCase, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'An unknown error occurred' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
   let userId = req.userId;
   await User.findByIdAndUpdate(
     userId, 
     { onlineStatus: false }, 
     { new: true } 
   );
     res.status(200).json({message:"Logout successfully"});
  } catch (error) {
   res.status(400).json({ message: 'An unknown error occurred' });
  }
}

export const googleSignIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token: googleToken } = req.body;
  if (!googleToken) {
    res.status(400).json({ message: 'Google token is required' });
    return;
  }

  try {
    const { token, refreshToken, user } = await googleLoginService(googleToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
  });  

    res.status(200).json({
      message: 'Google Sign-In successful',
      token,
      user: {
        id: user._id, 
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error:any) {
    console.error('Google Sign-In error:', error.message || error);
    res.status(500).json({
      message: 'Google Sign-In failed. Please check credentials.',
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token is required' });
      return ;
  }

  try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      const newToken = jwt.sign(
          { id: (decoded as any).id, role: (decoded as any).role },
          process.env.JWT_SECRET!,
          { expiresIn: '15m' } 
      );
      res.status(200).json({ token: newToken });
  } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  
  try {
    const { email } = req.body;
    const emailLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailLowerCase });

    if (!user) {
      res.status(404).json({ error: 'Email address not found in the system.' });
      return;
    }
    await otpService.generateAndSendOtp(email);
    res.status(201).send('OTP sent to email');
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const verifyPasswordOtp = (req: Request, res: Response, next: NextFunction): void => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const token = otpService.verifyOtpAndGenerateToken(email, otp);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const message = await resetPasswordService(token, newPassword);
    res.status(200).json({ message });
  } catch (error: unknown) {
    res.status(400).json({ message: 'Registered Email is required' });
    return;
  }
}

export const fetchImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;  
  try {
    const user = await User.findById(userId);
    res.status(200).json({imageUrl:user?.image});
  } catch (error) {
    res.status(400).json({message:'Image not found'});
    return;
  }
}

export const fetchUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;  
  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const user = await getUserProfileService(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}

export const editUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const updates = req.body;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const updatedUser = await updateUserProfile(userId, updates);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}

export const editPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;
  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    await updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
}

export const uploadImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }
  const imageUrl = (req.file as any).path;
  
  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const updatedUser = await uploadUserImage(userId, imageUrl);
    res.status(200).json({ success: true, imageUrl, user: updatedUser });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
}

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    if (!userId) {
      res.status(400).json({ message: 'Missing userId in request parameters' });
      return;
    }

    if (typeof isBlocked !== 'boolean') {
      res.status(400).json({ message: 'Invalid or missing isBlocked value' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status', error: error });
  }
};

export const getStudentsByInstructor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructorId = req.userId;
    const { page = 1, limit = 4 } = req.query; 
    const skip = (Number(page) - 1) * Number(limit);

    const totalStudents = await orderModel.countDocuments({
      tutorId: instructorId,
      studentId: { $ne: null },
    });

    const students = await orderModel
      .find({
        tutorId: instructorId,
        studentId: { $ne: null },
      })
      .populate("studentId", "username email phone image gender")
      .populate("courseId", "title level")
      .skip(skip)
      .limit(Number(limit));
    
    res.status(200).json({
      students,
      totalStudents,
      currentPage: Number(page),
      totalPages: Math.ceil(totalStudents / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching students by instructor:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

export const getStudentsChat = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructorId = req.userId;

    const orders = await orderModel
    .find({
      tutorId: instructorId,
      studentId: { $ne: null },  
    })
    .populate("studentId", "username email phone image gender onlineStatus")
    .populate("courseId", "title level"); 

    if (orders.length === 0) {
      res.status(404).json({ message: "No students found for this instructor." });
      return;
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching students by instructor:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

export const getMyMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { senderId, receiverId } = req.query;
    
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
}

export const getStatsCounts = async(req:Request,res:Response):Promise<void>=>{
  try {
    const [studentCount, courseCount, tutorCount] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Instructor.countDocuments(),
    ]);

    res.status(200).json({
      students: studentCount,
      courses: courseCount,
      tutors: tutorCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}