import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
};

export const generateToken = (
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"]
): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
};
