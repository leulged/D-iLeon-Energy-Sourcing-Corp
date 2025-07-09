import mongoose, { Document, Schema } from "mongoose";

export interface IOnboarding extends Document {
  userId: mongoose.Types.ObjectId;
  userRole: "buyer" | "seller";
  status: "pending" | "in_progress" | "submitted" | "approved" | "rejected";
  progress: number; // 0-100
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    bankStatement?: string;
    identityDocument?: string;
    complianceCertificate?: string;
    insuranceCertificate?: string;
    financialStatement?: string;
    [key: string]: string | undefined;
  };
  verificationDetails: {
    businessVerified: boolean;
    financialVerified: boolean;
    complianceVerified: boolean;
    identityVerified: boolean;
  };
  adminReview: {
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    comments?: string;
    status: "pending" | "approved" | "rejected";
  };
  requirements: {
    businessLicense: { required: boolean; completed: boolean };
    taxCertificate: { required: boolean; completed: boolean };
    bankStatement: { required: boolean; completed: boolean };
    identityDocument: { required: boolean; completed: boolean };
    complianceCertificate: { required: boolean; completed: boolean };
    insuranceCertificate: { required: boolean; completed: boolean };
    financialStatement: { required: boolean; completed: boolean };
  };
  createdAt: Date;
  updatedAt: Date;
}

const onboardingSchema = new Schema<IOnboarding>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    userRole: {
      type: String,
      enum: ["buyer", "seller"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "submitted", "approved", "rejected"],
      default: "pending",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    documents: {
      businessLicense: String,
      taxCertificate: String,
      bankStatement: String,
      identityDocument: String,
      complianceCertificate: String,
      insuranceCertificate: String,
      financialStatement: String,
    },
    verificationDetails: {
      businessVerified: { type: Boolean, default: false },
      financialVerified: { type: Boolean, default: false },
      complianceVerified: { type: Boolean, default: false },
      identityVerified: { type: Boolean, default: false },
    },
    adminReview: {
      reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
      reviewedAt: Date,
      comments: String,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
    requirements: {
      businessLicense: {
        type: new Schema(
          {
            required: { type: Boolean, default: true },
            completed: { type: Boolean, default: false },
          },
          { _id: false }
        ),
        default: { required: true, completed: false },
      },
      taxCertificate: {
        type: new Schema(
          {
            required: { type: Boolean, default: true },
            completed: { type: Boolean, default: false },
          },
          { _id: false }
        ),
        default: { required: true, completed: false },
      },
      bankStatement: {
        type: new Schema(
          {
            required: { type: Boolean, default: true },
            completed: { type: Boolean, default: false },
          },
          { _id: false }
        ),
        default: { required: true, completed: false },
      },
      identityDocument: {
        type: new Schema(
          {
            required: { type: Boolean, default: true },
            completed: { type: Boolean, default: false },
          },
          { _id: false }
        ),
        default: { required: true, completed: false },
      },
      complianceCertificate: {
        type: new Schema(
          {
            required: { type: Boolean, default: true },
            completed: { type: Boolean, default: false },
          },
          { _id: false }
        ),
        default: { required: true, completed: false },
      },
      insuranceCertificate: {
        type: new Schema(
          {
            required: { type: Boolean, default: true },
            completed: { type: Boolean, default: false },
          },
          { _id: false }
        ),
        default: { required: true, completed: false },
      },
      financialStatement: {
        type: new Schema(
          {
            required: { type: Boolean, default: true },
            completed: { type: Boolean, default: false },
          },
          { _id: false }
        ),
        default: { required: true, completed: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
onboardingSchema.index({ userId: 1 });
onboardingSchema.index({ status: 1 });
onboardingSchema.index({ userRole: 1 });
onboardingSchema.index({ "adminReview.status": 1 });

export const Onboarding = mongoose.model<IOnboarding>(
  "Onboarding",
  onboardingSchema
);
