import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
  X
} from "lucide-react";

const CandidateJobs = () => {
  const { darkMode, candidateName } = useOutletContext();
  const { token, candidate } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedMessage, setAppliedMessage] = useState("");

  // Pagination states (5 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Fetch Jobs List via Axios API
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, config);
      const jobData = res.data.data || res.data.info || res.data || [];
      
      setJobs(jobData);
      if (jobData.length > 0) {
        setSelectedJob(jobData[0]);
      }
    } catch (err) {
      console.error("Jobs Fetch Error:", err);
      setError("Failed to load available openings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchJobs();
    } else {
      setLoading(false);
      setError("Authentication token not found.");
    }
  }, [token, fetchJobs]);

  // Handle Job Selection & Mobile Modal Toggle
  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Handle Job Application
  const handleApply = async (jobId) => {
    try {
      setApplying(true);
      setAppliedMessage("");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/jobs/${jobId}/apply`, {}, config);
      setAppliedMessage("Successfully applied to this position!");
      setTimeout(() => setAppliedMessage(""), 4000);
    } catch (err) {
      console.error("Application Error:", err);
      alert(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className={`w-full min-h-[60vh] flex items-center justify-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        <div className="animate-pulse font-medium text-lg flex items-center gap-2">
          <Search className="animate-bounce" size={20} /> Loading job opportunities...
        </div>
      </div>
    );
  }

  // Reusable component content for the details view
  const renderJobDetails = (job) => {
    return (
      <div>
        <div className="border-b pb-3 mb-3 dark:border-gray-800">
          <h2 className="text-base sm:text-xl font-bold">{job.title}</h2>
          <p className={`text-xs sm:text-sm mt-0.5 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {job.company} &bull; {job.location}
          </p>
          <p className={`text-xs sm:text-sm mt-0.5 font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            {job.salary || "Competitive salary package"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApply(job._id)}
              disabled={applying}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {applying ? "Applying..." : "Apply now"}
            </button>

            <button className={`p-1.5 sm:p-2 rounded-lg border transition cursor-pointer ${darkMode ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-700"}`} title="Bookmark Job">
              <Bookmark size={15} />
            </button>

            <button className={`p-1.5 sm:p-2 rounded-lg border transition cursor-pointer ${darkMode ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-700"}`} title="Not Interested">
              <ThumbsDown size={15} />
            </button>

            <button className={`p-1.5 sm:p-2 rounded-lg border transition cursor-pointer ${darkMode ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-700"}`} title="Share Job">
              <Share2 size={15} />
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 text-xs sm:text-sm">
          <h3 className="font-semibold text-sm">Full job description</h3>
          <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {job.description || "We are seeking a talented and motivated professional to join our dynamic development team."}
          </p>

          {job.responsibilities && (
            <div className="pt-1">
              <h4 className="font-semibold mb-1">Your responsibilities:</h4>
              <ul className={`list-disc pl-4 space-y-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {Array.isArray(job.responsibilities) ? (
                  job.responsibilities.map((resp, idx) => <li key={idx}>{resp}</li>)
                ) : (
                  <li>{job.responsibilities}</li>
                )}
              </ul>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="pt-1">
              <h4 className="font-semibold mb-1">Required Skills:</h4>
              <ul className={`list-disc pl-4 space-y-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {job.skills
                  .flatMap(s => typeof s === 'string' ? s.split('"') : [s])
                  .filter(Boolean)
                  .map((skill, index) => (
                    <li key={index} >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                      <span>{String(skill).trim()}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {job.requirements && (
            <div className="pt-1">
              <h4 className="font-semibold mb-1">Requirements:</h4>
              <ul className={`list-disc pl-4 space-y-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {Array.isArray(job.requirements) ? (
                  job.requirements.map((req, idx) => <li key={idx}>{req}</li>)
                ) : (
                  <li>{job.requirements}</li>
                )}
              </ul>
            </div>
          )}

          

          {job.benefits &&
            job.benefits.length > 0 && (
              <div>
                <h2 className="font-semibold mb-1">
                  Perks & Benefits
                </h2>

                <ul className={`list-disc pl-4 space-y-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {job.benefits
                    .flatMap(b =>
                      typeof b === 'string'
                        ? b.split('"')
                        : [b]
                    )
                    .filter(Boolean)
                    .map((benefit) => (
                      <li
                        key={idx}
                        
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                        <span>{String(benefit).trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 pb-12">
      <div className="mb-4 flex flex-col gap-2">
        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Browse curated openings matching your skillset and apply instantly.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs">
          {error}
        </div>
      )}

      {appliedMessage && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 size={16} /> {appliedMessage}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">Jobs for you</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between space-y-2">
          <div className="space-y-2">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => {
                const isSelected = selectedJob?._id === job._id;
                return (
                  <div
                    key={job._id}
                    onClick={() => handleSelectJob(job)}
                    className={`cursor-pointer rounded-lg border p-2 sm:p-3 transition-all relative ${
                      darkMode 
                        ? isSelected ? "border-blue-500 bg-gray-800 shadow-sm ring-1 ring-blue-500" : "border-gray-800 bg-gray-900 hover:border-gray-700" 
                        : isSelected ? "border-blue-600 bg-white shadow-sm ring-1 ring-blue-600" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        {job.easilyApply !== false && (
                          <span className={`inline-block mb-1 px-1 py-0.5 text-[9px] sm:text-[10px] font-medium rounded ${
                            darkMode ? "bg-blue-950 text-blue-300" : "bg-blue-50 text-blue-700"
                          }`}>
                            Easily apply
                          </span>
                        )}
                        <h3 className="font-semibold text-xs sm:text-sm truncate">{job.title || "Job Title"}</h3>
                        <p className={`text-[11px] sm:text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {job.company || "Company Name"}
                        </p>
                        
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={10} className="shrink-0" /> {job.location || "Location"}
                          </span>
                          {job.salary && (
                            <span className={`px-1 py-0.5 rounded text-[9px] sm:text-[10px] font-medium truncate ${
                              darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                            }`}>
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <button onClick={(e) => { e.stopPropagation(); }} className={`p-1 rounded transition cursor-pointer ${darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`} title="Save Job">
                          <Bookmark size={12} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); }} className={`p-1 rounded transition cursor-pointer ${darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`} title="Not Interested">
                          <ThumbsDown size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`p-4 text-center rounded-lg border text-xs ${darkMode ? "border-gray-800 bg-gray-900 text-gray-400" : "border-gray-200 bg-white text-gray-500"}`}>
                No jobs available.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-2 py-1.5 rounded-lg border text-xs ${
              darkMode ? "border-gray-800 bg-gray-900 text-gray-300" : "border-gray-200 bg-white text-gray-700"
            }`}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1 rounded flex items-center font-medium transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              >
                <ChevronLeft size={14} />
              </button>

              <span className="text-[11px] font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1 rounded flex items-center font-medium transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className={`hidden lg:block lg:col-span-7 rounded-xl border p-5 sticky top-4 shadow-sm ${
          darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
        }`}>
          {selectedJob ? (
            renderJobDetails(selectedJob)
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs sm:text-sm">
              Select a job from the list to view full description.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 lg:hidden">
          <div className={`w-full max-h-[90vh] sm:max-w-xl rounded-t-2xl sm:rounded-2xl border shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 ${
            darkMode ? "border-gray-800 bg-gray-900 text-gray-100" : "border-gray-200 bg-white text-gray-900"
          }`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">Job Overview</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-full transition cursor-pointer ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-200 text-gray-600"}`}
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

export default CandidateJobs;