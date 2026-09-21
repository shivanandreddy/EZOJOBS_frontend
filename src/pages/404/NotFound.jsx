import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-gray-800 dark:text-white">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Page Not Found
        </h2>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/ezohr/home"
          className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;