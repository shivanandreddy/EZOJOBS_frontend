import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateOverallInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Track updating state per interview to show loading feedback
  const [updatingId, setUpdatingId] = useState(null);

  const availableStatuses = ["In Progress", "Hired", "Rejected", "On Hold"];

  // Fetch all interviews on mount
  useEffect(() => {
    fetchAllInterviews();
  }, []);

  const fetchAllInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Calls your endpoint that returns all interviews for Admin/HR
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/interviews`,
        config
      );

      setInterviews(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError(
        err.response?.data?.message || "Failed to load interview records."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle updating overallStatus using your controller endpoint
  const handleStatusChange = async (interviewId, newStatus) => {
    try {
      setError("");
      setSuccessMessage("");
      setUpdatingId(interviewId);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = { overallStatus: newStatus };

      // Matches: PATCH /api/interviews/:id/overall-status (adjust if your route path differs)
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/interviews/${interviewId}/status`,
        payload,
        config
      );

      if (res.data.success) {
        setSuccessMessage(`Overall status updated to "${newStatus}" successfully.`);
        // Update local state instantly without full re-fetch
        setInterviews((prev) =>
          prev.map((item) =>
            item._id === interviewId
              ? { ...item, overallStatus: newStatus }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error updating overall status:", err);
      setError(
        err.response?.data?.message || "Failed to update overall interview status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Status Badge Styling Helper
  const getOverallStatusClass = (status) => {
    switch (status) {
      case "Hired":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      case "On Hold":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
      case "In Progress":
      default:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-600 dark:text-slate-400">
        Loading interview records...
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Manage Overall Interview Status
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review candidate processes and update their final company-wide interview status.
          </p>
        </div>

        <button
          onClick={fetchAllInterviews}
          className="self-start sm:self-auto px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
        >
          Refresh List
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Interviews Table */}
      {interviews.length === 0 ? (
        <div className="py-12 text-center border-t border-b border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">
            No interview records found in the system.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Candidate</th>
                  <th className="py-3 px-4 font-semibold">Job Position</th>
                  <th className="py-3 px-4 font-semibold">HR Assigned</th>
                  <th className="py-3 px-4 font-semibold">Rounds Completed</th>
                  <th className="py-3 px-4 font-semibold">Current Overall Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {interviews.map((item) => {
                  const candidate = item.candiate || item.candidate;
                  const job = item.job;
                  const hr = item.hr;
                  const currentStatus = item.overallStatus || "In Progress";
                  const isUpdating = updatingId === item._id;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Candidate info */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {candidate?.name || "Unknown Candidate"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {candidate?.email || "No email"}
                        </div>
                      </td>

                      {/* Job info */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-indigo-600 dark:text-indigo-400">
                          {job?.title || "N/A"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {job?.department || ""}
                        </div>
                      </td>

                      {/* HR Info */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        {hr?.name || "N/A"}
                      </td>

                      {/* Rounds progress */}
                      <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-300">
                        {item.rounds?.length || 0} rounds configured
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getOverallStatusClass(
                            currentStatus
                          )}`}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      {/* Action Dropdown */}
                      <td className="py-4 px-4 text-right">
                        <select
                          value={currentStatus}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value)
                          }
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
                        >
                          {availableStatuses.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        {isUpdating && (
                          <span className="block text-[10px] text-indigo-500 mt-1">
                            Updating...
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateOverallInterview;