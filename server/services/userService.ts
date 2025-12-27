import { IUser } from '../entities/IUser';
import { userRepository } from '../repositories/userRepository';
import { toggleUserStatusRepository, getStudentsByInstructorRepository, getStudentsChatRepository, getMyMessagesRepository, getStatsCountsRepository } from '../repositories/userRepository';

import bcrypt from 'bcrypt';

export const getUserProfileService = async (userId: string): Promise<IUser> => {
  try {
    const user = await userRepository.findUserById(userId);
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

export const updateUserProfile = async (userId: string, userData: Partial<IUser>): Promise<IUser | null> => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  Object.assign(user, userData);
  return userRepository.save(user);
}

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(userId, hashedPassword);
}

export const uploadUserImage = async (userId: string, imageUrl: string): Promise<IUser | null> => {
  const user = await userRepository.updateUser(userId, { image: imageUrl });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export const toggleUserStatusService = async (userId: string, isBlocked: boolean) => {
  try {
    const updatedUser = await toggleUserStatusRepository(userId, isBlocked);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    throw new Error('Failed to update user status');
  }
};

export const getStudentsByInstructorService = async (instructorId: string, page: string, limit: string) => {
  const result = await getStudentsByInstructorRepository(instructorId, page, limit);
  return result;
};

export const getStudentsChatService = async (instructorId: string) => {
  const orders = await getStudentsChatRepository(instructorId);
  if (orders.length === 0) {
    throw new Error('No students found for this instructor.');
  }
  return orders;
};

export const getMyMessagesService = async (senderId: string | undefined, receiverId: string | undefined) => {
  const messages = await getMyMessagesRepository(senderId, receiverId);
  return messages;
};

export const getStatsCountsService = async () => {
  const stats = await getStatsCountsRepository();
  return stats;
};
