import { Request, Response, NextFunction } from "express";
import { verifyToken, JWTPayload } from "../utils/jwt";
import { User } from "../models/User";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      res
        .status(401)
        .json({ message: "User not found or account deactivated." });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export const requireEmailVerification = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user?.isEmailVerified) {
    _res.status(403).json({ message: "Email verification required." });
    return;
  }
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Insufficient permissions." });
      return;
    }

    next();
  };
};

// Specific role middleware
export const requireAdmin = requireRole(["admin"]);
export const requireBuyer = requireRole(["buyer", "admin"]);
export const requireSeller = requireRole(["seller", "admin"]);
export const requireAnalyst = requireRole(["analyst", "admin"]);

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.userId).select("-password");
      if (user && user.isActive) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
