import React, { useState, useEffect, useMemo } from "react";
import SurveyCard from "./surveyCard";
import MasterCard from "./masterCard";
import MeetingOrSessionCard from "./meetingorsessioncard";
import EventDetailModal from "./EventModal";
import { Search, ChevronDown } from "lucide-react";
import useAuth from "../../../store/UseAuth";

const ActivityMaster = () => {
  const [activeTab, setActiveTab] = useState("activities");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [eventFilterStatus, setEventFilterStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);

  const [activityMasterData, setActivityMasterData] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [meetingsAndSessions, setMeetingsAndSessions] = useState([]);

  const [limit, setLimit] = useState(25);
  const [offset, setOffset] = useState(0);

  const { rollno } = useAuth();

  useEffect(() => {
    if (activeTab === "activities") {
      handleData();
    }
  }, [offset, limit, activeTab]);

  useEffect(() => {
    if (rollno) {
      fetchSurveyData();
      fetchMeetingAndSessionData();
    }
  }, [rollno]);

  const handlePaginationplus = () => setOffset((prev) => prev + limit);
  const handlePaginationminus = () => setOffset((prev) => Math.max(prev - limit, 0));

  const handleData = async () => {
    try {
      // FIXED: Restored limit and offset to ensure pagination works correctly.
      const response = await fetch(
        `http://localhost:6001/api/activitymaster/fetch?limit=${limit}&offset=${offset}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Network response was not ok for activities");
      const data = await response.json();
      setActivityMasterData(data.events || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchSurveyData = async () => {
    try {
      const response = await fetch(
        `http://localhost:6001/api/activitymaster/getsurveydata`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Network response was not ok for survey data");
      const data = await response.json();
      const processedSurveys = data.map((survey) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(survey.end_date);
        return {
          id: survey.activity_id,
          title: survey.description,
          publishedBy: survey.publishing_department,
          startDate: survey.start_date,
          endDate: survey.end_date,
          link: survey.link_or_location,
          status: today > endDate ? "Missed" : "Pending",
        };
      });
      setSurveys(processedSurveys);
    } catch (error) {
      console.error("Error fetching survey data:", error);
    }
  };

  const fetchMeetingAndSessionData = async () => {
    try {
      const response = await fetch(
        `http://localhost:6001/api/activitymaster/getsessiondata`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Network response was not ok for meeting/session data");
      const data = await response.json();
      const meetings = data.meetings || [];
      const sessions = data.sessions || [];

      const processEvent = (event, type) => {
        const dateKey = type === 'Meeting' ? 'date_of_meeting' : 'date_of_session';
        const now = new Date();
        const eventDateTime = new Date(`${event[dateKey]}T${event.end_time}`);
        return {
          id: event.activity_id, type, title: event.description,
          department: event.publishing_department, host: event.host,
          date: event[dateKey], startTime: event.start_time, endTime: event.end_time,
          location: event.link_or_location,
          status: now > eventDateTime ? "Completed" : "Upcoming",
        };
      };

      const processedEvents = [
        ...meetings.map(m => processEvent(m, 'Meeting')),
        ...sessions.map(s => processEvent(s, 'Session'))
      ];
      processedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      setMeetingsAndSessions(processedEvents);
    } catch (error) {
      console.error("Error fetching meeting/session data:", error);
    }
  };
  
  const filteredActivities = useMemo(() => {
    if (!activityMasterData) return [];
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const getEventStatus = (event) => {
      if (!event.rounds || event.rounds.length === 0) return 'Unknown';
      const deadlineDate = new Date(event.deadline);
      const startDates = event.rounds.map(r => new Date(r.start_date));
      const firstRoundStartDate = new Date(Math.min.apply(null, startDates));
      if (today < firstRoundStartDate) return 'Upcoming';
      if (today > deadlineDate) return 'Completed';
      return 'Ongoing';
    };
  
    // Chain .filter() with .sort() to ensure a consistent order
    return activityMasterData
      .filter((item) => {
        const searchMatch = item.event_name.toLowerCase().includes(searchTerm.toLowerCase());
        if (!searchMatch) return false;
        if (eventFilterStatus === 'All') return true;
        return getEventStatus(item) === eventFilterStatus;
      })
      .sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
  
  }, [searchTerm, activityMasterData, eventFilterStatus]);
  

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => 
      (selectedStatus === "All Statuses" || survey.status === selectedStatus) &&
      (!searchTerm || survey.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, surveys, selectedStatus]);

  const filteredMeetingsAndSessions = useMemo(() => {
    return meetingsAndSessions.filter((event) =>
      (selectedStatus === "All Statuses" || event.status === selectedStatus) &&
      (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.host.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, meetingsAndSessions, selectedStatus]);

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
    setEventFilterStatus("All");
  };

  const TabButton = ({ label, value }) => (
    <button
      onClick={() => handleTabClick(value)}
      className={`py-3 px-6 font-medium text-sm focus:outline-none -mb-px border-b-2 ${
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
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={18} />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "activities":
        return (
          <>
            <MasterCard data={filteredActivities} onCardClick={handleCardClick} />
            <div className="fixed bottom-4 right-4 flex gap-2">
              <button onClick={handlePaginationminus} className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-lg">&lt;</button>
              <button onClick={handlePaginationplus} className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-lg">&gt;</button>
            </div>
          </>
        );
      case "surveys":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">No surveys match your criteria.</p>
            )}
          </div>
        );
      case "meetings":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetingsAndSessions.length > 0 ? (
              filteredMeetingsAndSessions.map((event) => <MeetingOrSessionCard key={`${event.type}-${event.id}`} meeting={event} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">No meetings or sessions match your criteria.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const statusOptions = {
    surveys: ["All Statuses", "Pending", "Missed"],
    meetings: ["All Statuses", "Upcoming", "Completed"],
    activities: ["All", "Upcoming", "Ongoing", "Completed"],
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-1">
            <TabButton label="Activities" value="activities" />
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
              placeholder={`Search in ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {activeTab === 'activities' && (
              <FilterDropdown
                value={eventFilterStatus}
                onChange={setEventFilterStatus}
                options={statusOptions.activities}
                label="Filter by event status"
              />
            )}
            {(activeTab === "surveys" || activeTab === "meetings") && (
              <FilterDropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions[activeTab]}
                label="Filter by status"
              />
            )}
          </div>
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