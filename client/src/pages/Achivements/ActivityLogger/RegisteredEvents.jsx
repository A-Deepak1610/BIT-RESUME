import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

// Import Card Components
import LoggerCard from "./LoggerCard"; // For 'Registered' tab
import RequestCard from "./RequestedCard"; // For 'Requested' tab
import EventDetailModal from "../ActivityMaster/EventModal"; // The modal

// Import Data Sources
import initialRegisteredData from "../../../dummydatas/RegisteredEvents.json";
import initialRequestedData from "../../../dummydatas/RequestedEvents.json";

const RegisteredEvents = () => {
  const [activeTab, setActiveTab] = useState("registered");
  const [searchTerm, setSearchTerm] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState(initialRegisteredData);
  const [requestedEvents, setRequestedEvents] = useState(initialRequestedData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);

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
    setRequestedEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: "Approved" } : event
      )
    );
  };

  const handleReject = (eventId) => {
    setRequestedEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: "Rejected" } : event
      )
    );
  };

  const filteredEvents = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filterLogic = (item) => {
      const eventName = (item.eventName || item["Event Name"] || "").toLowerCase();
      const eventCode = (item.eventCode || item["Event code"] || "").toLowerCase();
      return eventName.includes(lowercasedSearchTerm) || eventCode.includes(lowercasedSearchTerm);
    };

    return {
      registered: lowercasedSearchTerm ? registeredEvents.filter(filterLogic) : registeredEvents,
      requested: lowercasedSearchTerm ? requestedEvents.filter(filterLogic) : requestedEvents
    };
  }, [searchTerm, registeredEvents, requestedEvents]);

  const TabButton = ({ label, value }) => (
    <button
      onClick={() => handleTabClick(value)}
      className={`py-3 px-6 font-medium text-sm focus:outline-none -mb-px border-b-2
        ${activeTab === value
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "registered":
        if (filteredEvents.registered.length === 0) {
          return <p className="col-span-full text-center text-gray-500 py-10">No registered events match your search.</p>;
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
          return <p className="col-span-full text-center text-gray-500 py-10">No requested events match your search.</p>;
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.requested.map((event) => (
              <div key={event.id || event.eventCode} className="cursor-pointer" onClick={() => handleCardClick(event)}>
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
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-1">
            <TabButton label="Registered Events" value="registered" />
            <TabButton label="Requested Events" value="requested" />
          </nav>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex">
          <div className="relative flex-grow w-full md:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base shadow-sm border border-gray-300"
              placeholder={`Search in ${activeTab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Content Area */}
        {renderContent()}
      </div>

      {/* Detail Modal */}
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