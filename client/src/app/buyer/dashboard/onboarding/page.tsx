"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BuyerDashboardSidebar from "../../../components/BuyerDashboardSidebar";
import DashboardNavbar from "../../../components/DashboardNavbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface OnboardingStatus {
  onboarding: {
    status: string;
    progress: number;
    requirements: {
      [key: string]: { required: boolean; completed: boolean };
    };
  };
  progress: number;
  totalRequirements: number;
  completedRequirements: number;
}

const documentTypes = [
  {
    key: "businessLicense",
    label: "Business License",
    description: "Valid business license or registration certificate",
    required: true,
  },
  {
    key: "taxCertificate",
    label: "Tax Certificate",
    description: "Tax registration certificate or VAT certificate",
    required: true,
  },
  {
    key: "bankStatement",
    label: "Bank Statement",
    description: "Recent bank statement (last 3 months)",
    required: true,
  },
  {
    key: "identityDocument",
    label: "Identity Document",
    description: "Passport, national ID, or driver's license",
    required: true,
  },
  {
    key: "complianceCertificate",
    label: "Compliance Certificate",
    description: "Industry-specific compliance certificates",
    required: true,
  },
  {
    key: "insuranceCertificate",
    label: "Insurance Certificate",
    description: "Business insurance or liability insurance",
    required: true,
  },
  {
    key: "financialStatement",
    label: "Financial Statement",
    description: "Annual financial statements or audit reports",
    required: true,
  },
];

export default function BuyerOnboardingPage() {
  const router = useRouter();
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      if (role !== "buyer") {
        router.push("/login");
        return;
      }

      fetchOnboardingStatus();
    }
  }, [router]);

  const fetchOnboardingStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/onboarding/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOnboardingStatus(data);
      } else {
        setError("Failed to load onboarding status");
      }
    } catch {
      setError("Failed to load onboarding status");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    try {
      setUploading(documentType);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", documentType);

      const response = await fetch(`${API_URL}/api/onboarding/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(
          `Document uploaded successfully! Progress: ${data.progress}%`
        );
        fetchOnboardingStatus(); // Refresh status
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Upload failed");
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmitForReview = async () => {
    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/onboarding/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSuccess(
          "Onboarding submitted for review! You&apos;ll be notified once reviewed."
        );
        fetchOnboardingStatus(); // Refresh status
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Submission failed");
      }
    } catch {
      setError("Submission failed. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "submitted":
        return "text-yellow-400";
      case "in_progress":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-black text-white">
        <BuyerDashboardSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardNavbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p>Loading onboarding status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      <BuyerDashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        <main className="flex-1 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Onboarding Checklist</h1>
            <p className="text-neutral-400 mb-8">
              Complete all required documents to start trading on our platform
            </p>

            {/* Status and Progress */}
            {onboardingStatus && (
              <div className="bg-neutral-900 rounded-xl p-6 mb-8 border border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Progress Overview</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      onboardingStatus.onboarding.status
                    )}`}
                  >
                    {onboardingStatus.onboarding.status
                      .replace("_", " ")
                      .toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{onboardingStatus.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${onboardingStatus.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-neutral-400">
                  {onboardingStatus.completedRequirements} of{" "}
                  {onboardingStatus.totalRequirements} documents completed
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-900 text-white rounded p-4 mb-6 border border-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900 text-white rounded p-4 mb-6 border border-green-700">
                {success}
              </div>
            )}

            {/* Document Checklist */}
            <div className="grid gap-6">
              {documentTypes.map((doc) => {
                const isCompleted =
                  onboardingStatus?.onboarding.requirements[doc.key]
                    ?.completed || false;
                const isRequired = doc.required;

                return (
                  <div
                    key={doc.key}
                    className={`bg-neutral-900 rounded-xl p-6 border transition-all duration-200 ${
                      isCompleted
                        ? "border-green-600 bg-neutral-900/50"
                        : "border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`text-2xl ${
                              isCompleted
                                ? "text-green-400"
                                : "text-neutral-400"
                            }`}
                          >
                            {isCompleted ? "✅" : "📄"}
                          </span>
                          <h3 className="text-lg font-semibold">{doc.label}</h3>
                          {isRequired && (
                            <span className="px-2 py-1 bg-red-900 text-red-200 text-xs rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-400 text-sm">
                          {doc.description}
                        </p>
                      </div>

                      {!isCompleted && (
                        <div className="ml-4">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(doc.key, file);
                                }
                              }}
                              disabled={uploading === doc.key}
                            />
                            <div
                              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                uploading === doc.key
                                  ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                                  : "bg-orange-600 hover:bg-orange-700 text-white"
                              }`}
                            >
                              {uploading === doc.key
                                ? "Uploading..."
                                : "Upload"}
                            </div>
                          </label>
                        </div>
                      )}
                    </div>

                    {isCompleted && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <span>✓</span>
                        <span>Document uploaded successfully</span>
                        <label className="ml-4 cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(doc.key, file);
                              }
                            }}
                            disabled={uploading === doc.key}
                          />
                          <div
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                              uploading === doc.key
                                ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {uploading === doc.key ? "Uploading..." : "Replace"}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status and Submit Button Logic */}
            {onboardingStatus &&
            onboardingStatus.onboarding.status === "pending" ? (
              <div className="mt-8 bg-yellow-900/20 border border-yellow-700 rounded-xl p-6 text-center">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Under Review
                </h3>
                <p className="text-neutral-300">
                  Your onboarding has been submitted and is currently under
                  review by our team. You&apos;ll receive a notification once
                  the review is complete.
                </p>
              </div>
            ) : onboardingStatus && onboardingStatus.progress < 100 ? (
              <div className="mt-8">
                <button
                  className="px-8 py-3 font-semibold rounded-lg transition-colors bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  disabled
                >
                  Submit for Review
                </button>
                <div className="mt-4 bg-yellow-900/20 border border-yellow-700 rounded-xl p-6 text-center">
                  <h3 className="text-yellow-400 font-semibold mb-2">
                    Incomplete Onboarding
                  </h3>
                  <p className="text-neutral-300">
                    Please complete all required fields and upload all documents
                    before submitting for review.
                  </p>
                </div>
              </div>
            ) : onboardingStatus && onboardingStatus.progress === 100 ? (
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmitForReview}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Submit for Review
                </button>
                <p className="text-neutral-400 text-sm mt-2">
                  All documents uploaded. Submit for admin review to complete
                  onboarding.
                </p>
              </div>
            ) : null}

            {/* Status Messages */}
            {onboardingStatus &&
              onboardingStatus.onboarding.status === "approved" && (
                <div className="mt-8 bg-green-900/20 border border-green-700 rounded-xl p-6 text-center">
                  <h3 className="text-green-400 font-semibold mb-2">
                    Onboarding Approved!
                  </h3>
                  <p className="text-neutral-300">
                    Congratulations! Your onboarding has been approved. You can
                    now start trading on our platform.
                  </p>
                </div>
              )}

            {onboardingStatus &&
              onboardingStatus.onboarding.status === "rejected" && (
                <div className="mt-8 bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
                  <h3 className="text-red-400 font-semibold mb-2">
                    Onboarding Rejected
                  </h3>
                  <p className="text-neutral-300">
                    Your onboarding has been rejected. Please review the
                    feedback and resubmit your documents.
                  </p>
                </div>
              )}
            {onboardingStatus &&
              onboardingStatus.onboarding.status === "rejected" && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleSubmitForReview}
                    className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Resubmit for Review
                  </button>
                  <p className="text-neutral-400 text-sm mt-2">
                    You can update your documents and resubmit for admin review.
                  </p>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
