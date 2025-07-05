import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  verifyEmail,
  verifyEmailGet,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Validation middleware
const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be less than 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be less than 50 characters"),
  body("company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name must be less than 100 characters"),
  body("role")
    .optional()
    .isIn(["admin", "buyer", "seller", "analyst"])
    .withMessage("Invalid role"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const emailValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
];

const tokenValidation = [
  body("token").notEmpty().withMessage("Token is required"),
];

const passwordValidation = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const profileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be less than 50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be less than 50 characters"),
  body("company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name must be less than 100 characters"),
];

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/verify-email", tokenValidation, verifyEmail);
router.get("/verify-email", verifyEmailGet);
router.post("/resend-verification", emailValidation, resendVerificationEmail);
router.post("/forgot-password", emailValidation, forgotPassword);
router.post(
  "/reset-password",
  [...tokenValidation, ...passwordValidation],
  resetPassword
);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, profileValidation, updateProfile);

export default router;
 