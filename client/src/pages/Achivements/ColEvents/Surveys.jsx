import React, { useState, useMemo } from "react";
import SurveyCard from "./surveyCard";
import initialSurveyData from "../../../dummydatas/Survey.json"; // Make sure this path is correct
import { Search, ChevronDown } from "lucide-react";

const Surveys = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" or "completed"
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");

  const surveys = initialSurveyData;

  const uniqueSurveyTypes = useMemo(() => {
    const types = new Set(surveys.map(s => s.serveyType).filter(Boolean));
    return ["All Types", ...Array.from(types)];
  }, [surveys]);

  const statusOptions = ["All Statuses", "Pending", "Completed", "Closed"]; // "Closed" maps to "Missed"

  const filteredSurveys = useMemo(() => {
    let surveysToFilter = [...surveys];

    // 1. Filter by activeTab
    if (activeTab === "completed") {
      surveysToFilter = surveysToFilter.filter(s => s.Status === "completed");
    }

    // 2. Filter by selectedStatus
    if (selectedStatus && selectedStatus !== "All Statuses") {
      const statusToFilter = selectedStatus === "Closed" ? "Missed" : selectedStatus.toLowerCase();
       // Ensure matching with JSON 'Status' values which are lowercase 'completed', 'pending' etc.
       // If your JSON Status values are capitalized (e.g. "Pending"), then use selectedStatus directly
      if (selectedStatus === "Completed") { // specific handling for 'Completed' to match 'completed' in JSON
        surveysToFilter = surveysToFilter.filter(s => s.Status === "completed");
      } else if (selectedStatus === "Pending") {
        surveysToFilter = surveysToFilter.filter(s => s.Status === "Pending");
      }
       else { // For "Closed" which maps to "Missed"
        surveysToFilter = surveysToFilter.filter(s => s.Status === "Missed");
      }
    }

    // 3. Filter by selectedType
    if (selectedType && selectedType !== "All Types") {
      surveysToFilter = surveysToFilter.filter(s => s.serveyType === selectedType);
    }

    // 4. Filter by searchTerm
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      surveysToFilter = surveysToFilter.filter((survey) =>
        [
          survey.SurveyName,
          survey.SurveyDescription,
          survey.serveyType,
          survey.Status, // Search by actual status value
          survey.PublishedBy,
          survey["Event Date"],
          survey.DeathLine,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }
    return surveysToFilter;
  }, [searchTerm, surveys, activeTab, selectedStatus, selectedType]);

  const TabButton = ({ label, value, currentTab, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`py-3 px-6 font-medium text-sm focus:outline-none -mb-px border-b-2
        ${
          currentTab === value
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
    >
      {label}
    </button>
  );

  const FilterDropdown = ({ value, onChange, options, label }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        aria-label={label}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={18} />
      </div>
    </div>
  );


  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-1">
            <TabButton label="All Surveys" value="all" currentTab={activeTab} onClick={setActiveTab} />
            <TabButton label="Completed Surveys" value="completed" currentTab={activeTab} onClick={setActiveTab} />
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow w-full md:max-w-lg"> {/* Increased max-width slightly */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base shadow-sm border border-gray-300"
              placeholder="Search surveys by title, event, or publisher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="w-full sm:w-auto sm:min-w-[160px]">
                 <FilterDropdown
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={statusOptions}
                    label="Filter by status"
                />
            </div>
            <div className="w-full sm:w-auto sm:min-w-[160px]">
                <FilterDropdown
                    value={selectedType}
                    onChange={setSelectedType}
                    options={uniqueSurveyTypes}
                    label="Filter by type"
                />
            </div>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys && filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey, index) => (
              <SurveyCard key={survey.id || index} survey={survey} />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center min-h-[200px]">
              <p className="text-center text-gray-500 py-10 text-xl">
                {searchTerm || selectedStatus !== "All Statuses" || selectedType !== "All Types" ? "No surveys match your criteria." : "No surveys found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Surveys;