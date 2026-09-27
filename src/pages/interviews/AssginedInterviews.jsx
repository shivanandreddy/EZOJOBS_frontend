import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignedInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Candidate profile modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Evaluation Modal State
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalTarget, setEvalTarget] = useState({
    interviewId: null,
    roundNumber: null,
    status: "",
    maxPoints: 10,
  });
  const [scoredPoints, setScoredPoints] = useState("");
  const [remarkText, setRemarkText] = useState("");

  // Fetch assigned interviews
  useEffect(() => {
    fetchAssignedInterviews();
  }, []);

  const fetchAssignedInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/interviews`,
        config
      );

      setInterviews(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching assigned interviews:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load assigned interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open Evaluation Modal
  const handleOpenEvalModal = (interviewId, round, newStatus) => {
    setEvalTarget({
      interviewId,
      roundNumber: round.roundNumber,
      status: newStatus,
      maxPoints: round.maxPoints ?? 10,
    });
    setScoredPoints(round.scoredPoints !== undefined && round.scoredPoints !== null ? round.scoredPoints : "");
    setRemarkText(round.remark || ""); // Pre-fill with existing remark if available
    setShowEvalModal(true);
  };

  // Submit Evaluation (Points + Status + Remark)
  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        interviewId: evalTarget.interviewId,
        roundNumber: evalTarget.roundNumber,
        status: evalTarget.status,
        scoredPoints: scoredPoints !== "" ? Number(scoredPoints) : undefined,
        remark: remarkText,
      };

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/interviews/round-status`,
        payload,
        config
      );

      if (res.data.success) {
        setSuccessMessage(
          `Round ${evalTarget.roundNumber} marked as ${evalTarget.status} successfully.`
        );
        setShowEvalModal(false);
        await fetchAssignedInterviews();
      }
    } catch (err) {
      console.error("Error updating round evaluation:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update interview evaluation."
      );
    }
  };

  // Open candidate profile modal
  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  // Close candidate profile modal
  const handleCloseProfile = () => {
    setSelectedCandidate(null);
    setShowProfileModal(false);
  };

  // Status styling
  const getStatusClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300";
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "Selected":
      case "Shortlisted":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
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
    <>
      <div className="w-full text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Assigned Interviews
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View and manage interviews assigned to you.
            </p>
          </div>

          <button
            onClick={fetchAssignedInterviews}
            className="self-start sm:self-auto px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* No interviews */}
        {interviews.length === 0 ? (
          <div className="py-12 text-center border-t border-b border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              No interviews found assigned to you.
            </p>
          </div>
        ) : (
          <div className="border-t border-slate-200 dark:border-slate-800">
            {interviews.map((item) => {
              const candidate = item.candiate || item.candidate;
              const job = item.job;

              return (
                <div
                  key={item._id}
                  className="border-b border-slate-200 dark:border-slate-800 py-5"
                >
                  {/* Candidate + Job */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {candidate?.name || "Candidate Name"}
                        </h3>

                        {/* View Profile */}
                        <button
                          onClick={() => handleViewProfile(candidate)}
                          className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                        >
                          View Profile
                        </button>
                      </div>

                      {candidate?.email && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {candidate.email}
                        </p>
                      )}
                    </div>

                    <div className="lg:text-right">
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {job?.title || "Job Position"}
                      </p>
                      {job?.department && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {job.department}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rounds Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                          <th className="py-3 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                            Round
                          </th>
                          <th className="py-3 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                            Round Name
                          </th>
                          <th className="py-3 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                            Scheduled
                          </th>
                          <th className="py-3 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                            Score
                          </th>
                          <th className="py-3 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                            Status
                          </th>
                          <th className="py-3 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                            Remark
                          </th>
                          <th className="py-3 text-right font-semibold text-slate-600 dark:text-slate-400">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.rounds?.map((round, rIndex) => {
                          const status = round.status || "Scheduled";

                          return (
                            <tr
                              key={`${item._id}-${round.roundNumber}-${rIndex}`}
                              className="border-b last:border-b-0 border-slate-100 dark:border-slate-800/60"
                            >
                              <td className="py-4 pr-4 whitespace-nowrap">
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                  Round {round.roundNumber}
                                </span>
                              </td>
                              <td className="py-4 pr-4">
                                <span className="text-slate-700 dark:text-slate-300">
                                  {round.roundName || "-"}
                                </span>
                              </td>
                              <td className="py-4 pr-4 whitespace-nowrap">
                                <span className="text-slate-600 dark:text-slate-400">
                                  {round.scheduledAt
                                    ? new Date(
                                        round.scheduledAt
                                      ).toLocaleString()
                                    : "Not specified"}
                                </span>
                              </td>
                              <td className="py-4 pr-4 whitespace-nowrap">
                                <span className="text-slate-700 dark:text-slate-300 font-medium">
                                  {round.scoredPoints !== null && round.scoredPoints !== undefined
                                    ? `${round.scoredPoints} / ${round.maxPoints ?? 10}`
                                    : `- / ${round.maxPoints ?? 10}`}
                                </span>
                              </td>
                              <td className="py-4 pr-4">
                                <span
                                  className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                                    status
                                  )}`}
                                >
                                  {status}
                                </span>
                              </td>
                              <td className="py-4 pr-4 max-w-xs">
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate block" title={round.remark}>
                                  {round.remark ? round.remark : "No remark"}
                                </span>
                              </td>
                              <td className="py-4 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      handleOpenEvalModal(
                                        item._id,
                                        round,
                                        "Selected"
                                      )
                                    }
                                    disabled={
                                      status === "Selected" ||
                                      status === "Rejected"
                                    }
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors"
                                  >
                                    Select
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleOpenEvalModal(
                                        item._id,
                                        round,
                                        "Rejected"
                                      )
                                    }
                                    disabled={
                                      status === "Selected" ||
                                      status === "Rejected"
                                    }
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          EVALUATION MODAL (Points & Remark)
          ===================================================== */}
      {showEvalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowEvalModal(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white capitalize">
                Evaluate Round {evalTarget.roundNumber} ({evalTarget.status})
              </h3>
              <button
                onClick={() => setShowEvalModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Points Scored (Max: {evalTarget.maxPoints}) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={evalTarget.maxPoints}
                  required
                  value={scoredPoints}
                  onChange={(e) => setScoredPoints(e.target.value)}
                  placeholder={`Enter points (0 - ${evalTarget.maxPoints})`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Remark
                </label>
                <textarea
                  rows="4"
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Provide feedback or remarks about the candidate..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white text-xs font-medium rounded-lg transition-colors ${
                    evalTarget.status === "Selected"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  Submit & {evalTarget.status}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CANDIDATE PROFILE MODAL
          ===================================================== */}
      {showProfileModal && selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleCloseProfile}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Profile Header + Status Badge */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">
                  {selectedCandidate.profileImage ||
                  selectedCandidate.profilePicture ||
                  selectedCandidate.avatar ? (
                    <img
                      src={
                        selectedCandidate.profileImage ||
                        selectedCandidate.profilePicture ||
                        selectedCandidate.avatar
                      }
                      alt={selectedCandidate.name || "Candidate"}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {selectedCandidate.name?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedCandidate.name || "Candidate Name"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {selectedCandidate.email || "Email not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className="text-sm text-slate-400">Status</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-sm">
                  {selectedCandidate.overallStatus || selectedCandidate.status || "Shortlisted"}
                </span>
                <button
                  onClick={handleCloseProfile}
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Left Column: Candidate Information Fields */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">
                  Candidate Information
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Name</p>
                    <p className="font-medium text-white break-all">
                      {selectedCandidate.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs mb-1">Mobile</p>
                    <p className="font-medium text-white">
                      {selectedCandidate.mobile ||
                        selectedCandidate.mobileNumber ||
                        selectedCandidate.phone ||
                        selectedCandidate.phone_number ||
                        "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs mb-1">Experience</p>
                    <p className="font-medium text-white">
                      {selectedCandidate.experience !== undefined
                        ? selectedCandidate.experience
                        : "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs mb-1">Age</p>
                    <p className="font-medium text-white">
                      {selectedCandidate.age || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs mb-1">Gender</p>
                    <p className="font-medium text-white">
                      {selectedCandidate.gender || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs mb-1">Location</p>
                    <p className="font-medium text-white">
                      {selectedCandidate.location || "Not provided"}
                    </p>
                  </div>

                  
                </div>
              </div>

              {/* Right Column: Skills & Education Table */}
              <div className="lg:col-span-7 space-y-6">
                {/* Skills Section */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedCandidate.skills) ? (
                      selectedCandidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white"
                        >
                          {typeof skill === "string" ? skill : skill.name || "-"}
                        </span>
                      ))
                    ) : selectedCandidate.skills ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white">
                        {selectedCandidate.skills}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-500">
                        No skills provided
                      </span>
                    )}
                  </div>
                </div>

                {/* Education Section */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">
                    Education
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-800 text-slate-400">
                        <tr>
                          <th className="py-3 px-4 font-medium">Education</th>
                          <th className="py-3 px-4 font-medium">Institution</th>
                          <th className="py-3 px-4 font-medium">Branch</th>
                          <th className="py-3 px-4 font-medium">CGPA</th>
                          <th className="py-3 px-4 font-medium">Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {selectedCandidate.school && (
                          <tr>
                            <td className="py-3 px-4 font-semibold text-white">
                              School
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.school.schoolName || "-"}
                            </td>
                            <td className="py-3 px-4">-</td>
                            <td className="py-3 px-4">
                              {selectedCandidate.school.cgpa !== null &&
                              selectedCandidate.school.cgpa !== undefined
                                ? selectedCandidate.school.cgpa
                                : "-"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.school.completedYear || "-"}
                            </td>
                          </tr>
                        )}

                        {selectedCandidate.inter && (
                          <tr>
                            <td className="py-3 px-4 font-semibold text-white">
                              Intermediate
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.inter.collegeName || "-"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.inter.branch || "-"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.inter.cgpa !== null &&
                              selectedCandidate.inter.cgpa !== undefined
                                ? selectedCandidate.inter.cgpa
                                : "-"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.inter.startedYear &&
                              selectedCandidate.inter.endedYear
                                ? `${selectedCandidate.inter.startedYear} - ${selectedCandidate.inter.endedYear}`
                                : selectedCandidate.inter.endedYear || "-"}
                            </td>
                          </tr>
                        )}

                        {selectedCandidate.graduation && (
                          <tr>
                            <td className="py-3 px-4 font-semibold text-white">
                              {selectedCandidate.graduation.type || "Graduation"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.graduation.organisationName || "-"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.graduation.branch || "-"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.graduation.cgpa !== null &&
                              selectedCandidate.graduation.cgpa !== undefined
                                ? selectedCandidate.graduation.cgpa
                                : "-"}
                            </td>
                            <td className="py-3 px-4">
                              {selectedCandidate.graduation.startedYear &&
                              selectedCandidate.graduation.endedYear
                                ? `${selectedCandidate.graduation.startedYear} - ${selectedCandidate.graduation.endedYear}`
                                : selectedCandidate.graduation.endedYear || "-"}
                            </td>
                          </tr>
                        )}

                        {!selectedCandidate.school &&
                          !selectedCandidate.inter &&
                          !selectedCandidate.graduation && (
                            <tr>
                              <td
                                colSpan="5"
                                className="py-4 px-4 text-center text-slate-500"
                              >
                                No education details provided
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedInterviews;