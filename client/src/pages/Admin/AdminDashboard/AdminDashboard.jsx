import React, { useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";
import {
  Users,
  UserCheck,
  UserX,
  FileText,
  Award,
  BookOpen,
  Briefcase,
  FileBarChart,
  Medal,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  RefreshCw,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// Default user stats
const defaultUserStats = {
  total: 0,
  active: 0,
  inactive: 0,
  newThisMonth: 0,
};

// Static date filter component
const StaticDateFilter = ({ selectedDate, onDateChange, onReset }) => {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Date Filter</h3>
          {selectedDate && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {new Date(selectedDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              // min={thirtyDaysAgo}
              max={today}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
            />
          </div>

          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm flex items-center gap-2 mt-6 sm:mt-0"
          >
            <RefreshCw size={14} />
            Show All Data
          </button>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-3 text-sm text-gray-600 bg-blue-50 p-2 rounded">
          📊 Showing data for{" "}
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      )}

      {!selectedDate && (
        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          📈 Showing all data from the last 30 days
        </div>
      )}
    </div>
  );
};

// Stat card component
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend,
  dateInfo,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {dateInfo && (
            <p className="text-xs text-blue-600 font-medium">{dateInfo}</p>
          )}
        </div>
      </div>
      {trend && (
        <div
          className={`flex items-center space-x-1 ${
            trend > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  </div>
);

// Upload card component
const UploadCard = ({ icon: Icon, title, data, color, dateInfo }) => {
  const approvalRate =
    data.total > 0 ? ((data.approved / data.total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Uploads</span>
          <span className="font-semibold text-gray-900">{data.total}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-green-600 flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Approved
          </span>
          <span className="font-semibold text-green-600">{data.approved}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-yellow-600 flex items-center">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
          <span className="font-semibold text-yellow-600">{data.pending}</span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Approval Rate</span>
            <span
              className={`font-semibold ${
                approvalRate >= 90
                  ? "text-green-600"
                  : approvalRate >= 80
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {approvalRate}%
            </span>
          </div>
        </div>

        {dateInfo && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-blue-600">{dateInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Daily uploads by category chart with proper naming
const CategoryUploadsBarChart = ({ data, selectedDate }) => {
  const filteredData = selectedDate
    ? data.filter((item) => item.date === selectedDate)
    : data;

  const categoryData = {};
  filteredData.forEach((item) => {
    if (!categoryData[item.category]) {
      categoryData[item.category] = { total: 0, approved: 0, pending: 0 };
    }
    categoryData[item.category].total++;
    categoryData[item.category][item.status]++;
  });

  const categories = Object.keys(categoryData);
  const colors = [
    "#2D4BFF",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
  ];

  const plotData = [
    {
      x: categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
      y: categories.map((cat) => categoryData[cat].total),
      type: "bar",
      name: "Total Uploads",
      marker: { color: colors },
      hovertemplate: "<b>%{x}</b><br>Total Uploads: %{y}<br><extra></extra>",
    },
  ];

  const chartTitle = selectedDate
    ? `Daily Upload Distribution by Category (${new Date(
        selectedDate
      ).toLocaleDateString()})`
    : "Upload Distribution by Category (Last 30 Days)";

  const layout = {
    title: {
      text: chartTitle,
      font: { size: 16, family: "Arial, sans-serif" },
    },
    xaxis: {
      title: "Upload Categories",
      titlefont: { size: 14 },
    },
    yaxis: {
      title: "Number of Uploads",
      titlefont: { size: 14 },
    },
    margin: { l: 60, r: 20, t: 80, b: 80 },
    showlegend: false,
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <Plot
        data={plotData}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
};

// Approval status distribution with proper naming
const ApprovalStatusPieChart = ({ data, selectedDate }) => {
  const filteredData = selectedDate
    ? data.filter((item) => item.date === selectedDate)
    : data;

  const statusCounts = { approved: 0, pending: 0 };
  filteredData.forEach((item) => {
    statusCounts[item.status]++;
  });

  const plotData = [
    {
      values: [statusCounts.approved, statusCounts.pending],
      labels: ["Approved Submissions", "Pending Submissions"],
      type: "pie",
      name: "Approval Status",
      marker: { colors: ["#10b981", "#f59e0b"] },
      hovertemplate:
        "<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>",
    },
  ];

  const chartTitle = selectedDate
    ? `Submission Approval Status (${new Date(
        selectedDate
      ).toLocaleDateString()})`
    : "Overall Submission Approval Status (Last 30 Days)";

  const layout = {
    title: {
      text: chartTitle,
      font: { size: 16, family: "Arial, sans-serif" },
    },
    margin: { l: 20, r: 20, t: 80, b: 20 },
    showlegend: true,
    legend: {
      x: 0,
      y: 0,
      font: { size: 12 },
    },
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <Plot
        data={plotData}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "350px" }}
      />
    </div>
  );
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [uploadData, setUploadData] = useState([]);
  const [userStats, setUserStats] = useState(defaultUserStats);
  const [facultyPerformance, setFacultyPerformance] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // Empty = show all data

  // Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch upload statistics - get all data (365 days to cover everything)
        const statsResponse = await fetch(
          `${API_URL}api/admin/dashboard/stats?days=3650`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log("Upload stats API response:", statsData);
          // Accept empty array as valid data
          if (statsData.data && Array.isArray(statsData.data)) {
            setUploadData(statsData.data);
          } else {
            // API returned null or unexpected format - treat as empty
            setUploadData([]);
          }
        } else {
          console.warn("Failed to fetch stats, status:", statsResponse.status);
          setError("Failed to fetch upload data from server.");
          setUploadData([]);
        }

        // Fetch user statistics
        const userStatsResponse = await fetch(
          `${API_URL}api/admin/dashboard/user-stats`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (userStatsResponse.ok) {
          const userData = await userStatsResponse.json();
          console.log("User stats API response:", userData);
          if (userData.data) {
            setUserStats(userData.data);
          }
        }

        // Fetch faculty performance data
        const facultyResponse = await fetch(
          `${API_URL}api/admin/dashboard/faculty-performance`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (facultyResponse.ok) {
          const facultyData = await facultyResponse.json();
          console.log("Faculty performance API response:", facultyData);
          if (facultyData.data && Array.isArray(facultyData.data)) {
            setFacultyPerformance(facultyData.data);
          } else {
            setFacultyPerformance([]);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load data from server.");
        setUploadData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter data based on selected date
  const filteredData = useMemo(() => {
    if (!selectedDate) return uploadData;
    return uploadData.filter((item) => item.date === selectedDate);
  }, [selectedDate, uploadData]);

  // Calculate stats from filtered data
  const dateStats = useMemo(() => {
    const categoryData = {};
    filteredData.forEach((item) => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
        };
      }
      categoryData[item.category].total++;
      if (categoryData[item.category][item.status] !== undefined) {
        categoryData[item.category][item.status]++;
      }
    });

    const totalUploads = filteredData.length;
    const totalApproved = filteredData.filter(
      (item) => item.status === "approved"
    ).length;
    const totalPending = filteredData.filter(
      (item) => item.status === "pending"
    ).length;

    return {
      categoryData,
      totalUploads,
      totalApproved,
      totalPending,
      overallApprovalRate:
        totalUploads > 0
          ? ((totalApproved / totalUploads) * 100).toFixed(1)
          : 0,
    };
  }, [filteredData]);

  const getDateInfo = () => {
    if (!selectedDate) return "All time data";
    return `Data for ${new Date(selectedDate).toLocaleDateString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="space-y-6">
        {/* Static Date Filter */}
        <StaticDateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onReset={() => setSelectedDate("")}
        />

        {/* Error message if any */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            ⚠️ {error}
          </div>
        )}

        {/* User Statistics (Overall - not date filtered) */}

        {/* Upload Overview (Date filtered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileText}
            title="Total Uploads"
            value={dateStats.totalUploads.toLocaleString()}
            subtitle={selectedDate ? "On selected date" : "Last 30 days"}
            color="bg-indigo-500"
            dateInfo={getDateInfo()}
          />
          <StatCard
            icon={CheckCircle}
            title="Approved"
            value={dateStats.totalApproved.toLocaleString()}
            subtitle={`${dateStats.overallApprovalRate}% approval rate`}
            color="bg-green-500"
            dateInfo={getDateInfo()}
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={dateStats.totalPending.toLocaleString()}
            subtitle="Awaiting review"
            color="bg-yellow-500"
            dateInfo={getDateInfo()}
          />
        </div>

        {/* Upload Categories (Date filtered) */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upload Analytics by Category{" "}
            {selectedDate && `- ${new Date(selectedDate).toLocaleDateString()}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UploadCard
              icon={Briefcase}
              title="Projects"
              data={
                dateStats.categoryData.project || {
                  total: 0,
                  approved: 0,
                  pending: 0,
                  rejected: 0,
                }
              }
              color="bg-blue-500"
              dateInfo={getDateInfo()}
            />
            <UploadCard
              icon={Award}
              title="Patents"
              data={
                dateStats.categoryData.patent || {
                  total: 0,
                  approved: 0,
                  pending: 0,
                  rejected: 0,
                }
              }
              color="bg-purple-500"
              dateInfo={getDateInfo()}
            />
            <UploadCard
              icon={Briefcase}
              title="Internships"
              data={
                dateStats.categoryData.internship || {
                  total: 0,
                  approved: 0,
                  pending: 0,
                  rejected: 0,
                }
              }
              color="bg-orange-500"
              dateInfo={getDateInfo()}
            />
            <UploadCard
              icon={FileBarChart}
              title="Paper Presentations"
              data={
                dateStats.categoryData.paper || {
                  total: 0,
                  approved: 0,
                  pending: 0,
                  rejected: 0,
                }
              }
              color="bg-red-500"
              dateInfo={getDateInfo()}
            />
            <UploadCard
              icon={Medal}
              title="Certificates"
              data={
                dateStats.categoryData.certificate || {
                  total: 0,
                  approved: 0,
                  pending: 0,
                  rejected: 0,
                }
              }
              color="bg-yellow-500"
              dateInfo={getDateInfo()}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Overall Faculty Performance Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faculty Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejection Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facultyPerformance.length > 0 ? (
                  facultyPerformance.map((faculty, index) => (
                    <tr
                      key={faculty.faculty_id || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {faculty.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {faculty.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {faculty.approved}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {faculty.pending}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`${
                            faculty.rejectionRate > 10
                              ? "text-red-600"
                              : faculty.rejectionRate > 7
                              ? "text-yellow-600"
                              : "text-green-600"
                          } font-medium`}
                        >
                          {faculty.rejectionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            faculty.rejectionRate > 10
                              ? "bg-red-100 text-red-800"
                              : faculty.rejectionRate > 7
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {faculty.rejectionRate > 10
                            ? "Needs Attention"
                            : faculty.rejectionRate > 7
                            ? "Monitor"
                            : "Good"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No faculty data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
