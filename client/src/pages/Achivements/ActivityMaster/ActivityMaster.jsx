// Your existing ActivityMaster.js
import React, { useState } from "react";
import MasterCard from "./masterCard";
import ActivityMasterData from "../../../dummydatas/ActivityMasterData.json";
import { Search } from "lucide-react";
import EventDetailModal from "./EventModal";

const ActivityMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);

  const filteredData = ActivityMasterData.filter((item) =>
    item["Event Name"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (eventData) => {
    setSelectedEventData(eventData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEventData(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-8">
          {/* Responsive Search Bar Area */}
          <div className="flex justify-center sm:justify-start">
            <div className="relative flex-1 w-full max-w-lg"> {/* max-w-lg to constrain width, sm:mx-0 removed to rely on flex justify */}
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           text-sm md:text-base shadow-sm placeholder-gray-400"
                placeholder="Search events by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <MasterCard data={filteredData} onCardClick={handleCardClick} /> 
        </div>
      </div>

      {selectedEventData && (
          <EventDetailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            eventData={selectedEventData}
          />
        )
      }
    </div>
  );
};

export default ActivityMaster;