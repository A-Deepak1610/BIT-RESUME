import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import LoggerCard from "./LoggerCard";
import RequestCard from "./RequestedCard";
import EventDetailModal from "../ActivityMaster/EventModal";
import useAuth from "../../../store/UseAuth";

const RegisteredEvents = () => {
  const [activeTab, setActiveTab] = useState("registered");
  const [searchTerm, setSearchTerm] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [requestedEvents, setRequestedEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);
  const { rollno } = useAuth();

  // Current date for status calculations
  const currentDate = new Date('2025-08-07T18:58:20Z');

  const handleRequestedEvents = async () => {
    console.log("Fetching requested events for rollno:", rollno);
    try {
      const response = await fetch(`http://localhost:6001/api/events/requested_events/${rollno}`,{
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
      console.log("Requested events data:", data);

      // Map the backend data to frontend format
      const mappedRequestedEvents = data.requested_events.map(event => {
        // Parse teammates string into array
        const teammatesArray = event.teammates ? event.teammates.split(',') : [];
        
        // Format date from YYYY-MM-DD to DD.MM.YYYY
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '.');
        };

        return {
          id: event.event_code,
          eventDate: formatDate(event.start_date),
          eventType: event.type,
          eventName: event.event_name,
          location: event.location,
          prizeAmount: `₹${parseInt(event.final_prize1).toLocaleString('en-IN')}`,
          eventCode: event.event_code,
          teamMembers: teammatesArray,
          applyButtonText: "Apply On Duty",
          "Requested By": event.leader_rollno,
          imageUrl: event.image_url,
          status: "pending",
          teamCode: event.team_code,
          numberOfTeammates: event.number_of_teammates
        };
      });

      setRequestedEvents(mappedRequestedEvents);

    } catch (error) {
      console.error("Error fetching requested events:", error);
    }
  };

  useEffect(() => {
    handleRequestedEvents();
  }, []);

  useEffect(() => {
    handleRegisterEvents();
  }, [rollno]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  const handleCardClick = (eventData) => {
    setSelectedEventData(eventData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEventData(null);
  };

  const handleApprove = (eventId) => {
    setRequestedEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: "Approved" } : event
      )
    );
  };

  const handleReject = (eventId) => {
    setRequestedEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: "Rejected" } : event
      )
    );
  };

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

  const handleRegisterEvents = async () => {
    console.log("Fetching registered events for rollno:", rollno);
    try {
      const response = await fetch(
        `http://localhost:6001/api/events/registered_events/${rollno}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Fetched registered events", result);

      // Map the backend data to the structure your LoggerCard expects
      const mappedEvents = result.map(event => {
        // Parse teammates string into array
        const teammatesArray = event.teammates ? event.teammates.split(',') : [];
        
        // Format date from YYYY-MM-DD to DD.MM.YYYY
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '.');
        };

        // Check if event is completed based on end_date
        const isEventCompleted = event.end_date ? 
          currentDate > new Date(event.end_date) : false;

        return {
          // Map backend snake_case to frontend camelCase
          id: event.event_code,
          eventCode: event.event_code,
          eventName: event.event_name,
          imageUrl: event.image_url,
          type: event.type,
          eventType: event.type,
          location: event.location,
          finalPrize1: event.final_prize1,
          prizeAmount: `₹${parseInt(event.final_prize1).toLocaleString('en-IN')}`,
          startDate: formatDate(event.start_date),
          eventDate: formatDate(event.start_date),
          teamCode: event.team_code,
          leaderRollno: event.leader_rollno,
          numberOfTeammates: event.number_of_teammates,
          teamMembers: teammatesArray,
          teammates: event.teammates,
          
          // Add status fields with proper mapping
          state: event.state || 'pending',
          verified: event.user_verified || event.verified || 'pending',
          user_verified: event.user_verified,
          user_status: event.user_status,
          faculty_remarks: event.faculty_remarks,
          
          // Add completion status
          isCompleted: isEventCompleted,
          
          // Keep raw dates for calculations
          start_date: event.start_date,
          end_date: event.end_date,
          
          // Keep any additional fields from backend
          ...event
        };
      });

      setRegisteredEvents(mappedEvents);

    } catch (error) {
      console.error("Error fetching registered events:", error);
    }
  };

  const filteredEvents = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filterLogic = (item) => {
      const eventName = (item.eventName || "").toLowerCase();
      const eventCode = (item.eventCode || "").toLowerCase();
      return (
        eventName.includes(lowercasedSearchTerm) ||
        eventCode.includes(lowercasedSearchTerm)
      );
    };
    return {
      registered: lowercasedSearchTerm
        ? registeredEvents.filter(filterLogic)
        : registeredEvents,
      requested: lowercasedSearchTerm
        ? requestedEvents.filter(filterLogic)
        : requestedEvents,
    };
  }, [searchTerm, registeredEvents, requestedEvents]);

  const renderContent = () => {
    switch (activeTab) {
      case "registered":
        if (filteredEvents.registered.length === 0) {
          return (
            <p className="col-span-full text-center text-gray-500 py-10">
              No registered events match your search.
            </p>
          );
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filteredEvents.registered.map((event) => (
              <LoggerCard
                key={event.id || event.eventCode}
                data={event}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        );
      case "requested":
        if (filteredEvents.requested.length === 0) {
          return (
            <p className="col-span-full text-center text-gray-500 py-10">
              No requested events match your search.
            </p>
          );
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.requested.map((event) => (
              <div
                key={event.id || event.eventCode}
                className="cursor-pointer"
              >
                <RequestCard
                  data={event}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-1">
            <TabButton label="Registered Events" value="registered" />
            <TabButton label="Requested Events" value="requested" />
          </nav>
        </div>
        <div className="mb-8 flex">
          <div className="relative flex-grow w-full md:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base shadow-sm border border-gray-300"
              placeholder={`Search in ${activeTab
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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

export default RegisteredEvents;