import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ListTodo,
  Settings,
  HelpCircle,
  ChevronDown,
  PersonStanding,
  CalendarCheck,
  UserRound,
  BriefcaseBusiness,
  MessageSquareText,
  ThumbsUp,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  // Track open dropdown menus by consistent keys matching the toggle handlers
  const [openSubmenus, setOpenSubmenus] = useState({
    JobsAndRecruitment: true, // Set true if you want it open by default
    Projects: false,          // Used for Candidate Management dropdown
    Interviewer: false,       // Used for Interviewer dropdown
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLinkClick = () => {
    // Close sidebar on mobile devices only (< 768px)
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 dark:bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 dark:border-slate-800 bg-gray-200 dark:bg-slate-900 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-300 dark:border-slate-800 px-5 bg-blue-600">
          <Link to="/ezohr/home" onClick={handleLinkClick} className="flex items-center gap-3 ">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-white dark:bg-blue-500 font-bold text-blue-600 dark:text-white">
              E
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-100 text-white">
              EZO Jobs
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 mt-2">
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
            Workspace
          </p>

          {/* 1. Dashboard */}
          <div className="mb-1">
            <Link
              to="/ezohr/home"
              onClick={handleLinkClick}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive('/ezohr/home')
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* 2. Jobs & Recruitment */}
          <div className="mb-1">
            <button
              type="button"
              onClick={() => toggleSubmenu('JobsAndRecruitment')}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <ListTodo size={18} />
                <span>Jobs & Recruitment</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                  openSubmenus['JobsAndRecruitment'] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubmenus['JobsAndRecruitment'] && (
              <div className="ml-7 mt-1 space-y-1 border-l border-blue-500 dark:border-slate-800 pl-2">
                <Link
                  to="/ezohr/jobs/create"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/jobs/create')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Create Job
                </Link>
                <Link
                  to="/ezohr/jobs/drafts"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/jobs/drafts')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Draft Jobs
                </Link>
                <Link
                  to="/ezohr/jobs/manage"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/jobs/manage')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Manage Jobs
                </Link>
              </div>
            )}
          </div>

          {/* 3. Candidate Management */}
          <div className="mb-1">
            <button
              type="button"
              onClick={() => toggleSubmenu('Projects')}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <PersonStanding size={18} />
                <span>Candidate Management</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                  openSubmenus['Projects'] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubmenus['Projects'] && (
              <div className="ml-7 mt-1 space-y-1 border-l border-blue-500 dark:border-slate-800 pl-2">
                <Link
                  to="/ezohr/candidates"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/candidates')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  All Candidates
                </Link>
              </div>
            )}
          </div>

          {/* 4. Interviewer */}
          <div className="mb-1">
            <button
              type="button"
              onClick={() => toggleSubmenu('Interviewer')}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <CalendarCheck size={18} />
                <span>Interviewer</span>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                  openSubmenus['Interviewer'] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubmenus['Interviewer'] && (
              <div className="ml-7 mt-1 space-y-1 border-l border-blue-500 dark:border-slate-800 pl-2">
                {/* Assigned Interviews */}
                <Link
                  to="/ezohr/interviewer/interviews"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/interviewer/interviews')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <CalendarCheck size={15} />
                  View Assigned Interviews
                </Link>

                {/* Candidate Profile */}
                <Link
                  to="/ezohr/interviewer/candidate-profile"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/interviewer/candidate-profile')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <UserRound size={15} />
                  View Candidate Profile
                </Link>

                {/* Job Details */}
                <Link
                  to="/ezohr/interviewer/job-details"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/interviewer/job-details')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <BriefcaseBusiness size={15} />
                  View Job Details
                </Link>

                {/* Submit Feedback */}
                <Link
                  to="/ezohr/interviewer/feedback"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/interviewer/feedback')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <MessageSquareText size={15} />
                  Submit Feedback
                </Link>

                {/* Recommendation */}
                <Link
                  to="/ezohr/interviewer/recommendation"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/ezohr/interviewer/recommendation')
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ThumbsUp size={15} />
                  Give Recommendation
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-slate-800 p-3">
          <Link
            to="/ezohr/settings"
            onClick={handleLinkClick}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              isActive('/ezohr/settings')
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Settings size={18} />
            Settings
          </Link>

          <Link
            to="/ezohr/help"
            onClick={handleLinkClick}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              isActive('/ezohr/help')
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle size={18} />
            Help
          </Link>

          {/* User Profile Footer */}
          <div className="mt-3 flex items-center gap-3 rounded-md bg-blue-600 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-blue-500 text-sm font-semibold text-blue-600 dark:text-white shrink-0">
              <p className="capitalize">{user?.name ? user.name.charAt(0) : 'U'}</p>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white dark:text-slate-200 truncate capitalize">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-300 dark:text-slate-400 truncate">
                {user?.role || 'Member'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;