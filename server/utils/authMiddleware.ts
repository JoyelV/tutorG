import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repositories/userRepository';
import { IUser } from '../entities/IUser';
import { instructorRepository } from '../repositories/instructorRepository';
import { adminRepository } from '../repositories/adminRepository';

export const studentAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication token missing' });
      return ;
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret not set');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };

    // Check if the user exists in the database
    const user = await userRepository.findUserById(decoded.id);
    if (!user) {
       res.status(404).json({ message: 'Student not found' });
       return;
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      res.status(403).json({ message: 'Student account is blocked' });
      return;
    }

    // Check if the user has a student role
    if (user.role !== 'user') {
      res.status(403).json({ message: 'Unauthorized: Not a student' });
      return ;
    }

    next(); // Pass control to the next middleware/route handler
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


export const tutorAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) : Promise<void> => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentication token missing' });
        return ;
      }
  
      const token = authHeader.split(' ')[1];
  
      // Verify JWT token
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret not set');
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
  
      // Check if the user exists in the database
      const user = await instructorRepository.findUserById(decoded.id);
      if (!user) {
         res.status(404).json({ message: 'Student not found' });
         return;
      }
  
      // Check if the user is blocked
      if (user.isBlocked) {
        res.status(403).json({ message: 'Student account is blocked' });
        return;
      }
  
      // Check if the user has a student role
      if (user.role !== 'instructor') {
        res.status(403).json({ message: 'Unauthorized: Not a student' });
        return ;
      }
  
      next(); // Pass control to the next middleware/route handler
    } catch (err) {
      console.error('Authentication error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  

  export const adminAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) : Promise<void> => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentication token missing' });
        return ;
      }
  
      const token = authHeader.split(' ')[1];
  
      // Verify JWT token
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret not set');
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
  
      // Check if the user exists in the database
      const user = await adminRepository.findUserById(decoded.id);
      if (!user) {
         res.status(404).json({ message: 'Student not found' });
         return;
      }
  
      // Check if the user has a student role
      if (user.role !== 'admin') {
        res.status(403).json({ message: 'Unauthorized: Not a student' });
        return ;
      }
  
      next(); // Pass control to the next middleware/route handler
    } catch (err) {
      console.error('Authentication error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };