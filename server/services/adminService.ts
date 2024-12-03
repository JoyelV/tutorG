import bcrypt from 'bcrypt';
import { otpRepository } from '../repositories/otpRepository';
import { adminRepository } from '../repositories/adminRepository';
import jwt from 'jsonwebtoken';
import { IAdmin } from '../entities/IAdmin';

export const verifyOTP = async (email: string, otp: string): Promise<string> => {
  const storedEntry = otpRepository.getOtp(email);
  if (!storedEntry) {
    throw new Error('OTP expired or not sent');
  }

  const expirationTime = 2 * 60 * 1000;
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
  await adminRepository.createUser(storedEntry.username, email, hashedPassword);

  otpRepository.deleteOtp(email);

  return 'User registered successfully';
}

export const loginService = async (
  email: string,
  password: string
): Promise<{ token: string; refreshToken: string; user: Partial<IAdmin> }> => {
  const user = await adminRepository.findUserByEmail(email);
  if (!user) {
      throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch,"isMatch at admin..........")
  if (!isMatch) {
      throw new Error('Invalid credentials');
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT secrets are not set');
  }

  const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } 
  );

  const refreshToken = jwt.sign(
      { id: user._id },
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

    const user = await adminRepository.findUserByEmail(decoded.email);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await adminRepository.updateUserPassword(decoded.email, hashedPassword);
    if (!updatedUser) {
      throw new Error('Failed to update password');
    }

    return 'Password reset successful';
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

//Profile Service management

export const getUserProfileService = async (userId: string): Promise<IAdmin> => {
  try {
    const user = await adminRepository.findUserById(userId);
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

export const updateUserProfile = async (userId: string, userData: Partial<IAdmin>): Promise<IAdmin | null> => {
  const user = await adminRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  Object.assign(user, userData);
  return adminRepository.save(user);
}

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await adminRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await adminRepository.updatePassword(userId, hashedPassword);
}

export const uploadUserImage = async (userId: string, imageUrl: string): Promise<IAdmin | null> => {
  const user = await adminRepository.updateUser(userId, { image: imageUrl });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}
