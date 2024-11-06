import { IUser } from '../models/User';
import User from '../models/User';

// Function to get user profile by userId
export const getUserProfile = async (userId: string): Promise<IUser | null> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error:any) {
        throw new Error(error.message);
    }
};
