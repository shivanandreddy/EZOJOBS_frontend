import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { UserContext } from '../../context/UserContext'; // Adjust path to your UserContext file

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext); // Destructure your context's login function (or setUser)
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/`, {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      if (token) {
        // Pass token and user data to your UserContext handler 
        login(token, user || { email: formData.email });
        navigate('/ezojobs');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200"
      style={{ minHeight: '100vh', display: 'flex', width: '100%' }}
    >
      {/* Left Section: Form */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-1/2 xl:p-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-slate-100">
            EZO Jobs
          </span>
        </div>

        {/* Form Container */}
        <div className="mx-auto my-auto w-full max-w-md py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
              Please enter your details to sign in to your workspace.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 dark:text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/ezojobs/register/"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition ml-1"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500">
          <span>&copy; {new Date().getFullYear()} EZO Jobs Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-700 dark:hover:text-slate-300 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-slate-300 transition">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Right Section: Image Hero */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
          alt="Recruitment and Hiring Collaboration"
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-md shadow-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={14} /> Modern Recruitment Platform
            </div>
            <h2 className="text-3xl  sm:text-3xl text-white">
              Your Recruitment and Hiring Power House
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Manage candidate pipelines, organize interview schedules, track open positions, and collaborate seamlessly across your hiring teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;