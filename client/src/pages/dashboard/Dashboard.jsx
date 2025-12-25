import React, { useEffect, useState } from "react";
import useAuth from "../../store/UseAuth";
import {
  Briefcase,
  FolderGit2,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Loader2,
  Users,
  Award,
  Presentation,
  FileText,
  TrendingUp,
} from "lucide-react";

// Stat Card Component - Modern gradient style
const StatCard = ({ icon: Icon, value, label, gradient, iconBg }) => (
  <div className={`relative overflow-hidden rounded-xl p-4 ${gradient}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/80 mt-1">{label}</p>
      </div>
      <div className={`p-3 rounded-full ${iconBg}`}>
        <Icon className="text-white" size={22} />
      </div>
    </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };
  const icons = {
    Approved: CheckCircle2,
    Pending: Clock,
    Rejected: XCircle,
  };
  const StatusIcon = icons[status] || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
        styles[status] || styles.Pending
      }`}
    >
      <StatusIcon size={12} />
      {status}
    </span>
  );
};

// Recent Item Component - Modern card style
const RecentItem = ({ title, type, date, status }) => (
  <div className="group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
      <FileText className="text-white" size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
        {title}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        {type} • {date}
      </p>
    </div>
    <StatusBadge status={status} />
  </div>
);

// Status Summary Card
const StatusSummaryCard = ({ icon: Icon, label, count, color, bgColor }) => (
  <div className={`flex items-center gap-3 p-4 rounded-xl ${bgColor}`}>
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="text-white" size={18} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

// Skill Progress Component - Modern style
const SkillProgress = ({ skill, completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-700">{skill}</span>
        <span className="text-xs font-medium text-indigo-600">
          {completed}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Mentorship Line Component
const MentorshipLine = ({ skill, count }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-700">{skill}</span>
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
      {count} mentees
    </span>
  </div>
);

export default function Dashboard() {
  const { rollno } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCertifications: 0,
    totalHackathons: 0,
    totalInternships: 0,
    totalPapers: 0,
    totalPatents: 0,
    pendingApprovals: 0,
    approvedItems: 0,
    rejectedItems: 0,
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [mentorshipData, setMentorshipData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:6001/";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!rollno) return;

      setLoading(true);
      try {
        // Fetch upload details
        const uploadsRes = await fetch(
          `${API_URL}api/uploadview/getuploaddetails`,
          { credentials: "include" }
        );

        if (uploadsRes.ok) {
          const uploadsData = (await uploadsRes.json()) || [];

          const projects = uploadsData.filter(
            (item) => item.type === "Project"
          );
          const certificates = uploadsData.filter(
            (item) => item.type === "Certificate"
          );
          const internships = uploadsData.filter(
            (item) => item.type === "Internship"
          );
          const hackathons = certificates.filter(
            (item) => item["SUb-type"] === "Hackathon"
          );
          const pending = uploadsData.filter(
            (item) => item.status === "Pending"
          );
          const approved = uploadsData.filter(
            (item) => item.status === "Verified"
          );
          const rejected = uploadsData.filter(
            (item) => item.status === "Rejected"
          );

          setStats((prev) => ({
            ...prev,
            totalProjects: projects.length,
            totalCertifications: certificates.length,
            totalHackathons: hackathons.length,
            totalInternships: internships.length,
            pendingApprovals: pending.length,
            approvedItems: approved.length,
            rejectedItems: rejected.length,
          }));

          const formattedUploads = uploadsData.slice(0, 6).map((item) => {
            const date = new Date(item.uploaded_on);
            return {
              title: item.title,
              type: item.type,
              date: date.toLocaleDateString(),
              status:
                item.status === "Verified"
                  ? "Approved"
                  : item.status === "Rejected"
                  ? "Rejected"
                  : "Pending",
            };
          });
          setRecentUploads(formattedUploads);
        }
        // Fetch dashboard stats (papers and patents count)
        try {
          const statsRes = await fetch(
            `${API_URL}api/resume/dashboardstats/${rollno}`,
            { credentials: "include" }
          );
          if (statsRes.ok) {
            const dashStats = await statsRes.json();
            setStats((prev) => ({
              ...prev,
              totalPapers: dashStats?.total_papers || 0,
              totalPatents: dashStats?.total_patents || 0,
            }));
          }
        } catch (err) {
          console.error("Error fetching dashboard stats:", err);
        }

        // Fetch skill completion data (PS levels)
        try {
          const skillRes = await fetch(
            `${API_URL}api/ps/levels_status/${rollno}`,
            { credentials: "include" }
          );
          if (skillRes.ok) {
            const skillsResponse = await skillRes.json();
            const skillsData = skillsResponse?.data || [];
            if (Array.isArray(skillsData)) {
              const skillMap = {};
              skillsData.forEach((skill) => {
                const name = skill.skill_name;
                if (!skillMap[name]) {
                  skillMap[name] = {
                    completed: 0,
                    total: skill.total_levels || 7,
                  };
                }
                // Count each completed level entry as one completed level
                if (
                  skill.status === "completed" ||
                  skill.status === "Completed"
                ) {
                  skillMap[name].completed++;
                }
                // Update total_levels if available (use the latest value)
                if (skill.total_levels) {
                  skillMap[name].total = skill.total_levels;
                }
              });
              setSkillData(
                Object.entries(skillMap)
                  .slice(0, 6)
                  .map(([name, data]) => ({
                    skill: name,
                    completed: data.completed,
                    total: data.total,
                  }))
              );
            }
          }
        } catch (err) {
          console.error("Error fetching skills:", err);
        }

        // Fetch mentorship data
        try {
          const mentorRes = await fetch(
            `${API_URL}api/ps/metorships/${rollno}`,
            { credentials: "include" }
          );
          if (mentorRes.ok) {
            const mentorData = await mentorRes.json();
            if (mentorData && mentorData.mentorships) {
              setMentorshipData(mentorData.mentorships.slice(0, 6));
            }
          }
        } catch (err) {
          console.error("Error fetching mentorship data:", err);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [rollno]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-500 mx-auto" size={40} />
          <span className="mt-3 text-gray-500 block">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 w-full h-full overflow-auto bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here's your overview.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          icon={FolderGit2}
          value={stats.totalProjects}
          label="Projects"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          iconBg="bg-blue-400/30"
        />
        <StatCard
          icon={FileCheck}
          value={stats.totalCertifications}
          label="Certifications"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          iconBg="bg-emerald-400/30"
        />
        <StatCard
          icon={Award}
          value={stats.totalHackathons}
          label="Hackathons"
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          iconBg="bg-amber-400/30"
        />
        <StatCard
          icon={Briefcase}
          value={stats.totalInternships}
          label="Internships"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          iconBg="bg-purple-400/30"
        />
        <StatCard
          icon={Presentation}
          value={stats.totalPapers}
          label="Papers"
          gradient="bg-gradient-to-br from-teal-500 to-teal-600"
          iconBg="bg-teal-400/30"
        />
        <StatCard
          icon={FileText}
          value={stats.totalPatents}
          label="Patents"
          gradient="bg-gradient-to-br from-rose-500 to-pink-500"
          iconBg="bg-rose-400/30"
        />
      </div>

      {/* Status Summary Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatusSummaryCard
          icon={CheckCircle2}
          label="Approved"
          count={stats.approvedItems}
          color="bg-emerald-500"
          bgColor="bg-white shadow-sm"
        />
        <StatusSummaryCard
          icon={Clock}
          label="Pending"
          count={stats.pendingApprovals}
          color="bg-amber-500"
          bgColor="bg-white shadow-sm"
        />
        <StatusSummaryCard
          icon={XCircle}
          label="Rejected"
          count={stats.rejectedItems}
          color="bg-red-500"
          bgColor="bg-white shadow-sm"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Skill Completion Status */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Skill Progress
            </h3>
            <TrendingUp className="text-indigo-500" size={18} />
          </div>
          {skillData.length > 0 ? (
            skillData
              .slice(0, 4)
              .map((skill, index) => (
                <SkillProgress
                  key={index}
                  skill={skill.skill}
                  completed={skill.completed}
                  total={skill.total}
                />
              ))
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">
              No skill data available
            </p>
          )}
        </div>

        {/* Mentorship Status */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Mentorship</h3>
            <Users className="text-indigo-500" size={18} />
          </div>
          {mentorshipData.length > 0 ? (
            mentorshipData
              .slice(0, 4)
              .map((item, index) => (
                <MentorshipLine
                  key={index}
                  skill={item.skill_name}
                  count={item.mentee_count}
                />
              ))
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">
              No mentorship data available
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Quick Stats</h3>
            <Award className="text-indigo-500" size={18} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <span className="text-sm text-gray-700">Total Uploads</span>
              <span className="text-lg font-bold text-blue-600">
                {stats.approvedItems +
                  stats.pendingApprovals +
                  stats.rejectedItems}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
              <span className="text-sm text-gray-700">Approval Rate</span>
              <span className="text-lg font-bold text-emerald-600">
                {stats.approvedItems +
                  stats.pendingApprovals +
                  stats.rejectedItems >
                0
                  ? Math.round(
                      (stats.approvedItems /
                        (stats.approvedItems +
                          stats.pendingApprovals +
                          stats.rejectedItems)) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
              <span className="text-sm text-gray-700">Mentees Guided</span>
              <span className="text-lg font-bold text-purple-600">
                {mentorshipData.reduce(
                  (sum, item) => sum + (item.mentee_count || 0),
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Recent Uploads
          </h3>
          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
            {stats.pendingApprovals} pending
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentUploads.length > 0 ? (
            recentUploads.map((item, index) => (
              <RecentItem key={index} {...item} />
            ))
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center col-span-2">
              No uploads yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
