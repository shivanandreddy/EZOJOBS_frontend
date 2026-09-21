import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Users,
  Search,
  Plus,
  Calendar,
  XCircle,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit2Icon
} from 'lucide-react';
import { jobStatus } from '../../enums.js'; 
import { useUser } from '../../context/UserContext';

const ManageJobs = ({ onCreateJobClick, onViewJobClick }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const userRole = user?.role;

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch jobs from Express Backend
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`);
      if (response.data && response.data.data) {
        setJobs(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle direct inline status update from job card dropdown
  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/update/${jobId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state immediately
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId || job.jobId === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      console.error('Error updating job status:', err);
      alert('Failed to update job status. Please try again.');
    }
  };

  // Client-side Filtering
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || job.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Calculate Pagination Slices safely
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, departmentFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Close Position Handler
  const handleCloseJob = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === id || job.jobId === id ? { ...job, status: 'Closed' } : job
        )
      );
    } catch (err) {
      alert('Failed to close job position.');
    }
  };

  // Delete Job Handler
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id && job.jobId !== id));
    } catch (err) {
      alert(`Failed to delete job posting: ${err.message}`);
    }
  };

  return (
    <div className="w-full bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="w-full space-y-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Manage Job Postings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View, filter, and control active job listings across departments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchJobs}
              className="flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#080d1a] px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Refresh Listings"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              onClick={onCreateJobClick}
              to="/ezohr/jobs/create"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-sm"
            >
              <Plus size={16} />
              Post New Job
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, location, or Job ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#080d1a] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#080d1a] px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition"
            >
              <option value="All">All Statuses</option>
              {Object.values(jobStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#080d1a] px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 space-x-3 text-slate-500 dark:text-slate-400">
            <RefreshCw size={20} className="animate-spin text-blue-500" />
            <span>Loading job postings...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="p-4 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
            <Briefcase size={36} className="mx-auto mb-3 text-slate-400 dark:text-slate-600" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">No Jobs Found</h3>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && !error && paginatedJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedJobs.map((job) => {
              const jobIdParam = job._id || job.jobId;
              return (
                <div
                  key={jobIdParam}
                  className="flex flex-col justify-between rounded-lg border border-slate-200 dark:border-slate-800/80 bg-blue-50/50 dark:bg-[#080d1a] p-6 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-sm transition space-y-5"
                >
                  {/* Header & Badges */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          job.status === 'Active'
                            ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-200/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {job.status}
                      </span>

                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {job.jobId}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-500 line-clamp-1">
                      {job.title}
                    </h3>

                    {/* Meta Information List */}
                    <div className="space-y-2 text-xs pt-1 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
                        <span>{job.type} • {job.experience}</span>
                      </div>
                      

                      {/* HR/Admin Status Update Dropdown (Border Removed) */}
                      {(userRole === 'hr' || userRole === 'admin') && (
                        <div className="flex items-center    border-slate-200/60 dark:border-slate-800/60 mt-2">
                          <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400">Status:</span>
                          <select
                            value={job.status || 'Active'}
                            onChange={(e) => handleStatusUpdate(jobIdParam, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent border-0 py-0.5 px-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0 cursor-pointer"
                          >
                            <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Active</option>
                            <option value="Paused" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Paused</option>
                            <option value="Closed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Closed</option>
                            <option value="Draft" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Draft</option>
                          </select>
                        </div>
                      )}

                      <div className="flex items-center gap-2 font-medium text-orange-600 dark:text-orange-400 mt-2">
                        Salary:
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {job.salary}
                      </span>
                        </div>
                    </div>
                  </div>

                  {/* Footer Metadata & Controls */}
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>Created: {job.createdAt ? job.createdAt.split('T')[0] : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>Deadline: {job.deadline}</span>
                      </div>
                      
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <Link 
                        to={`/ezohr/jobs/${jobIdParam}`}
                        onClick={() => onViewJobClick && onViewJobClick(job)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0c1426] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Eye size={14} />
                        View
                      </Link>

                      <button
                        onClick={() => handleCloseJob(jobIdParam)}
                        className="flex items-center justify-center p-1.5 rounded-md border border-amber-500/50 text-amber-600 dark:text-amber-500 hover:bg-amber-500/10 transition"
                        title="Close Position"
                      >
                        <XCircle size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(jobIdParam)}
                        className="flex items-center justify-center p-1.5 rounded-md border border-red-500/50 text-red-600 dark:text-red-500 hover:bg-red-500/10 transition"
                        title="Delete Posting"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && filteredJobs.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-medium text-slate-700 dark:text-slate-200">{startIndex + 1}</span> to{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {Math.min(startIndex + itemsPerPage, filteredJobs.length)}
              </span>{' '}
              of <span className="font-medium text-slate-700 dark:text-slate-200">{filteredJobs.length}</span> jobs
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 p-2 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#080d1a] font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-md font-medium text-xs transition ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#080d1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 p-2 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#080d1a] font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageJobs;