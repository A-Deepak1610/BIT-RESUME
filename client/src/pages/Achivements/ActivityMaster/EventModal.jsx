import React, { useEffect, useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Clock,
  ExternalLinkIcon,
  Users,
  Tag,
  Laptop,
  Users2,
  AlertTriangle,
  Info,
  ListChecks,
  Award,
  GitCommitHorizontal,
} from "lucide-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import useAuth from "../../../store/UseAuth";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "transparent",
  boxShadow: "none",
  p: 0,
  outline: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "calc(100% - 32px)",
  maxWidth: "60rem",
};

// --- ApplyModal Component ---
// Now accepts onRegistrationSuccess to signal a successful API call
const ApplyModal = ({
  isOpen,
  onClose,
  eventName,
  eventCode,
  onRegistrationSuccess,
}) => {
  // --- STATE MANAGEMENT ---
  const [participationType, setParticipationType] = useState("team");
  const [teamName, setTeamName] = useState("");
  const [teamMates, setTeamMates] = useState([""]);
  const [domain, setDomain] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const { rollno } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL
  // --- API SUBMISSION LOGIC ---
  const handleEventsApply = async () => {
    const finalTeamMates =
      participationType === "team"
        ? teamMates.filter((mate) => mate.trim() !== "")
        : [];

    try {
      const response = await fetch(
        `${API_URL}api/addregisterevents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventCode: eventCode,
            teamName: teamName,
            domain: domain,
            problemStatement: problemStatement,
            leaderRollNo: rollno,
            teamMates: finalTeamMates,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errMsg = await response.text();
        console.error("Server Error:", errMsg);
        alert("Failed to submit! Try again.");
        return;
      }
      const data = await response.json();
      if (data.success) {
        alert(`✅ Registration Successful! Your Team Code: ${data.teamCode}`);
        // *** CHANGE HERE ***
        // This function, passed from the parent, will trigger the closing of both modals.
        onRegistrationSuccess();
      } else {
        alert(
          data.message || "Registration failed. Please check your details."
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Unable to connect to server. Try again later!");
    }
  };

  const handleTeamMateChange = (index, value) => {
    const newTeamMates = [...teamMates];
    newTeamMates[index] = value;
    setTeamMates(newTeamMates);
  };

  const addTeamMate = () => setTeamMates([...teamMates, ""]);
  const removeTeamMate = (index) =>
    setTeamMates(teamMates.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEventsApply();
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="apply-modal-title">
      <Box sx={{ ...modalStyle, maxWidth: "36rem" }}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center">
            <h2
              id="apply-modal-title"
              className="text-xl font-bold text-gray-800"
            >
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
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 overflow-y-auto space-y-6"
          >
            {/* Participation Type Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participation Type
              </label>
              <div className="flex items-center gap-x-6">
                <div className="flex items-center">
                  <input
                    id="team-radio"
                    name="participationType"
                    type="radio"
                    value="team"
                    checked={participationType === "team"}
                    onChange={(e) => setParticipationType(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="team-radio"
                    className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Team
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="individual-radio"
                    name="participationType"
                    type="radio"
                    value="individual"
                    checked={participationType === "individual"}
                    onChange={(e) => setParticipationType(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="individual-radio"
                    className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Individual
                  </label>
                </div>
              </div>
            </div>

            {/* Team Name Input */}
            <div>
              <label
                htmlFor="team-name"
                className="block text-sm font-medium text-gray-700"
              >
                {participationType === "team" ? "Team Name" : "Project Name"}
              </label>
              <input
                id="team-name"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  participationType === "team"
                    ? "e.g., The Code Crusaders"
                    : "e.g., Smart Irrigation System"
                }
                required
              />
            </div>

            {/* Conditional Teammates Section */}
            {participationType === "team" && (
              <div>
                <label
                  htmlFor="teammates"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Teammates' Roll Numbers
                </label>
                <div className="space-y-2">
                  {teamMates.map((mate, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={mate}
                        onChange={(e) =>
                          handleTeamMateChange(index, e.target.value)
                        }
                        placeholder={`Teammate ${index + 1} Roll Number`}
                        className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeTeamMate(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
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
            )}

            {/* Domain and Problem Statement Inputs */}
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="problem-statement"
                className="block text-sm font-medium text-gray-700"
              >
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

            {/* Action Buttons */}
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

// --- EventDetailModal Component ---
const EventDetailModal = ({ isOpen, onClose, eventData }) => {
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("Description");
    }
  }, [isOpen]);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (!isOpen || !eventData) {
    return null;
  }

  const {
    event_name,
    deadline,
    event_code,
    domains,
    min_team_size,
    max_team_size,
    description,
    rules,
    constraints,
    final_prize1,
    final_prize2,
    final_prize3,
    rounds,
    apply_link,
    online_rounds,
    offline_rounds,
  } = eventData;

  const handleOpenApplyModal = () => {
    setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
  };

  // *** NEW FUNCTION ***
  // This function will be passed to ApplyModal and called on success.
  const handleRegistrationSuccess = () => {
    handleCloseApplyModal(); // Close the apply modal
    onClose(); // Close the main event detail modal
  };

  const domainTags = domains
    ? String(domains)
        .split(/[,;]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : [];

  const TABS = {
    Description: <Info size={16} />,
    Rounds: <GitCommitHorizontal size={16} />,
    Rules: <ListChecks size={16} />,
    Constraints: <AlertTriangle size={16} />,
    Rewards: <Award size={16} />,
  };

  const { rollno } = useAuth();
  const [applied, setApplied] = useState(false);

  const handleApplied = async () => {
    try {
      const response = await fetch(
        `${API_URL}api/checkapplied?rollno=${encodeURIComponent(
          rollno
        )}&event_code=${encodeURIComponent(eventData.event_code)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setApplied(data.applied);
    } catch (error) {
      console.error("Error handling applied:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleApplied();
    }
  }, [isOpen, rollno]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="event-detail-modal-title"
      >
        <Box sx={modalStyle}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                  <h2
                    id="event-detail-modal-title"
                    className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
                  >
                    {event_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Code: {event_code}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-grow">
              {/* Overview Section */}
              <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Event Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {/* Team Size, Rounds, Domains etc. */}
                  <div>
                    <h4 className="text-xs text-gray-500 font-semibold mb-1 flex items-center">
                      <Users size={14} className="mr-1.5" />
                      Team Size
                    </h4>
                    <p className="text-gray-700">
                      {min_team_size} - {max_team_size} members
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 font-semibold mb-1 flex items-center">
                      <Laptop size={14} className="mr-1.5" />
                      Online Rounds
                    </h4>
                    <p className="text-gray-700">{online_rounds ?? "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 font-semibold mb-1 flex items-center">
                      <Users2 size={14} className="mr-1.5" />
                      Offline Rounds
                    </h4>
                    <p className="text-gray-700">{offline_rounds ?? "N/A"}</p>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <h4 className="text-xs text-gray-500 font-semibold mb-1.5 flex items-center">
                      <Tag size={14} className="mr-1.5" />
                      Domains
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {domainTags.length > 0 ? (
                        domainTags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(() => {
                // Check if deadline has passed
                const isDeadlinePassed = deadline
                  ? new Date(deadline) < new Date()
                  : false;
                const isDisabled = applied || isDeadlinePassed;
                const buttonText = applied
                  ? "Applied"
                  : isDeadlinePassed
                  ? "Deadline Passed"
                  : "Apply Now";

                return (
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
                    <button
                      disabled={isDisabled}
                      onClick={handleOpenApplyModal}
                      className={`w-full sm:w-auto flex-1 sm:flex-none text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {buttonText}
                    </button>
                    <div
                      className={`w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-medium px-4 py-2 rounded-lg ${
                        isDeadlinePassed
                          ? "text-gray-600 bg-gray-100 border border-gray-300"
                          : "text-red-600 bg-red-50 border border-red-200"
                      }`}
                    >
                      <Clock size={16} className="mr-2" />
                      {isDeadlinePassed ? "Deadline Ended: " : "Apply Before: "}
                      <strong>{deadline}</strong>
                    </div>
                    <a
                      href={apply_link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center ${
                        !apply_link && "pointer-events-none opacity-50"
                      }`}
                    >
                      Official Website
                      <ExternalLinkIcon size={14} className="ml-1" />
                    </a>
                  </div>
                );
              })()}

              {/* Tab Navigation & Content */}
              <div>
                <div className="border-b border-gray-200 mb-4">
                  <nav className="flex space-x-2 sm:space-x-4 -mb-px overflow-x-auto">
                    {Object.entries(TABS).map(([tab, icon]) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                          activeTab === tab
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {icon} {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="text-sm text-gray-800 p-4 bg-gray-50 rounded-md min-h-[150px] prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                  {/* Tab Content based on activeTab */}
                  {activeTab === "Description" && (
                    <p>{description || "No description available."}</p>
                  )}
                  {activeTab === "Rounds" && (
                    <div className="space-y-4">
                      {rounds && rounds.length > 0 ? (
                        rounds.map((round) => (
                          <div key={round.round_number} className="not-prose">
                            <p className="font-bold text-sm text-gray-900">
                              Round {round.round_number}: {round.description}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {round.start_date} to {round.end_date}
                            </p>
                            <p className="text-xs mt-1 bg-gray-100 p-1.5 rounded-md">
                              <strong>RPs:</strong> I: {round.year1_rp}, II:{" "}
                              {round.year2_rp}, III: {round.year3_rp}, IV:{" "}
                              {round.year4_rp}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No round details available.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "Rules" && (
                    <div>
                      {rules ? (
                        rules
                          .split(/[\r\n]+/)
                          .map(
                            (line, index) =>
                              line.trim() && <p key={index}>{line.trim()}</p>
                          )
                      ) : (
                        <p>Rules for {event_name} will be updated soon.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "Constraints" && (
                    <div>
                      {constraints &&
                      constraints.trim().toLowerCase() !== "na" ? (
                        constraints
                          .split(/[\r\n]+/)
                          .map(
                            (line, index) =>
                              line.trim() && <p key={index}>{line.trim()}</p>
                          )
                      ) : (
                        <p>No specific constraints provided.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "Rewards" && (
                    <div>
                      <p>
                        <strong>Prize Money & Rewards:</strong>
                      </p>
                      <ul>
                        <li>
                          <span className="font-semibold">Winner:</span>{" "}
                          {final_prize1 || "N/A"}
                        </li>
                        <li>
                          <span className="font-semibold">1st Runner-up:</span>{" "}
                          {final_prize2 || "N/A"}
                        </li>
                        <li>
                          <span className="font-semibold">2nd Runner-up:</span>{" "}
                          {final_prize3 || "N/A"}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* *** CHANGE HERE *** */}
      {/* Pass the new handler function to the ApplyModal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        eventName={event_name}
        eventCode={event_code}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </>
  );
};

export default EventDetailModal;
