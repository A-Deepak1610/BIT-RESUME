// RequestedEvents.jsx
import React, { useState } from "react";
import RequestCard from "./RequestedCard";
import initialEventData from "../../../dummydatas/RequestedEvents.json"; 


const RequestedEvents = () => {
  const [events, setEvents] = useState(initialEventData);

  const handleApprove = (eventId) => {
    console.log("Approving event:", eventId);
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: "Approved" } : event
      )
    );
  };

  const handleReject = (eventId) => {
    console.log("Rejecting event:", eventId);
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: "Rejected" } : event
      )
    );
  };

  if (!events || events.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-7 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-500 py-10">
          No requested events found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-7 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <RequestCard
            key={event.id || event.eventCode} // Use a unique key
            data={event}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
};

export default RequestedEvents;