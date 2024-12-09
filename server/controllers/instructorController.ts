import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sendOTPEmail } from '../utils/emailService';
import { generateOTP } from '../utils/otpGenerator';
import { verifyOTP, loginService, resetPasswordService } from '../services/instructorService';
import { otpService } from '../services/otpService';
import { otpRepository } from '../repositories/otpRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { updateUserProfile, updatePassword, uploadUserImage, getUserProfileService } from '../services/instructorService';
import Instructor from '../models/Instructor';
import orderModel from '../models/Orders';
import { AuthenticatedRequest } from '../utils/VerifyToken';

dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const otp = generateOTP();
    otpRepository.saveOtp(email, { otp, username, password, createdAt: new Date() });
    await sendOTPEmail(email, otp);

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
  try {
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const otp = generateOTP();
    otpRepository.saveOtp(email, { otp, username, password, createdAt: new Date() });
    await sendOTPEmail(email, otp);
    console.log(otp);
    
    res.status(200).json({ message: 'OTP resend to your email. Please verify.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const verifyRegisterOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const message = await verifyOTP(email, otp);
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
  try {
    const { token, refreshToken ,user } = await loginService(email, password);
    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An unknown error occurred' });
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
      console.log("called refereshtoken",newToken);

      res.status(200).json({ token: newToken });
  } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    await otpService.generateAndSendOtp(email);
    res.status(200).send('OTP sent to email');
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
    console.log('Generated token:', token);

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
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

export const fetchUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  console.log("fetchUserProfile", userId);
  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const user = await getUserProfileService(userId);
    console.log("user", user);

    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}

export const editUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  const updates = req.body;
  console.log("userId", userId);
  console.log("updates", updates);

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const updatedUser = await updateUserProfile(userId, updates);
    console.log("updatedUser", updatedUser);

    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}

export const editPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  const { currentPassword, newPassword } = req.body;
  console.log("req.params in editPassword", req.params);

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
  console.log("req.file.path", req.file.path);
  const imageUrl = req.file ? req.file.path : "";

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const updatedUser = await uploadUserImage(userId, imageUrl);
    console.log("updatedUser", updatedUser);

    res.status(200).json({ success: true, imageUrl, user: updatedUser });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
}

export const toggleTutorStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Request Params:', req.params); 
    console.log('Request Body:', req.body);     

    const { tutorId } = req.params;
    const { isBlocked } = req.body;

    if (!tutorId) {
      res.status(400).json({ message: 'Missing userId in request parameters' });
      return;
    }

    if (typeof isBlocked !== 'boolean') {
      res.status(400).json({ message: 'Invalid or missing isBlocked value' });
      return;
    }

    const updatedUser = await Instructor.findByIdAndUpdate(
      tutorId,
      { isBlocked },
      { new: true }
    );
console.log(updatedUser);

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


export const addTutors = async (req: Request, res: Response): Promise<void> => {
  console.log("hi in addtutors controller function",req.body);
  try {
    const {
        username,
        email,
        phone,
        password,
        headline,
        areasOfExpertise,
        bio,
        highestQualification,
        websiteLink,
        isBlocked,
        tutorRequest,
    } = req.body;

    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const image = req.file ? req.file.path : "";

    // Validation checks (can also be implemented using middleware)
    if (!username || !email || !phone || !password) {
        res.status(400).json({ message: 'Required fields are missing.' });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to the database
    const newTutor = new Instructor({
        username,
        email,
        phone,
        password:hashedPassword, 
        headline,
        image,
        areasOfExpertise,
        bio,
        highestQualification,
        websiteLink,
        isBlocked,
        tutorRequest,
    });

    await newTutor.save();

    res.status(201).json({ message: 'Tutor added successfully!', tutor: newTutor });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
}
};

export const getMyTutors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.userId;

  try {
    const orders = await orderModel.find({ studentId })
    .populate('tutorId', 'username image') 
    .exec();
    console.log(orders,"orders");

  // Filter out duplicate tutorIds
  const uniqueOrders = orders.filter((order, index, self) =>
    index === self.findIndex((o) => o.tutorId.toString() === order.tutorId.toString())
  );
    
      console.log(uniqueOrders,"uniqueOrders");
 
      res.status(200).json(uniqueOrders); 
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Server error' });
  }
}