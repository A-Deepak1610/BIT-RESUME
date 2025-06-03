// RegisteredEvents.js
import React, { useState } from "react";
import LoggerCard from "./LoggerCard"; // Assuming LoggerCard.js is in the same directory
import data from "../../../dummydatas/RegisteredEvents.json"; // Adjust the path as necessary

const RegisteredEvents = () => {
  const [events, setEvents] = useState(data);

  const handleCardClick = (eventData) => {
    console.log("Card clicked:", eventData.eventName, eventData);
    // Implement navigation or modal display logic here
  };

  if (!events || events.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-7 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-500 py-10">
          No registered events found or data is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-7 bg-gray-100 min-h-screen"> {/* Adjusted padding for responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <LoggerCard
            key={event.id || event.eventCode}
            data={event}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RegisteredEvents;