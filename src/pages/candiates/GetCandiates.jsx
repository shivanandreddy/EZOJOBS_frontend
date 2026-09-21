import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export default function GetCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [candidateCount, setCandidateCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');

  // Fetch candidates from Node.js backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/candiates`); 
        
        setCandidates(response.data.data || []);
        setCandidateCount(response.data.count || 0);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch candidate data');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Helper function to clean up double quotes/slashes in educationLevel
  const formatEducation = (level) => {
    if (!level) return 'N/A';
    return level.replace(/["\\]/g, '').toUpperCase();
  };

  // Extract unique roles, locations, and education levels for the dropdown options
  const filterOptions = useMemo(() => {
    const roles = new Set();
    const locations = new Set();
    const educations = new Set();

    candidates.forEach((c) => {
      if (c.role) roles.add(c.role);
      if (c.location) locations.add(c.location);
      if (c.educationLevel) educations.add(formatEducation(c.educationLevel));
    });

    return {
      roles: Array.from(roles),
      locations: Array.from(locations),
      educations: Array.from(educations),
    };
  }, [candidates]);

  // Filter candidates based on search term and selected dropdown values
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      // Search term matching (Name, Email, Skills)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        candidate.name?.toLowerCase().includes(searchLower) ||
        candidate.email?.toLowerCase().includes(searchLower) ||
        candidate.skills?.some((skill) => skill.toLowerCase().includes(searchLower));

      // Dropdown filters matching
      const matchesRole = selectedRole ? candidate.role === selectedRole : true;
      const matchesLocation = selectedLocation ? candidate.location === selectedLocation : true;
      const matchesEducation = selectedEducation
        ? formatEducation(candidate.educationLevel) === selectedEducation
        : true;

      return matchesSearch && matchesRole && matchesLocation && matchesEducation;
    });
  }, [candidates, searchTerm, selectedRole, selectedLocation, selectedEducation]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-sans text-center text-gray-600 dark:text-gray-300">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-2"></div>
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-sans">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
          <p className="font-semibold">Error loading candidates</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto font-sans text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Candidates Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and view registered candidate records</p>
        </div>
        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm font-medium px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
          Showing: {filteredCandidates.length} / {candidateCount}
        </span>
      </div>

      {/* Search & Filters Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative md:col-span-1">
          <input
            type="text"
            placeholder="Search by name, email, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
          >
            <option value="">All Roles</option>
            {filterOptions.roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
          >
            <option value="">All Locations</option>
            {filterOptions.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Education Filter */}
        <div>
          <select
            value={selectedEducation}
            onChange={(e) => setSelectedEducation(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Education Levels</option>
            {filterOptions.educations.map((edu) => (
              <option key={edu} value={edu}>
                {edu}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-900 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Candidate</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Education</th>
              <th className="py-3.5 px-4">Experience</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Skills</th>
              <th className="py-3.5 px-4 text-right">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <tr key={candidate._id} className="transition-colors">
                  {/* Name & Email */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {candidate.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{candidate.email}</div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4">
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-0.5 rounded capitalize border border-gray-200 dark:border-gray-700">
                      {candidate.role || 'N/A'}
                    </span>
                  </td>

                  {/* Education */}
                  <td className="py-4 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {formatEducation(candidate.educationLevel)}
                  </td>

                  {/* Experience & Age */}
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                    <div>{candidate.experience} yrs exp</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Age: {candidate.age}</div>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                    {candidate.location || '—'}
                  </td>

                  {/* Skills */}
                  <td className="py-4 px-4">
                    {candidate.skills && candidate.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded border border-transparent dark:border-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500 italic">None</span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4 text-right text-xs text-gray-400 dark:text-gray-500">
                    {new Date(candidate.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                  No candidates found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}