
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  Briefcase,
  FileText,
  Target,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Calendar,
  CheckCircle,
} from "lucide-react";

const CandiateDashboard = () => {
  const { darkMode, candidateName } = useOutletContext();

  const navigate = useNavigate();

  const { token, candiate } = useAuth();

  // --------------------------------------------------
  // Candidate ID
  // --------------------------------------------------
  const candidateId = candiate?._id || candiate?.id;

  // --------------------------------------------------
  // Dashboard Data
  // --------------------------------------------------
  const [dashboardData, setDashboardData] = useState({
    jobs: [],
    candiates: [],
    interviews: [],
    users: [],
  });

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Candidate Profile
  // --------------------------------------------------
  const [candidateProfile, setCandidateProfile] = useState(null);

  // --------------------------------------------------
  // Fetch Candidate Profile
  // --------------------------------------------------
  const fetchCandidateDetails = async () => {
    if (!candidateId || !token) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/candiates/${candidateId}`,
        config
      );

      const profileData =
        response.data?.data ||
        response.data?.info ||
        response.data;

      setCandidateProfile(profileData);
    } catch (err) {
      console.error("Candidate Profile Fetch Error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Dashboard
  // --------------------------------------------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard`,
        config
      );

      const data = response.data;

      if (data?.success) {
        setDashboardData({
          jobs: data.info?.jobs || [],
          candiates: data.info?.candiates || [],
          interviews: data.info?.interviews || [],
          users: data.info?.users || [],
        });
      } else {
        setError("Failed to load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Data
  // --------------------------------------------------
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setProfileLoading(false);
      setError("Authentication token not found.");
      return;
    }

    fetchDashboardData();
    fetchCandidateDetails();
  }, [token, candidateId]);

  // --------------------------------------------------
  // Candidate Profile Completion
  // --------------------------------------------------
  const getProfileCompletionPercentage = () => {
    const profile = candidateProfile || candiate;

    if (!profile) return 0;

    const pc =
      profile.profileCompletion ||
      profile.profile_completion;

    if (pc !== undefined && pc !== null) {
      if (
        typeof pc === "object" &&
        pc.percentage !== undefined
      ) {
        return Number(pc.percentage) || 0;
      }

      return Number(pc) || 0;
    }

    let score = 0;

    if (profile.name) {
      score += 20;
    }

    if (
      profile.age ||
      profile.location ||
      profile.gender
    ) {
      score += 20;
    }

    if (
      profile.currentSalary ||
      profile.previousCompanyName ||
      profile.experience !== null
    ) {
      score += 20;
    }

    if (
      profile.skills &&
      profile.skills.length > 0 &&
      profile.skills[0] !== ""
    ) {
      score += 20;
    }

    if (
      profile.graduation?.branch ||
      profile.school?.schoolName ||
      profile.inter?.collegeName
    ) {
      score += 20;
    }

    return score;
  };

  const profileCompletionPercentage =
    getProfileCompletionPercentage();

  // --------------------------------------------------
  // Dashboard Arrays
  // --------------------------------------------------
  const jobs = dashboardData.jobs;
  const candidates = dashboardData.candiates;
  const allInterviews = dashboardData.interviews;

  // --------------------------------------------------
  // Find Current Candidate
  // --------------------------------------------------
  const currentCandidate = useMemo(() => {
    return (
      candidates.find(
        (candidate) => candidate._id === candidateId
      ) ||
      candidateProfile ||
      candiate
    );
  }, [
    candidates,
    candidateId,
    candidateProfile,
    candiate,
  ]);

  // --------------------------------------------------
  // Candidate Role
  // student / employee
  // --------------------------------------------------
  const candidateRole =
    currentCandidate?.role?.toLowerCase() || "student";

  // --------------------------------------------------
  // Get Candidate's Applications
  // --------------------------------------------------
  const candidateApplications = useMemo(() => {
    if (!candidateId) return [];

    const applications = [];

    jobs.forEach((job) => {
      const application = job.candiatesApplied?.find(
        (item) => item.candiateId === candidateId
      );

      if (application) {
        applications.push({
          ...application,
          job,
        });
      }
    });

    return applications;
  }, [jobs, candidateId]);

  // --------------------------------------------------
  // Applied Jobs Count
  // --------------------------------------------------
  const appliedJobsCount =
    candidateApplications.length;

  // --------------------------------------------------
  // Candidate Interviews
  // --------------------------------------------------
  const candidateInterviews = useMemo(() => {
    if (!candidateId) return [];

    return allInterviews.filter(
      (interview) => interview.candiate === candidateId
    );
  }, [allInterviews, candidateId]);

  // --------------------------------------------------
  // Upcoming Interviews
  // --------------------------------------------------
  const upcomingInterviews = useMemo(() => {
    const now = new Date();

    const result = [];

    candidateInterviews.forEach((interview) => {
      const job = jobs.find(
        (item) => item._id === interview.job
      );

      interview.rounds?.forEach((round) => {
        if (!round.scheduledAt) return;

        const scheduledDate = new Date(
          round.scheduledAt
        );

        if (scheduledDate >= now) {
          result.push({
            interview,
            round,
            job,
          });
        }
      });
    });

    return result.sort(
      (a, b) =>
        new Date(a.round.scheduledAt) -
        new Date(b.round.scheduledAt)
    );
  }, [candidateInterviews, jobs]);

  // --------------------------------------------------
  // Selected / Hired
  // --------------------------------------------------
  const selectedApplications =
    candidateApplications.filter(
      (application) =>
        application.status === "Selected"
    );

  // --------------------------------------------------
  // Interview Status
  // --------------------------------------------------
  const interviewCount =
    candidateInterviews.length;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading && profileLoading) {
    return (
      <div
        className={`w-full min-h-[60vh] flex items-center justify-center ${
          darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        <div className="animate-pulse font-medium text-lg">
          Loading dashboard information...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Dashboard
  // --------------------------------------------------
  return (
    <div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* =========================================
          WELCOME
      ========================================== */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome,{" "}
          {candidateName ||
            currentCandidate?.name ||
            "Candidate"}{" "}
          👋
        </h1>

        <p
          className={`mt-2 ${
            darkMode
              ? "text-gray-400"
              : "text-gray-600"
          }`}
        >
          Find your opportunity and track your
          applications.
        </p>

        {/* Candidate Type */}
        <div className="mt-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              darkMode
                ? "bg-blue-900/40 text-blue-400"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {candidateRole === "employee"
              ? "Employee"
              : "Student"}
          </span>
        </div>
      </div>

      {/* =========================================
          STATS
      ========================================== */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Available Jobs"
          value={jobs.length}
          icon={
            <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          darkMode={darkMode}
        />

        <StatCard
          title="Applied Jobs"
          value={appliedJobsCount}
          icon={
            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          }
          darkMode={darkMode}
        />

        <StatCard
          title="Interviews"
          value={interviewCount}
          icon={
            <Target className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          }
          darkMode={darkMode}
        />

        <StatCard
          title="Selected"
          value={selectedApplications.length}
          icon={
            <Star className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          }
          darkMode={darkMode}
        />

      </div>

      {/* =========================================
          PROFILE COMPLETION
      ========================================== */}
      {!profileLoading &&
        profileCompletionPercentage < 100 && (
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
                  Complete your profile to get
                  better job recommendations.
                </p>
              </div>

              <span className="font-semibold text-blue-600">
                {profileCompletionPercentage}%
              </span>
            </div>

            <div
              className={`h-2 w-full overflow-hidden rounded-full ${
                darkMode
                  ? "bg-gray-700"
                  : "bg-gray-200"
              }`}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${profileCompletionPercentage}%`,
                }}
              />
            </div>

            <button
              onClick={() =>
                navigate(
                  "/ezohr/candiate/profile"
                )
              }
              className="mt-5 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Complete Profile
            </button>
          </section>
        )}

      {/* =========================================
          RECOMMENDED JOBS
      ========================================== */}
      <section
        className={`mb-8 rounded-xl border p-6 shadow-sm ${
          darkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Recommended Jobs
            </h2>

            <p
              className={`mt-1 text-sm ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Jobs currently available on Ezo Jobs
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/ezohr/candiate/jobs"
              )
            }
            className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.slice(0, 3).map((job) => {
              const application =
                job.candiatesApplied?.find(
                  (item) =>
                    item.candiateId === candidateId
                );

              return (
                <JobCard
                  key={job._id}
                  id={job._id}
                  title={
                    job.title ||
                    "Job Title"
                  }
                  company={
                    job.company ||
                    "Company Name"
                  }
                  location={
                    job.location ||
                    "Location"
                  }
                  type={
                    job.type ||
                    "Full Time"
                  }
                  salary={
                    job.salary ||
                    "As per industry standards"
                  }
                  status={
                    application?.status
                  }
                  darkMode={darkMode}
                />
              );
            })
          ) : (
            <div className="col-span-3 py-10 text-center">
              <Briefcase
                className="mx-auto mb-3 text-gray-400"
                size={36}
              />

              <p
                className={
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              >
                No jobs available right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          RECENT APPLICATIONS
      ========================================== */}
      <section
        className={`mb-8 rounded-xl border p-6 shadow-sm ${
          darkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Recent Applications
            </h2>

            <p
              className={`mt-1 text-sm ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Track the jobs you have applied for
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/ezohr/candiate/applications"
              )
            }
            className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        {candidateApplications.length === 0 ? (
          <div className="py-10 text-center">
            <FileText
              className="mx-auto mb-3 text-gray-400"
              size={36}
            />

            <p
              className={
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }
            >
              You haven't applied for any jobs yet.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/ezohr/candidate/jobs"
                )
              }
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          candidateApplications
            .slice(0, 5)
            .map((application) => (
              <Application
                key={`${application.job._id}-${application._id}`}
                id={application.job._id}
                title={
                  application.job.title
                }
                company={
                  application.job.company
                }
                status={
                  application.status
                }
                darkMode={darkMode}
              />
            ))
        )}
      </section>

      {/* =========================================
          UPCOMING INTERVIEWS
      ========================================== */}
      <section
        className={`rounded-xl border p-6 shadow-sm ${
          darkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Upcoming Interviews
            </h2>

            <p
              className={`mt-1 text-sm ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Your scheduled interview rounds
            </p>
          </div>

          <Calendar
            size={22}
            className="text-blue-600"
          />
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="py-10 text-center">
            <Calendar
              className="mx-auto mb-3 text-gray-400"
              size={36}
            />

            <p
              className={
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }
            >
              No upcoming interviews.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingInterviews
              .slice(0, 5)
              .map(
                ({
                  interview,
                  round,
                  job,
                }) => {
                  const scheduledDate =
                    new Date(
                      round.scheduledAt
                    );

                  return (
                    <div
                      key={`${interview._id}-${round._id}`}
                      className={`flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                        darkMode
                          ? "border-gray-700 bg-gray-800"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          <Calendar
                            size={18}
                          />
                        </div>

                        <div>
                          <h3 className="font-medium">
                            {job?.title ||
                              "Interview"}
                          </h3>

                          <p
                            className={`text-sm ${
                              darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {round.roundName ||
                              `Round ${round.roundNumber}`}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="font-medium">
                          {scheduledDate.toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>

                        <p
                          className={`text-sm ${
                            darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {scheduledDate.toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          round.status ===
                          "Selected"
                            ? darkMode
                              ? "bg-green-900/40 text-green-400"
                              : "bg-green-100 text-green-700"
                            : darkMode
                            ? "bg-yellow-900/40 text-yellow-400"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {round.status ||
                          "Scheduled"}
                      </span>
                    </div>
                  );
                }
              )}
          </div>
        )}
      </section>
    </div>
  );
};

/* ==================================================
   STAT CARD
================================================== */

const StatCard = ({
  title,
  value,
  icon,
  darkMode,
}) => (
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

      <div
        className={`rounded-xl p-3 ${
          darkMode
            ? "bg-gray-800"
            : "bg-slate-100"
        }`}
      >
        {icon}
      </div>
    </div>
  </div>
);

/* ==================================================
   JOB CARD
================================================== */

const JobCard = ({
  id,
  title,
  company,
  location,
  type,
  salary,
  status,
  darkMode,
}) => (
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

      <div
        className={`rounded-lg p-2 ${
          darkMode
            ? "border border-blue-900/40 bg-blue-950/50 text-blue-400"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        <Briefcase size={18} />
      </div>
    </div>

    <div
      className={`space-y-1.5 text-sm ${
        darkMode
          ? "text-gray-400"
          : "text-gray-600"
      }`}
    >
      <div className="flex items-center gap-2">
        <MapPin
          size={15}
          className="shrink-0 text-slate-400"
        />

        <span>{location}</span>
      </div>

      <div className="flex items-center gap-2">
        <Clock
          size={15}
          className="shrink-0 text-slate-400"
        />

        <span>{type}</span>
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between gap-2">
      <span className="text-sm font-semibold">
        {salary}
      </span>

      {status && (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            status === "Shortlisted"
              ? darkMode
                ? "bg-green-900/40 text-green-400"
                : "bg-green-100 text-green-700"
              : status === "Rejected"
              ? darkMode
                ? "bg-red-900/40 text-red-400"
                : "bg-red-100 text-red-700"
              : darkMode
              ? "bg-blue-900/40 text-blue-400"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status}
        </span>
      )}

      <Link
        to={`/ezohr/candiate/jobs/${id}`}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        View Job
      </Link>
    </div>
  </div>
);

/* ==================================================
   APPLICATION
================================================== */

const Application = ({
  id,
  title,
  company,
  status,
  darkMode,
}) => {
  const statusClasses = {
    Selected: darkMode
      ? "bg-green-900/40 text-green-400"
      : "bg-green-100 text-green-700",

    Shortlisted: darkMode
      ? "bg-green-900/40 text-green-400"
      : "bg-green-100 text-green-700",

    Rejected: darkMode
      ? "bg-red-900/40 text-red-400"
      : "bg-red-100 text-red-700",

    Interview: darkMode
      ? "bg-purple-900/40 text-purple-400"
      : "bg-purple-100 text-purple-700",

    Applied: darkMode
      ? "bg-blue-900/40 text-blue-400"
      : "bg-blue-100 text-blue-700",

    "Under Review": darkMode
      ? "bg-yellow-900/40 text-yellow-400"
      : "bg-yellow-100 text-yellow-700",
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

      <div className="flex items-center gap-3">
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
            statusClasses[status] ||
            (darkMode
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-100 text-gray-700")
          }`}
        >
          {status || "Applied"}
        </span>

        {id && (
          <Link
            to={`/ezohr/candiate/jobs/${id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
};

export default CandiateDashboard;

