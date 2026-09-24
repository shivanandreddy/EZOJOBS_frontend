import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";

const CandiateJobs = () => {
  const { darkMode, candidateName } = useOutletContext();
  const { token, candiate } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedMessage, setAppliedMessage] = useState("");

  // Pagination states (5 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Fetch Jobs List via Axios API
  const fetchJobs = async () => {
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
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
    } else {
      setLoading(false);
      setError("Authentication token not found.");
    }
  }, [token]);

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

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Browse curated openings matching your skillset and apply instantly.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-sm">
          {error}
        </div>
      )}

      {appliedMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={18} /> {appliedMessage}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Jobs for you</h2>

      {/* Split View Container with narrower left column (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Narrower Job Cards + Pagination */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => {
                const isSelected = selectedJob?._id === job._id;
                return (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className={`cursor-pointer rounded-lg border p-3 transition-all relative ${
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
                        
                        <h3 className="font-semibold text-xs sm:text-sm truncate">{job.title || "Job Title"}</h3>
                        <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {job.company || "Company Name"}
                        </p>
                        
                        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={11} className="shrink-0" /> {job.location || "Location"}
                          </span>
                          {job.salary && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                            }`}>
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>

                    
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`p-6 text-center rounded-lg border ${darkMode ? "border-gray-800 bg-gray-900 text-gray-400" : "border-gray-200 bg-white text-gray-500"}`}>
                No job postings currently available.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
              darkMode ? "border-gray-800 bg-gray-900 text-gray-300" : "border-gray-200 bg-white text-gray-700"
            }`}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-medium transition disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={15} /> Prev
              </button>

              <span className="text-xs font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-medium transition disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Job Description View Pane (col-span-8) */}
        <div className={`lg:col-span-9 rounded-xl border p-6 sticky top-6 shadow-sm ${
          darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
        }`}>
          {selectedJob ? (
            <div>
              {/* Job Title & Metadata */}
              <div className="border-b pb-5 mb-5 dark:border-gray-800">
                <h2 className="text-xl sm:text-2xl font-bold">{selectedJob.title}</h2>
                <p className={`text-sm mt-1 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {selectedJob.company} &bull; {selectedJob.location}
                </p>
                <p className={`text-sm mt-1 font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  {selectedJob.salary || "Competitive salary package"}
                </p>

                {/* Action Row */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleApply(selectedJob._id)}
                    disabled={applying}
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  >
                    {applying ? "Applying..." : "Apply now"}
                  </button>

                  <button 
                    className={`p-2.5 rounded-lg border transition ${
                      darkMode ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    title="Bookmark Job"
                  >
                    <Bookmark size={18} />
                  </button>

                  <button 
                    className={`p-2.5 rounded-lg border transition ${
                      darkMode ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    title="Not Interested"
                  >
                    <ThumbsDown size={18} />
                  </button>

                  <button 
                    className={`p-2.5 rounded-lg border transition ${
                      darkMode ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    title="Share Job"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Full Description & Responsibilities */}
              <div className="space-y-4 max-h-[calc(100vh-380px)] overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold">Full job description</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {selectedJob.description || "We are seeking a talented and motivated professional to join our dynamic development team. In this role, you will collaborate closely with cross-functional teams to build cutting-edge solutions."}
                </p>

                {selectedJob.responsibilities && (
                  <div className="pt-2">
                    <h4 className="font-semibold text-sm mb-2">Your responsibilities:</h4>
                    <ul className={`list-disc pl-5 space-y-1.5 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {Array.isArray(selectedJob.responsibilities) ? (
                        selectedJob.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))
                      ) : (
                        <li>{selectedJob.responsibilities}</li>
                      )}
                    </ul>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div className="pt-2">
                    <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                    <ul className={`list-disc pl-5 space-y-1.5 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {Array.isArray(selectedJob.requirements) ? (
                        selectedJob.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))
                      ) : (
                        <li>{selectedJob.requirements}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              Select a job from the list to view full description.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CandiateJobs;