import bcrypt from 'bcrypt';
import { IUser } from '../models/User';
import User from '../models/User';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

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
