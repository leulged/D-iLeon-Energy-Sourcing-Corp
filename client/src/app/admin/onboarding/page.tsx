"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OnboardingSubmission {
  _id: string;
  userId: string;
  userRole: "buyer" | "seller";
  status: "pending" | "approved" | "rejected" | "needs_info";
  progress: number;
  requirements: {
    companyIdentity: { completed: boolean; documents: string[] };
    authorityProof: { completed: boolean; documents: string[] };
    transactionDocs: { completed: boolean; documents: string[] };
    complianceDocs: { completed: boolean; documents: string[] };
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
  };
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminOnboardingPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<OnboardingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingSubmission, setViewingSubmission] =
    useState<OnboardingSubmission | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      if (role !== "admin") {
        router.push("/admin/login");
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/onboarding/admin/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    if (selectedItems.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/onboarding/admin/bulk-update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            submissionIds: selectedItems,
            status: action === "approve" ? "approved" : "rejected",
          }),
        }
      );

      if (response.ok) {
        setSelectedItems([]);
        fetchSubmissions();
      }
    } catch (error) {
      console.error("Error updating submissions:", error);
    }
  };

  const handleStatusUpdate = async (submissionId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/onboarding/admin/${submissionId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStatus =
      filterStatus === "all" || submission.status === filterStatus;
    const matchesRole =
      filterRole === "all" || submission.userRole === filterRole;
    const matchesSearch =
      submission.user.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.user.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.user.company.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesRole && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      case "needs_info":
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getRoleColor = (role: string) => {
    return role === "buyer"
      ? "bg-blue-600 text-white"
      : "bg-purple-600 text-white";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-yellow-300 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading onboarding submissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-yellow-300 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">
            Onboarding Review
          </h1>
          <div className="flex gap-4">
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction("approve")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Approve Selected ({selectedItems.length})
                </button>
                <button
                  onClick={() => handleBulkAction("reject")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Reject Selected ({selectedItems.length})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 rounded-xl p-6 mb-6 border border-yellow-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-yellow-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-yellow-700 rounded-lg text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_info">Needs Info</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-yellow-700 rounded-lg text-white"
              >
                <option value="all">All Roles</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchSubmissions}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-neutral-900 rounded-xl border border-yellow-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredSubmissions.length &&
                        filteredSubmissions.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(
                            filteredSubmissions.map((s) => s._id)
                          );
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="rounded border-yellow-700"
                    />
                  </th>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Company</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Progress</th>
                  <th className="px-6 py-4 text-left">Submitted</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-700">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-neutral-800">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(submission._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([
                              ...selectedItems,
                              submission._id,
                            ]);
                          } else {
                            setSelectedItems(
                              selectedItems.filter(
                                (id) => id !== submission._id
                              )
                            );
                          }
                        }}
                        className="rounded border-yellow-700"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">
                          {submission.user.firstName} {submission.user.lastName}
                        </div>
                        <div className="text-sm text-yellow-200">
                          {submission.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{submission.user.company}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          submission.userRole
                        )}`}
                      >
                        {submission.userRole}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-neutral-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${submission.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{submission.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingSubmission(submission)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          View
                        </button>
                        {submission.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(submission._id, "approved")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(submission._id, "rejected")
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12 text-yellow-200">
            No onboarding submissions found.
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-xl border border-yellow-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">
                  Onboarding Details
                </h2>
                <button
                  onClick={() => setViewingSubmission(null)}
                  className="text-yellow-300 hover:text-yellow-100"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    User Information
                  </h3>
                  <div className="bg-neutral-800 p-4 rounded-lg">
                    <p>
                      <strong>Name:</strong> {viewingSubmission.user.firstName}{" "}
                      {viewingSubmission.user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {viewingSubmission.user.email}
                    </p>
                    <p>
                      <strong>Company:</strong> {viewingSubmission.user.company}
                    </p>
                    <p>
                      <strong>Role:</strong> {viewingSubmission.userRole}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Status & Progress
                  </h3>
                  <div className="bg-neutral-800 p-4 rounded-lg">
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          viewingSubmission.status
                        )}`}
                      >
                        {viewingSubmission.status}
                      </span>
                    </p>
                    <p>
                      <strong>Progress:</strong> {viewingSubmission.progress}%
                    </p>
                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(
                        viewingSubmission.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Requirements & Documents
                </h3>
                <div className="space-y-4">
                  {Object.entries(viewingSubmission.requirements).map(
                    ([key, requirement]) => (
                      <div key={key} className="bg-neutral-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              requirement.completed
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {requirement.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                        {requirement.documents &&
                          requirement.documents.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-yellow-200 mb-2">
                                Documents:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {requirement.documents.map((doc, index) => (
                                  <a
                                    key={index}
                                    href={`${API_URL}/api/onboarding/documents/${doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-yellow-600 hover:bg-yellow-700 text-black px-3 py-1 rounded text-sm"
                                  >
                                    View Document {index + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setViewingSubmission(null)}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
                {viewingSubmission.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(viewingSubmission._id, "approved");
                        setViewingSubmission(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(viewingSubmission._id, "rejected");
                        setViewingSubmission(null);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 