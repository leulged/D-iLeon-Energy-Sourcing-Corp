import nodemailer from "nodemailer";
import { IUser } from "../models/User";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env["EMAIL_SERVICE"] || "gmail",
      auth: {
        user: process.env["EMAIL_USER"],
        pass: process.env["EMAIL_PASSWORD"],
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: process.env["EMAIL_USER"],
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendVerificationEmail(user: IUser, token: string): Promise<void> {
    const verificationUrl = `${
      process.env["BACKEND_URL"] || "http://localhost:5000"
    }/api/auth/verify-email?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to D'iLeon Energy Sourcing Corp!</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The D'iLeon Team</p>
      </div>
    `;

    await this.sendEmail({
      to: user.email,
      subject: "Verify Your Email Address - D'iLeon Energy",
      html,
    });
  }

  async sendPasswordResetEmail(user: IUser, token: string): Promise<void> {
    const resetUrl = `${
      process.env["FRONTEND_URL"] || "http://localhost:3000"
    }/reset-password?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${user.firstName},</p>
        <p>You requested a password reset for your D'iLeon Energy account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The D'iLeon Team</p>
      </div>
    `;

    await this.sendEmail({
      to: user.email,
      subject: "Password Reset Request - D'iLeon Energy",
      html,
    });
  }
}

export const emailService = new EmailService();
