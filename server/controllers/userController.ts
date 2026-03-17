import { Request, Response, NextFunction } from 'express';
import { sendOTPEmail } from '../utils/emailService';
import { generateOTP } from '../utils/otpGenerator';
import { verifyOTP, loginService, resetPasswordService, googleLoginService, logoutService } from '../services/authService';
import { otpService } from '../services/otpService';
import { otpRepository } from '../repositories/otpRepository';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { updateUserProfile, updatePassword, uploadUserImage, getUserProfileService } from '../services/userService';
import { userRepository } from '../repositories/userRepository';
import { toggleUserStatusService, getStudentsByInstructorService, getStudentsChatService, getMyMessagesService, getStatsCountsService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

// Removed redundant dotenv.config() as it's handled in server.ts

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new AppError(400, 'All fields are required');
  }

  const emailLowerCase = email.toLowerCase();
  const existingUser = await userRepository.findUserByEmail(emailLowerCase);

  if (existingUser) {
    throw new AppError(409, 'Email already exists');
  }

  const otp = generateOTP();
  await otpRepository.saveOtp(emailLowerCase, { otp, username, password, createdAt: new Date() });
  await sendOTPEmail(emailLowerCase, otp);

  res.status(200).json(
    new ApiResponse(200, null, 'OTP sent to your email. Please verify.')
  );
});

/**
 * Resend OTP to the student email for registration.
 */
export const resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!email) {
    throw new AppError(400, 'Email is required');
  }

  const emailLowerCase = email.toLowerCase();
  const otp = generateOTP();
  otpRepository.saveOtp(emailLowerCase, { otp, username, password, createdAt: new Date() });
  await sendOTPEmail(emailLowerCase, otp);

  res.status(200).json(
    new ApiResponse(200, null, 'OTP resend to your email. Please verify.')
  );
});

export const verifyRegisterOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new AppError(400, 'Email and OTP are required');
  }

  const emailLowerCase = email.toLowerCase();
  const message = await verifyOTP(emailLowerCase, otp);

  res.status(201).json(
    new ApiResponse(201, null, message)
  );
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const emailLowerCase = email.toLowerCase();
  const { token, refreshToken, user } = await loginService(emailLowerCase, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    }, 'Login successful')
  );
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || '';
  if (!userId) {
    throw new AppError(404, 'User ID not found');
  }
  const message = await logoutService(userId);
  res.status(200).json(new ApiResponse(200, null, message));
});

export const googleSignIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token: googleToken } = req.body;
  if (!googleToken) {
    throw new AppError(400, 'Google token is required');
  }

  const { token, refreshToken, user } = await googleLoginService(googleToken);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    }, 'Google Sign-In successful')
  );
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError(401, 'Refresh token is required');
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
  const newToken = jwt.sign(
    { id: (decoded as any).id, role: (decoded as any).role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  res.status(200).json(new ApiResponse(200, { token: newToken }, 'Token refreshed successfully'));
});

export const sendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(400, 'Email is required');
  }
  const emailLowerCase = email.toLowerCase();
  const user = await userRepository.findUserByEmail(emailLowerCase);

  if (!user) {
    throw new AppError(404, 'Email address not found in the system');
  }
  await otpService.generateAndSendOtp(email);
  res.status(201).json(new ApiResponse(201, null, 'OTP sent to email'));
});

export const verifyPasswordOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError(400, 'Email and OTP are required');
  }

  const token = otpService.verifyOtpAndGenerateToken(email, otp);
  res.status(200).json(new ApiResponse(200, { token }, 'OTP verified successfully'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new AppError(400, 'Token and new password are required');
  }
  const message = await resetPasswordService(token, newPassword);
  res.status(200).json(new ApiResponse(200, null, message));
});

export const fetchImage = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }
  const user = await getUserProfileService(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  res.status(200).json(new ApiResponse(200, { imageUrl: user.image }));
});

export const fetchUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }
  const user = await getUserProfileService(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  res.status(200).json(new ApiResponse(200, user));
});

export const editUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const updates = req.body;
  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }
  const updatedUser = await updateUserProfile(userId, updates);
  res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

export const editPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;
  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }
  await updatePassword(userId, currentPassword, newPassword);
  res.status(200).json(new ApiResponse(200, null, 'Password updated successfully'));
});

export const uploadImage = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!req.file) {
    throw new AppError(400, 'No file uploaded');
  }
  const imageUrl = (req.file as any).path;

  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }

  const updatedUser = await uploadUserImage(userId, imageUrl);
  res.status(200).json(new ApiResponse(200, { imageUrl, user: updatedUser }, 'Image uploaded successfully'));
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { isBlocked } = req.body;

  if (!userId) {
    throw new AppError(400, 'Missing userId in request parameters');
  }

  if (typeof isBlocked !== 'boolean') {
    throw new AppError(400, 'Invalid or missing isBlocked value');
  }

  const updatedUser = await toggleUserStatusService(userId, isBlocked);
  res.status(200).json(new ApiResponse(200, updatedUser, 'User status updated successfully'));
});

export const getStudentsByInstructor = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const instructorId = req.userId || '';
  const { page = 1, limit = 4 } = req.query;
  const result = await getStudentsByInstructorService(instructorId, page.toString(), limit.toString());
  res.status(200).json(new ApiResponse(200, result));
});

export const getStudentsChat = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const instructorId = req.userId || '';
  const orders = await getStudentsChatService(instructorId);
  res.status(200).json(new ApiResponse(200, orders));
});

export const getMyMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { senderId, receiverId } = req.query;
  const sender = typeof senderId === 'string' ? senderId : undefined;
  const receiver = typeof receiverId === 'string' ? receiverId : undefined;

  if (!sender || !receiver) {
    throw new AppError(400, 'Invalid or missing senderId or receiverId');
  }

  const messages = await getMyMessagesService(sender, receiver);
  res.status(200).json(new ApiResponse(200, messages));
});

export const getStatsCounts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const stats = await getStatsCountsService();
  res.status(200).json(new ApiResponse(200, stats));
});
