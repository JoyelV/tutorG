import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import Instructor from '../models/Instructor';
import {IInstructor} from '../entities/IInstructor';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

interface ProfileUpdateBody {
    username?: string;
    email?: string;
    phone?: string;
    address?: { line1: string; line2: string };
    gender?: string;
    dob?: string;
    image?: string;
};

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

    const existingUser = await Instructor.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Instructor({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//AUTHENTICATION  
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const user: IInstructor | null = await Instructor.findOne({ email });
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
    console.log("reqbody in instructor side",req.body);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("hashedPassword",hashedPassword);

      const user = await Instructor.findOne({ email:decoded.email });
      console.log("Instructor",user);
      
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

//PROFILE MANAGEMENT
export const getUserProfile = async (userId: string): Promise<IInstructor | null> => {
    try {
        const instructor = await Instructor.findById(userId);
        if (!instructor) {
            throw new Error('User not found');
        }
        return instructor;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

export const updateUserProfile = async (userId: string, adminData: ProfileUpdateBody): Promise<IInstructor | null> => {
    try {
        const admin = await Instructor.findById(userId);
        if (!admin) {
            throw new Error('User not found');
        }

        const { username, email, phone, address, gender, dob, image } = adminData;

        admin.username = username || admin.username;
        admin.email = email || admin.email;
        admin.phone = phone || admin.phone;
        admin.address = address || admin.address;
        admin.gender = gender || admin.gender;
        admin.dob = dob || admin.dob;
        admin.image = image || admin.image;

        await admin.save();
        return admin;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    try {
        const instructor = await Instructor.findById(userId);
        if (!instructor) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, instructor.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        instructor.password = hashedPassword;

        await instructor.save();
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};

export const uploadUserImage = async (userId: string, imageUrl: string) => {
    try {
        const updatedInstructor = await Instructor.findByIdAndUpdate(userId, { image: imageUrl }, { new: true });
        if (!updatedInstructor) {
            throw new Error('User not found');
        }
        await updatedInstructor.save();
        return updatedInstructor;
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