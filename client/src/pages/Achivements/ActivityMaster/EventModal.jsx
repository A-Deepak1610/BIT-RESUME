// src/components/EventDetailModal.js (or appropriate path)
import React, { useState } from "react";
import { X, CalendarDays, Users, User, Tag, Clock, ExternalLinkIcon } from "lucide-react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'transparent',
  boxShadow: 'none',
  p: 0,
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'calc(100% - 32px)', 
  maxWidth: '60rem', 
};

const EventDetailModal = ({ isOpen, onClose, eventData }) => {
  const [activeTab, setActiveTab] = useState("Description");

  if (!isOpen || !eventData) { // Ensure isOpen is also checked
      return null;
  }

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("Description");
    }
  }, [isOpen]);


  const {
    "Event Name": eventName,
    Date: eventDate,
    "Event code": eventCode,
    "Feild or Domain": fieldsOrDomain,
    "Reward Points": rewardPoints,
    "Eligibility Status": eligibilityStatus,
    "Applied Teams": appliedTeams,
    "Team size": teamSize,
    "Registration Death Line": registrationDeadline,
    Description: eventDescription = "Description not available for this event.", // Default if missing
    "Prize Money": prizeMoney
  } = eventData;

  const currentDescription = typeof eventDescription === 'string' ? eventDescription : "Description not available for this event.";

  const domainTags = fieldsOrDomain ? String(fieldsOrDomain).split(/[,;]/).map((tag) => tag.trim()).filter(tag => tag) : [];


  const formatRewardPointsText = (roundData) => {
    // ... (your existing function, ensure it handles missing data gracefully)
    if (!roundData || typeof roundData !== 'object') return "N/A";
    // ... rest of your logic
    const year1Points = roundData["Year 1"] || roundData["year 1"];
    const year2Points = roundData["Year 2"] || roundData["year 2"];
    const year3Points = roundData["Year 3"] || roundData["year 3"];
    const year4Points = roundData["Year 4"] || roundData["year 4"];

    const pointsForYear1And2 = year1Points || year2Points;
    const pointsForYear3And4 = year3Points || year4Points;
    
    return `Year I & II - ${pointsForYear1And2 || 'N/A'} ; Year III & IV - ${pointsForYear3And4 || 'N/A'}`;
  };

  const formattedDeadline = registrationDeadline ? String(registrationDeadline).replace(/\./g, "-") : "N/A";

  return (
    <Modal
      open={isOpen}
      onClose={onClose} // This enables ESC and click-outside-to-close
      aria-labelledby="event-detail-modal-title"
      aria-describedby="event-detail-modal-description"
      BackdropProps={{
        sx: {
          // backdropFilter: 'blur(3px)', // Removed blur
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Default MUI-like backdrop
        }
      }}
      // disableScrollLock={false} // Default is false, usually okay. Set true if page scroll is an issue.
    >
      <Box sx={modalStyle}>
        {/* Ensure eventData is available before rendering content dependent on it */}
        {eventData && (
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-200"> {/* Slightly reduced padding for more content space */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex-grow">
                  <h2 id="event-detail-modal-title" className="text-xl sm:text-2xl font-bold text-gray-800">{eventName}</h2>
                  <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mt-1">
                    <CalendarDays size={16} className="mr-1.5 sm:mr-2" />
                    <span>{eventDate}</span>
                    <span className="mx-1.5 sm:mx-2">|</span>
                    <span>Code : {eventCode}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end space-y-2 flex-shrink-0 mt-2 sm:mt-0">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                    <a
                    href={eventData["Apply Link"] || "#"} // Assuming an "Apply Link" field in your data
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center ${!eventData["Apply Link"] && "pointer-events-none opacity-50"}`}
                    >
                    Apply on website
                    <ExternalLinkIcon size={16} className="ml-1.5" />
                    </a>
                </div>
              </div>
            </div>

            {/* Modal Body (scrollable part) */}
            <div id="event-detail-modal-description" className="p-4 sm:p-5 overflow-y-auto flex-grow"> {/* Slightly reduced padding */}
              {/* Fields & Rewards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5"> {/* Reduced margins */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5">Fields / Domain</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {domainTags.length > 0 ? domainTags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center"
                      >
                        <Tag size={12} className="mr-1.5 text-gray-500" />
                        {tag}
                      </span>
                    )) : <span className="text-xs text-gray-500">N/A</span>}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5">Level based Reward Points</h3>
                  {rewardPoints && rewardPoints["Round 1"] ? (
                    <div className="text-xs text-gray-600 mb-1">
                      <p className="font-medium">{rewardPoints["Round 1"].Discription}</p>
                      <p>{formatRewardPointsText(rewardPoints["Round 1"])}</p>
                    </div>
                  ) : <span className="text-xs text-gray-500">N/A for Round 1</span>}
                  {rewardPoints && rewardPoints["Round 2"] && (
                     <div className="text-xs text-gray-600 mt-1.5"> {/* Reduced margin top */}
                      <p className="font-medium">{rewardPoints["Round 2"].Discription}</p>
                      <p>{formatRewardPointsText(rewardPoints["Round 2"])}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Team Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-5 py-3 sm:py-3.5 bg-gray-50 px-3 sm:px-4 rounded-lg"> {/* Reduced padding/margins */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">Eligibility Status</h3>
                  <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                    eligibilityStatus?.toLowerCase() === "eligible"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : eligibilityStatus?.toLowerCase() === "not eligible" || eligibilityStatus?.toLowerCase() === "ineligible"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200" // For other statuses like "Pending"
                  }`}>
                    {eligibilityStatus || "N/A"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 flex items-center">
                    <User size={14} className="mr-1.5 text-gray-400" />
                    Applied Teams
                  </h3>
                  <p className="text-sm text-gray-700">{appliedTeams !== undefined ? appliedTeams : "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 flex items-center">
                    <Users size={14} className="mr-1.5 text-gray-400" />
                    Team size
                  </h3>
                  <p className="text-sm text-gray-700">{teamSize || "N/A"}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-5"> {/* Reduced margin */}
                <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-colors duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Apply Now
                </button>
                <div className="w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg">
                  <Clock size={16} className="mr-2" />
                  Deadline: {formattedDeadline}
                </div>
              </div>

              {/* Tabs & Content */}
              <div>
                <div className="border-b border-gray-200 mb-3 sm:mb-4">
                  <nav className="flex space-x-2 sm:space-x-4 -mb-px overflow-x-auto" aria-label="Tabs">
                    {["Description", "Rules", "Rewards"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap py-2 sm:py-2.5 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors focus:outline-none 
                          ${
                            activeTab === tab
                              ? "border-indigo-500 text-indigo-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="text-sm text-gray-700 p-3 sm:p-4 bg-gray-50 rounded-md min-h-[100px]">
                  {activeTab === "Description" && (
                    <div className="leading-relaxed space-y-2 prose prose-sm max-w-none">
                      {currentDescription.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {activeTab === "Rules" && (
                    <div className="prose prose-sm max-w-none">
                      <p>Rules for {eventName} will be updated soon. Please check back later.</p>
                      {/* You can add more structured rules here */}
                    </div>
                  )}
                  {activeTab === "Rewards" && (
                    <div className="prose prose-sm max-w-none">
                      <p>Detailed reward structure for {eventName}:</p>
                      <p><strong>Prize Money:</strong> {prizeMoney || "N/A"}</p>
                      {/* You can list more reward details here */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default EventDetailModal;