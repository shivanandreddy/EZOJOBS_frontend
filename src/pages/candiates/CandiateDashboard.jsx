import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { 
  Briefcase, 
  FileText, 
  Target, 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight 
} from "lucide-react";

const CandiateDashboard = () => {
  // Grab state/props shared from layout if needed (like darkMode)
  const { darkMode, candidateName } = useOutletContext();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [candidateProfile, setCandidateProfile] = useState(null);
  
  const [statsData, setStatsData] = useState({
    openings: "0",
    interviews: "0",
    activeCandidates: "0",
    newCandidates: "0",
    openingsChange: "+0%",
    interviewsChange: "+0%",
    activeChange: "+0%",
    newChange: "+0%",
  });
  
  const [interviews, setInterviews] = useState([]);
  const [totals, setTotals] = useState({
    applications: 0,
    offers: 0,
    hired: 0,
  });

  const { token, candiate } = useAuth();
  const candidateId = candiate?._id || candiate?.id;

  // Fetch full candidate details by ID to get profile completion data
  const fetchCandidateDetails = async () => {
    if (!candidateId || !token) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/candiates/${candidateId}`,
        config
      );
      
      const profileData = res.data.data || res.data.info || res.data;
      setCandidateProfile(profileData);
    } catch (err) {
      console.error("Candidate Profile Fetch Error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Extract profile completion percentage dynamically from fetched candidate details
  const getProfileCompletionPercentage = () => {
    const profile = candidateProfile || candiate;
    if (!profile) return 0;
    
    // Check if profileCompletion exists directly on the object (as object or number)
    const pc = profile.profileCompletion || profile.profile_completion;
    if (pc !== undefined && pc !== null) {
      if (typeof pc === "object" && pc.percentage !== undefined) {
        return Number(pc.percentage) || 0;
      }
      return Number(pc) || 0;
    }
    
    // Fallback calculation checking your fully populated schema fields
    let score = 0;
    if (profile.name) score += 20;
    if (profile.age || profile.location || profile.gender) score += 20;
    if (profile.currentSalary || profile.previousCompanyName || profile.experience !== null) score += 20;
    if (profile.skills && profile.skills.length > 0 && profile.skills[0] !== "") score += 20;
    if (profile.graduation?.branch || profile.school?.schoolName || profile.inter?.collegeName) score += 20;
    
    return score;
  };

  const profileCompletionPercentage = getProfileCompletionPercentage();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch dashboard data from backend API endpoint
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`, config);
      const dashboardData = response.data.info || response.data.data || response.data;

      if (dashboardData) {
        setStatsData(dashboardData.stats || statsData);
        setJobs(dashboardData.jobs || []);
        setInterviews(dashboardData.interviews || []);
        setTotals(dashboardData.totals || { applications: 0, offers: 0, hired: 0 });
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
      fetchCandidateDetails();
    } else {
      setLoading(false);
      setProfileLoading(false);
      setError("Authentication token not found.");
    }
  }, [token, candidateId]);

  // General Loading State
  if (loading && profileLoading) {
    return (
      <div className={`w-full min-h-[60vh] flex items-center justify-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        <div className="animate-pulse font-medium text-lg">
          Loading dashboard information...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome, {candidateName || candidateProfile?.name || candiate?.name || "Candidate"} 👋
        </h1>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Find your opportunity and track your applications.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Vacancies" value={jobs.length} icon={<Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />} darkMode={darkMode} />
        <StatCard title="Applied Jobs" value={totals.applications || "5"} icon={<FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />} darkMode={darkMode} />
        <StatCard title="Interviews" value={interviews.length || "2"} icon={<Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />} darkMode={darkMode} />
        <StatCard title="Offers / Hired" value={totals.hired || "0"} icon={<Star className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />} darkMode={darkMode} />
      </div>

      {/* ================= PROFILE COMPLETION (Hidden if 100%) ================= */}
      {!profileLoading && profileCompletionPercentage < 100 && (
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
            <span className="font-semibold text-blue-600">{profileCompletionPercentage}%</span>
          </div>

          <div className={`h-2 w-full overflow-hidden rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <div 
              className="h-full rounded-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${profileCompletionPercentage}%` }}
            />
          </div>

          <button 
            onClick={() => navigate("/ezohr/candiate/profile")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
          >
            Complete Profile
          </button>
        </section>
      )}

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
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.slice(0, 3).map((job) => (
              <JobCard 
                key={job._id} 
                id={job._id}
                title={job.title || "Job Title"} 
                company={job.company || "Company Name"} 
                location={job.location || "Location"} 
                type={job.type || "Full Time"} 
                salary={job.salary || "As per industry standards"} 
                darkMode={darkMode} 
              />
            ))
          ) : (
            <>
              <JobCard title="Frontend Developer" company="ABC Technologies" location="Hyderabad" type="Full Time" salary="₹5 - ₹8 LPA" darkMode={darkMode} />
              <JobCard title="Node.js Developer" company="XYZ Solutions" location="Bangalore" type="Full Time" salary="₹6 - ₹10 LPA" darkMode={darkMode} />
              <JobCard title="React Developer" company="Tech Solutions Pvt Ltd" location="Hyderabad" type="Remote" salary="₹4 - ₹7 LPA" darkMode={darkMode} />
            </>
          )}
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
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        <Application title="Full Stack Developer" company="ABC Technologies" status="Interview" statusStyle="green" darkMode={darkMode} />
        <Application title="Backend Developer" company="XYZ Solutions" status="Under Review" statusStyle="yellow" darkMode={darkMode} />
        <Application title="React Developer" company="Tech Solutions" status="Applied" statusStyle="blue" darkMode={darkMode} />
      </section>
    </div>
  );
};

/* Reusable Sub-components */
const StatCard = ({ title, value, icon, darkMode }) => (
  <div className={`rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 ${darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-800 text-blue-400" : "bg-slate-100 text-blue-600"}`}>{icon}</div>
    </div>
  </div>
);

const JobCard = ({ id, title, company, location, type, salary, darkMode }) => (
  <div className={`rounded-lg border p-5 transition hover:shadow-md ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{company}</p>
      </div>
      <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-950/50 text-blue-400 border border-blue-900/40" : "bg-blue-50 text-blue-600"}`}>
        <Briefcase size={18} />
      </div>
    </div>
    <div className={`space-y-1.5 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
      <div className="flex items-center gap-2">
        <MapPin size={15} className="shrink-0 text-slate-400" />
        <span>{location}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={15} className="shrink-0 text-slate-400" />
        <span>{type}</span>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <span className="font-semibold text-sm">{salary}</span>
      {id ? (
        <Link 
          to={`/ezohr/candiate/jobs/${id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          View Job
        </Link>
      ) : (
        <button 
          disabled
          className="rounded-lg bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed"
        >
          View Job
        </button>
      )}
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