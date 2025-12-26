import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  FolderOpen,
  GraduationCap,
  Award,
  Briefcase,
  FileText,
  Lightbulb,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";

const categoryConfig = {
  projects: {
    label: "Projects",
    icon: FolderOpen,
    color: "#3B82F6",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  certificates: {
    label: "Certifications",
    icon: GraduationCap,
    color: "#10B981",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  hackathons: {
    label: "Hackathons",
    icon: Award,
    color: "#F59E0B",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
  },
  internships: {
    label: "Internships",
    icon: Briefcase,
    color: "#8B5CF6",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  papers: {
    label: "Papers",
    icon: FileText,
    color: "#F97316",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  patents: {
    label: "Patents",
    icon: Lightbulb,
    color: "#EF4444",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
};

const StatCard = ({
  icon: Icon,
  label,
  count,
  color,
  bgColor,
  textColor,
  onClick,
  isActive,
}) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl ${bgColor} border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
      isActive
        ? "border-indigo-500 ring-2 ring-indigo-200"
        : "border-transparent"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg`} style={{ backgroundColor: color }}>
        <Icon className="text-white" size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
        <p className={`text-sm ${textColor}`}>{label}</p>
      </div>
    </div>
  </div>
);

const RecordCard = ({ record }) => {
  const config = categoryConfig[record.category] || categoryConfig.projects;
  const Icon = config.icon;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={config.textColor} size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">
              {record.title || "Untitled"}
            </h4>
            <p className="text-sm text-gray-500 truncate">
              {record.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {record.student_name}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {record.rollno}
              </span>
              {record.year && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {record.year} Year
                </span>
              )}
              {record.department && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {record.department}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right ml-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              record.status === "Approved"
                ? "bg-green-100 text-green-700"
                : record.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {record.status}
          </span>
          <p className="text-xs text-gray-400 mt-1">{record.upload_date}</p>
        </div>
      </div>
    </div>
  );
};

export default function Reports() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [years, setYears] = useState([]);
  const [rollnos, setRollnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRollno, setSelectedRollno] = useState("");
  const [rollnoSearch, setRollnoSearch] = useState("");
  const [showRollnoDropdown, setShowRollnoDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [chartType, setChartType] = useState("bar");

  const rollnoDropdownRef = useRef(null);

  // Filter rollnos based on search
  const filteredRollnos = rollnos.filter(
    (item) =>
      item.rollno.toLowerCase().includes(rollnoSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(rollnoSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rollnoDropdownRef.current &&
        !rollnoDropdownRef.current.contains(event.target)
      ) {
        setShowRollnoDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchYears();
    fetchRollnos();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchRollnos();
  }, [selectedYear]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear, selectedRollno, selectedCategory, startDate, endDate]);
  const API_URL = import.meta.env.VITE_API_URL
  const fetchYears = async () => {
    try {
      const res = await fetch(
        `${API_URL}api/admin/analytics/years`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setYears(data.years || []);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchRollnos = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedYear) params.append("year", selectedYear);

      const res = await fetch(
        `${API_URL}api/admin/analytics/rollnos?${params}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setRollnos(data.rollnos || []);
      }
    } catch (error) {
      console.error("Error fetching rollnos:", error);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedYear) params.append("year", selectedYear);
      if (selectedRollno) params.append("rollno", selectedRollno);
      if (selectedCategory) params.append("category", selectedCategory);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const res = await fetch(
        `${API_URL}api/admin/analytics?${params}`,
        { credentials: "include"}
      );
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedRollno("");
    setRollnoSearch("");
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
  };

  const filteredRecords =
    analyticsData?.records?.filter((record) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        record.title?.toLowerCase().includes(query) ||
        record.student_name?.toLowerCase().includes(query) ||
        record.rollno?.toLowerCase().includes(query) ||
        record.department?.toLowerCase().includes(query)
      );
    }) || [];

  const chartData =
    analyticsData?.date_wise_counts
      ?.map((item) => ({
        ...item,
        date: item.date
          ? new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "",
      }))
      .reverse() || [];

  const exportToCSV = () => {
    if (!filteredRecords.length) return;

    const headers = [
      "Category",
      "Title",
      "Description",
      "Status",
      "Upload Date",
      "Roll No",
      "Student Name",
      "Year",
      "Batch",
      "Department",
    ];
    console.log("filteredRecords", filteredRecords)
    const rows = filteredRecords.map((r) => [
      r.category,
      r.title,
      r.description,
      r.status,
      r.upload_date,
      r.rollno,
      r.student_name,
      r.year,
      r.batch,
      r.department,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_report_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Upload Analytics</h1>
        <p className="text-gray-600 mt-1">
          Date-wise analysis of student uploads
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-700">Filters</span>
          </div>
          {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {showFilters && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedRollno("");
                    setRollnoSearch("");
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year} Year
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative" ref={rollnoDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll No
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search roll no or name..."
                    value={rollnoSearch}
                    onChange={(e) => {
                      setRollnoSearch(e.target.value);
                      setShowRollnoDropdown(true);
                      if (e.target.value === "") {
                        setSelectedRollno("");
                      }
                    }}
                    onFocus={() => setShowRollnoDropdown(true)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {(rollnoSearch || selectedRollno) && (
                    <button
                      onClick={() => {
                        setRollnoSearch("");
                        setSelectedRollno("");
                        setShowRollnoDropdown(false);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {showRollnoDropdown && filteredRollnos.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredRollnos.slice(0, 50).map((item) => (
                      <div
                        key={item.rollno}
                        onClick={() => {
                          setSelectedRollno(item.rollno);
                          setRollnoSearch(`${item.rollno} - ${item.name}`);
                          setShowRollnoDropdown(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-indigo-50 ${
                          selectedRollno === item.rollno ? "bg-indigo-100" : ""
                        }`}
                      >
                        <span className="font-medium">{item.rollno}</span>
                        <span className="text-gray-500 ml-2">
                          - {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <X size={16} /> Clear
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Download size={16} /> Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <StatCard
            key={key}
            icon={config.icon}
            label={config.label}
            count={analyticsData?.summary?.[key] || 0}
            color={config.color}
            bgColor={config.bgColor}
            textColor={config.textColor}
            onClick={() =>
              setSelectedCategory(selectedCategory === key ? "" : key)
            }
            isActive={selectedCategory === key}
          />
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Date-wise Upload Trends
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 rounded-lg text-sm ${
                chartType === "bar"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 rounded-lg text-sm ${
                chartType === "line"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Line
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" name="Projects" fill="#3B82F6" />
                <Bar
                  dataKey="certificates"
                  name="Certifications"
                  fill="#10B981"
                />
                <Bar dataKey="hackathons" name="Hackathons" fill="#F59E0B" />
                <Bar dataKey="internships" name="Internships" fill="#8B5CF6" />
                <Bar dataKey="papers" name="Papers" fill="#F97316" />
                <Bar dataKey="patents" name="Patents" fill="#EF4444" />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="projects"
                  name="Projects"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="certificates"
                  name="Certifications"
                  stroke="#10B981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="hackathons"
                  name="Hackathons"
                  stroke="#F59E0B"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="internships"
                  name="Internships"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="papers"
                  name="Papers"
                  stroke="#F97316"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="patents"
                  name="Patents"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Records Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Upload Records ({filteredRecords.length})
            </h2>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, roll no, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {filteredRecords.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No records found.</p>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record, index) => (
                <RecordCard
                  key={`${record.category}-${record.id}-${index}`}
                  record={record}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
