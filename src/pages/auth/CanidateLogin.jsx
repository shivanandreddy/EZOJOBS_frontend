
import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CandiateLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("candidateTheme") === "dark";
  });

  // Save theme preference
  useEffect(() => {
    localStorage.setItem(
      "candidateTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        console.error("Google credential not received");
        return;
      }

      // Send Google credential to your backend
      const response = await fetch(
        "http://localhost:3000/api/candiates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google login failed");
      }

      console.log("Candidate login successful:", data);

      // Save JWT + candidate in AuthContext/localStorage
      login(data.token, data.candiate);

      // Redirect to candidate dashboard
      navigate("/ezohr/candiate/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Candidate Google Login Error:", error);
      alert(error.message || "Google login failed");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    alert("Google login failed. Please try again.");
  };

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center px-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-950"
          : "bg-gray-50"
      }`}
    >
      {/* ================= THEME TOGGLE ================= */}
      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-yellow-300 hover:bg-gray-700"
            : "border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-100"
        }`}
        title={
          darkMode
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* ================= LOGIN CARD ================= */}
      <div
        className={`w-full max-w-md rounded-2xl border p-8 shadow-xl transition-colors duration-300 sm:p-10 ${
          darkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-200 bg-white"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
            E
          </div>

          <h1
            className={`text-2xl font-bold ${
              darkMode
                ? "text-white"
                : "text-gray-900"
            }`}>
          EZO JOBS
          </h1>

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Candidate Portal
          </p>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2
            className={`text-xl font-semibold ${
              darkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Candidate Login
          </h2>

          <p
            className={`mt-2 text-sm ${
              darkMode
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            Sign in with your Google account to continue
          </p>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme={darkMode ? "filled_black" : "outline"}
            size="large"
            width="320"
            text="continue_with"
          />
        </div>

        {/* Divider */}
        <div className="my-7 flex items-center">
          <div
            className={`h-px flex-1 ${
              darkMode
                ? "bg-gray-800"
                : "bg-gray-200"
            }`}
          />

          <span
            className={`px-4 text-xs ${
              darkMode
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          >
            SECURE LOGIN
          </span>

          <div
            className={`h-px flex-1 ${
              darkMode
                ? "bg-gray-800"
                : "bg-gray-200"
            }`}
          />
        </div>

        {/* Information */}
        <div
          className={`rounded-lg p-4 text-center text-xs ${
            darkMode
              ? "bg-gray-800/60 text-gray-400"
              : "bg-gray-50 text-gray-500"
          }`}
        >
          <p>
            By continuing, you agree to use your Google
            account to securely access the EZOHR Candidate
            Portal.
          </p>
        </div>

        {/* Footer */}
        <p
          className={`mt-6 text-center text-xs ${
            darkMode
              ? "text-gray-500"
              : "text-gray-400"
          }`}
        >
          © {new Date().getFullYear()} EZOHR. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default CandiateLogin;

