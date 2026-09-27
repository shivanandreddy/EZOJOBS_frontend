import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { Info, Menu, X } from "lucide-react";

const CandidateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { candiate, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("candidateTheme") === "dark";
  });

  const [showInfo, setShowInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const candidateName = candiate?.name || "Candidate";

  // --------------------------------------------------
  // CHECK ACTIVE NAVIGATION
  // --------------------------------------------------
  const isActive = (path) => {
    return location.pathname === path;
  };

  // --------------------------------------------------
  // DESKTOP NAV ITEM CLASS
  // --------------------------------------------------
  const desktopNavClass = (path) => {
    if (isActive(path)) {
      return darkMode
        ? "text-blue-400 font-semibold  "
        : "text-blue-600 font-semibold  ";
    }

    return darkMode
      ? "text-gray-400 hover:text-white"
      : "text-gray-600 hover:text-gray-900";
  };

  // --------------------------------------------------
  // MOBILE NAV ITEM CLASS
  // --------------------------------------------------
  const mobileNavClass = (path) => {
    if (isActive(path)) {
      return darkMode
        ? "bg-blue-900/40 text-blue-400 font-semibold"
        : "bg-blue-50 text-blue-600 font-semibold";
    }

    return darkMode
      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
      : "text-gray-700 hover:bg-gray-100";
  };

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

          {/* ================= LOGO ================= */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm">
              E
            </div>

            <div>
              <h1 className="text-base font-bold sm:text-lg">
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

          {/* ================= DESKTOP NAVIGATION ================= */}
          <div className="hidden items-center gap-6 lg:flex">

            {/* Dashboard */}
            <button
              onClick={() =>
                handleNavClick(
                  "/ezohr/candiate/dashboard"
                )
              }
              className={`h-16  transition ${desktopNavClass(
                "/ezohr/candiate/dashboard"
              )}`}
            >
              Dashboard
            </button>

            {/* Jobs */}
            <button
              onClick={() =>
                handleNavClick(
                  "/ezohr/candiate/jobs"
                )
              }
              className={`h-16 border-b-2 border-transparent transition ${desktopNavClass(
                "/ezohr/candiate/jobs"
              )}`}
            >
              Jobs
            </button>

            {/* Applications */}
            <button
              onClick={() =>
                handleNavClick(
                  "/ezohr/candiate/applications"
                )
              }
              className={`h-16 border-b-2 border-transparent transition ${desktopNavClass(
                "/ezohr/candiate/applications"
              )}`}
            >
              Applications
            </button>

            {/* Profile */}
            <button
              onClick={() =>
                handleNavClick(
                  "/ezohr/candiate/profile"
                )
              }
              className={`h-16 border-b-2 border-transparent transition ${desktopNavClass(
                "/ezohr/candiate/profile"
              )}`}
            >
              Profile
            </button>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Info */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                showInfo
                  ? darkMode
                    ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                    : "bg-gray-200 text-yellow-600 hover:bg-gray-300"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white sm:flex">
              {candidateName.charAt(0).toUpperCase()}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:block"
            >
              Logout
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition lg:hidden ${
                darkMode
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div
            className={`border-b px-4 py-4 shadow-lg lg:hidden ${
              darkMode
                ? "border-gray-800 bg-gray-900"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Profile Preview */}
            <div
              className={`flex items-center gap-3 border-b pb-3 ${
                darkMode
                  ? "border-gray-800"
                  : "border-gray-100"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {candidateName.charAt(0).toUpperCase()}
              </div>

              <div className="overflow-hidden">
                <p className="truncate font-medium">
                  {candidateName}
                </p>

                <p
                  className={`text-xs ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Candidate Portal
                </p>
              </div>
            </div>

            {/* Mobile Links */}
            <div className="mt-3 flex flex-col space-y-2">

              {/* Dashboard */}
              <button
                onClick={() =>
                  handleNavClick(
                    "/ezohr/candiate/dashboard"
                  )
                }
                className={`rounded-lg px-3 py-2 text-left transition ${mobileNavClass(
                  "/ezohr/candiate/dashboard"
                )}`}
              >
                Dashboard
              </button>

              {/* Jobs */}
              <button
                onClick={() =>
                  handleNavClick(
                    "/ezohr/candiate/jobs"
                  )
                }
                className={`rounded-lg px-3 py-2 text-left transition ${mobileNavClass(
                  "/ezohr/candiate/jobs"
                )}`}
              >
                Jobs
              </button>

              {/* Applications */}
              <button
                onClick={() =>
                  handleNavClick(
                    "/ezohr/candiate/applications"
                  )
                }
                className={`rounded-lg px-3 py-2 text-left transition ${mobileNavClass(
                  "/ezohr/candiate/applications"
                )}`}
              >
                Applications
              </button>

              {/* Profile */}
              <button
                onClick={() =>
                  handleNavClick(
                    "/ezohr/candiate/profile"
                  )
                }
                className={`rounded-lg px-3 py-2 text-left transition ${mobileNavClass(
                  "/ezohr/candiate/profile"
                )}`}
              >
                Profile
              </button>
            </div>

            {/* Mobile Logout */}
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full rounded-lg bg-red-500 py-2.5 text-center text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showInfo && (
          <div
            className={`mb-6 rounded-xl border p-4 text-sm ${
              darkMode
                ? "border-blue-900 bg-blue-950/30 text-blue-200"
                : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            💡 <strong>Tip:</strong> Keep your profile
            completion above 80% to receive faster callback
            responses from recruiters!
          </div>
        )}

        <Outlet
          context={{
            darkMode,
            candidateName,
          }}
        />
      </main>
    </div>
  );
};

export default CandidateLayout;