import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

//REGISTRATION
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
});

interface OtpStore {
  [email: string]: number;
}

const otpStore: OtpStore = {};

export const sendOtp = (req: Request, res: Response): void => {
  const { email } = req.body;
  console.log('Email:', req.body.email); // Log email to verify if it's correct
  console.log('Env Variables:', process.env.EMAIL_USER, process.env.EMAIL_PASS); // Log env variables
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER as string,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error)  {
        console.error('Error sending OTP:', error); 
        return res.status(500).send('Error sending OTP');
      }
    res.status(200).send('OTP sent to email');
  });
};

export const verifyOtp = (req: Request, res: Response): void => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === parseInt(otp, 10)) {
    delete otpStore[email];
    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    console.log("token in verifyOtp",token);

    res.status(200).json({ token });
    return ;
  }
  res.status(400).send('Invalid OTP');
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const user = await User.findOne({ email:decoded.email });
   
    if (user) {
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({
        message: 'Password reset successful',
        role: user.role, 
      });
    }
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
};

//USER PROFILE
export const getUserProfile = async (userId: string): Promise<IUser | null> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

interface ProfileUpdateBody {
    username?: string;
    email?: string;
    phone?: string;
    address?: { line1: string; line2: string };
    gender?: string;
    dob?: string;
    image?: string;
}

export const updateUserProfile = async (userId: string, userData: ProfileUpdateBody): Promise<IUser | null> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const { username, email, phone, address, gender, dob, image } = userData;

        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.gender = gender || user.gender;
        user.dob = dob || user.dob;
        user.image = image || user.image;

        await user.save();
        return user;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};

export const uploadUserImage = async (userId: string, imageUrl: string) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { image: imageUrl }, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        await updatedUser.save();
        return updatedUser;
    } catch (error) {
        throw new Error('Error updating user image');
    }
};

export const getUserImage = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const imageDirectory = path.join(__dirname, '..', 'public', 'images');
  const imagePath = path.join(imageDirectory, `${userId}.jpg`); 
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Image not found for user with ID ' + userId });
  }
};




