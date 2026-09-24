import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    salary: "",
    deadline: "",
    status: "Active",
    description: "",
    company: "",
    responsibilities: [""],
    requirements: [""],
    benefits: [""],
    skills: [""]
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch job details on mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`, config);
        const job = res.data.data || res.data;

        setFormData({
          title: job.title || "",
          department: job.department || "",
          location: job.location || "",
          type: job.type || "Full-time",
          experience: job.experience || "",
          salary: job.salary || "",
          deadline: job.deadline ? job.deadline.split("T")[0] : "",
          status: job.status || "Active",
          description: job.description || "",
          company: job.company || "",
          responsibilities: job.responsibilities?.length > 0 ? job.responsibilities : [""],
          requirements: job.requirements?.length > 0 ? job.requirements : [""],
          benefits: job.benefits?.length > 0 ? job.benefits : [""],
          skills: job.skills?.length > 0 ? job.skills : [""]
        });
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleAddField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveField = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray.length > 0 ? updatedArray : [""] }));
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setError("");
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.filter((item) => item.trim() !== ""),
        requirements: formData.requirements.filter((item) => item.trim() !== ""),
        benefits: formData.benefits.filter((item) => item.trim() !== ""),
        skills: formData.skills.filter((item) => item.trim() !== "")
      };

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/jobs/${id}`, payload, config);

      if (res.data.success || res.status === 200) {
        setSuccessMessage("Job updated successfully!");

          navigate(-1);
       
      }
    } catch (err) {
      console.error("Error updating job:", err);
      setError(err.response?.data?.message || "Failed to update job details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-6 py-20 text-center text-slate-600 dark:text-slate-400">
        Loading job information...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 py-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Edit Job Position</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Modify listings and dynamic requirements.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleOpenModal} className="space-y-6 w-full">
        {/* Row 1: Title, Department, Company */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Row 2: Location, Type, Experience, Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience Required</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Row 3: Deadline & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Dynamic Section: Required Skills */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Required Skills</label>
            <button
              type="button"
              onClick={() => handleAddField("skills")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add Skill
            </button>
          </div>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange("skills", index, e.target.value)}
                placeholder={`Skill #${index + 1} (e.g. React.js)`}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField("skills", index)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Section: Key Responsibilities */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Key Responsibilities</label>
            <button
              type="button"
              onClick={() => handleAddField("responsibilities")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add Responsibility
            </button>
          </div>
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleArrayChange("responsibilities", index, e.target.value)}
                placeholder={`Responsibility #${index + 1}`}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {formData.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField("responsibilities", index)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Section: Requirements & Qualifications */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Requirements & Qualifications</label>
            <button
              type="button"
              onClick={() => handleAddField("requirements")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add Requirement
            </button>
          </div>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                placeholder={`Requirement #${index + 1}`}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField("requirements", index)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Section: Perks & Benefits */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Perks & Benefits</label>
            <button
              type="button"
              onClick={() => handleAddField("benefits")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add Benefit
            </button>
          </div>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
                placeholder={`Benefit #${index + 1}`}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              {formData.benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField("benefits", index)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit Action Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors text-sm"
          >
            Update Job Listing
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                📋 Confirm Job Posting Details
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body (Scrollable Details) */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800 dark:text-slate-200">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Title</p>
                  <p className="font-medium">{formData.title || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Company</p>
                  <p className="font-medium">{formData.company || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Department</p>
                  <p className="font-medium">{formData.department || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Location</p>
                  <p className="font-medium">{formData.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Employment Type</p>
                  <p className="font-medium">{formData.type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Status</p>
                  <p className="font-medium">{formData.status || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Experience</p>
                  <p className="font-medium">{formData.experience || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Salary</p>
                  <p className="font-medium">{formData.salary || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Deadline</p>
                  <p className="font-medium">{formData.deadline || "N/A"}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-1">Description</p>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{formData.description || "N/A"}</p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.filter(Boolean).length > 0 ? (
                    formData.skills.filter(Boolean).map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs rounded-full font-medium border border-indigo-200 dark:border-indigo-800">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs">No skills specified</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">Responsibilities</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                  {formData.responsibilities.filter(Boolean).length > 0 ? (
                    formData.responsibilities.filter(Boolean).map((resp, i) => <li key={i}>{resp}</li>)
                  ) : (
                    <li className="text-slate-400 list-none">No responsibilities listed</li>
                  )}
                </ul>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">Requirements & Qualifications</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                  {formData.requirements.filter(Boolean).length > 0 ? (
                    formData.requirements.filter(Boolean).map((req, i) => <li key={i}>{req}</li>)
                  ) : (
                    <li className="text-slate-400 list-none">No requirements listed</li>
                  )}
                </ul>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">Perks & Benefits</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                  {formData.benefits.filter(Boolean).length > 0 ? (
                    formData.benefits.filter(Boolean).map((ben, i) => <li key={i}>{ben}</li>)
                  ) : (
                    <li className="text-slate-400 list-none">No benefits listed</li>
                  )}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-sm transition-colors"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmUpdate}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md text-sm transition-colors flex items-center gap-2"
              >
                {submitting ? "Updating..." : "💾 Confirm & Publish"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default EditJob;