import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignedInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch assigned interviews on mount
  useEffect(() => {
    fetchAssignedInterviews();
  }, []);

  const fetchAssignedInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/interviews`, config);
      setInterviews(res.data.data || []);
    } catch (err) {
      console.error("Error fetching assigned interviews:", err);
      setError("Failed to load assigned interviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (interviewId, roundNumber, newStatus) => {
    try {
      setError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Updated payload including interviewId to match your backend controller route requirement
      const payload = { interviewId, roundNumber, status: newStatus };

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/interviews/round-status`,
        payload,
        config
      );

      if (res.data.success) {
        setSuccessMessage("Interview round status updated successfully!");
        fetchAssignedInterviews(); // Refresh list
      }
    } catch (err) {
      console.error("Error updating round status:", err);
      setError(err.response?.data?.message || "Failed to update interview status.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-600 dark:text-slate-400">
        Loading assigned interviews...
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Assigned Interviews
        </h2>
        <button
          onClick={fetchAssignedInterviews}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg">
          {successMessage}
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">No interviews found assigned to you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => {
            const candidate = item.candiate || item.candidate;
            const job = item.job;

            return (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {candidate?.name || "Candidate Name"} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({candidate?.email})</span>
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                      Position: {job?.title} {job?.department ? `- ${job.department}` : ""}
                    </p>
                  </div>
                </div>

                {/* Rounds Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Interview Rounds & Schedule
                  </h4>
                  {item.rounds?.map((round, rIndex) => (
                    <div
                      key={rIndex}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            Round {round.roundNumber}: {round.roundName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Scheduled: {round.scheduledAt ? new Date(round.scheduledAt).toLocaleString() : "Not specified"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                          round.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                          round.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:text-red-900/40 dark:text-red-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {round.status || 'Pending'}
                        </span>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdateStatus(item._id, round.roundNumber, 'Accepted')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item._id, round.roundNumber, 'Rejected')}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedInterviews;