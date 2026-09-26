import { useOutletContext } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import {
  Bookmark,
  ThumbsDown,
  Share2,
  MapPin,
  CheckCircle2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

const CandiateJobs = () => {
  const { darkMode } = useOutletContext();
  const { token, candiate } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);
  const [appliedMessage, setAppliedMessage] = useState("");
  const [applyError, setApplyError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // --------------------------------------------------
  // Search / Filters
  // --------------------------------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const jobsPerPage = 8;

  const candiateId = candiate?._id;

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getSafeText = (value, fallback = "") => {
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.label ||
        value.email ||
        value._id ||
        fallback
      );
    }

    return fallback;
  };

  const normalizeArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const formatArrayItem = (item) => {
    if (typeof item === "string" || typeof item === "number") {
      return String(item).replace(/^"|"$/g, "").trim();
    }

    if (item && typeof item === "object") {
      return (
        item.name ||
        item.title ||
        item.label ||
        item.description ||
        item.value ||
        item.email ||
        item._id ||
        ""
      );
    }

    return "";
  };

  const getApplicantCount = (job) => {
    if (!job) return 0;

    if (Array.isArray(job.candiatesApplied)) {
      return job.candiatesApplied.length;
    }

    if (typeof job.candiatesApplied === "number") {
      return job.candiatesApplied;
    }

    return 0;
  };

  const hasCandidateApplied = (job) => {
    if (!job || !candiateId) {
      return false;
    }

    if (typeof job.isApplied === "boolean") {
      return job.isApplied;
    }

    if (!Array.isArray(job.candiatesApplied)) {
      return false;
    }

    return job.candiatesApplied.some((application) => {
      if (!application) return false;

      const appliedCandidateId =
        typeof application.candiateId === "object"
          ? application.candiateId?._id
          : application.candiateId;

      return (
        appliedCandidateId &&
        String(appliedCandidateId) === String(candiateId)
      );
    });
  };

  const getCandidateApplication = (job) => {
  if (!job || !candiateId || !Array.isArray(job.candiatesApplied)) {
    return null;
  }

  return (
    job.candiatesApplied.find((application) => {
      const appliedCandidateId =
        typeof application?.candiateId === "object"
          ? application?.candiateId?._id
          : application?.candiateId;

      return (
        appliedCandidateId &&
        String(appliedCandidateId) === String(candiateId)
      );
    }) || null
  );
};
  // --------------------------------------------------
  // Fetch Jobs
  // --------------------------------------------------

  const fetchJobs = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: candiateId ? { candiateId } : {},
        }
      );

      const jobData =
        res.data?.data ||
        res.data?.info ||
        res.data ||
        [];

      const normalizedJobs = Array.isArray(jobData)
        ? jobData
        : [];

      setJobs(normalizedJobs);

      if (normalizedJobs.length > 0) {
        setSelectedJob(normalizedJobs[0]);
      } else {
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("Jobs Fetch Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load available openings. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [token, candiateId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // --------------------------------------------------
  // Dynamic Filter Options
  // --------------------------------------------------

  const jobTypes = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => getSafeText(job.type).trim())
          .filter(Boolean)
      ),
    ].sort();
  }, [jobs]);

  const locations = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => getSafeText(job.location).trim())
          .filter(Boolean)
      ),
    ].sort();
  }, [jobs]);

  const experiences = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => getSafeText(job.experience).trim())
          .filter(Boolean)
      ),
    ].sort();
  }, [jobs]);

  // --------------------------------------------------
  // Filter + Search + Sort
  // --------------------------------------------------

  const filteredJobs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = jobs.filter((job) => {
      const title = getSafeText(job.title).toLowerCase();
      const company = getSafeText(job.company).toLowerCase();
      const location = getSafeText(job.location).toLowerCase();
      const type = getSafeText(job.type).toLowerCase();
      const experience = getSafeText(job.experience).toLowerCase();
      const salary = getSafeText(job.salary).toLowerCase();
      const description = getSafeText(job.description).toLowerCase();

      const skills = normalizeArray(job.skills)
        .map(formatArrayItem)
        .join(" ")
        .toLowerCase();

      const searchableText = `
        ${title}
        ${company}
        ${location}
        ${type}
        ${experience}
        ${salary}
        ${description}
        ${skills}
      `.toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesType =
        jobTypeFilter === "all" ||
        type === jobTypeFilter.toLowerCase();

      const matchesLocation =
        locationFilter === "all" ||
        location === locationFilter.toLowerCase();

      const matchesExperience =
        experienceFilter === "all" ||
        experience === experienceFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesExperience
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "title") {
        return getSafeText(a.title).localeCompare(
          getSafeText(b.title)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
        );
      }

      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    });
  }, [
    jobs,
    searchTerm,
    jobTypeFilter,
    locationFilter,
    experienceFilter,
    sortBy,
  ]);

  // --------------------------------------------------
  // Reset Pagination
  // --------------------------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    jobTypeFilter,
    locationFilter,
    experienceFilter,
    sortBy,
  ]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  const indexOfLastJob =
    currentPage * jobsPerPage;

  const indexOfFirstJob =
    indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= totalPages
    ) {
      setCurrentPage(newPage);
    }
  };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters = () => {
    setSearchTerm("");
    setJobTypeFilter("all");
    setLocationFilter("all");
    setExperienceFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    jobTypeFilter !== "all" ||
    locationFilter !== "all" ||
    experienceFilter !== "all" ||
    sortBy !== "newest";

  // --------------------------------------------------
  // Job Selection
  // --------------------------------------------------

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setApplyError("");
    setAppliedMessage("");
    setIsModalOpen(true);
  };

  // --------------------------------------------------
  // Apply
  // --------------------------------------------------

  const handleApply = async (jobId) => {
    if (!token) {
      setApplyError("Please login to apply for this job.");
      return;
    }

    if (!candiateId) {
      setApplyError(
        "Candidate ID not found. Please login again."
      );
      return;
    }

    const currentJob = jobs.find(
      (job) => String(job._id) === String(jobId)
    );

    if (currentJob && hasCandidateApplied(currentJob)) {
      setApplyError("");

      setAppliedMessage(
        "You have already applied for this position."
      );

      return;
    }

    try {
      setApplying(true);
      setAppliedMessage("");
      setApplyError("");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}/apply`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            candiateId,
          },
        }
      );

      const updateJob = (job) => {
        const existingApplications =
          Array.isArray(job.candiatesApplied)
            ? job.candiatesApplied
            : [];

        return {
          ...job,
          isApplied: true,
          candiatesApplied: [
            ...existingApplications,
            {
              candiateId,
              status: "Applied",
            },
          ],
        };
      };

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          String(job._id) === String(jobId)
            ? updateJob(job)
            : job
        )
      );

      setSelectedJob((prevJob) =>
        prevJob &&
        String(prevJob._id) === String(jobId)
          ? updateJob(prevJob)
          : prevJob
      );

      setAppliedMessage(
        "Successfully applied to this position!"
      );

      setTimeout(() => {
        setAppliedMessage("");
      }, 4000);
    } catch (err) {
      console.error("Application Error:", err);

      const message =
        err.response?.data?.message ||
        "Failed to submit application.";

      if (
        message
          .toLowerCase()
          .includes("already applied")
      ) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            String(job._id) === String(jobId)
              ? {
                  ...job,
                  isApplied: true,
                }
              : job
          )
        );

        setSelectedJob((prevJob) =>
          prevJob &&
          String(prevJob._id) === String(jobId)
            ? {
                ...prevJob,
                isApplied: true,
              }
            : prevJob
        );

        setApplyError("");

        setAppliedMessage(
          "You have already applied for this position."
        );
      } else {
        setApplyError(message);
      }
    } finally {
      setApplying(false);
    }
  };

  // --------------------------------------------------
  // Job Details
  // --------------------------------------------------

  const renderJobDetails = (job) => {
    if (!job) return null;

    const applicantCount = getApplicantCount(job);
    const alreadyApplied = hasCandidateApplied(job);

    const candidateApplication = getCandidateApplication(job);

const applicationStatus =
  candidateApplication?.status || "Not Applied";

    const responsibilities =
      normalizeArray(job.responsibilities)
        .map(formatArrayItem)
        .filter(Boolean);

    const requirements =
      normalizeArray(job.requirements)
        .map(formatArrayItem)
        .filter(Boolean);

    const skills = normalizeArray(job.skills)
      .flatMap((skill) => {
        if (typeof skill === "string") {
          return skill
            .split('"')
            .map((item) => item.trim())
            .filter(Boolean);
        }

        return [formatArrayItem(skill)];
      })
      .filter(Boolean);

    const benefits = normalizeArray(job.benefits)
      .flatMap((benefit) => {
        if (typeof benefit === "string") {
          return benefit
            .split('"')
            .map((item) => item.trim())
            .filter(Boolean);
        }

        return [formatArrayItem(benefit)];
      })
      .filter(Boolean);

    const textSecondary = darkMode
      ? "text-gray-300"
      : "text-gray-700";

    const textMuted = darkMode
      ? "text-gray-400"
      : "text-gray-600";

    const badgeClass = darkMode
      ? "bg-gray-800 text-gray-300"
      : "bg-gray-100 text-gray-700";

    const actionButtonClass = darkMode
      ? "border-gray-700 text-gray-300 hover:bg-gray-800"
      : "border-gray-300 text-gray-700 hover:bg-gray-50";

    return (
      <div className="h-full">
        {/* Header */}
        <div
          className={`border-b pb-4 mb-4 ${
            darkMode
              ? "border-gray-800"
              : "border-gray-200"
          }`}
        >
          <h2 className="text-base sm:text-xl font-bold">
            {getSafeText(job.title, "Job Title")}
          </h2>

          <p
            className={`text-xs sm:text-sm mt-1 font-medium ${textSecondary}`}
          >
            {getSafeText(job.company, "Company Name")} &bull;{" "}
            {getSafeText(job.location, "Location")}
          </p>

          <p
            className={`text-xs sm:text-sm mt-1 font-semibold ${
              darkMode
                ? "text-blue-400"
                : "text-blue-600"
            }`}
          >
            {getSafeText(
              job.salary,
              "Competitive salary package"
            )}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-[10px] sm:text-xs">
            <span
              className={`px-2 py-1 rounded-md ${badgeClass}`}
            >
              {applicantCount} Applicants
            </span>

            {job.type && (
              <span
                className={`px-2 py-1 rounded-md ${badgeClass}`}
              >
                {getSafeText(job.type)}
              </span>
            )}

            {job.experience && (
              <span
                className={`px-2 py-1 rounded-md ${badgeClass}`}
              >
                Experience: {getSafeText(job.experience)}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApply(job._id)}
              disabled={applying || alreadyApplied}
              className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm font-semibold text-white transition flex items-center gap-2 ${
                alreadyApplied
                  ? "bg-emerald-600 cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {applying ? (
                <>
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                  Applying...
                </>
              ) : alreadyApplied ? (
                <>
                  <Check size={14} />
                  Applied
                </>
              ) : (
                "Apply now"
              )}
            </button>
              {alreadyApplied && (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] sm:text-xs font-semibold ${
      applicationStatus === "Selected"
        ? darkMode
          ? "bg-emerald-950/50 text-emerald-400"
          : "bg-emerald-50 text-emerald-700"
        : applicationStatus === "Rejected"
        ? darkMode
          ? "bg-red-950/50 text-red-400"
          : "bg-red-50 text-red-700"
        : applicationStatus === "Interview"
        ? darkMode
          ? "bg-purple-950/50 text-purple-400"
          : "bg-purple-50 text-purple-700"
        : darkMode
        ? "bg-blue-950/50 text-blue-400"
        : "bg-blue-50 text-blue-700"
    }`}
  >
    Status: {applicationStatus}
  </span>
)}

            {[Bookmark, ThumbsDown, Share2].map(
              (Icon, index) => (
                <button
                  key={index}
                  className={`p-1.5 sm:p-2 rounded-lg border transition cursor-pointer ${actionButtonClass}`}
                >
                  <Icon size={15} />
                </button>
              )
            )}
          </div>
        </div>

        {/* Error */}
        {applyError && (
          <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{applyError}</span>
          </div>
        )}

       

        {/* Scrollable Job Details */}
        <div className="space-y-4 max-h-[calc(100vh-190px)] overflow-y-auto pr-2 text-xs sm:text-sm">
          <h3 className="font-semibold text-sm">
            Job Description
          </h3>

          <p
            className={`leading-relaxed ${textMuted}`}
          >
            {getSafeText(
              job.description,
              "We are seeking a talented and motivated professional to join our dynamic team."
            )}
          </p>

          {/* Responsibilities */}
          {responsibilities.length > 0 && (
            <div className="pt-2">
              <h4 className="font-semibold mb-2">
                Roles & Responsibilities
              </h4>

              <ul
                className={`list-disc pl-5 space-y-2 ${textMuted}`}
              >
                {responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="pt-2">
              <h4 className="font-semibold mb-2">
                Skills Required
              </h4>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-[10px] font-medium border ${
                      darkMode
                        ? "bg-blue-950/50 text-blue-300 border-blue-900"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="pt-2">
              <h4 className="font-semibold mb-2">
                Requirements
              </h4>

              <ul
                className={`list-disc pl-5 space-y-2 ${textMuted}`}
              >
                {requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <div className="pt-2 pb-4">
              <h4 className="font-semibold mb-2">
                Perks & Benefits
              </h4>

              <ul
                className={`list-disc pl-5 space-y-2 ${textMuted}`}
              >
                {benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div
        className={`w-full min-h-[60vh] flex items-center justify-center ${
          darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        <div className="animate-pulse font-medium text-lg flex items-center gap-2">
          <Search
            className="animate-bounce"
            size={20}
          />
          Loading job opportunities...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 pb-12">
      {/* Header */}
      

      {/* Search + Filter Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2 w-full">
          {/* Search */}
          <div className="relative w-[45%] sm:flex-1 min-w-0">
            <Search
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode
                  ? "text-gray-500"
                  : "text-gray-400"
              }`}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search jobs, company..."
              className={`w-full pl-9 pr-8 py-2.5 rounded-lg border text-sm outline-none transition ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
              }`}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters */}
          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition ${
              showFilters
                ? "bg-blue-600 text-white border-blue-600"
                : darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>

            {[
              jobTypeFilter !== "all",
              locationFilter !== "all",
              experienceFilter !== "all",
            ].filter(Boolean).length > 0 && (
              <span
                className={`min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  showFilters
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
                }`}
              >
                {
                  [
                    jobTypeFilter !== "all",
                    locationFilter !== "all",
                    experienceFilter !== "all",
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative shrink-0">
            <ArrowUpDown
              size={14}
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                darkMode
                  ? "text-gray-500"
                  : "text-gray-400"
              }`}
            />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className={`appearance-none pl-8 pr-7 py-2.5 rounded-lg border text-xs sm:text-sm outline-none cursor-pointer ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-2 w-full overflow-hidden">
            <div
              className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide ${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              <select
                value={jobTypeFilter}
                onChange={(e) =>
                  setJobTypeFilter(e.target.value)
                }
                className={`shrink-0 w-[145px] px-3 py-2.5 rounded-lg border text-xs sm:text-sm outline-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <option value="all">All Types</option>

                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(e.target.value)
                }
                className={`shrink-0 w-[155px] px-3 py-2.5 rounded-lg border text-xs sm:text-sm outline-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <option value="all">
                  All Locations
                </option>

                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                ))}
              </select>

              <select
                value={experienceFilter}
                onChange={(e) =>
                  setExperienceFilter(e.target.value)
                }
                className={`shrink-0 w-[155px] px-3 py-2.5 rounded-lg border text-xs sm:text-sm outline-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <option value="all">
                  All Experience
                </option>

                {experiences.map((experience) => (
                  <option
                    key={experience}
                    value={experience}
                  >
                    {experience}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="shrink-0 px-3 py-2.5 rounded-lg border border-red-200 text-red-600 dark:border-red-900 dark:text-red-400 text-xs font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div
          className={`mt-2 text-xs ${
            darkMode
              ? "text-gray-500"
              : "text-gray-500"
          }`}
        >
          Showing{" "}
          <span className="font-semibold">
            {filteredJobs.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {jobs.length}
          </span>{" "}
          jobs
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Success */}
      {appliedMessage && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          {appliedMessage}
        </div>
      )}

      <h2
        className={`text-lg font-semibold mb-3 ${
          darkMode
            ? "text-gray-100"
            : "text-gray-900"
        }`}
      >
        Jobs for you
      </h2>

      {/* Main Job Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Job List */}
        <div className="lg:col-span-3 col-span-4 flex flex-col space-y-3">
          <div className="space-y-2">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => {
                const isSelected =
                  String(selectedJob?._id) ===
                  String(job._id);

                const alreadyApplied =
                  hasCandidateApplied(job);

                return (
                  <div
                    key={job._id}
                    onClick={() =>
                      handleSelectJob(job)
                    }
                    className={`cursor-pointer rounded-lg border p-2 sm:p-3 transition-all ${
                      darkMode
                        ? isSelected
                          ? "border-blue-500 bg-gray-800 shadow-sm ring-1 ring-blue-500"
                          : "border-gray-800 bg-gray-900 hover:border-gray-700"
                        : isSelected
                        ? "border-blue-600 bg-white shadow-sm ring-1 ring-blue-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-semibold text-xs sm:text-sm truncate ${
                            darkMode
                              ? "text-gray-100"
                              : "text-gray-900"
                          }`}
                        >
                          {getSafeText(
                            job.title,
                            "Job Title"
                          )}
                        </h3>

                        <p
                          className={`text-[11px] sm:text-xs truncate ${
                            darkMode
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {getSafeText(
                            job.company,
                            "Company Name"
                          )}
                        </p>

                        <div
                          className={`mt-1 flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] ${
                            darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1 truncate">
                            <MapPin
                              size={10}
                              className="shrink-0"
                            />

                            {getSafeText(
                              job.location,
                              "Location"
                            )}
                          </span>

                          

                          {alreadyApplied && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500 text-black dark:bg-emerald-950/50 dark:text-emerald-400 text-[9px] font-semibold">
                              <Check size={10} />
                              Applied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className={`p-6 text-center rounded-lg border text-xs ${
                  darkMode
                    ? "border-gray-800 bg-gray-900 text-gray-400"
                    : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                <Search
                  size={22}
                  className="mx-auto mb-2 opacity-50"
                />

                <p className="font-medium">
                  No jobs found
                </p>

                <p className="mt-1 opacity-75">
                  Try changing your search or filters.
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg border text-xs ${
                darkMode
                  ? "border-gray-800 bg-gray-900 text-gray-300"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <button
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                className={`p-1 rounded flex items-center font-medium transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                  darkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={14} />
              </button>

              <span className="text-[11px] font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages
                }
                className={`p-1 rounded flex items-center font-medium transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                  darkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Job Details */}
        <div
          className={`hidden lg:block lg:col-span-9 rounded-xl border p-5 sticky top-4 shadow-sm min-h-[calc(100vh-140px)] ${
            darkMode
              ? "border-gray-800 bg-gray-900 text-gray-100"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          {selectedJob ? (
            renderJobDetails(selectedJob)
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs sm:text-sm">
              Select a job from the list to view full
              description.
            </div>
          )}
        </div>
      </div>

      {/* Mobile Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 lg:hidden">
          <div
            className={`w-full max-h-[90vh] sm:max-w-xl rounded-t-2xl sm:rounded-2xl border shadow-xl flex flex-col overflow-hidden ${
              darkMode
                ? "border-gray-800 bg-gray-900 text-gray-100"
                : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div
              className={`flex items-center justify-between px-4 py-3 border-b ${
                darkMode
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                Job Overview
              </span>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className={`p-1.5 rounded-full transition cursor-pointer ${
                  darkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {renderJobDetails(selectedJob)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandiateJobs;