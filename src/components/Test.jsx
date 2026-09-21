import React from 'react';
import { useUser } from '../context/UserContext'; // Adjust path to point to your UserContext file

const Test = () => {
  const { user, token, isAuthenticated, logout, loading } = useUser();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading user context...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-md border border-gray-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          UserContext Test Panel
        </h2>

        {/* Authentication Status Badge */}
        <div className="mb-4">
          <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Status: </span>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
          }`}>
            {isAuthenticated ? 'Authenticated (Logged In)' : 'Not Authenticated'}
          </span>
        </div>

        {/* User Details */}
        <div className="space-y-2 mb-6">
          <div className="text-sm">
            <span className="font-semibold text-gray-700 dark:text-slate-300">User Data:</span>
            <pre className="mt-1 p-2 bg-gray-50 dark:bg-slate-950 rounded text-xs text-gray-800 dark:text-slate-200 overflow-x-auto">
              {user ? JSON.stringify(user, null, 2) : 'null'}
            </pre>
          </div>

          <div className="text-sm truncate">
            <span className="font-semibold text-gray-700 dark:text-slate-300">Token:</span>
            <p className="mt-1 p-2 bg-gray-50 dark:bg-slate-950 rounded text-xs text-gray-600 dark:text-slate-400 truncate">
              {token || 'No token found'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isAuthenticated && (
          <button
            onClick={logout}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Test Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Test;