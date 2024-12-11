import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  userId?: string; 
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  console.log("refreshToken in verifytoken file",refreshToken);

  if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token is required' });
      return ;
  }

  try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      console.log("decoded",decoded);

      const newToken = jwt.sign(
          { id: (decoded as any).id, role: (decoded as any).role },
          process.env.JWT_SECRET!,
          { expiresIn: '15m' } 
      );
      console.log("called refereshtoken",newToken);

      res.status(200).json({ token: newToken });
  } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
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
    console.log(decoded,"decoded hii first");
    
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      res.status(403).json({ message: 'Invalid token payload' });
      return;
    }
    req.userId = decoded.id as string; 
    console.log(req.userId,"req.userId");
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};

