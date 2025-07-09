import { Request, Response } from "express";
import { Onboarding } from "../models/Onboarding";
import { OnboardingDocument } from "../models/Document";
import { User } from "../models/User";

// Get onboarding status for current user
export const getOnboardingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let onboarding = await Onboarding.findOne({ userId }).populate("documents");

    if (!onboarding) {
      // Create new onboarding record if it doesn't exist
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      onboarding = new Onboarding({
        userId,
        userRole: user.role === "buyer" ? "buyer" : "seller",
        status: "in_progress",
        progress: 0,
      });
      await onboarding.save();
    }

    // Calculate progress
    const totalRequirements = Object.keys(onboarding.requirements).length;
    const completedRequirements = Object.values(onboarding.requirements).filter(
      (req) => req.completed
    ).length;
    const progress = Math.round(
      (completedRequirements / totalRequirements) * 100
    );

    onboarding.progress = progress;
    await onboarding.save();

    res.json({
      onboarding,
      progress,
      totalRequirements,
      completedRequirements,
    });
  } catch (error) {
    console.error("Get onboarding status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Upload document
export const uploadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { documentType } = req.body;
    const file = req.file;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Get or create onboarding record
    let onboarding = await Onboarding.findOne({ userId });
    if (!onboarding) {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      onboarding = new Onboarding({
        userId,
        userRole: user.role === "buyer" ? "buyer" : "seller",
        status: "in_progress",
      });
      await onboarding.save();
    }

    // Check if a document of this type already exists and remove it
    const existingDocId = onboarding.documents[documentType];
    if (existingDocId) {
      // Find and delete the existing document
      const existingDoc = await OnboardingDocument.findById(existingDocId);
      if (existingDoc) {
        // Delete the file from disk if it exists
        const fs = require("fs");
        if (fs.existsSync(existingDoc.filePath)) {
          fs.unlinkSync(existingDoc.filePath);
        }
        // Delete the document record
        await OnboardingDocument.findByIdAndDelete(existingDocId);
      }
    }

    // Create document record
    const document = new OnboardingDocument({
      userId,
      onboardingId: onboarding._id,
      documentType,
      fileName: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      filePath: file.path,
    });

    await document.save();

    // Update onboarding document reference
    onboarding.documents[documentType] = (document._id as any).toString();
    (onboarding.requirements as any)[documentType].completed = true;
    onboarding.status = "in_progress";

    // Calculate progress
    const totalRequirements = Object.keys(onboarding.requirements).length;
    const completedRequirements = Object.values(onboarding.requirements).filter(
      (req) => req.completed
    ).length;
    onboarding.progress = Math.round(
      (completedRequirements / totalRequirements) * 100
    );

    await onboarding.save();

    res.json({
      message: existingDocId
        ? "Document updated successfully"
        : "Document uploaded successfully",
      document,
      progress: onboarding.progress,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit onboarding for review
export const submitOnboarding = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const onboarding = await Onboarding.findOne({ userId });
    if (!onboarding) {
      res.status(404).json({ message: "Onboarding record not found" });
      return;
    }

    // Check if all required documents are uploaded
    const incompleteRequirements = Object.entries(
      onboarding.requirements
    ).filter(([_key, req]) => req.required && !req.completed);

    if (incompleteRequirements.length > 0) {
      res.status(400).json({
        message: "Please complete all required documents before submitting",
        incompleteRequirements: incompleteRequirements.map(([key]) => key),
      });
      return;
    }

    // Only allow submit if status is 'in_progress' or 'rejected'
    if (
      onboarding.status !== "in_progress" &&
      onboarding.status !== "rejected"
    ) {
      res
        .status(400)
        .json({ message: "You cannot submit onboarding at this stage." });
      return;
    }

    onboarding.status = "pending";
    onboarding.adminReview.status = "pending";
    await onboarding.save();

    res.json({
      message: "Onboarding submitted successfully for review",
      onboarding,
    });
  } catch (error) {
    console.error("Submit onboarding error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all onboarding records (admin only)
export const getAllOnboarding = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, role, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (role) filter.userRole = role;

    const skip = (Number(page) - 1) * Number(limit);

    const onboardingRecords = await Onboarding.find(filter)
      .populate("userId", "email firstName lastName company")
      .populate("adminReview.reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Onboarding.countDocuments(filter);

    res.json({
      onboardingRecords,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Get all onboarding error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Review onboarding (admin only)
export const reviewOnboarding = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    const { onboardingId } = req.params;
    const { status, comments } = req.body;

    if (!adminId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const onboarding = await Onboarding.findById(onboardingId);
    if (!onboarding) {
      res.status(404).json({ message: "Onboarding record not found" });
      return;
    }

    onboarding.adminReview = {
      reviewedBy: adminId as any, // Cast to ObjectId
      reviewedAt: new Date(),
      comments,
      status,
    };

    onboarding.status = status === "approved" ? "approved" : "rejected";
    await onboarding.save();

    res.json({
      message: `Onboarding ${status} successfully`,
      onboarding,
    });
  } catch (error) {
    console.error("Review onboarding error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get onboarding by ID (admin only)
export const getOnboardingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { onboardingId } = req.params;

    const onboarding = await Onboarding.findById(onboardingId)
      .populate("userId", "email firstName lastName company")
      .populate("adminReview.reviewedBy", "firstName lastName");

    if (!onboarding) {
      res.status(404).json({ message: "Onboarding record not found" });
      return;
    }

    // Get documents for this onboarding
    const documents = await OnboardingDocument.find({
      onboardingId: onboarding._id,
    });

    res.json({
      onboarding,
      documents,
    });
  } catch (error) {
    console.error("Get onboarding by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all submissions for admin review
export const getAdminSubmissions = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const onboardingRecords = await Onboarding.find()
      .populate("userId", "email firstName lastName company")
      .sort({ createdAt: -1 });

    // Transform data to match frontend expectations
    const submissions = onboardingRecords.map((record) => ({
      _id: record._id,
      userId: record.userId,
      userRole: record.userRole,
      status: record.status,
      progress: record.progress,
      requirements: record.requirements,
      user: record.userId, // This will be populated
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));

    res.json({ submissions });
  } catch (error) {
    console.error("Get admin submissions error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Bulk update submissions status
export const bulkUpdateSubmissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { submissionIds, status } = req.body;

    if (!submissionIds || !Array.isArray(submissionIds)) {
      res.status(400).json({ message: "Invalid submission IDs" });
      return;
    }

    if (!["approved", "rejected", "needs_info"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const result = await Onboarding.updateMany(
      { _id: { $in: submissionIds } },
      {
        status,
        "adminReview.status": status,
        "adminReview.reviewedBy": req.user?.userId,
        "adminReview.reviewedAt": new Date(),
      }
    );

    res.json({
      message: `Updated ${result.modifiedCount} submissions to ${status}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk update submissions error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update individual submission status
export const updateSubmissionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "needs_info"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const onboarding = await Onboarding.findById(submissionId);
    if (!onboarding) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    onboarding.status = status;
    onboarding.adminReview = {
      reviewedBy: req.user?.userId as any,
      reviewedAt: new Date(),
      status,
      comments: req.body.comments || "",
    };

    await onboarding.save();

    res.json({
      message: `Submission ${status} successfully`,
      onboarding,
    });
  } catch (error) {
    console.error("Update submission status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
