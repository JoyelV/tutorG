import { Request, Response, NextFunction } from "express";
import { sendOTPEmail } from "../utils/emailService";
import { generateOTP } from "../utils/otpGenerator";
import { otpRepository } from "../repositories/otpRepository";
import { otpService } from "../services/otpService";
import {
  loginService,
  resetPasswordService,
  getUserProfileService,
  updateUserProfile,
  updatePassword,
  uploadUserImage,
  getDashboardData,
  getRevenueData,
  getCategoryData,
  getTopSellingCourses,
} from "../services/adminService";
import { userRepository } from "../repositories/userRepository";
import { instructorRepository } from "../repositories/instructorRepository";
import { adminRepository } from "../repositories/adminRepository";
import { AuthenticatedRequest } from "../utils/VerifyToken";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";
import { logger } from "../utils/logger";

/* =========================
   RESEND OTP (REGISTER)
========================= */
export const resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const otp = generateOTP();
  otpRepository.saveOtp(email, { otp, username, password, createdAt: new Date() });
  await sendOTPEmail(email, otp);

  res.status(200).json(new ApiResponse(200, null, "OTP resent to your email. Please verify."));
});

/* =========================
   LOGIN
========================= */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const emailLowerCase = email.toLowerCase();
  const { token, refreshToken, user } = await loginService(emailLowerCase, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse(200, {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    }
  }, "Login successful"));
});

/* =========================
   SEND OTP (RESET PASSWORD)
========================= */
export const sendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const emailLowerCase = email.toLowerCase();
  const user = await adminRepository.findUserByEmail(emailLowerCase);

  if (!user) {
    throw new AppError(400, "Email not found");
  }

  await otpService.generateAndSendOtp(emailLowerCase);
  res.status(200).json(new ApiResponse(200, null, "OTP sent to email"));
});

/* =========================
   VERIFY OTP (RESET PASSWORD)
========================= */
export const verifyPasswordOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new AppError(400, "Email and OTP are required");
  }

  const emailLowerCase = email.toLowerCase();
  const token = otpService.verifyOtpAndGenerateToken(emailLowerCase, otp);

  res.status(200).json(new ApiResponse(200, { token }, "OTP verified successfully"));
});

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new AppError(400, "Token and new password are required");
  }
  const message = await resetPasswordService(token, newPassword);
  res.status(200).json(new ApiResponse(200, null, message));
});

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await userRepository.getAllUsers();
  res.status(200).json(new ApiResponse(200, users));
});

/* =========================
   GET ALL INSTRUCTORS
========================= */
export const getAllInstructors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const instructors = await instructorRepository.getAllInstructors();
  res.status(200).json(new ApiResponse(200, instructors));
});

/* =========================
   FETCH PROFILE
========================= */
export const fetchUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(400, "User ID missing");
  }
  const user = await getUserProfileService(userId);
  res.status(200).json(new ApiResponse(200, user));
});

/* =========================
   UPDATE PROFILE
========================= */
export const editUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const updates = req.body;
  if (!userId) {
    throw new AppError(400, "User ID missing");
  }
  const updatedUser = await updateUserProfile(userId, updates);
  res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

/* =========================
   UPDATE PASSWORD
========================= */
export const editPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;
  if (!userId) {
    throw new AppError(400, "User ID missing");
  }
  await updatePassword(userId, currentPassword, newPassword);
  res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
});

/* =========================
   UPLOAD PROFILE IMAGE
========================= */
export const uploadImage = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!req.file) {
    throw new AppError(400, "No file uploaded");
  }
  if (!userId) {
    throw new AppError(400, "User ID missing");
  }

  const imageUrl = (req.file as any).path;
  const updatedUser = await uploadUserImage(userId, imageUrl);
  res.status(200).json(new ApiResponse(200, { imageUrl, user: updatedUser }, "Image upload successful"));
});

/* =========================
   ANALYTICS CONTROLLERS
========================= */

export const getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const stats = await getDashboardData();
  res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

export const getRevenueAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const revenueData = await getRevenueData();
  res.status(200).json(new ApiResponse(200, revenueData, "Revenue analytics fetched successfully"));
});

export const getCategoryDistribution = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categoryData = await getCategoryData();
  res.status(200).json(new ApiResponse(200, categoryData, "Category distribution fetched successfully"));
});

export const getTopCourses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const courses = await getTopSellingCourses();
  res.status(200).json(new ApiResponse(200, courses, "Top selling courses fetched successfully"));
});
