import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { decode } from 'punycode';
import Instructor from '../models/Instructor';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  userId?: string; 
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token is required' });
      return ;
  }

  try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

      const newToken = jwt.sign(
          { id: (decoded as any).id, role: (decoded as any).role },
          process.env.JWT_SECRET!,
          { expiresIn: '15m' } 
      );

      res.status(200).json({ token: newToken });
  } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      res.status(403).json({ message: 'Invalid token payload' });
      return;
    }
    req.userId = decoded.id as string; 

    if(decoded.role==='user'){
      const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({ message: 'User is blocked' });
      return;
    }
    }else if(decoded.role==='instructor'){
      const instructor = await Instructor.findById(decoded.id);

      if (!instructor) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      if (instructor.isBlocked) {
        res.status(403).json({ message: 'User is blocked' });
        return;
      }
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};

