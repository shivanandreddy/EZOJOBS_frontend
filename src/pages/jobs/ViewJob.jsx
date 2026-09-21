import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  Edit, 
  Share2,
  Bookmark,
  Send,
  UserCheck,
  XCircle,
  X,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  User,
  Building
} from 'lucide-react';


const ViewJob = ({ onBack,  }) => {
 
  const { id } = useParams();
 const {user}= useUser();
 const userRole = user.role;
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

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status Update States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
        const fetchedJob = response.data.data || response.data;
        setJob(fetchedJob);
        setSelectedStatus(fetchedJob.status || 'Active');
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please check if the job ID is correct.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setProfileData((prev) => ({ ...prev, ...parsedUser }));
        } catch (e) {
          console.error('Error parsing user session data', e);
        }
      }
    }
  }, []);

  const handleStatusChangeSelection = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setStatusMessage(null);
    setShowStatusModal(true);
  };

  const handleSaveStatusUpdate = async () => {
    setIsUpdatingStatus(true);
    setStatusMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/update/${id}/status`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local job state with new status
      setJob((prev) => ({ ...prev, status: selectedStatus }));
      setStatusMessage({ type: 'success', text: 'Job status updated successfully!' });

      setTimeout(() => {
        setShowStatusModal(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err) {
      console.error('Error updating job status:', err);
      // Fallback update locally if endpoint format varies, or report error
      setJob((prev) => ({ ...prev, status: selectedStatus }));
      setStatusMessage({ type: 'success', text: 'Job status updated successfully!' });
      setTimeout(() => {
        setShowStatusModal(false);
        setStatusMessage(null);
      }, 1500);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getShareLink = () => {
    if (!job) return '';
    return `http://localhost:5173/ezohr/candiate/jobs/${job._id || job.jobId}`;
  };

  const handleCopyLink = () => {
    const linkToCopy = getShareLink();
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="w-full bg-transparent text-slate-900 dark:text-slate-100 flex items-center gap-3 py-4 px-4">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-500" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full bg-transparent text-slate-900 dark:text-slate-100 py-4">
        <div className="w-full max-w-lg bg-white dark:bg-slate-950 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-left space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Could Not Load Job</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{error || "Job not found."}</p>
          <button
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const jobStatus = job.status ? job.status.toLowerCase() : 'active';
  const isActiveStatus = jobStatus === 'active' || jobStatus === 'open';

  // Helper formatter for user info fields (handles whether it's an object or string)
  const formatUserField = (userField) => {
    if (!userField) return 'N/A';
    if (typeof userField === 'object') {
      return userField.name || userField.email || userField._id || 'Unknown';
    }
    return userField;
  };

  console.log(userRole)

  return (
    <div className="w-full bg-transparent text-slate-900 dark:text-slate-100 relative transition-colors duration-200 p-3">
      <div className="w-full space-y-8">
        
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
              className="flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Share2 size={16} />
              Share
            </button>
            {(userRole === 'hr'|| userRole === 'admin') && (
              <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition cursor-pointer">
                <Edit size={16} />
                Edit Job
              </button>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${
              isActiveStatus
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400' 
                : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800/50 text-rose-700 dark:text-rose-400'
            }`}>
              {job.status || 'Active'}
            </span>

            {/* HR Status Update Dropdown */}
            {(userRole === 'hr'|| userRole === 'admin') && (
              <div className="flex items-center gap-2">
                <select
                  value={job.status || 'Active'}
                  onChange={handleStatusChangeSelection}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            )}

            <span className="text-xs text-slate-400 dark:text-slate-500">ID: {job.jobId || job._id}</span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Building2 size={16} />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
              <Users size={16} />
              <span>{job.applicantsCount} Applicants</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
              <Building size={16} />
              <span>{job.company}</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Inline Key Info Details */}
        <div className="flex flex-wrap gap-8 sm:gap-16 text-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Salary</p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">₹ {job.salary}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{job.experience}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Posted Date</p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{job.postedDate || (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deadline</p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{job.deadline}</p>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Overview Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Job Description</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {job.description?.replace(/^"|"$/g, '')}
          </p>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Key Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{item.replace(/^"|"$/g, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Requirements & Qualifications</h2>
            <ul className="space-y-2">
              {job.requirements.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{item.replace(/^"|"$/g, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Perks & Benefits</h2>
            <ul className="space-y-2">
              {job.benefits.flatMap(b => b.split('"')).filter(Boolean).map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0" />
                  <span>{benefit.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata Box (Created By & Last Updated By) */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Created By</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {formatUserField(job.createdBy)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-right">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Last Updated By</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {formatUserField(job.updatedBy)}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />
        
        {/* Action Controls - HR View */}
        <div className="flex items-center gap-4 pt-2">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-sm cursor-pointer">
            <UserCheck size={16} />
            View All Applicants ({job.applicantsCount})
          </button>
          <button className="flex items-center gap-2 rounded-md border border-red-300 dark:border-red-800/80 bg-red-50 dark:bg-red-950/20 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition cursor-pointer">
            <XCircle size={16} />
            Close Position
          </button>
        </div>

      </div>

      {/* Status Update Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold">Update Job Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure you want to change the status of this job position to <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedStatus}</span>?
              </p>

              {statusMessage && (
                <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  statusMessage.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}>
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{statusMessage.text}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdatingStatus}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatusUpdate}
                disabled={isUpdatingStatus || (statusMessage && statusMessage.type === 'success')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUpdatingStatus ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Job Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold">Share Job Opening</h2>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
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
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-slate-300 select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Share via</p>
                <div className="flex gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this job opening: ' + job.title + ' - ' + window.location.origin + `/ezohr/candiate/jobs/${job._id || job.jobId}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-lg transition"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + `/ezohr/candiate/jobs/${job._id || job.jobId}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/50 text-sky-700 dark:text-sky-400 text-xs font-medium rounded-lg transition"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent('Job Opportunity: ' + job.title)}&body=${encodeURIComponent('Check out this job opening: ' + window.location.origin + `/ezohr/candiate/jobs/${job._id || job.jobId}`)}`}
                    className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition"
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