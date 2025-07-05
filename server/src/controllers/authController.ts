import { Request, Response } from "express";
import { User } from "../models/User";
import {
  generateToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
} from "../utils/jwt";
import { emailService } from "../utils/email";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, company, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
      return;
    }

    // Create verification token
    const verificationToken = generateEmailVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      company,
      role: role || "buyer",
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({ message: "Account is deactivated." });
      return;
    }

    // Verify password
    const isPasswordValid = await user["comparePassword"](password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    // Prevent login if email is not verified
    if (!user.isEmailVerified) {
      res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyEmailGet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ message: "Invalid verification token." });
      return;
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Redirect to frontend with success message
    const frontendUrl = process.env["FRONTEND_URL"] || "http://localhost:3000";
    res.redirect(`${frontendUrl}/verify-email?token=${token}&verified=true`);
  } catch (error) {
    console.error("Email verification error:", error);
    const frontendUrl = process.env["FRONTEND_URL"] || "http://localhost:3000";
    res.redirect(`${frontendUrl}/verify-email?error=verification_failed`);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ message: "Email is already verified." });
      return;
    }

    // Generate new verification token
    const verificationToken = generateEmailVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    res.json({ message: "Verification email sent successfully." });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
      return;
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      res.status(500).json({ message: "Failed to send password reset email." });
      return;
    }

    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token." });
      return;
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, company } = req.body;

    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (company !== undefined) user.company = company;

    await user.save();

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
