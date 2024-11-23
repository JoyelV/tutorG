import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (payload: object, expiresIn: string): string=> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    return 'Invalid or expired token';
  }
};
