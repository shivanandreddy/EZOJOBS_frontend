import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FileEdit, 
  Building2, 
  MapPin, 
  Clock, 
  Search, 
  Send, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  AlertCircle,
  Calendar
} from 'lucide-react';

const DraftJobs = ({ onEditDraftClick }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch jobs and filter strictly by status=Draft from the API response
  const fetchDrafts = async () => {
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs?status=Draft`);
      
      const rawData = response.data?.data || response.data || [];
      const jobsList = Array.isArray(rawData) ? rawData : [];

      const draftList = jobsList.filter(
        (job) => job.status && job.status === 'Draft'
      );

      setDrafts(draftList);
    } catch (err) {
      console.error('Error fetching draft jobs:', err);
      setError('Failed to load draft jobs from the server. Please try again.');
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  // Filter drafts based on user search input
  const filteredDrafts = drafts.filter((draft) =>
    (draft.title && draft.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (draft.jobId && draft.jobId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (draft.department && draft.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Publish Draft Handler (Updates status to Active using axios.patch)
  const handlePublish = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Sends a PATCH request to change the status to Active
      await axios.patch(`${import.meta.env.VITE_API_URL}/jobs/update/${id}/status`, { 
        status: 'Active' 
      }, config);

      // Remove the published draft from the local state list immediately
      setDrafts((prev) => prev.filter((d) => d._id !== id && d.jobId !== id));
      
      alert('Draft successfully published as an active job listing!');
    } catch (err) {
      console.error('Failed to publish draft:', err);
      alert('Failed to publish the draft. Please check your network or API endpoint.');
    }
  };

  // Delete Draft Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
      setDrafts((prev) => prev.filter((d) => d._id !== id && d.jobId !== id));
    } catch (err) {
      console.error('Failed to delete draft:', err);
      alert('Failed to delete the draft item.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full gap-6 overflow-y-auto">
      
      {/* Top Header & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-blue-500 font-extrabold text-xl tracking-tight">
            <FileEdit size={24} />
            <span>Draft Jobs</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review, edit, or publish saved job listing drafts from your database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080e1b] pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <button
            onClick={fetchDrafts}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080e1b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh Drafts"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-amber-500' : ''} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw size={18} className="animate-spin text-amber-500" />
          <span className="text-xs font-medium">Fetching draft jobs...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredDrafts.length === 0 && (
        <div className="text-center py-20 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0b1220]">
          <FileEdit size={36} className="mx-auto mb-2 text-slate-400" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">No Draft Jobs Found</h3>
          <p className="text-xs mt-1 text-slate-500">
            There are currently no job postings with a status of 'Draft' in your system.
          </p>
        </div>
      )}

      {/* Drafts Grid */}
      {!loading && !error && filteredDrafts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredDrafts.map((draft) => (
            <div
              key={draft._id || draft.jobId}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-gradient-to-b dark:from-[#0e1628] dark:to-[#090f1e] p-6 shadow-sm hover:shadow-md transition space-y-4 border-l-4 border-l-blue-500 dark:border-l-blue-500"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {draft.status || 'Draft'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {draft.jobId || 'N/A'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {draft.title}
                </h3>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Building2 size={13} className="text-amber-500 shrink-0" />
                    <span>{draft.department || 'General'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-purple-500 shrink-0" />
                    <span className="truncate">{draft.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-blue-500 shrink-0" />
                    <span>{draft.type || 'Full-time'} {draft.experience ? `• ${draft.experience}` : ''}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Updated: {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{draft.salary || 'Competitive'}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/ezohr/jobs/edit/${draft._id || draft.jobId}`}
                    onClick={() => onEditDraftClick && onEditDraftClick(draft)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#121c32] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Edit3 size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handlePublish(draft._id || draft.jobId)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 px-3 py-2 text-xs font-semibold text-white transition shadow-sm"
                    title="Publish Job"
                  >
                    <Send size={14} />
                    Publish
                  </button>
                  <button
                    onClick={() => handleDelete(draft._id || draft.jobId)}
                    className="flex items-center justify-center p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                    title="Delete Draft"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DraftJobs;