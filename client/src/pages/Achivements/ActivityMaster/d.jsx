// src/components/EventDetailModal.js (or appropriate path)
import React, { useState } from "react";
import { X, CalendarDays, Users, User, Tag, Clock, ExternalLinkIcon, Plus, Trash2 } from "lucide-react";
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

// --- New Apply Modal Component ---
const ApplyModal = ({ isOpen, onClose, eventName }) => {
    const [teamMates, setTeamMates] = useState(['']); // Start with one empty input for the first teammate
    const [domain, setDomain] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
  
    const handleTeamMateChange = (index, value) => {
      const newTeamMates = [...teamMates];
      newTeamMates[index] = value;
      setTeamMates(newTeamMates);
    };
  
    const addTeamMate = () => {
      setTeamMates([...teamMates, '']);
    };
  
    const removeTeamMate = (index) => {
        // Prevent removing the last input field
        if (teamMates.length > 1) {
            const newTeamMates = teamMates.filter((_, i) => i !== index);
            setTeamMates(newTeamMates);
        }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Filter out any empty strings from teammates before logging/submitting
      const finalTeamMates = teamMates.filter(mate => mate.trim() !== '');
      
      console.log("Submitting Application:", {
        eventName,
        teamMates: finalTeamMates,
        domain,
        problemStatement,
      });
  
      alert("Application submitted successfully! Check the browser console for the data.");
      
      // Reset form and close modal
      setTeamMates(['']);
      setDomain('');
      setProblemStatement('');
      onClose();
    };
  
    return (
      <Modal open={isOpen} onClose={onClose} aria-labelledby="apply-modal-title">
        <Box sx={{...modalStyle, maxWidth: '36rem'}}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 id="apply-modal-title" className="text-xl font-bold text-gray-800">
                Apply for: <span className="text-indigo-600">{eventName}</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div>
                <label htmlFor="teammates" className="block text-sm font-medium text-gray-700 mb-2">
                  Teammates' Role Numbers
                </label>
                <div className="space-y-2">
                  {teamMates.map((mate, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={mate}
                        onChange={(e) => handleTeamMateChange(index, e.target.value)}
                        placeholder={`Teammate ${index + 1} Role Number`}
                        className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                      {teamMates.length > 1 && (
                         <button type="button" onClick={() => removeTeamMate(index)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                           <Trash2 size={16} />
                         </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTeamMate}
                  className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Teammate
                </button>
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Domain
                </label>
                <input
                  id="domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Web Development, AI/ML"
                  required
                />
              </div>

              <div>
                <label htmlFor="problem-statement" className="block text-sm font-medium text-gray-700">
                  Problem Statement
                </label>
                <textarea
                  id="problem-statement"
                  rows={4}
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Briefly describe your chosen problem statement or project idea."
                  required
                />
              </div>

              {/* Modal Footer (Form Actions) */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    );
  };
  
// --- Main Event Detail Modal Component ---
const EventDetailModal = ({ isOpen, onClose, eventData }) => {
  const [activeTab, setActiveTab] = useState("Description");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false); // State for the new modal

  if (!isOpen || !eventData) {
      return null;
  }

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("Description");
    }
  }, [isOpen]);

  const handleOpenApplyModal = () => {
    // We can optionally close the detail modal first, or leave it open in the background.
    // For a cleaner UX, let's close the detail modal when opening the apply modal.
    // onClose(); 
    setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
  };

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
    if (!roundData || typeof roundData !== 'object') return "N/A";
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
    // Use a Fragment to render both modals
    <>
        <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="event-detail-modal-title"
        aria-describedby="event-detail-modal-description"
        BackdropProps={{
            sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }
        }}
        >
        <Box sx={modalStyle}>
            {eventData && (
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-gray-200">
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
                            href={eventData["Apply Link"] || "#"}
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
                <div id="event-detail-modal-description" className="p-4 sm:p-5 overflow-y-auto flex-grow">
                {/* Fields & Rewards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5">
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
                        <div className="text-xs text-gray-600 mt-1.5">
                        <p className="font-medium">{rewardPoints["Round 2"].Discription}</p>
                        <p>{formatRewardPointsText(rewardPoints["Round 2"])}</p>
                        </div>
                    )}
                    </div>
                </div>

                {/* Status & Team Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-5 py-3 sm:py-3.5 bg-gray-50 px-3 sm:px-4 rounded-lg">
                    <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">Eligibility Status</h3>
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        eligibilityStatus?.toLowerCase() === "eligible"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : eligibilityStatus?.toLowerCase() === "not eligible" || eligibilityStatus?.toLowerCase() === "ineligible"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-200"
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
                
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-5">
                    {/* UPDATED: OnClick now opens the apply modal */}
                    <button onClick={handleOpenApplyModal} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-colors duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                        </div>
                    )}
                    {activeTab === "Rewards" && (
                        <div className="prose prose-sm max-w-none">
                        <p>Detailed reward structure for {eventName}:</p>
                        <p><strong>Prize Money:</strong> {prizeMoney || "N/A"}</p>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>
            )}
        </Box>
        </Modal>

        {/* Render the new Apply Modal */}
        <ApplyModal 
            isOpen={isApplyModalOpen} 
            onClose={handleCloseApplyModal} 
            eventName={eventName} 
        />
    </>
  );
};

export default EventDetailModal;