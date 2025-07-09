import mongoose, { Document, Schema } from "mongoose";

export interface IOnboardingDocument extends Document {
  userId: mongoose.Types.ObjectId;
  onboardingId: mongoose.Types.ObjectId;
  documentType: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
  uploadDate: Date;
  status: "pending" | "approved" | "rejected";
  adminReview?: {
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    comments?: string;
    status: "pending" | "approved" | "rejected";
  };
  createdAt: Date;
  updatedAt: Date;
}

const onboardingDocumentSchema = new Schema<IOnboardingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    onboardingId: {
      type: Schema.Types.ObjectId,
      ref: "Onboarding",
      required: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        "businessLicense",
        "taxCertificate",
        "bankStatement",
        "identityDocument",
        "complianceCertificate",
        "insuranceCertificate",
        "financialStatement",
      ],
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
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
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
onboardingDocumentSchema.index({ userId: 1 });
onboardingDocumentSchema.index({ onboardingId: 1 });
onboardingDocumentSchema.index({ documentType: 1 });
onboardingDocumentSchema.index({ status: 1 });
onboardingDocumentSchema.index({ uploadDate: 1 });

export const OnboardingDocument = mongoose.model<IOnboardingDocument>(
  "OnboardingDocument",
  onboardingDocumentSchema
);
