import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Info } from "lucide-react";

const CandidateLayout = () => {
  const navigate = useNavigate();
  const { candiate, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("candidateTheme") === "dark";
  });

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
        darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ================= NAVBAR (Persistent) ================= */}
      <nav
        className={`sticky top-0 z-50 border-b transition-colors ${
          darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              E
            </div>
            <div>
              <h1 className="text-lg font-bold">EZO JOBS</h1>
              <p className={`hidden text-xs sm:block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Candidate Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => navigate("/ezohr/candiate/dashboard")}
              className={`font-medium transition ${
                darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/ezohr/candiate/jobs")}
              className={`transition ${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => navigate("/ezohr/candiate/applications")}
              className={`transition ${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => navigate("/ezohr/candiate/profile")}
              className={`transition ${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile
            </button>
          </div>

          {/* Right Side Options */}
          <div className="flex items-center gap-3">
            {/* Info Toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                showInfo
                  ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={showInfo ? "Hide Info" : "Show Info"}
            >
              <Info size={18} />
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                darkMode ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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

      {/* ================= MAIN DYNAMIC CONTENT VIA OUTLET ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showInfo && (
          <div className={`mb-6 rounded-xl border p-4 text-sm ${darkMode ? "border-blue-900 bg-blue-950/30 text-blue-200" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
            💡 **Tip:** Keep your profile completion above 80% to receive faster callback responses from recruiters!
          </div>
        )}

        {/* This renders whatever child route is active */}
        <Outlet context={{ darkMode, candidateName }} />
      </main>
    </div>
  );
};

export default CandidateLayout;