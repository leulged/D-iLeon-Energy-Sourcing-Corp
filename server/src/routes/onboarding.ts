import express from "express";
import multer from "multer";
import path from "path";
import { body } from "express-validator";
import {
  getOnboardingStatus,
  uploadDocument,
  submitOnboarding,
  getAllOnboarding,
  reviewOnboarding,
  getOnboardingById,
  getAdminSubmissions,
  bulkUpdateSubmissions,
  updateSubmissionStatus,
} from "../controllers/onboardingController";
import { authenticate } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";
import { OnboardingDocument } from "../models/Document";
import { Request, Response } from "express";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, JPG, PNG, and DOC files are allowed."
        )
      );
    }
  },
});

// Validation middleware
const documentTypeValidation = [
  body("documentType")
    .isIn([
      "businessLicense",
      "taxCertificate",
      "bankStatement",
      "identityDocument",
      "complianceCertificate",
      "insuranceCertificate",
      "financialStatement",
    ])
    .withMessage("Invalid document type"),
];

const reviewValidation = [
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be either 'approved' or 'rejected'"),
  body("comments")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Comments must be less than 1000 characters"),
];

// User routes (require authentication)
router.get("/status", authenticate, getOnboardingStatus);
router.post(
  "/upload",
  authenticate,
  upload.single("document"),
  documentTypeValidation,
  uploadDocument
);
router.post("/submit", authenticate, submitOnboarding);

// Admin routes (require admin authentication)
router.get("/admin/all", authenticate, isAdmin, getAllOnboarding);
router.get("/admin/submissions", authenticate, isAdmin, getAdminSubmissions);
router.get("/admin/:onboardingId", authenticate, isAdmin, getOnboardingById);
router.post(
  "/admin/:onboardingId/review",
  authenticate,
  isAdmin,
  reviewValidation,
  reviewOnboarding
);
router.put("/admin/bulk-update", authenticate, isAdmin, bulkUpdateSubmissions);
router.put(
  "/admin/:submissionId/status",
  authenticate,
  isAdmin,
  updateSubmissionStatus
);

// Document download route
router.get(
  "/documents/:documentId",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentId } = req.params;
      const document = await OnboardingDocument.findById(documentId);

      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }

      // Check if user is admin or owns the document
      if (
        req.user?.role !== "admin" &&
        document.userId.toString() !== req.user?.userId
      ) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      res.sendFile(path.resolve(document.filePath));
    } catch (error) {
      console.error("Document download error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
