import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ScheduleInterview = () => {
  const navigate = useNavigate();

  // Form state
  const [candidate, setCandidate] = useState("");
  const [job, setJob] = useState("");
  const [rounds, setRounds] = useState([
    { roundNumber: 1, roundName: "Screening", interviewer: "", scheduledAt: "" }
  ]);

  // Dropdown data options loaded from backend
  const [candidatesList, setCandidatesList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [interviewersList, setInterviewersList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch dropdown dependencies on mount
useEffect(() => {
  const fetchMetadata = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // ================================
      // GET JOBS
      // ================================
      const jobsRes = await axios.get(
        "http://localhost:3000/api/jobs",
        config
      );

      const jobsData =
        jobsRes.data?.data ||
        jobsRes.data?.jobs ||
        jobsRes.data ||
        [];

      setJobsList(
        Array.isArray(jobsData)
          ? jobsData
          : []
      );

      // ================================
      // GET CANDIDATES
      // ================================
      const candidatesRes = await axios.get(
        "http://localhost:3000/api/candiates",
        config
      );

      const candidatesData =
        candidatesRes.data?.data ||
        candidatesRes.data?.candiates ||
        candidatesRes.data ||
        [];

      setCandidatesList(
        Array.isArray(candidatesData)
          ? candidatesData
          : []
      );

      // ================================
      // GET INTERVIEWERS
      // ================================
      const usersRes = await axios.get(
        "http://localhost:3000/api/candiates",
        config
      );

      const usersData =
        usersRes.data?.data ||
        usersRes.data ||
        [];

      const interviewers = (
        Array.isArray(usersData)
          ? usersData
          : []
      ).filter(
        (u) =>
          u.role?.toLowerCase() === "interviewer" ||
          u.role?.toLowerCase() === "hr"
      );

      setInterviewersList(interviewers);
    } catch (err) {
      console.error(
        "Error loading scheduling metadata:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load prerequisite data (jobs, candidates, or interviewers)."
      );
    }
  };

  fetchMetadata();
}, []);

  const handleAddRound = () => {
    setRounds([
      ...rounds,
      {
        roundNumber: rounds.length + 1,
        roundName: "",
        interviewer: "",
        scheduledAt: ""
      }
    ]);
  };

  const handleRemoveRound = (index) => {
    const updatedRounds = rounds.filter((_, i) => i !== index);
    const reindexedRounds = updatedRounds.map((r, i) => ({
      ...r,
      roundNumber: i + 1
    }));
    setRounds(reindexedRounds);
  };

  const handleRoundChange = (index, field, value) => {
    const updatedRounds = [...rounds];
    updatedRounds[index][field] = value;
    setRounds(updatedRounds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        candiate: candidate, // Using your project-wide custom field spelling key
        job,
        rounds
      };

      const res = await axios.post("http://localhost:3000/api/interviews", payload, config);

      if (res.data.success) {
        setSuccessMessage("Interview scheduled successfully!");
        setTimeout(() => {
          navigate("/interviews");
        }, 1500);
      }
    } catch (err) {
      console.error("Error scheduling interview:", err);
      setError(err.response?.data?.message || "An error occurred while scheduling the interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Schedule Interviews</h2>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Job Position:
            </label>
            <select
              value={job}
              onChange={(e) => setJob(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose Job --</option>
              {jobsList.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} - {j.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Candidate:
            </label>
            <select
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose Candidate --</option>
              {candidatesList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800 my-6" />

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Interview Rounds</h3>
          <button
            type="button"
            onClick={handleAddRound}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            + Add Another Round
          </button>
        </div>

        {rounds.map((round, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                Round {round.roundNumber}
              </span>
              {rounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRound(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Remove Round
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Round Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Technical Screening"
                  value={round.roundName}
                  onChange={(e) => handleRoundChange(index, "roundName", e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Assigned Interviewer:
                </label>
                <select
                  value={round.interviewer}
                  onChange={(e) => handleRoundChange(index, "interviewer", e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">-- Choose Interviewer --</option>
                  {interviewersList.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Scheduled Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={round.scheduledAt}
                  onChange={(e) => handleRoundChange(index, "scheduledAt", e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            {loading ? "Scheduling..." : "Save & Schedule Interview"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleInterview;