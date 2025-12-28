import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { otpRepository } from "../repositories/otpRepository";
import { adminRepository } from "../repositories/adminRepository";
import { IAdmin } from "../entities/IAdmin";

/* =========================
   DTOs (Response Types)
========================= */

interface AdminAuthResponse {
  id: string;
  username: string;
  email: string;
  role?: string;
}

/* =========================
   OTP VERIFICATION
========================= */

export const verifyOTP = async (
  email: string,
  otp: string
): Promise<string> => {
  const storedEntry = otpRepository.getOtp(email);
  if (!storedEntry) {
    throw new Error("OTP expired or not sent");
  }

  const expirationTime = 2 * 60 * 1000;
  const currentTime = Date.now();
  const otpCreatedTime = new Date(storedEntry.createdAt).getTime();

  if (currentTime - otpCreatedTime > expirationTime) {
    otpRepository.deleteOtp(email);
    throw new Error("OTP has expired");
  }

  if (storedEntry.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(storedEntry.password, 10);
  await adminRepository.createUser(
    storedEntry.username,
    email,
    hashedPassword
  );

  otpRepository.deleteOtp(email);
  return "User registered successfully";
};

/* =========================
   LOGIN SERVICE
========================= */

export const loginService = async (
  email: string,
  password: string
): Promise<{ token: string; refreshToken: string; user: AdminAuthResponse }> => {
  const user = await adminRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not set");
  }

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    refreshToken,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

/* =========================
   RESET PASSWORD
========================= */

export const resetPasswordService = async (
  token: string,
  newPassword: string
): Promise<string> => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const userId = decoded.id as string;
    if (!userId) {
      throw new Error("Invalid token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await adminRepository.updatePassword(
      userId,
      hashedPassword
    );

    if (!updatedUser) {
      throw new Error("Failed to update password");
    }

    return "Password reset successful";
  } catch {
    throw new Error("Invalid or expired token");
  }
};

/* =========================
   PROFILE SERVICES
========================= */

export const getUserProfileService = async (
  userId: string
): Promise<IAdmin> => {
  const user = await adminRepository.findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUserProfile = async (
  userId: string,
  userData: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const updatedUser = await adminRepository.updateUser(userId, userData);
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
};

/* =========================
   CHANGE PASSWORD
========================= */

export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await adminRepository.findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await adminRepository.updatePassword(userId, hashedPassword);
};

/* =========================
   UPDATE PROFILE IMAGE
========================= */

export const uploadUserImage = async (
  userId: string,
  imageUrl: string
): Promise<IAdmin | null> => {
  const user = await adminRepository.updateUser(userId, {
    image: imageUrl,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
