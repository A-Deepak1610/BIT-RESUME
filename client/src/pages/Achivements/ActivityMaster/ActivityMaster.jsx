
import React, { useState, useEffect, useMemo } from "react";
import SurveyCard from "./surveyCard";
import MasterCard from "./masterCard";
import MeetingOrSessionCard from "./meetingorsessioncard";
import EventDetailModal from "./EventModal";
import { Search, ChevronDown } from "lucide-react";
import useAuth from "../../../store/UseAuth";


const ActivityMaster = () => {
  const [activeTab, setActiveTab] = useState("activities");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
 
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [activityMasterData, setActivityMasterData] = useState([]);
  const [surveys, setSurveys] = useState([]); // State for fetched survey data
  const meetings = []; // Assuming meetings are also fetched or handled similarly
  const {rollno} = useAuth();


  useEffect(() => {
    handleData();
    fetchSurveyData(); // Fetch survey data on component mount
  }, []);


  const handleData = async () => {
    try {
      const response = await fetch('http://localhost:6001/api/activitymaster/fetch', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setActivityMasterData(data.events || []);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const fetchSurveyData = async () => { // Using a default rollno for the example
    try {
      const response = await fetch(`http://localhost:6001/api/activitymaster/getsurveydata/${rollno}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok for survey data');
      }
      const data = await response.json();
     
      const processedSurveys = data.map(survey => {
        const today = new Date();
        const startDate = new Date(survey['start-date']);
        const endDate = new Date(survey['end-date']);
       
        let status = "Pending";
        if (today > endDate) {
          status = "Missed"; // Or "Completed" based on submission, which we can't determine here
        }


        return { ...survey, Status: status };
      });


      setSurveys(processedSurveys);
    } catch (error) {
      console.error('There has been a problem with your fetch operation for survey data:', error);
    }
  };


  const filteredActivities = useMemo(() => {
      if (!activityMasterData) return [];
      return activityMasterData.filter((item) =>
          item.event_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, activityMasterData]);


  const filteredSurveys = useMemo(() => {
    return surveys.filter(survey => {
      const statusMatch = selectedStatus === "All Statuses" || survey.Status === selectedStatus;
      const typeMatch = selectedType === "All Types" || survey['activity-type'] === selectedType;
      const termMatch = !searchTerm || survey['activity-title'].toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && typeMatch && termMatch;
    });
  }, [searchTerm, surveys, selectedStatus, selectedType]);
 
  const filteredMeetings = useMemo(() => {
    // This would also be updated to use fetched meeting data
    return meetings.filter(meeting => {
      const statusMatch = selectedStatus === "All Statuses" || meeting.Status.toLowerCase() === selectedStatus.toLowerCase();
      const typeMatch = selectedType === "All Types" || meeting.serveyType === selectedType;
      const termMatch = !searchTerm || Object.values(meeting).join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && typeMatch && termMatch;
    });
  }, [searchTerm, meetings, selectedStatus, selectedType]);


  const handleCardClick = (eventData) => {
    setSelectedEventData(eventData);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEventData(null);
  };
 
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setSelectedStatus("All Statuses");
    setSelectedType("All Types");
  }


  const TabButton = ({ label, value }) => (
    <button
      onClick={() => handleTabClick(value)}
      className={`py-3 px-6 font-medium text-sm focus:outline-none -mb-px border-b-2
        ${
          activeTab === value
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
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={18} />
      </div>
    </div>
  );
 
  const renderContent = () => {
    switch(activeTab) {
      case 'surveys':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey, index) => (
                <SurveyCard key={index} survey={survey} />
              ))
            ) : <p className="col-span-full text-center text-gray-500 py-10">No surveys match.</p> }
          </div>
        );
      case 'activities':
        return <MasterCard data={filteredActivities} onCardClick={handleCardClick} />;
      case 'meetings':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting, index) => (
                <MeetingOrSessionCard key={meeting.id || index} meeting={meeting} />
              ))
            ) : <p className="col-span-full text-center text-gray-500 py-10">No meetings match.</p> }
          </div>
        );
      default:
        return null;
    }
  }
 
  const statusOptions = ["All Statuses", "Pending", "Completed", "Missed"];
  const uniqueSurveyTypes = ["All Types", "Survey", "Feedback", "Quiz", "General"];
  const uniqueMeetingTypes = ["All Types", "One-on-One", "Team Sync", "Workshop"];


  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-1">
            <TabButton label="Activities" value="activities" />
            <TabButton label="Surveys" value="surveys" />
            <TabButton label="Meetings/Sessions" value="meetings" />
          </nav>
        </div>


        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow w-full md:max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base shadow-sm border border-gray-300"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(activeTab === "surveys" || activeTab === 'meetings') && (
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <FilterDropdown value={selectedStatus} onChange={setSelectedStatus} options={statusOptions} label="Filter by status" />
              <FilterDropdown value={selectedType} onChange={setSelectedType} options={activeTab === 'surveys' ? uniqueSurveyTypes : uniqueMeetingTypes} label="Filter by type" />
            </div>
          )}
        </div>
       
        {renderContent()}


      </div>


      {selectedEventData && (
        <EventDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          eventData={selectedEventData}
        />
      )}
    </div>
  );
};


export default ActivityMaster;
