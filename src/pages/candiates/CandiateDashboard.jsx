import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

const CandiateDashboard = () => {
  // Grab state/props shared from layout if needed (like darkMode)
  const { darkMode, candidateName } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome, {candidateName} 👋
        </h1>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Find your opportunity and track your applications.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Vacancies" value="12" icon="💼" darkMode={darkMode} />
        <StatCard title="Applied Jobs" value="5" icon="📄" darkMode={darkMode} />
        <StatCard title="Interviews" value="2" icon="🎯" darkMode={darkMode} />
        <StatCard title="Viewed Jobs" value="7" icon="⭐" darkMode={darkMode} />
      </div>

      {/* ================= PROFILE COMPLETION ================= */}
      <section
        className={`mb-8 rounded-xl border p-6 shadow-sm ${
          darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Profile Completion</h2>
            <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Complete your profile to get better job recommendations.
            </p>
          </div>
          <span className="font-semibold text-blue-600">70%</span>
        </div>

        <div className={`h-2 w-full overflow-hidden rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
          <div className="h-full w-[70%] rounded-full bg-blue-600" />
        </div>

        <button 
          onClick={() => navigate("/ezohr/candidate/profile")}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Complete Profile
        </button>
      </section>

      {/* ================= RECOMMENDED JOBS ================= */}
      <section
        className={`mb-8 rounded-xl border p-6 shadow-sm ${
          darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended Jobs</h2>
          <button 
            onClick={() => navigate("/ezohr/candidate/jobs")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <JobCard title="Frontend Developer" company="ABC Technologies" location="Hyderabad" type="Full Time" salary="₹5 - ₹8 LPA" darkMode={darkMode} />
          <JobCard title="Node.js Developer" company="XYZ Solutions" location="Bangalore" type="Full Time" salary="₹6 - ₹10 LPA" darkMode={darkMode} />
          <JobCard title="React Developer" company="Tech Solutions Pvt Ltd" location="Hyderabad" type="Remote" salary="₹4 - ₹7 LPA" darkMode={darkMode} />
        </div>
      </section>

      {/* ================= RECENT APPLICATIONS ================= */}
      <section
        className={`rounded-xl border p-6 shadow-sm ${
          darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          <button 
            onClick={() => navigate("/ezohr/candidate/applications")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All →
          </button>
        </div>

        <Application title="Full Stack Developer" company="ABC Technologies" status="Interview" statusStyle="green" darkMode={darkMode} />
        <Application title="Backend Developer" company="XYZ Solutions" status="Under Review" statusStyle="yellow" darkMode={darkMode} />
        <Application title="React Developer" company="Tech Solutions" status="Applied" statusStyle="blue" darkMode={darkMode} />
      </section>
    </div>
  );
};

/* Reusable Sub-components (StatCard, JobCard, Application) remain unchanged here */
const StatCard = ({ title, value, icon, darkMode }) => (
  <div className={`rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 ${darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

const JobCard = ({ title, company, location, type, salary, darkMode }) => (
  <div className={`rounded-lg border p-5 transition hover:shadow-md ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{company}</p>
      </div>
      <span className="text-xl">💼</span>
    </div>
    <div className={`space-y-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
      <p>📍 {location}</p>
      <p>🕐 {type}</p>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <span className="font-semibold">{salary}</span>
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">View Job</button>
    </div>
  </div>
);

const Application = ({ title, company, status, statusStyle, darkMode }) => {
  const statusClasses = {
    green: darkMode ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700",
    yellow: darkMode ? "bg-yellow-900/40 text-yellow-400" : "bg-yellow-100 text-yellow-700",
    blue: darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`flex flex-col gap-3 border-b py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{company}</p>
      </div>
      <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClasses[statusStyle]}`}>
        {status}
      </span>
    </div>
  );
};

export default CandiateDashboard;