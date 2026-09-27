
import { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Calendar,
  Users,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    jobs: [],
    candiates: [],
    interviews: [],
    users: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Get logged-in user
  // --------------------------------------------------
  const loggedInUser = useMemo(() => {
    try {
      const user = localStorage.getItem("user");

      if (!user) return null;

      return JSON.parse(user);
    } catch (error) {
      console.error("Unable to read logged-in user:", error);
      return null;
    }
  }, []);

  const userRole = loggedInUser?.role?.toLowerCase();
  const userId = loggedInUser?._id || loggedInUser?.id;

  // --------------------------------------------------
  // Fetch Dashboard Data
  // --------------------------------------------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard`
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

    fetchDashboardData();
  }, []);

  // --------------------------------------------------
  // Data
  // --------------------------------------------------
  const jobs = dashboardData.jobs;
  const candidates = dashboardData.candiates;
  const allInterviews = dashboardData.interviews;

  // --------------------------------------------------
  // Find Candidate
  // --------------------------------------------------
  const getCandidate = (candidateId) => {
    return candidates.find(
      (candidate) => candidate._id === candidateId
    );
  };

  // --------------------------------------------------
  // Find Job
  // --------------------------------------------------
  const getJob = (jobId) => {
    return jobs.find((job) => job._id === jobId);
  };

  // --------------------------------------------------
  // Filter interviews for logged-in role
  // --------------------------------------------------
  const interviews = useMemo(() => {
    if (userRole === "interviewer") {
      return allInterviews.filter((interview) =>
        interview.rounds?.some(
          (round) => round.interviewer === userId
        )
      );
    }

    // HR can see all interviews
    return allInterviews;
  }, [allInterviews, userRole, userId]);

  // --------------------------------------------------
  // Current / Active Jobs
  // --------------------------------------------------
  const activeJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = job.status?.toLowerCase();

      return (
        status === "active" ||
        status === "published" ||
        status === "open"
      );
    });
  }, [jobs]);

  // --------------------------------------------------
  // Total Applications
  // --------------------------------------------------
  const totalApplications = useMemo(() => {
    return jobs.reduce((total, job) => {
      return total + (job.candiatesApplied?.length || 0);
    }, 0);
  }, [jobs]);

  // --------------------------------------------------
  // Application Status Counts
  // --------------------------------------------------
  const applicationStatus = useMemo(() => {
    const statusCounts = {
      Applied: 0,
      Shortlisted: 0,
      Rejected: 0,
      Selected: 0,
      Interview: 0,
    };

    jobs.forEach((job) => {
      job.candiatesApplied?.forEach((application) => {
        const status = application.status;

        if (statusCounts[status] !== undefined) {
          statusCounts[status]++;
        }
      });
    });

    return statusCounts;
  }, [jobs]);

  // --------------------------------------------------
  // New Candidates
  // --------------------------------------------------
  const newCandidates = useMemo(() => {
    const currentDate = new Date();

    return candidates.filter((candidate) => {
      if (!candidate.createdAt) return false;

      const createdDate = new Date(candidate.createdAt);

      const difference =
        currentDate.getTime() - createdDate.getTime();

      const days = difference / (1000 * 60 * 60 * 24);

      return days <= 30;
    });
  }, [candidates]);

  // --------------------------------------------------
  // Upcoming Interviews
  // --------------------------------------------------
  const upcomingInterviews = useMemo(() => {
    const now = new Date();

    return interviews
      .map((interview) => {
        const candidate = getCandidate(interview.candiate);
        const job = getJob(interview.job);

        // For interviewer, only show their assigned rounds
        let rounds = interview.rounds || [];

        if (userRole === "interviewer") {
          rounds = rounds.filter(
            (round) => round.interviewer === userId
          );
        }

        const upcomingRounds = rounds.filter(
          (round) =>
            round.scheduledAt &&
            new Date(round.scheduledAt) >= now
        );

        return {
          ...interview,
          candidate,
          job,
          rounds: upcomingRounds,
        };
      })
      .filter((interview) => interview.rounds.length > 0)
      .sort((a, b) => {
        return (
          new Date(a.rounds[0].scheduledAt) -
          new Date(b.rounds[0].scheduledAt)
        );
      });
  }, [
    interviews,
    candidates,
    jobs,
    userRole,
    userId,
  ]);

  // --------------------------------------------------
  // Interview Statistics
  // --------------------------------------------------
  const interviewStats = useMemo(() => {
    let scheduled = 0;
    let selected = 0;
    let pending = 0;

    interviews.forEach((interview) => {
      interview.rounds?.forEach((round) => {
        if (
          (userRole === "interviewer" || userRole === "admin") &&
          round.interviewer !== userId
        ) {
          return;
        }

        if (round.scheduledAt) {
          scheduled++;
        }

        if (round.status === "Selected") {
          selected++;
        }

        if (
          !round.status ||
          round.status === "Pending" ||
          round.status === "Scheduled"
        ) {
          pending++;
        }
      });
    });

    return {
      scheduled,
      selected,
      pending,
    };
  }, [interviews, userRole, userId]);

  // --------------------------------------------------
  // Dashboard Stats
  // --------------------------------------------------
  const stats =
   ( userRole === "interviewer" || userRole === "admin")
      ? [
          {
            title: "Assigned Interviews",
            value: interviews.length,
            icon: <Calendar size={22} />,
            color:
              "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          },
          {
            title: "Upcoming Rounds",
            value: upcomingInterviews.reduce(
              (total, interview) =>
                total + interview.rounds.length,
              0
            ),
            icon: <Clock size={22} />,
            color:
              "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
          },
          {
            title: "Selected Rounds",
            value: interviewStats.selected,
            icon: <CheckCircle size={22} />,
            color:
              "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
          },
          {
            title: "Pending Evaluations",
            value: interviewStats.pending,
            icon: <FileText size={22} />,
            color:
              "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
          },
        ]
      : [
          {
            title: "Active Job Openings",
            value: activeJobs.length,
            icon: <Briefcase size={22} />,
            color:
              "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          },
          {
            title: "Interviews Scheduled",
            value: interviews.length,
            icon: <Calendar size={22} />,
            color:
              "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
          },
          {
            title: "Total Candidates",
            value: candidates.length,
            icon: <Users size={22} />,
            color:
              "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
          },
          {
            title: "New Candidates",
            value: newCandidates.length,
            icon: <Sparkles size={22} />,
            color:
              "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
          },
        ];

  // --------------------------------------------------
  // Date Format
  // --------------------------------------------------
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // Time Format
  // --------------------------------------------------
  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="font-medium text-gray-600 dark:text-gray-300">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Dashboard
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-transparent">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {(userRole === "interviewer")
              ? "View your assigned interviews and candidate evaluations."
              : "Welcome back! Here's what's happening with your recruitment."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================
          HR DASHBOARD
      ================================= */}
      {(userRole === "hr" || userRole === "admin") && (
        <>
          {/* Jobs + Pipeline */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Jobs */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 p-5 dark:border-gray-800">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Current Job Openings
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Recently posted positions
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-3">
                        Position
                      </th>

                      <th className="px-5 py-3">
                        Department
                      </th>

                      <th className="px-5 py-3">
                        Applicants
                      </th>

                      <th className="px-5 py-3">
                        Status
                      </th>

                      <th className="px-5 py-3">
                        Posted
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {jobs.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-5 py-6 text-center text-gray-500"
                        >
                          No job openings found.
                        </td>
                      </tr>
                    ) : (
                      jobs.map((job) => (
                        <tr
                          key={job._id}
                          className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {job.title}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                            {job.department || "-"}
                          </td>

                          <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                            {job.candiatesApplied?.length || 0}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              {job.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                            {formatDate(job.postedDate)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Candidate Pipeline */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Candidate Pipeline
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Candidate recruitment stages
                </p>
              </div>

              <div className="space-y-5">
                {Object.entries(applicationStatus).map(
                  ([status, count]) => (
                    <div key={status}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          {status}
                        </span>

                        <span className="font-semibold text-gray-900 dark:text-white">
                          {count}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width:
                              totalApplications > 0
                                ? `${Math.min(
                                    (count / totalApplications) * 100,
                                    100
                                  )}%`
                                : "0%",
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================================
          INTERVIEWER DASHBOARD
      ================================= */}
      {(userRole === "interviewer" || userRole === "admin") && (
        <div className="mb-6 mt-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              My Assigned Interviews
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Interviews and rounds assigned to you
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3">
                    Candidate
                  </th>

                  <th className="px-5 py-3">
                    Job
                  </th>

                  <th className="px-5 py-3">
                    Round
                  </th>

                  <th className="px-5 py-3">
                    Scheduled
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {upcomingInterviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No upcoming interviews assigned to you.
                    </td>
                  </tr>
                ) : (
                  upcomingInterviews.map((interview) =>
                    interview.rounds.map((round) => (
                      <tr
                        key={`${interview._id}-${round._id}`}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {interview.candidate?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {interview.candidate?.name ||
                                  "Unknown Candidate"}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {interview.candidate?.email ||
                                  "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          {interview.job?.title || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            Round {round.roundNumber}:{" "}
                            {round.roundName}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(round.scheduledAt)}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(round.scheduledAt)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              round.status === "Selected"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {round.status || "Scheduled"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================
          UPCOMING INTERVIEWS
      ================================= */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="border-b border-gray-200 p-5 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Upcoming Interviews
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {userRole === "interviewer"
              ? "Your upcoming interview rounds"
              : "Scheduled candidate interviews"}
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-gray-800">
          {upcomingInterviews.length === 0 ? (
            <div className="col-span-2 p-8 text-center text-gray-500 dark:text-gray-400">
              No upcoming interviews scheduled.
            </div>
          ) : (
            upcomingInterviews.slice(0, 4).map((interview) => {
              const round = interview.rounds[0];

              return (
                <div
                  key={`${interview._id}-${round._id}`}
                  className="flex items-center gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {interview.candidate?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {interview.candidate?.name ||
                        "Unknown Candidate"}
                    </h3>

                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {interview.job?.title || "-"}
                    </p>

                    <span className="mt-2 inline-block rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {round.roundName}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(round.scheduledAt)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(round.scheduledAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================================
          HR SUMMARY
      ================================= */}
      {userRole === "hr" && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">
                  Total Applications
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {totalApplications}
                </h3>

                <p className="mt-2 text-sm text-blue-100">
                  Across all jobs
                </p>
              </div>

              <FileText size={32} />
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">
                  Shortlisted Candidates
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {applicationStatus.Shortlisted}
                </h3>

                <p className="mt-2 text-sm text-purple-100">
                  Candidates moved forward
                </p>
              </div>

              <UserCheck size={32} />
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-green-600 to-green-500 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">
                  Selected Candidates
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {applicationStatus.Selected}
                </h3>

                <p className="mt-2 text-sm text-green-100">
                  Successfully selected
                </p>
              </div>

              <CheckCircle size={32} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;

