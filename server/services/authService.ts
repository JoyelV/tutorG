import bcrypt from 'bcrypt';
import { otpRepository } from '../repositories/otpRepository';
import { userRepository } from '../repositories/userRepository';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { IUser } from '../entities/IUser';
import User from '../models/User';

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
  await userRepository.createUser(storedEntry.username, email, hashedPassword);

  otpRepository.deleteOtp(email);

  return 'User registered successfully';
}

export const loginService = async (
  email: string,
  password: string
): Promise<{ token: string; refreshToken: string; user: Partial<IUser> }> => {
  const user = await userRepository.findUserByEmail(email);
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
  await userRepository.updateUser(user._id.toString(), { onlineStatus: true });

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
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
      },
  };
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (googleToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.name) {
    throw new Error('Invalid Google token or payload');
  }

  const email = payload.email;
  let user = await userRepository.findUserByEmail(email);

  if (!user) {
    const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      
    user = await User.create({
      email: payload.email,
      username: payload.name,
      password:hashedPassword,
      role: 'user',
    });
  }else{
    if(user?.isBlocked){
      throw new Error('User Blocked');
    }
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are not set in environment variables');
  }
  await userRepository.updateUser(user._id.toString(), { onlineStatus: true });

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

  return { token, refreshToken, user };
};

export const resetPasswordService = async (token: string, newPassword: string): Promise<string> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await userRepository.findUserByEmail(decoded.email.toLowerCase());
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await userRepository.updateUserPassword(decoded.email.toLowerCase(), hashedPassword);
    if (!updatedUser) {
      throw new Error('Failed to update password');
    }

    return 'Password reset successful';
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};