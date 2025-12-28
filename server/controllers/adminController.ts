import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

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
} from "../services/adminService";

import { userRepository } from "../repositories/userRepository";
import { instructorRepository } from "../repositories/instructorRepository";
import { adminRepository } from "../repositories/adminRepository";
import { AuthenticatedRequest } from "../utils/VerifyToken";

dotenv.config();

/* =========================
   RESEND OTP (REGISTER)
========================= */
export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const otp = generateOTP();
    otpRepository.saveOtp(email, {
      otp,
      username,
      password,
      createdAt: new Date(),
    });

    await sendOTPEmail(email, otp);

    res
      .status(200)
      .json({ message: "OTP resent to your email. Please verify." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    next(error);
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const emailLowerCase = email.toLowerCase();

    const { token, refreshToken, user } =
      await loginService(emailLowerCase, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id, // ✅ FIXED (DTO)
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid email or password" });
  }
};

/* =========================
   SEND OTP (RESET PASSWORD)
========================= */
export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const emailLowerCase = email.toLowerCase();
    const user = await adminRepository.findUserByEmail(emailLowerCase);

    if (!user) {
      res.status(400).json({ message: "Email not found" });
      return;
    }

    await otpService.generateAndSendOtp(emailLowerCase);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    next(error);
  }
};

/* =========================
   VERIFY OTP (RESET PASSWORD)
========================= */
export const verifyPasswordOtp = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP are required" });
      return;
    }

    const emailLowerCase = email.toLowerCase();
    const token = otpService.verifyOtpAndGenerateToken(emailLowerCase, otp);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    next(error);
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const message = await resetPasswordService(token, newPassword);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* =========================
   GET ALL INSTRUCTORS
========================= */
export const getAllInstructors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const instructors = await instructorRepository.getAllInstructors();
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ message: "Failed to fetch instructors" });
  }
};

/* =========================
   FETCH PROFILE
========================= */
export const fetchUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID missing" });
    return;
  }

  try {
    const user = await getUserProfileService(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

/* =========================
   UPDATE PROFILE
========================= */
export const editUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  const updates = req.body;

  if (!userId) {
    res.status(400).json({ message: "User ID missing" });
    return;
  }

  try {
    const updatedUser = await updateUserProfile(userId, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Failed to update profile" });
  }
};

/* =========================
   UPDATE PASSWORD
========================= */
export const editPassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    res.status(400).json({ message: "User ID missing" });
    return;
  }

  try {
    await updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Password update failed" });
  }
};

/* =========================
   UPLOAD PROFILE IMAGE
========================= */
export const uploadImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  if (!userId) {
    res.status(400).json({ message: "User ID missing" });
    return;
  }

  try {
    const imageUrl = (req.file as any).path;
    const updatedUser = await uploadUserImage(userId, imageUrl);

    res.status(200).json({
      success: true,
      imageUrl,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed" });
  }
};
