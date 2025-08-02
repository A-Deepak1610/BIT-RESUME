import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import LoggerCard from "./LoggerCard";
import RequestCard from "./RequestedCard";
import EventDetailModal from "../ActivityMaster/EventModal";
import useAuth from "../../../store/UseAuth";

const RegisteredEvents = () => {
  const [activeTab, setActiveTab] = useState("registered");
  const [searchTerm, setSearchTerm] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]); // Initialize with an empty array
  const [requestedEvents, setRequestedEvents] = useState([]); // Initialize with an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);
  // const { rollno } = useAuth();
  const rollno='7376242Ad136';

  useEffect(() => {
    // Fetch initial data when the component mounts
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
        `http://localhost:6001/api/events/registered/${rollno}`,
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

      // Map the backend data to the structure your components expect
      const mappedEvents = result.data.map(event => {
        // Determine completion status based on event.state and event.verified
        const isFacultyStageComplete = event.state === 'onduty' || event.verified;
        const isOnDutyStageComplete = event.verified;
        const isEventComplete = event.verified;

        return {
          ...event,
          id: event.eventCode, // Assuming eventCode is a unique identifier
          prizeAmount: event.finalPrize1,
          eventDate: event.startDate,
          eventType: event.type,
          applyButtonText: "View Details", // You can customize this
          progressStatus: [
              { stageName: 'Faculty', isCompleted: isFacultyStageComplete },
              { stageName: 'On Duty', isCompleted: isOnDutyStageComplete },
              { stageName: 'Completed', isCompleted: isEventComplete },
          ]
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
                onClick={() => handleCardClick(event)}
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
      {/* {selectedEventData && (
        <EventDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          eventData={selectedEventData}
        />
      )} */}
    </div>
  );
};

export default RegisteredEvents;