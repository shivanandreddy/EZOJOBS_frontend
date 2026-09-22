import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  HelpCircle,
  UserCircle,
  Sun,
  Moon,
  Search,
  LogOut,
  User,
  Settings,
} from 'lucide-react';

const Topbar = ({ sidebarOpen, setSidebarOpen, title, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Theme state: defaults to local storage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Sync state with <html> class & localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Logout handler function
  const handleLogout = async () => {
    try {
      // Clear client storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();

      // Trigger optional parent handler (e.g., clearing global auth state)
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Redirect to login or logout page
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-blue-600 dark:bg-slate-900 px-4 transition-colors duration-200">
      {/* Left section: Sidebar toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-2 text-white dark:text-slate-300 hover:bg-blue-500 dark:hover:bg-slate-800 transition"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100 hidden sm:block">
          {title}
        </h1> */}
      </div>

      {/* Center section: Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        {/* Desktop / Tablet Search Bar */}
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 px-3 py-1.5 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
          <Search
            size={18}
            className="text-gray-400 dark:text-slate-400 shrink-0"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects, or team members..."
            className="w-full bg-transparent text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Mobile Search Input overlay when active */}
        {isMobileSearchOpen && (
          <div className="absolute inset-x-0 top-0 z-40 flex h-16 items-center gap-2  dark:bg-slate-900 px-4 sm:hidden">
            <div className="flex flex-1 items-center gap-2 rounded-md border  border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 px-3 py-1.5">
              <Search
                size={18}
                className="text-gray-400 dark:text-slate-400 shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-transparent text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none"
              />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="rounded-md p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Right section: Action Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search Toggle Icon */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="sm:hidden rounded-md p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          <Search size={20} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="rounded-md p-2 text-white dark:text-slate-300 hover:bg-blue-500 dark:hover:bg-slate-800 transition"
        >
          {darkMode ? (
            <Sun size={20} className="text-amber-400" />
          ) : (
            <Moon size={20} />
          )}
        </button>

        <button className="rounded-md p-2 text-white dark:text-slate-300 hover:bg-blue-500 dark:hover:bg-slate-800 transition">
          <HelpCircle size={20} />
        </button>

        <button className="relative rounded-md p-2 text-white dark:text-slate-300 hover:bg-blue-500 dark:hover:bg-slate-800 transition">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="rounded-md p-2 text-white dark:text-slate-300 hover:bg-blue-500 dark:hover:bg-slate-800 transition flex items-center gap-1"
          >
            <UserCircle size={24} />
          </button>

          {/* Dropdown Content */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100">
                  User Account
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                  user@example.com
                </p>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/ezohr/profile');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/ezohr/settings');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="border-t border-gray-100 dark:border-slate-700 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;