import React, { useState } from 'react';
import {
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

const initialFormData = {
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
  benefits: []
};

const CreateJob = ({ onBack, onSubmitSuccess }) => {
  const { user, token } = useUser();

  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;

      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => {
      if (prev[field].length <= 1) {
        return prev;
      }

      return {
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      };
    });
  };

  /**
   * Validate and prepare the payload.
   *
   * IMPORTANT:
   * createdBy / updatedBy must contain the MongoDB User _id,
   * not user.name.
   */
  const handleOpenModal = (e) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);

    if (!user?._id) {
      setError('User information is missing. Please login again.');
      return;
    }

    if (!token) {
      setError('Authentication token is missing. Please login again.');
      return;
    }

    // Make sure deadline exists
    if (!formData.deadline) {
      setError('Application deadline is required.');
      return;
    }

    // Check deadline is not before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(formData.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      setError('Application deadline cannot be in the past.');
      return;
    }

    const cleanArray = (array) =>
      array
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    /**
     * Payload matching your Mongoose Job schema.
     */
    const payload = {
      title: formData.title.trim(),
      department: formData.department.trim(),
      location: formData.location.trim(),

      type: formData.type,

      experience: formData.experience.trim(),
      salary: formData.salary.trim(),

      // Send Date-compatible ISO value
      deadline: new Date(`${formData.deadline}T23:59:59`).toISOString(),

      status: formData.status,

      description: formData.description.trim(),

      responsibilities: cleanArray(formData.responsibilities),
      requirements: cleanArray(formData.requirements),
      benefits: cleanArray(formData.benefits),
      skills: cleanArray(formData.skills),

      // Use logged-in user's company
      company: user.company,

      // IMPORTANT: MongoDB User ObjectId
      createdBy: user._id,
      updatedBy: user._id
    };

    setPendingPayload(payload);
    setShowModal(true);
  };

  const handleConfirmPublish = async () => {
    if (!pendingPayload) {
      setError('Job data is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/jobs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(pendingPayload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || 'Failed to create job'
        );
      }

      setSuccessMessage('Job created successfully!');

      if (onSubmitSuccess) {
        onSubmitSuccess(data.data);
      }

      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage(null);
        setPendingPayload(null);
        setFormData(initialFormData);

        if (onBack) {
          onBack();
        }
      }, 1500);

    } catch (err) {
      setError(err.message || 'Something went wrong while creating the job.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    'w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors';

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <form onSubmit={handleOpenModal} className="w-full space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Post a New Job
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Fill in the details below to publish a new position to the career board.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* General Information */}
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
                placeholder="e.g. SQL Engineer"
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

        {/* Compensation */}
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
                placeholder="e.g. ₹12,00,000 - ₹18,00,000 / year"
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
                min={new Date().toISOString().split('T')[0]}
                value={formData.deadline}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

          </div>
        </div>

        {/* Description */}
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

        {/* Skills */}
        <DynamicList
          title="Required Skills"
          icon={<Tag size={18} className="text-blue-600 dark:text-blue-400" />}
          field="skills"
          items={formData.skills}
          placeholder="Skill"
          addLabel="Add Skill"
          formData={formData}
          handleArrayChange={handleArrayChange}
          addArrayField={addArrayField}
          removeArrayField={removeArrayField}
          inputStyles={inputStyles}
        />

        {/* Responsibilities */}
        <DynamicList
          title="Key Responsibilities"
          icon={<CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />}
          field="responsibilities"
          items={formData.responsibilities}
          placeholder="Responsibility"
          addLabel="Add Responsibility"
          formData={formData}
          handleArrayChange={handleArrayChange}
          addArrayField={addArrayField}
          removeArrayField={removeArrayField}
          inputStyles={inputStyles}
        />

        {/* Requirements */}
        <DynamicList
          title="Requirements & Qualifications"
          icon={<Award size={18} className="text-blue-600 dark:text-blue-400" />}
          field="requirements"
          items={formData.requirements}
          placeholder="Requirement"
          addLabel="Add Requirement"
          formData={formData}
          handleArrayChange={handleArrayChange}
          addArrayField={addArrayField}
          removeArrayField={removeArrayField}
          inputStyles={inputStyles}
        />

        {/* Benefits */}
        <DynamicList
          title="Perks & Benefits"
          icon={<Calendar size={18} className="text-blue-600 dark:text-blue-400" />}
          field="benefits"
          items={formData.benefits}
          placeholder="Benefit"
          addLabel="Add Benefit"
          formData={formData}
          handleArrayChange={handleArrayChange}
          addArrayField={addArrayField}
          removeArrayField={removeArrayField}
          inputStyles={inputStyles}
        />

        {/* Bottom Actions */}
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                Confirm Job Posting Details
              </h3>

              {!loading && (
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm">

              {successMessage && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">

                <PreviewItem label="Title" value={formData.title} />
                <PreviewItem label="Company" value={user?.company || '-'} />
                <PreviewItem label="Department" value={formData.department} />
                <PreviewItem label="Location" value={formData.location} />
                <PreviewItem label="Employment Type" value={formData.type} />
                <PreviewItem label="Status" value={formData.status} />
                <PreviewItem label="Experience" value={formData.experience} />
                <PreviewItem label="Salary" value={formData.salary} />
                <PreviewItem label="Deadline" value={formData.deadline} />

              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Description
                </span>

                <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-line">
                  {formData.description}
                </p>
              </div>

              <PreviewArray
                label="Skills"
                items={formData.skills}
                type="tags"
              />

              <PreviewArray
                label="Responsibilities"
                items={formData.responsibilities}
              />

              <PreviewArray
                label="Requirements"
                items={formData.requirements}
              />

              <PreviewArray
                label="Benefits"
                items={formData.benefits}
              />

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">

              <button
                type="button"
                disabled={loading || !!successMessage}
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                }}
                className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Back to Edit
              </button>

              <button
                type="button"
                disabled={loading || !!successMessage}
                onClick={handleConfirmPublish}
                className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={16} />

                {loading
                  ? 'Publishing...'
                  : successMessage
                    ? 'Published!'
                    : 'Confirm & Publish'}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------
   Dynamic List Component
------------------------------------------------------- */

const DynamicList = ({
  title,
  icon,
  field,
  items,
  placeholder,
  addLabel,
  formData,
  handleArrayChange,
  addArrayField,
  removeArrayField,
  inputStyles
}) => {
  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between pb-2">

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          {icon}
          {title}
        </h2>

        <button
          type="button"
          onClick={() => addArrayField(field)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
        >
          <Plus size={14} />
          {addLabel}
        </button>

      </div>

      <div className="space-y-3">

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">

            <input
              type="text"
              placeholder={`${placeholder} #${index + 1}`}
              value={item}
              onChange={(e) =>
                handleArrayChange(field, index, e.target.value)
              }
              className={inputStyles}
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField(field, index)}
                className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
              >
                <Trash2 size={16} />
              </button>
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

/* -------------------------------------------------------
   Preview Item
------------------------------------------------------- */

const PreviewItem = ({ label, value }) => {
  return (
    <div>
      <span className="text-xs text-slate-400 uppercase font-semibold">
        {label}
      </span>

      <p className="font-semibold text-slate-800 dark:text-slate-200">
        {value || '-'}
      </p>
    </div>
  );
};

/* -------------------------------------------------------
   Preview Array
------------------------------------------------------- */

const PreviewArray = ({ label, items, type = 'list' }) => {
  const filteredItems = items.filter(
    (item) => item && item.trim() !== ''
  );

  if (filteredItems.length === 0) {
    return null;
  }

  if (type === 'tags') {
    return (
      <div>
        <span className="text-xs text-slate-400 uppercase font-semibold">
          {label}
        </span>

        <div className="flex flex-wrap gap-1.5 mt-1">

          {filteredItems.map((item, index) => (
            <span
              key={index}
              className="px-2.5 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium"
            >
              {item}
            </span>
          ))}

        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="text-xs text-slate-400 uppercase font-semibold">
        {label}
      </span>

      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700 dark:text-slate-300">

        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}

      </ul>
    </div>
  );
};

export default CreateJob;
