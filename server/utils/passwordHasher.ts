import bcrypt from 'bcrypt';

export const hashPassword = async (plainText: string): Promise<string> => {
  return await bcrypt.hash(plainText, 10);
};

export const verifyPassword = async (plainText: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainText, hashedPassword);
};
