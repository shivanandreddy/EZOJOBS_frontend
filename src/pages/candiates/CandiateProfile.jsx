import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  candiateEducationLevel,
  candiateGraduation,
  candiateRole,
  userRoles,
} from "../../enums.js";

const CandidateProfile = () => {
  // Extract darkMode and candidateName from the outlet context
  const { darkMode, candidateName } = useOutletContext();

  const [formData, setFormData] = useState({
    name: "",
    role: candiateRole.STUDENT || "student",
    gender: "",
    mobile: "",
    age: "",
    experience: "",
    currentSalary: "",
    expectedSalary: "",
    previousCompanyName: "",
    location: "",
    educationLevel: candiateEducationLevel.SCHOOL || "school",
    school: {
      schoolName: "",
      cgpa: "",
      location: "",
      completedYear: "",
    },
    inter: {
      collegeName: "",
      branch: "",
      cgpa: "",
      location: "",
      startedYear: "",
      endedYear: "",
    },
    graduation: {
      type: candiateGraduation.BACHELORS || "",
      branch: "",
      organisationName: "",
      cgpa: "",
      location: "",
      startedYear: "",
      endedYear: "",
    },
    skills: [""],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { token, candiate } = useAuth();
  const candidateId = candiate?._id;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/candiates/${candidateId}`,
          config
        );

        const profile = res.data.data;

        setFormData({
          name: profile.name || "",
          role: profile.role || candiateRole.STUDENT || "student",
          gender: profile.gender || "",
          mobile: profile.mobile || "",
          age: profile.age || "",
          experience: profile.experience || "",
          currentSalary: profile.currentSalary || "",
          expectedSalary: profile.expectedSalary || "",
          previousCompanyName: profile.previousCompanyName || "",
          location: profile.location || "",
          educationLevel:
            profile.educationLevel ||
            candiateEducationLevel.SCHOOL ||
            "school",

          school: {
            schoolName: profile.school?.schoolName || "",
            cgpa: profile.school?.cgpa || "",
            location: profile.school?.location || "",
            completedYear: profile.school?.completedYear || "",
          },

          inter: {
            collegeName: profile.inter?.collegeName || "",
            branch: profile.inter?.branch || "",
            cgpa: profile.inter?.cgpa || "",
            location: profile.inter?.location || "",
            startedYear: profile.inter?.startedYear || "",
            endedYear: profile.inter?.endedYear || "",
          },

          graduation: {
            type: profile.graduation?.type || "",
            branch: profile.graduation?.branch || "",
            organisationName: profile.graduation?.organisationName || "",
            cgpa: profile.graduation?.cgpa || "",
            location: profile.graduation?.location || "",
            startedYear: profile.graduation?.startedYear || "",
            endedYear: profile.graduation?.endedYear || "",
          },

          skills:
            profile.skills?.length > 0 ? profile.skills : [""],
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    if (candidateId && token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("Candidate ID or token not found.");
    }
  }, [candidateId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;

    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const handleAddSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = formData.skills.filter(
      (_, i) => i !== index
    );

    setFormData((prev) => ({
      ...prev,
      skills:
        updatedSkills.length > 0 ? updatedSkills : [""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Clean up payload so empty enum strings don't fail Mongoose validation
      const cleanedGraduation = { ...formData.graduation };
      if (!cleanedGraduation.type || cleanedGraduation.type.trim() === "") {
        delete cleanedGraduation.type; // or set to undefined
      }

      const payload = {
        ...formData,
        graduation: cleanedGraduation,
        skills: formData.skills.filter(
          (skill) => skill.trim() !== ""
        ),
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/candiates/${candidateId}`,
        payload,
        config
      );

      if (res.data.success || res.status === 200) {
        const msg = "Profile updated successfully!";
        setSuccessMessage(msg);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error updating profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="animate-pulse font-medium">
          Loading profile information...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen  text-slate-900 dark:text-slate-100 px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Success
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold tracking-tight text-green-600 dark:text-indigo-400">
            Candidate Profile {candidateName ? `- ${candidateName}` : ""}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your credentials, professional history, and educational background.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-sm shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {Object.values(candiateRole).map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="e.g. Male / Female"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Mobile Number (10 digits)
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 28"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Professional Background */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Professional Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Current Salary
                </label>
                <input
                  type="number"
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={handleChange}
                  placeholder="e.g. 600000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Expected Salary
                </label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g. 900000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Previous Company
                </label>
                <input
                  type="text"
                  name="previousCompanyName"
                  value={formData.previousCompanyName}
                  onChange={handleChange}
                  placeholder="e.g. TechCorp Solutions"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Education Level */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Level of Education
            </h3>

            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                EductionLevel
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {Object.values(candiateEducationLevel).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* School */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
            <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              School Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  School Name
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.school.schoolName}
                  onChange={(e) => handleNestedChange("school", e)}
                  placeholder="e.g. St. Mary's High School"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  CGPA (0 - 10)
                </label>
                <input
                  type="number"
                  name="cgpa"
                  step="0.01"
                  value={formData.school.cgpa}
                  onChange={(e) => handleNestedChange("school", e)}
                  placeholder="e.g. 9.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.school.location}
                  onChange={(e) => handleNestedChange("school", e)}
                  placeholder="e.g. Mumbai, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Completed Year
                </label>
                <input
                  type="number"
                  name="completedYear"
                  value={formData.school.completedYear}
                  onChange={(e) => handleNestedChange("school", e)}
                  placeholder="e.g. 2018"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Intermediate */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
            <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Intermediate / College Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  College Name
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.inter.collegeName}
                  onChange={(e) => handleNestedChange("inter", e)}
                  placeholder="e.g. Sri Chaitanya Junior College"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Branch / Stream
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.inter.branch}
                  onChange={(e) => handleNestedChange("inter", e)}
                  placeholder="e.g. MPC"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  CGPA
                </label>
                <input
                  type="number"
                  name="cgpa"
                  step="0.01"
                  value={formData.inter.cgpa}
                  onChange={(e) => handleNestedChange("inter", e)}
                  placeholder="e.g. 9.0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.inter.location}
                  onChange={(e) => handleNestedChange("inter", e)}
                  placeholder="e.g. Hyderabad, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Started Year
                </label>
                <input
                  type="number"
                  name="startedYear"
                  value={formData.inter.startedYear}
                  onChange={(e) => handleNestedChange("inter", e)}
                  placeholder="e.g. 2018"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Ended Year
                </label>
                <input
                  type="number"
                  name="endedYear"
                  value={formData.inter.endedYear}
                  onChange={(e) => handleNestedChange("inter", e)}
                  placeholder="e.g. 2020"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Graduation */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
            <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Graduation Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Degree / Graduation Type
                </label>
                <select
                  name="type"
                  value={formData.graduation.type}
                  onChange={(e) => handleNestedChange("graduation", e)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select Degree Type</option>
                  {Object.values(candiateGraduation).map((deg) => (
                    <option key={deg} value={deg}>
                      {deg.charAt(0).toUpperCase() + deg.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Organisation / University
                </label>
                <input
                  type="text"
                  name="organisationName"
                  value={formData.graduation.organisationName}
                  onChange={(e) => handleNestedChange("graduation", e)}
                  placeholder="e.g. Osmania University"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Branch / Degree
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.graduation.branch}
                  onChange={(e) => handleNestedChange("graduation", e)}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  CGPA
                </label>
                <input
                  type="number"
                  name="cgpa"
                  step="0.01"
                  value={formData.graduation.cgpa}
                  onChange={(e) => handleNestedChange("graduation", e)}
                  placeholder="e.g. 8.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.graduation.location}
                  onChange={(e) => handleNestedChange("graduation", e)}
                  placeholder="e.g. Hyderabad, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Started Year
                </label>
                <input
                  type="number"
                  name="startedYear"
                  value={formData.graduation.startedYear}
                  onChange={(e) => handleNestedChange("graduation", e)}
                  placeholder="e.g. 2020"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Ended Year
                </label>
                <input
                  type="number"
                  name="endedYear"
                  value={formData.graduation.endedYear}
                  onChange={(e) => handleNestedChange("graduation", e)}
                  placeholder="e.g. 2024"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-colors duration-300">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Skills & Expertise
              </h4>
              <button
                type="button"
                onClick={handleAddSkill}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Add Skill
              </button>
            </div>

            <div className="space-y-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) =>
                      handleSkillChange(index, e.target.value)
                    }
                    placeholder={`e.g. React.js (Skill #${index + 1})`}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                  />

                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="px-3 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
            >
              {submitting ? "Saving Profile..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CandidateProfile;