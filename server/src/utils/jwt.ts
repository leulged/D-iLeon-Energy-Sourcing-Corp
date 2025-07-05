import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../models/User";

const JWT_SECRET: Secret = process.env["JWT_SECRET"] || "your-secret-key";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: (user._id as any).toString(),
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const generateEmailVerificationToken = (): string => {
  const options: SignOptions = {
    expiresIn: "24h",
  };
  return jwt.sign({}, JWT_SECRET, options);
};

export const generatePasswordResetToken = (): string => {
  const options: SignOptions = {
    expiresIn: "1h",
  };
  return jwt.sign({}, JWT_SECRET, options);
};
