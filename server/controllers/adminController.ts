import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import Admin, { IAdmin } from '../models/Admin';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User';
import Instructor from '../models/Instructor';

interface ProfileUpdateBody {
    username?: string;
    email?: string;
    phone?: string;
    address?: { line1: string; line2: string };
    gender?: string;
    dob?: string;
    image?: string;
};

//AUTHENTICATION  
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const user: IAdmin | null = await Admin.findOne({ email });
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
    console.log("req.body",req.body);

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
    console.log("reqbody in admin side",req.body);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("hashedPassword",hashedPassword);

      const user = await Admin.findOne({ email:decoded.email });
      console.log("admin",user);
      
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

// Controller to get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch users with selected fields
    const users = await User.find({}, 'username email phone gender role');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Controller to get all instructors
export const getAllInstructors = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch instructors with selected fields
    const instructors = await Instructor.find({});
    console.log(instructors,"instructors data");

    res.status(200).json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ message: 'Failed to fetch instructors' });
  }
};

//PROFILE MANAGEMENT
export const getUserProfile = async (userId: string): Promise<IAdmin | null> => {
    try {
        const admin = await Admin.findById(userId);
        console.log("hi testing getUserProfile data.......",admin)

        if (!admin) {
            throw new Error('User not found');
        }
        return admin;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

export const updateUserProfile = async (userId: string, adminData: ProfileUpdateBody): Promise<IAdmin | null> => {
    try {
        const admin = await Admin.findById(userId);
        if (!admin) {
            throw new Error('User not found');
        }

        const { username, email, phone, address, gender, dob } = adminData;

        admin.username = username || admin.username;
        admin.email = email || admin.email;
        admin.phone = phone || admin.phone;
        admin.address = address || admin.address;
        admin.gender = gender || admin.gender;
        admin.dob = dob || admin.dob;
        // admin.image = image || admin.image;

        await admin.save();
        return admin;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    try {
        const admin = await Admin.findById(userId);
        if (!admin) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;

        await admin.save();
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};

export const uploadUserImage = async (userId: string, imageUrl: string) => {
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(userId, { image: imageUrl }, { new: true });
        if (!updatedAdmin) {
            throw new Error('User not found');
        }
        await updatedAdmin.save();
        return updatedAdmin;
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