import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Info } from "lucide-react";

const CandiateDashboard = () => {
  const navigate = useNavigate();
  const { candiate, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("candidateTheme") === "dark";
  });

  // 👇 ADDED THIS LINE TO FIX THE ERROR
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "candidateTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/ezohr/candiate/login");
  };

  const candidateName = candiate?.name || "Candidate";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ================= NAVBAR ================= */}
      <nav
        className={`sticky top-0 z-50 border-b transition-colors ${
          darkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              E
            </div>

            <div>
              <h1 className="text-lg font-bold">
                EZO JOBS
              </h1>

              <p
                className={`hidden text-xs sm:block ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Candidate Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <button
              className={`font-medium ${
                darkMode
                  ? "text-blue-400"
                  : "text-blue-600"
              }`}
            >
              Dashboard
            </button>

            <button
              className={`transition ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Jobs
            </button>

            <button
              className={`transition ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Applications
            </button>

            <button
              className={`transition ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Info Toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                showInfo
                  ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={
                showInfo
                  ? "Hide Info"
                  : "Show Info"
              }
            >
              <Info size={18} />
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                darkMode
                  ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {candidateName.charAt(0).toUpperCase()}
            </div>

            {/* Candidate Name */}
            <span className="hidden text-sm font-medium sm:block">
              {candidateName}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Optional: Display info box conditionally if showInfo is true */}
        {showInfo && (
          <div className={`mb-6 rounded-xl border p-4 text-sm ${darkMode ? "border-blue-900 bg-blue-950/30 text-blue-200" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
            💡 **Tip:** Keep your profile completion above 80% to receive faster callback responses from recruiters!
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome, {candidateName} 👋
          </h1>

          <p
            className={`mt-2 ${
              darkMode
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
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
            darkMode
              ? "border-gray-800 bg-gray-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Profile Completion
              </h2>

              <p
                className={`mt-1 text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Complete your profile to get better job recommendations.
              </p>
            </div>

            <span className="font-semibold text-blue-600">
              70%
            </span>
          </div>

          <div
            className={`h-2 w-full overflow-hidden rounded-full ${
              darkMode
                ? "bg-gray-700"
                : "bg-gray-200"
            }`}
          >
            <div className="h-full w-[70%] rounded-full bg-blue-600" />
          </div>

          <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
            Complete Profile
          </button>
        </section>

        {/* ================= RECOMMENDED JOBS ================= */}
        <section
          className={`mb-8 rounded-xl border p-6 shadow-sm ${
            darkMode
              ? "border-gray-800 bg-gray-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recommended Jobs
            </h2>

            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <JobCard
              title="Frontend Developer"
              company="ABC Technologies"
              location="Hyderabad"
              type="Full Time"
              salary="₹5 - ₹8 LPA"
              darkMode={darkMode}
            />
            <JobCard
              title="Node.js Developer"
              company="XYZ Solutions"
              location="Bangalore"
              type="Full Time"
              salary="₹6 - ₹10 LPA"
              darkMode={darkMode}
            />
            <JobCard
              title="React Developer"
              company="Tech Solutions Pvt Ltd"
              location="Hyderabad"
              type="Remote"
              salary="₹4 - ₹7 LPA"
              darkMode={darkMode}
            />
          </div>
        </section>

        {/* ================= RECENT APPLICATIONS ================= */}
        <section
          className={`rounded-xl border p-6 shadow-sm ${
            darkMode
              ? "border-gray-800 bg-gray-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recent Applications
            </h2>

            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All →
            </button>
          </div>

          <Application
            title="Full Stack Developer"
            company="ABC Technologies"
            status="Interview"
            statusStyle="green"
            darkMode={darkMode}
          />
          <Application
            title="Backend Developer"
            company="XYZ Solutions"
            status="Under Review"
            statusStyle="yellow"
            darkMode={darkMode}
          />
          <Application
            title="React Developer"
            company="Tech Solutions"
            status="Applied"
            statusStyle="blue"
            darkMode={darkMode}
          />
        </section>
      </main>
    </div>
  );
};


/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon, darkMode }) => {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 ${
        darkMode
          ? "border-gray-800 bg-gray-900"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm ${
              darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>
        </div>

        <div className="text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};


/* ================= JOB CARD ================= */

const JobCard = ({ title, company, location, type, salary, darkMode }) => {
  return (
    <div
      className={`rounded-lg border p-5 transition hover:shadow-md ${
        darkMode
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            {company}
          </p>
        </div>

        <span className="text-xl">💼</span>
      </div>

      <div
        className={`space-y-1 text-sm ${
          darkMode
            ? "text-gray-400"
            : "text-gray-600"
        }`}
      >
        <p>📍 {location}</p>
        <p>🕐 {type}</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="font-semibold">
          {salary}
        </span>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          View Job
        </button>
      </div>
    </div>
  );
};


/* ================= APPLICATION ================= */

const Application = ({ title, company, status, statusStyle, darkMode }) => {
  const statusClasses = {
    green: darkMode
      ? "bg-green-900/40 text-green-400"
      : "bg-green-100 text-green-700",

    yellow: darkMode
      ? "bg-yellow-900/40 text-yellow-400"
      : "bg-yellow-100 text-yellow-700",

    blue: darkMode
      ? "bg-blue-900/40 text-blue-400"
      : "bg-blue-100 text-blue-700",
  };

  return (
    <div
      className={`flex flex-col gap-3 border-b py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between ${
        darkMode
          ? "border-gray-800"
          : "border-gray-200"
      }`}
    >
      <div>
        <h3 className="font-medium">
          {title}
        </h3>

        <p
          className={`text-sm ${
            darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {company}
        </p>
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClasses[statusStyle]}`}
      >
        {status}
      </span>
    </div>
  );
};

export default CandiateDashboard;