import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Edit,
  Share2,
  XCircle,
  X,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Building,
  Sparkles
} from 'lucide-react';

const ViewJob = ({ onBack }) => {
  const { id } = useParams();

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  const handleBackNavigation = () => {
    if (typeof onBack === 'function') {
      onBack();
    } else if (navigate) {
      navigate(-1);
    } else {
      window.history.back();
    }
  };

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  let userRole = '';

  try {
    if (userStr) userRole = JSON.parse(userStr).role;
  } catch (e) {
    // fallback
  }

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);

        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs/${id}`,
          config
        );

        const fetchedJob =
          response.data.data ||
          response.data.info ||
          response.data;

        setJob(fetchedJob);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(
          "Failed to load job details. Please check if the job ID is correct."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id, token]);

  const handleApply = async () => {
    if (!token) {
      navigate('/ezohr/login');
      return;
    }

    try {
      setIsApplying(true);
      setApplyError("");
      setApplySuccess("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs/${id}/apply`,
        {},
        config
      );

      setHasApplied(true);
      setApplySuccess("Application submitted successfully!");
    } catch (err) {
      console.error("Apply Error:", err);

      setApplyError(
        err.response?.data?.message ||
        "Failed to submit application. You may have already applied."
      );
    } finally {
      setIsApplying(false);
    }
  };

  const getShareLink = () => {
    if (!job) return '';

    return `${window.location.origin}/ezohr/candiate/jobs/${
      job._id || job.jobId
    }`;
  };

  const handleCopyLink = () => {
    const linkToCopy = getShareLink();

    navigator.clipboard.writeText(linkToCopy);

    setCopied(true);

    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center gap-3 ">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-500" />

        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Loading job details...
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl  text-left space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />

            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Could Not Load Job
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error || "Job not found."}
          </p>

          <button
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const jobStatus = job.status
    ? job.status.toLowerCase()
    : 'active';

  const isActiveStatus =
    jobStatus === 'active' || jobStatus === 'open';

  const formatUserField = (userField) => {
    if (!userField) return 'N/A';

    if (typeof userField === 'object') {
      return (
        userField.name ||
        userField.email ||
        userField._id ||
        'Unknown'
      );
    }

    return userField;
  };

  return (
    <div className="min-h-screen w-full 0 text-slate-900 dark:text-slate-100 transition-colors duration-200 ">

      {/* LEFT-ALIGNED CONTENT LAYOUT */}
      <div className="w-full max-w-5xl px-6 lg:px-8 space-y-8">

        {/* Top Actions & Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Jobs
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Share2 size={16} />
              Share
            </button>

            {userRole === 'employer' || userRole === 'admin' ? (
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition cursor-pointer">
                <Edit size={16} />
                Edit Job
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={isApplying || hasApplied}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white transition ${
                  hasApplied
                    ? 'bg-emerald-600 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
                }`}
              >
                {isApplying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Applying...
                  </>
                ) : hasApplied ? (
                  <>
                    <Check size={16} />
                    Applied Successfully
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Apply Now
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Status / Success Messages */}
        {applyError && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{applyError}</span>
          </div>
        )}

        {applySuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{applySuccess}</span>
          </div>
        )}

        {/* Header Section */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${
                isActiveStatus
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400'
              }`}
            >
              {job.status || 'Active'}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              ID: {job.jobId || job._id}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Building2
                size={16}
                className="text-slate-400 dark:text-slate-500"
              />
              <span>{job.department || "Engineering"}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className="text-slate-400 dark:text-slate-500"
              />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock
                size={16}
                className="text-slate-400 dark:text-slate-500"
              />
              <span>{job.type}</span>
            </div>

            <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
              <Users size={16} />
              <span>{job.applicantsCount ?? 0} Applicants</span>
            </div>

            <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
              <Building size={16} />
              <span>{job.company || "Ezo Jobs"}</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Inline Key Info Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Salary
            </p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {job.salary}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Experience
            </p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {job.experience}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Posted Date
            </p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {job.postedDate ||
                (job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString()
                  : 'N/A')}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deadline
            </p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {job.deadline || 'N/A'}
            </p>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Job Description
          </h2>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {job.description
              ? job.description.replace(/^"|"$/g, '')
              : "No description provided."}
          </p>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities &&
          job.responsibilities.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Key Responsibilities
              </h2>

              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                    />

                    <span>
                      {typeof item === 'string'
                        ? item.replace(/^"|"$/g, '')
                        : JSON.stringify(item)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Requirements */}
        {job.requirements &&
          job.requirements.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Requirements & Qualifications
              </h2>

              <ul className="space-y-2">
                {job.requirements.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                    />

                    <span>
                      {typeof item === 'string'
                        ? item.replace(/^"|"$/g, '')
                        : JSON.stringify(item)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => {
                const skillText = typeof skill === 'string' 
                  ? skill.replace(/^"|"$/g, '') 
                  : (skill.name || JSON.stringify(skill));
                  
                return (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                  >
                    {skillText}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits &&
          job.benefits.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Perks & Benefits
              </h2>

              <ul className="space-y-2">
                {job.benefits
                  .flatMap(b =>
                    typeof b === 'string'
                      ? b.split('"')
                      : [b]
                  )
                  .filter(Boolean)
                  .map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />

                      <span>{String(benefit).trim()}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

        {/* Metadata */}
        <div className="flex items-center justify-between py-4 border-y border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Created By
            </p>

            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatUserField(job.createdBy)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-500 dark:text-slate-400">
              Last Updated By
            </p>

            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatUserField(job.updatedBy)}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          {userRole === 'employer' || userRole === 'admin' ? (
            <>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition cursor-pointer">
                View All Applicants ({job.applicantsCount ?? 0})
              </button>

              <button className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 transition cursor-pointer">
                <XCircle size={16} />
                Close Position
              </button>
            </>
          ) : (
            <button
              onClick={handleApply}
              disabled={isApplying || hasApplied}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition ${
                hasApplied
                  ? 'bg-emerald-600 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
              }`}
            >
              {isApplying ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Submitting Application...
                </>
              ) : hasApplied ? (
                <>
                  <Check size={16} />
                  Applied Successfully
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Apply for this Position
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Share Job Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />

                <h2 className="text-lg font-bold">
                  Share Job Opening
                </h2>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Anyone with this link can view this job position and apply directly.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareLink()}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-200 select-all focus:outline-none"
                />

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Share via
                </p>

                <div className="flex gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      'Check out this job opening: ' +
                      job.title +
                      ' - ' +
                      getShareLink()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-lg transition"
                  >
                    WhatsApp
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      getShareLink()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-xs font-medium rounded-lg transition"
                  >
                    LinkedIn
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      'Job Opportunity: ' + job.title
                    )}&body=${encodeURIComponent(
                      'Check out this job opening: ' +
                      getShareLink()
                    )}`}
                    className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition"
                  >
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewJob;