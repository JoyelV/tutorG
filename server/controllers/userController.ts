import bcrypt from 'bcrypt';
import { IUser } from '../models/User';
import User from '../models/User';

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
    currentPassword?: string;
    newPassword?: string;
    image?: string;
}

export const updateUserProfile = async (userId: string, userData: any): Promise<IUser | null> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const { username, email, phone, address, gender, dob, currentPassword, newPassword, image } = userData;

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }
            user.password = await bcrypt.hash(newPassword, 12);
        } else if (currentPassword || newPassword) {
            throw new Error('Please provide both current and new passwords');
        }

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