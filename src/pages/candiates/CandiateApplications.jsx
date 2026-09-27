import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  CalendarDays,
  DollarSign,
  CheckCircle,
  XCircle,
  UserCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CandiateApplications = () => {
  const { darkMode } = useOutletContext();
  const { token, candiate } = useAuth();

  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Mobile modal
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const jobsPerPage = 6;

  const candiateId = candiate?._id;

  // --------------------------------------------------
  // GET ALL JOBS
  // --------------------------------------------------
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token || !candiateId) {
          setApplications([]);
          setSelectedJob(null);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              candiateId,
            },
          }
        );

        const jobs =
          response.data?.data ||
          response.data?.jobs ||
          response.data ||
          [];

        // --------------------------------------------------
        // ONLY JOBS WHERE CURRENT CANDIDATE HAS APPLIED
        // --------------------------------------------------
        const appliedJobs = jobs.filter((job) => {
          if (!Array.isArray(job.candiatesApplied)) {
            return false;
          }

          return job.candiatesApplied.some(
            (application) =>
              application?.candiateId &&
              String(
                typeof application.candiateId === "object"
                  ? application.candiateId?._id
                  : application.candiateId
              ) === String(candiateId)
          );
        });

        setApplications(appliedJobs);

        // Select first job automatically
        if (appliedJobs.length > 0) {
          setSelectedJob(appliedJobs[0]);
        } else {
          setSelectedJob(null);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load your applications."
        );

        setApplications([]);
        setSelectedJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token, candiateId]);

  // --------------------------------------------------
  // GET CURRENT CANDIDATE APPLICATION
  // --------------------------------------------------
  const getCandidateApplication = (job) => {
    if (!job || !Array.isArray(job.candiatesApplied)) {
      return null;
    }

    return (
      job.candiatesApplied.find((application) => {
        const applicationCandidateId =
          typeof application?.candiateId === "object"
            ? application?.candiateId?._id
            : application?.candiateId;

        return (
          applicationCandidateId &&
          String(applicationCandidateId) === String(candiateId)
        );
      }) || null
    );
  };

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return {
          className: darkMode
            ? "bg-green-900/40 text-green-300 border-green-800"
            : "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle,
        };

      case "Rejected":
        return {
          className: darkMode
            ? "bg-red-900/40 text-red-300 border-red-800"
            : "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
        };

      case "Shortlisted":
        return {
          className: darkMode
            ? "bg-blue-900/40 text-blue-300 border-blue-800"
            : "bg-blue-50 text-blue-700 border-blue-200",
          icon: UserCheck,
        };

      case "Interview":
        return {
          className: darkMode
            ? "bg-purple-900/40 text-purple-300 border-purple-800"
            : "bg-purple-50 text-purple-700 border-purple-200",
          icon: CalendarDays,
        };

      default:
        return {
          className: darkMode
            ? "bg-gray-800 text-gray-300 border-gray-700"
            : "bg-gray-100 text-gray-700 border-gray-200",
          icon: FileText,
        };
    }
  };

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------
  const totalPages = Math.ceil(
    applications.length / jobsPerPage
  );

  const currentJobs = useMemo(() => {
    const startIndex =
      (currentPage - 1) * jobsPerPage;

    return applications.slice(
      startIndex,
      startIndex + jobsPerPage
    );
  }, [applications, currentPage]);

  useEffect(() => {
    if (currentJobs.length > 0) {
      const selectedStillExists = currentJobs.some(
        (job) => job._id === selectedJob?._id
      );

      if (!selectedStillExists) {
        setSelectedJob(currentJobs[0]);
      }
    }
  }, [currentPage, applications]);

  // --------------------------------------------------
  // PAGINATION HANDLERS
  // --------------------------------------------------
  const goToPreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  };

  // --------------------------------------------------
  // MOBILE JOB CLICK
  // --------------------------------------------------
  const handleJobClick = (job) => {
    setSelectedJob(job);

    // Only open modal on mobile
    if (window.innerWidth < 1024) {
      setShowMobileDetails(true);
    }
  };

  // --------------------------------------------------
  // CLOSE MOBILE MODAL
  // --------------------------------------------------
  const closeMobileDetails = () => {
    setShowMobileDetails(false);
  };

  // --------------------------------------------------
  // COMMON TEXT COLORS
  // --------------------------------------------------
  const textPrimary = darkMode
    ? "text-gray-100"
    : "text-gray-900";

  const textSecondary = darkMode
    ? "text-gray-300"
    : "text-gray-700";

  const textMuted = darkMode
    ? "text-gray-400"
    : "text-gray-600";

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div
        className={`min-h-[calc(100vh-100px)] flex items-center justify-center ${
          darkMode
            ? "bg-gray-950"
            : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4 ${
              darkMode
                ? "border-gray-700 border-t-blue-500"
                : "border-gray-200 border-t-blue-600"
            }`}
          />

          <p className={textMuted}>
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className={`min-h-[calc(100vh-100px)] p-4 ${
          darkMode
            ? "bg-gray-950"
            : "bg-gray-50"
        }`}
      >
        <div
          className={`rounded-lg border p-4 ${
            darkMode
              ? "border-red-900 bg-red-950/30 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {error}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO APPLICATIONS
  // --------------------------------------------------
  if (applications.length === 0) {
    return (
      <div
        className={`min-h-[calc(100vh-100px)] p-4 ${
          darkMode
            ? "bg-gray-950"
            : "bg-gray-50"
        }`}
      >
        <div
          className={`rounded-xl border p-10 text-center ${
            darkMode
              ? "border-gray-800 bg-gray-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <FileText
            className={`w-12 h-12 mx-auto mb-4 ${
              darkMode
                ? "text-gray-600"
                : "text-gray-400"
            }`}
          />

          <h2
            className={`text-xl font-semibold mb-2 ${textPrimary}`}
          >
            No Applications Found
          </h2>

          <p className={textMuted}>
            You have not applied for any jobs yet.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // JOB DETAILS CONTENT
  // --------------------------------------------------
  const JobDetails = ({ mobile = false }) => {
    if (!selectedJob) return null;

    return (
      <div
        className={`${
          mobile
            ? "h-full overflow-y-auto"
            : "rounded-xl border p-4 sm:p-5 sticky top-4 min-h-[calc(100vh-140px)]"
        } ${
          !mobile &&
          (darkMode
            ? "border-gray-800 bg-gray-900 text-gray-100"
            : "border-gray-200 bg-white text-gray-900")
        }`}
      >
        {/* ==================================================
            MOBILE MODAL HEADER
        ================================================== */}
        {mobile && (
          <div
            className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b ${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${textPrimary}`}
            >
              Job Details
            </h2>

            <button
              onClick={closeMobileDetails}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className={mobile ? "p-4" : ""}>
          {/* ==================================================
              JOB HEADER
          ================================================== */}
          <div
            className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b ${
              darkMode
                ? "border-gray-800"
                : "border-gray-200"
            }`}
          >
            <div>
              <h2
                className={`text-xl sm:text-2xl font-bold ${textPrimary}`}
              >
                {selectedJob.title}
              </h2>

              <div
                className={`flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm ${textMuted}`}
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />

                  {selectedJob.company ||
                    "Company not specified"}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />

                  {selectedJob.location ||
                    "Location not specified"}
                </span>
              </div>
            </div>

            {/* APPLICATION STATUS */}
            {(() => {
              const application =
                getCandidateApplication(
                  selectedJob
                );

              const status =
                application?.status || "Applied";

              const statusStyle =
                getStatusStyle(status);

              const StatusIcon =
                statusStyle.icon;

              return (
                <span
                  className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${statusStyle.className}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {status}
                </span>
              );
            })()}
          </div>

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 py-5">
            {/* Job Type */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gray-50"
              }`}
            >
              <Briefcase
                className={`w-5 h-5 ${
                  darkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                }`}
              />

              <div>
                <p className={`text-xs ${textMuted}`}>
                  Job Type
                </p>

                <p
                  className={`text-sm font-medium ${textSecondary}`}
                >
                  {selectedJob.type ||
                    "Not specified"}
                </p>
              </div>
            </div>

            {/* Experience */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gray-50"
              }`}
            >
              <Clock
                className={`w-5 h-5 ${
                  darkMode
                    ? "text-purple-400"
                    : "text-purple-600"
                }`}
              />

              <div>
                <p className={`text-xs ${textMuted}`}>
                  Experience
                </p>

                <p
                  className={`text-sm font-medium ${textSecondary}`}
                >
                  {selectedJob.experience ||
                    "Not specified"}
                </p>
              </div>
            </div>

            {/* Salary */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gray-50"
              }`}
            >
              <DollarSign
                className={`w-5 h-5 ${
                  darkMode
                    ? "text-green-400"
                    : "text-green-600"
                }`}
              />

              <div>
                <p className={`text-xs ${textMuted}`}>
                  Salary
                </p>

                <p
                  className={`text-sm font-medium ${textSecondary}`}
                >
                  {selectedJob.salary ||
                    "Not specified"}
                </p>
              </div>
            </div>

            {/* Department */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gray-50"
              }`}
            >
              <Building2
                className={`w-5 h-5 ${
                  darkMode
                    ? "text-orange-400"
                    : "text-orange-600"
                }`}
              />

              <div>
                <p className={`text-xs ${textMuted}`}>
                  Department
                </p>

                <p
                  className={`text-sm font-medium ${textSecondary}`}
                >
                  {selectedJob.department ||
                    "Not specified"}
                </p>
              </div>
            </div>

            {/* Posted Date */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gray-50"
              }`}
            >
              <CalendarDays
                className={`w-5 h-5 ${
                  darkMode
                    ? "text-yellow-400"
                    : "text-yellow-600"
                }`}
              />

              <div>
                <p className={`text-xs ${textMuted}`}>
                  Posted Date
                </p>

                <p
                  className={`text-sm font-medium ${textSecondary}`}
                >
                  {selectedJob.postedDate
                    ? new Date(
                        selectedJob.postedDate
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "Not specified"}
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gray-50"
              }`}
            >
              <CalendarDays
                className={`w-5 h-5 ${
                  darkMode
                    ? "text-red-400"
                    : "text-red-600"
                }`}
              />

              <div>
                <p className={`text-xs ${textMuted}`}>
                  Application Deadline
                </p>

                <p
                  className={`text-sm font-medium ${textSecondary}`}
                >
                  {selectedJob.deadline
                    ? new Date(
                        selectedJob.deadline
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}
          <div className="mb-6">
            <h3
              className={`text-lg font-semibold mb-2 ${textPrimary}`}
            >
              Job Description
            </h3>

            <p
              className={`text-sm leading-6 whitespace-pre-line ${textSecondary}`}
            >
              {selectedJob.description ||
                "No description provided."}
            </p>
          </div>

          {/* ==================================================
              RESPONSIBILITIES
          ================================================== */}
          {Array.isArray(
            selectedJob.responsibilities
          ) &&
            selectedJob.responsibilities.length >
              0 && (
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-2 ${textPrimary}`}
                >
                  Responsibilities
                </h3>

                <ul className="space-y-2">
                  {selectedJob.responsibilities.map(
                    (item, index) => (
                      <li
                        key={index}
                        className={`flex gap-2 text-sm ${textSecondary}`}
                      >
                        <span className="text-blue-500 mt-1">
                          •
                        </span>

                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* ==================================================
              REQUIREMENTS
          ================================================== */}
          {Array.isArray(
            selectedJob.requirements
          ) &&
            selectedJob.requirements.length > 0 && (
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-2 ${textPrimary}`}
                >
                  Requirements
                </h3>

                <ul className="space-y-2">
                  {selectedJob.requirements.map(
                    (item, index) => (
                      <li
                        key={index}
                        className={`flex gap-2 text-sm ${textSecondary}`}
                      >
                        <span className="text-blue-500 mt-1">
                          •
                        </span>

                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* ==================================================
              SKILLS
          ================================================== */}
          {Array.isArray(selectedJob.skills) &&
            selectedJob.skills.length > 0 && (
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-3 ${textPrimary}`}
                >
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-gray-800 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* ==================================================
              BENEFITS
          ================================================== */}
          {Array.isArray(selectedJob.benefits) &&
            selectedJob.benefits.length > 0 && (
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-2 ${textPrimary}`}
                >
                  Benefits
                </h3>

                <ul className="space-y-2">
                  {selectedJob.benefits.map(
                    (item, index) => (
                      <li
                        key={index}
                        className={`flex gap-2 text-sm ${textSecondary}`}
                      >
                        <span className="text-green-500 mt-1">
                          ✓
                        </span>

                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* ==================================================
              JOB INFORMATION
          ================================================== */}
          <div
            className={`pt-4 border-t ${
              darkMode
                ? "border-gray-800"
                : "border-gray-200"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p
                  className={`text-xs ${textMuted}`}
                >
                  Job ID
                </p>

                <p
                  className={`text-sm font-medium mt-1 break-all ${textSecondary}`}
                >
                  {selectedJob.jobId ||
                    selectedJob._id}
                </p>
              </div>

              <div>
                <p
                  className={`text-xs ${textMuted}`}
                >
                  Current Job Status
                </p>

                <p
                  className={`text-sm font-medium mt-1 ${textSecondary}`}
                >
                  {selectedJob.status ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------
  return (
    <div
      className={`min-h-[calc(100vh-100px)] p-3 sm:p-4 ${
        darkMode
          ? "bg-gray-950"
          : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-4">
          <h1
            className={`text-xl sm:text-2xl font-bold ${textPrimary}`}
          >
            My Applications
          </h1>

          <p
            className={`text-sm mt-1 ${textMuted}`}
          >
            View your applied jobs and application
            status.
          </p>
        </div>

        {/* ==================================================
            DESKTOP + MOBILE JOB LIST
        ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ==================================================
              LEFT SIDE
          ================================================== */}
          <div className="lg:col-span-4">
            <div
              className={`rounded-xl border p-3 ${
                darkMode
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  className={`font-semibold ${textPrimary}`}
                >
                  Applied Jobs
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {applications.length}
                </span>
              </div>

              {/* JOB LIST */}
              <div className="space-y-2">
                {currentJobs.map((job) => {
                  const application =
                    getCandidateApplication(job);

                  const status =
                    application?.status ||
                    "Applied";

                  const statusStyle =
                    getStatusStyle(status);

                  const StatusIcon =
                    statusStyle.icon;

                  const isSelected =
                    selectedJob?._id === job._id;

                  return (
                    <div
                      key={job._id}
                      onClick={() =>
                        handleJobClick(job)
                      }
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        darkMode
                          ? isSelected
                            ? "border-blue-500 bg-gray-800 ring-1 ring-blue-500"
                            : "border-gray-800 bg-gray-900 hover:border-gray-700"
                          : isSelected
                          ? "border-blue-600 bg-white ring-1 ring-blue-600"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {/* TITLE */}
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`font-semibold text-sm line-clamp-2 ${textPrimary}`}
                        >
                          {job.title}
                        </h3>

                        <span
                          className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium ${statusStyle.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />

                          {status}
                        </span>
                      </div>

                      {/* COMPANY */}
                      <div
                        className={`flex items-center gap-1 mt-2 text-xs ${textMuted}`}
                      >
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />

                        <span className="truncate">
                          {job.company ||
                            "Company not specified"}
                        </span>
                      </div>

                      {/* LOCATION */}
                      <div
                        className={`flex items-center gap-1 mt-1 text-xs ${textMuted}`}
                      >
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />

                        <span className="truncate">
                          {job.location ||
                            "Location not specified"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div
                  className={`flex items-center justify-between mt-4 pt-3 border-t ${
                    darkMode
                      ? "border-gray-800"
                      : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed ${
                      darkMode
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span
                    className={`text-xs ${textMuted}`}
                  >
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={
                      currentPage === totalPages
                    }
                    className={`p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed ${
                      darkMode
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              DESKTOP RIGHT SIDE
              HIDDEN ON MOBILE
          ================================================== */}
          <div className="hidden lg:block lg:col-span-8">
            <JobDetails />
          </div>
        </div>
      </div>

      {/* ==================================================
          MOBILE JOB DETAILS MODAL
      ================================================== */}
      {showMobileDetails && selectedJob && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileDetails}
          />

          {/* MODAL */}
          <div className="absolute inset-x-3 top-3 bottom-3 sm:inset-x-5 sm:top-5 sm:bottom-5">
            <div
              className={`h-full overflow-hidden rounded-xl shadow-2xl ${
                darkMode
                  ? "bg-gray-900"
                  : "bg-white"
              }`}
            >
              <JobDetails mobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandiateApplications;