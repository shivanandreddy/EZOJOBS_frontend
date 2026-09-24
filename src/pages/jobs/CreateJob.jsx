import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Briefcase, 
  Plus, 
  Trash2, 
  Save, 
  X,
  FileText,
  DollarSign,
  Calendar,
  Award,
  CheckCircle2,
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

const CreateJob = ({ onBack, onSubmitSuccess }) => {
  const { user,token } = useUser();
  

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    salary: '',
    deadline: '',
    status: 'Active',
    description: '',
    company: '',
    skills: [''],
    responsibilities: [''],
    requirements: [''],
    benefits: ['']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length <= 1) return;
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // Triggered when clicking "Review & Publish" -> validates & opens modal
  const handleOpenModal = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    
    const payload = {
      ...formData,
      responsibilities: formData.responsibilities.filter((item) => item.trim() !== ''),
      requirements: formData.requirements.filter((item) => item.trim() !== ''),
      benefits: formData.benefits.filter((item) => item.trim() !== ''),
      skills: formData.skills.filter((item) => item.trim() !== ''),
      postedDate: new Date().toISOString().split('T')[0],
      createdBy: user.name,
      updatedBy: user.name,
      company: user.company
    };

    setPendingPayload(payload);
    setShowModal(true);
  };

  // Triggered when clicking the confirmation button inside the modal
  const handleConfirmPublish = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`, {
        method: 'POST',
        headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  },
        body: JSON.stringify(pendingPayload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create job');

      // Show success message inside the modal
      setSuccessMessage('Job created successfully!');

      if (onSubmitSuccess) onSubmitSuccess(data.data);

      // Close modal and go back after 1.5 seconds so the user can see the success message
      
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage(null);
        // Reset form to initial empty state
        setFormData({
          title: '',
          department: '',
          location: '',
          type: 'Full-time',
          experience: '',
          salary: '',
          deadline: '',
          status: 'Active',
          description: '',
          company: '',
          skills: [''],
          responsibilities: [''],
          requirements: [''],
          benefits: ['']
        });
        if (onBack) onBack();
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <form onSubmit={handleOpenModal} className="w-full space-y-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Post a New Job</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Fill in the details below to publish a new position to the career board.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Basic Information Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Sql Engineer"
                value={formData.title}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Department *
              </label>
              <input
                type="text"
                name="department"
                required
                placeholder="e.g. Engineering"
                value={formData.department}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Hyderabad, India (Hybrid)"
                value={formData.location}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Employment Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Posting Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compensation & Experience */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <DollarSign size={18} className="text-blue-600 dark:text-blue-400" />
            Compensation & Requirement Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Experience Range *
              </label>
              <input
                type="text"
                name="experience"
                required
                placeholder="e.g. 3 - 5 Years"
                value={formData.experience}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Salary Range *
              </label>
              <input
                type="text"
                name="salary"
                required
                placeholder="e.g. ₹12,000,000 - ₹18,000,000 / year"
                value={formData.salary}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Application Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* Overview & Description */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" />
            Job Description
          </h2>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Write a clear overview describing the role..."
            value={formData.description}
            onChange={handleChange}
            className={`${inputStyles} leading-relaxed`}
          />
        </div>

        {/* Dynamic Lists: Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Tag size={18} className="text-blue-600 dark:text-blue-400" />
              Required Skills
            </h2>
            <button
              type="button"
              onClick={() => addArrayField('skills')}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              <Plus size={14} /> Add Skill
            </button>
          </div>

          <div className="space-y-3">
            {formData.skills.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Skill #${index + 1} (e.g. sql)`}
                  value={item}
                  onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                  className={inputStyles}
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('skills', index)}
                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Lists: Responsibilities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />
              Key Responsibilities
            </h2>
            <button
              type="button"
              onClick={() => addArrayField('responsibilities')}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              <Plus size={14} /> Add Responsibility
            </button>
          </div>

          <div className="space-y-3">
            {formData.responsibilities.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Responsibility #${index + 1}`}
                  value={item}
                  onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                  className={inputStyles}
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('responsibilities', index)}
                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Lists: Requirements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Award size={18} className="text-blue-600 dark:text-blue-400" />
              Requirements & Qualifications
            </h2>
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              <Plus size={14} /> Add Requirement
            </button>
          </div>

          <div className="space-y-3">
            {formData.requirements.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Requirement #${index + 1}`}
                  value={item}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  className={inputStyles}
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('requirements', index)}
                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Lists: Benefits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
              Perks & Benefits
            </h2>
            <button
              type="button"
              onClick={() => addArrayField('benefits')}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              <Plus size={14} /> Add Benefit
            </button>
          </div>

          <div className="space-y-3">
            {formData.benefits.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Benefit #${index + 1}`}
                  value={item}
                  onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                  className={inputStyles}
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('benefits', index)}
                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-sm"
          >
            <Save size={16} />
            Review & Publish
          </button>
        </div>

      </form>

      {/* Confirmation & Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                Confirm Job Posting Details
              </h3>
              {!loading && (
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Modal Body / Details & Status Alerts */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              
              {/* Success Message Banner inside Modal */}
              {successMessage && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2 animate-fadeIn">
                  <CheckCircle size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Message Banner inside Modal if submission fails */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Title</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.title}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Company</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.company}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Department</span>
                  <p className="text-slate-700 dark:text-slate-300">{formData.department}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Location</span>
                  <p className="text-slate-700 dark:text-slate-300">{formData.location}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Employment Type</span>
                  <p className="text-slate-700 dark:text-slate-300">{formData.type}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Status</span>
                  <p className="text-slate-700 dark:text-slate-300">{formData.status}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Experience</span>
                  <p className="text-slate-700 dark:text-slate-300">{formData.experience}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Salary</span>
                  <p className="text-slate-700 dark:text-slate-300">{formData.salary}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Deadline</span>
                  <p className="text-slate-700 dark:text-slate-300">{formData.deadline}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Description</span>
                <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-line">{formData.description}</p>
              </div>

              {formData.skills.filter(Boolean).length > 0 && (
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.skills.filter(Boolean).map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.responsibilities.filter(Boolean).length > 0 && (
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Responsibilities</span>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700 dark:text-slate-300">
                    {formData.responsibilities.filter(Boolean).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.requirements.filter(Boolean).length > 0 && (
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Requirements</span>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700 dark:text-slate-300">
                    {formData.requirements.filter(Boolean).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.benefits.filter(Boolean).length > 0 && (
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Benefits</span>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700 dark:text-slate-300">
                    {formData.benefits.filter(Boolean).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                type="button"
                disabled={loading || successMessage}
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={loading || successMessage}
                onClick={handleConfirmPublish}
                className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={16} />
                {loading ? 'Publishing...' : successMessage ? 'Published!' : 'Confirm & Publish'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CreateJob;