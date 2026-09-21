import React from "react";
import { 
  Briefcase, 
  Calendar, 
  Users, 
  Sparkles, 
  Plus, 
  ArrowUpRight 
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Current Job Openings",
      value: "24",
      change: "+12%",
      changeText: "from last month",
      icon: <Briefcase size={22} />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Interviews Scheduled",
      value: "18",
      change: "+8%",
      changeText: "from last week",
      icon: <Calendar size={22} />,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Active Candidates",
      value: "156",
      change: "+18%",
      changeText: "from last month",
      icon: <Users size={22} />,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "New Candidates",
      value: "42",
      change: "+24%",
      changeText: "this month",
      icon: <Sparkles size={22} />,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ];

  const jobs = [
    {
      title: "Senior React Developer",
      department: "Engineering",
      applicants: 32,
      status: "Active",
      posted: "2 days ago",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      applicants: 24,
      status: "Active",
      posted: "4 days ago",
    },
    {
      title: "Product Manager",
      department: "Product",
      applicants: 18,
      status: "Active",
      posted: "1 week ago",
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      applicants: 27,
      status: "Active",
      posted: "1 week ago",
    },
  ];

  const interviews = [
    {
      candidate: "Sarah Johnson",
      role: "Senior React Developer",
      date: "Today",
      time: "10:30 AM",
      type: "Technical Round",
      avatar: "SJ",
    },
    {
      candidate: "Michael Chen",
      role: "UI/UX Designer",
      date: "Today",
      time: "02:00 PM",
      type: "HR Interview",
      avatar: "MC",
    },
    {
      candidate: "Emily Davis",
      role: "Product Manager",
      date: "Tomorrow",
      time: "11:00 AM",
      type: "Final Round",
      avatar: "ED",
    },
    {
      candidate: "James Wilson",
      role: "Marketing Manager",
      date: "Tomorrow",
      time: "03:30 PM",
      type: "Manager Round",
      avatar: "JW",
    },
  ];

  const pipeline = [
    { name: "Applied", count: 156, color: "bg-blue-500" },
    { name: "Screening", count: 82, color: "bg-purple-500" },
    { name: "Interview", count: 45, color: "bg-yellow-500" },
    { name: "Offer", count: 18, color: "bg-green-500" },
    { name: "Hired", count: 12, color: "bg-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your recruitment.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow-sm">
          <Plus size={16} />
          <span>Post New Job</span>
        </button>
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

                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h2>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="font-semibold text-green-600 flex items-center gap-0.5">
                <ArrowUpRight size={14} />
                {stat.change}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {stat.changeText}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Job Openings */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Current Job Openings</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Recently posted positions
              </p>
            </div>

            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3">Position</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Applicants</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Posted</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {jobs.map((job) => (
                  <tr
                    key={job.title}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                    </td>

                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {job.department}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                      {job.applicants}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {job.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {job.posted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Pipeline */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white">Candidate Pipeline</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Candidate recruitment stages
            </p>
          </div>

          <div className="space-y-5">
            {pipeline.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.name}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${Math.min((item.count / 156) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interviews */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Upcoming Interviews</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your scheduled candidate interviews
            </p>
          </div>

          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
            View Calendar
          </button>
        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-gray-800">
          {interviews.map((interview) => (
            <div
              key={`${interview.candidate}-${interview.time}`}
              className="flex items-center gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {interview.avatar}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {interview.candidate}
                </h3>

                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                  {interview.role}
                </p>

                <span className="mt-2 inline-block rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {interview.type}
                </span>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{interview.date}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {interview.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow-sm">
          <p className="text-sm text-blue-100">Total Applications</p>
          <h3 className="mt-2 text-3xl font-bold">328</h3>
          <p className="mt-2 text-sm text-blue-100">
            Across all open positions
          </p>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 p-5 text-white shadow-sm">
          <p className="text-sm text-purple-100">Offers Sent</p>
          <h3 className="mt-2 text-3xl font-bold">18</h3>
          <p className="mt-2 text-sm text-purple-100">
            12 candidates accepted
          </p>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-green-600 to-green-500 p-5 text-white shadow-sm">
          <p className="text-sm text-green-100">Successful Hires</p>
          <h3 className="mt-2 text-3xl font-bold">12</h3>
          <p className="mt-2 text-sm text-green-100">
            This month
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;