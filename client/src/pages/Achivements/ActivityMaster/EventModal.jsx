import React, { useEffect, useState } from "react";
import {
  X,
  CalendarDays,
  Users,
  Tag,
  Plus,
  Trash2,
  Clock,
  ExternalLinkIcon,
  Trophy,
  Laptop,
  Users2,
  AlertTriangle, // Icon for Constraints
  Info, // Icon for Description
  ListChecks, // Icon for Rules
  Award, // Icon for Rewards
  GitCommitHorizontal, // Icon for Rounds
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

const ApplyModal = ({ isOpen, onClose, eventName, eventCode }) => {
  const [teamMates, setTeamMates] = useState([""]);
  const [domain, setDomain] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const { rollno } = useAuth();

  const handleEventsApply = async () => {
    // Filter out empty strings from teammates array
    const finalTeamMates = teamMates.filter((mate) => mate.trim() !== "");

    try {
      const response = await fetch(
        `http://localhost:6001/api/addregisterevents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventCode: eventCode,
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
        onClose();
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

  const addTeamMate = () => {
    setTeamMates([...teamMates, ""]);
  };

  const removeTeamMate = (index) => {
    const newTeamMates = teamMates.filter((_, i) => i !== index);
    setTeamMates(newTeamMates);
  };

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
            className="p-4 sm:p-5 overflow-y-auto space-y-4"
          >
            <div>
              <label
                htmlFor="teammates"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Teammates' Roll Numbers (optional)
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

const EventDetailModal = ({ isOpen, onClose, eventData }) => {
  const [activeTab, setActiveTab] = useState("Description");

  React.useEffect(() => {
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
        `http://localhost:6001/api/checkapplied?rollno=${encodeURIComponent(
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
    handleApplied();
  }, [isOpen, onClose, rollno]);
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
              {/* --- Overview Section --- */}
              <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Event Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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

              {/* --- Action Buttons --- */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
                <button 
                  disabled={applied}
                  onClick={handleOpenApplyModal}
                  className={` w-full ${applied?" cursor-not-allowed":""} sm:w-auto flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Apply Now
                </button>
                <div className="w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                  <Clock size={16} className="mr-2" />
                  Apply Before: <strong>{deadline}</strong>
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

              {/* --- Tab Navigation --- */}
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

                {/* --- Tab Content --- */}
                <div className="text-sm text-gray-800 p-4 bg-gray-50 rounded-md min-h-[150px] prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
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
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        eventName={event_name}
        eventCode={event_code}
      />
    </>
  );
};

export default EventDetailModal;

// import React, { useState } from "react";
// import {
//   X,
//   CalendarDays,
//   Users,
//   Tag,
//   Plus,
//   Trash2,
//   Clock,
//   ExternalLink as ExternalLinkIcon,
//   Trophy,
//   MapPin,
//   Layers,
//   Link as LinkIcon,
// } from "lucide-react";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import useAuth from "../../../store/UseAuth";
// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "transparent",
//   boxShadow: "none",
//   p: 0,
//   outline: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   width: "calc(100% - 32px)",
//   maxWidth: "60rem",
// };

// const ApplyModal = ({ isOpen, onClose, eventName, eventCode }) => {
//   const [teamMates, setTeamMates] = useState([""]);
//   const [domain, setDomain] = useState("");
//   const [problemStatement, setProblemStatement] = useState("");
//   const { rollno } = useAuth();

//   const handleEventsApply = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:6001/api/addregisterevents`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             eventCode: eventCode,
//             domain: domain,
//             problemStatement: problemStatement,
//             leaderRollNo: rollno,
//             teamMates: teamMates,
//           }),
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         const errMsg = await response.text();
//         console.error("Server Error:", errMsg);
//         alert("Failed to submit! Try again.");
//         return;
//       }
//       const data = await response.json();
//       console.log("Response Data:", data);
//       if (data.success) {
//         console.log(`✅ Registration Successful! Team Code: ${data.teamCode}`);
//       } else {
//         console.warn("Registration Failed:", data);
//       }
//     } catch (error) {
//       console.error("Error submitting application:", error);
//       alert("Unable to connect to server. Try again later!");
//     }
//   };

//   const handleTeamMateChange = (index, value) => {
//     const newTeamMates = [...teamMates];
//     newTeamMates[index] = value;
//     setTeamMates(newTeamMates);
//   };

//   const addTeamMate = () => {
//     setTeamMates([...teamMates, ""]);
//   };

//   const removeTeamMate = (index) => {
//     if (teamMates.length > 1) {
//       const newTeamMates = teamMates.filter((_, i) => i !== index);
//       setTeamMates(newTeamMates);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <Modal open={isOpen} onClose={onClose} aria-labelledby="apply-modal-title">
//       <Box sx={{ ...modalStyle, maxWidth: "36rem" }}>
//         <div className="bg-white rounded-xl shadow-2xl w-full max-height-[90vh] flex flex-col overflow-hidden">
//           <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center">
//             <h2 id="apply-modal-title" className="text-xl font-bold text-gray-800">
//               Apply for: <span className="text-indigo-600">{eventName}</span>
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               aria-label="Close modal"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
//             <div>
//               <label htmlFor="teammates" className="block text-sm font-medium text-gray-700 mb-2">
//                 Teammates' Roll Numbers
//               </label>
//               <div className="space-y-2">
//                 {teamMates.map((mate, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <input
//                       type="text"
//                       value={mate}
//                       onChange={(e) => handleTeamMateChange(index, e.target.value)}
//                       placeholder={`Teammate ${index + 1} Roll Number`}
//                       className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       required
//                     />
//                     {teamMates.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeTeamMate(index)}
//                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <button
//                 type="button"
//                 onClick={addTeamMate}
//                 className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
//               >
//                 <Plus size={16} /> Add Teammate
//               </button>
//             </div>

//             <div>
//               <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
//                 Domain
//               </label>
//               <input
//                 id="domain"
//                 type="text"
//                 value={domain}
//                 onChange={(e) => setDomain(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="e.g., Web Development, AI/ML"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="problem-statement" className="block text-sm font-medium text-gray-700">
//                 Problem Statement
//               </label>
//               <textarea
//                 id="problem-statement"
//                 rows={4}
//                 value={problemStatement}
//                 onChange={(e) => setProblemStatement(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="Briefly describe your chosen problem statement or project idea."
//                 required
//               />
//             </div>

//             <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEventsApply}
//                 type="submit"
//                 className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Submit Application
//               </button>
//             </div>
//           </form>
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// const EventDetailModal = ({ isOpen, onClose, eventData /** @type {EventData} */ }) => {
//   const [activeTab, setActiveTab] = useState("Description");
//   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

//   if (!isOpen || !eventData) return null;

//   React.useEffect(() => {
//     if (isOpen) setActiveTab("Description");
//   }, [isOpen]);

//   const {
//     event_name,
//     deadline,
//     event_code,
//     domains,
//     min_team_size,
//     max_team_size,
//     description,
//     rules,
//     constraints,
//     final_prize1,
//     final_prize2,
//     final_prize3,
//     rounds = [],
//     apply_link,
//     type,
//     location,
//     no_of_rounds,
//     online_rounds,
//     offline_rounds,
//     image_url,
//   } = eventData;

//   const domainTags = domains
//     ? String(domains)
//         .split(/[,;]/)
//         .map((tag) => tag.trim())
//         .filter((tag) => tag)
//     : [];

//   const sortedRounds = Array.isArray(rounds)
//     ? [...rounds].sort((a, b) => a.round_number - b.round_number)
//     : [];

//   const formatRewardPointsText = (round) => {
//     if (!round) return "N/A";
//     return `Year I: ${round.year1_rp ?? "0"}, Year II: ${round.year2_rp ?? "0"}, Year III: ${round.year3_rp ?? "0"}, Year IV: ${round.year4_rp ?? "0"}`;
//   };

//   const renderParagraphs = (text) =>
//     String(text)
//       .split(/\r?\n/)
//       .map((line) => line.trim())
//       .filter(Boolean)
//       .map((line, idx) => <p key={idx}>{line}</p>);

//   const renderBulleted = (text) => {
//     const lines = String(text)
//       .split(/\r?\n/)
//       .map((l) => l.trim())
//       .filter(Boolean);
//     if (!lines.length) return <p>No data available.</p>;
//     return (
//       <ul className="list-disc pl-5 space-y-1">
//         {lines.map((l, i) => (
//           <li key={i}>{l.replace(/^[-•·]\s*/, "")}</li>
//         ))}
//       </ul>
//     );
//   };

//   const handleOpenApplyModal = () => setIsApplyModalOpen(true);
//   const handleCloseApplyModal = () => setIsApplyModalOpen(false);

//   return (
//     <>
//       <Modal
//         open={isOpen}
//         onClose={onClose}
//         aria-labelledby="event-detail-modal-title"
//         aria-describedby="event-detail-modal-description"
//         slotProps={{
//           backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" } },
//         }}
//       >
//         <Box sx={modalStyle}>
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-hidden">
//             {/* Header */}
//             <div className="p-0">
//               {/* Optional banner image for enhanced UI */}
//               {image_url ? (
//                 <div className="w-full h-36 sm:h-48 relative bg-gray-100">
//                   <img
//                     src={`http://localhost:6001/${image_url}`}
//                     alt={`${event_name} banner`}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
//                   <div className="absolute bottom-2 left-3 right-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
//                     <div>
//                       <h2 id="event-detail-modal-title" className="text-white text-lg sm:text-2xl font-bold drop-shadow">
//                         {event_name}
//                       </h2>
//                       <div className="flex flex-wrap items-center text-[11px] sm:text-xs text-white/90 mt-1">
//                         <CalendarDays size={14} className="mr-1.5" />
//                         <span>{deadline}</span>
//                         <span className="mx-2">|</span>
//                         <span>Code: {event_code}</span>
//                         {type && (
//                           <>
//                             <span className="mx-2">|</span>
//                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white border border-white/30">
//                               {type}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {apply_link && (
//                         <a
//                           href={apply_link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 border border-white rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm"
//                           title="Open application link"
//                         >
//                           <LinkIcon size={14} />
//                           Apply on website
//                         </a>
//                       )}
//                       <button
//                         onClick={onClose}
//                         className="text-white/90 hover:text-white transition-colors p-1 rounded-full border border-white/40 bg-white/10"
//                         aria-label="Close modal"
//                       >
//                         <X size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-4 sm:p-5 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
//                     <div className="flex-grow">
//                       <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{event_name}</h2>
//                       <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mt-1">
//                         <CalendarDays size={16} className="mr-1.5 sm:mr-2" />
//                         <span>{deadline}</span>
//                         <span className="mx-1.5 sm:mx-2">|</span>
//                         <span>Code: {event_code}</span>
//                         {type && (
//                           <>
//                             <span className="mx-1.5 sm:mx-2">|</span>
//                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
//                               {type}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex flex-col items-start sm:items-end space-y-2 flex-shrink-0 mt-2 sm:mt-0">
//                       <button
//                         onClick={onClose}
//                         className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         aria-label="Close modal"
//                       >
//                         <X size={24} />
//                       </button>
//                       <a
//                         href={apply_link || "#"}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className={`text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center ${
//                           !apply_link && "pointer-events-none opacity-50"
//                         }`}
//                       >
//                         Apply on website
//                         <ExternalLinkIcon size={16} className="ml-1.5" />
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Body */}
//             <div id="event-detail-modal-description" className="p-4 sm:p-5 overflow-y-auto flex-grow">
//               {/* Top meta */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5">
//                 <div>
//                   <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5">
//                     Fields / Domain
//                   </h3>
//                   <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                     {domainTags.length > 0 ? (
//                       domainTags.map((tag, index) => (
//                         <span
//                           key={index}
//                           className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center"
//                         >
//                           <Tag size={12} className="mr-1.5 text-gray-500" />
//                           {tag}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="text-xs text-gray-500">N/A</span>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5">
//                     Rounds Timeline & Reward Points
//                   </h3>
//                   {sortedRounds.length > 0 ? (
//                     <div className="space-y-2">
//                       {sortedRounds.map((round) => (
//                         <div
//                           key={`${round.round_number}-${round.start_date}`}
//                           className="relative pl-4 border-l-2 border-indigo-200"
//                         >
//                           <span className="absolute -left-[5px] top-1 w-2 h-2 bg-indigo-500 rounded-full" />
//                           <p className="text-xs text-gray-700 font-semibold">
//                             Round {round.round_number}
//                             {round.description ? ` — ${round.description}` : ""}{" "}
//                             <span className="font-normal text-gray-500">
//                               ({round.start_date} to {round.end_date})
//                             </span>
//                           </p>
//                           <p className="text-[11px] text-gray-600">
//                             {formatRewardPointsText(round)}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <span className="text-xs text-gray-500">N/A</span>
//                   )}
//                 </div>
//               </div>

//               {/* Quick facts */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-5 py-3 sm:py-3.5 bg-gray-50 px-3 sm:px-4 rounded-lg">
//                 <div>
//                   <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 flex items-center">
//                     <Users size={14} className="mr-1.5 text-gray-400" />
//                     Team size
//                   </h3>
//                   <p className="text-sm text-gray-700">
//                     {min_team_size} - {max_team_size}
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 flex items-center">
//                     <Trophy size={14} className="mr-1.5 text-gray-400" />
//                     Prizes
//                   </h3>
//                   <p className="text-sm text-gray-700">1st: {final_prize1 || "N/A"}</p>
//                   <p className="text-sm text-gray-700">2nd: {final_prize2 || "N/A"}</p>
//                   <p className="text-sm text-gray-700">3rd: {final_prize3 || "N/A"}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 flex items-center">
//                     <Layers size={14} className="mr-1.5 text-gray-400" />
//                     Event Info
//                   </h3>
//                   <p className="text-sm text-gray-700">
//                     Type: <span className="font-medium">{type || "N/A"}</span>
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     Rounds:{" "}
//                     <span className="font-medium">
//                       {no_of_rounds ?? (sortedRounds?.length || "N/A")}
//                     </span>{" "}
//                     {typeof online_rounds !== "undefined" &&
//                       typeof offline_rounds !== "undefined" && (
//                         <span className="text-gray-600">
//                           (Online: {online_rounds}, Offline: {offline_rounds})
//                         </span>
//                       )}
//                   </p>
//                   <p className="text-sm text-gray-700 flex items-center">
//                     <MapPin size={14} className="mr-1.5 text-gray-400" />
//                     {location || "Location/Platform: N/A"}
//                   </p>
//                 </div>
//               </div>

//               {/* CTA */}
//               <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-5">
//                 <button
//                   onClick={handleOpenApplyModal}
//                   className="w-full cursor-pointer sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-colors duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Apply Now
//                 </button>
//                 <div className="w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg">
//                   <Clock size={16} className="mr-2" />
//                   Deadline: {deadline}
//                 </div>
//               </div>

//               {/* Tabs */}
//               <div>
//                 <div className="border-b border-gray-200 mb-3 sm:mb-4">
//                   <nav className="flex space-x-2 sm:space-x-4 -mb-px overflow-x-auto" aria-label="Tabs">
//                     {["Description", "Rules", "Constraints", "Rewards"].map((tab) => (
//                       <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`whitespace-nowrap py-2 sm:py-2.5 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors focus:outline-none
//                           ${
//                             activeTab === tab
//                               ? "border-indigo-500 text-indigo-600"
//                               : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                           }`}
//                       >
//                         {tab}
//                       </button>
//                     ))}
//                   </nav>
//                 </div>

//                 <div className="text-sm text-gray-700 p-3 sm:p-4 bg-gray-50 rounded-md min-h-[120px]">
//                   {activeTab === "Description" && (
//                     <div className="leading-relaxed space-y-2 prose prose-sm max-w-none">
//                       {description ? renderParagraphs(description) : "No description available."}
//                     </div>
//                   )}

//                   {activeTab === "Rules" && (
//                     <div className="prose prose-sm max-w-none">
//                       {rules ? renderParagraphs(rules) : `Rules for ${event_name} will be updated soon.`}
//                     </div>
//                   )}

//                   {activeTab === "Constraints" && (
//                     <div className="prose prose-sm max-w-none">
//                       {constraints ? renderBulleted(constraints) : "No constraints provided."}
//                     </div>
//                   )}

//                   {activeTab === "Rewards" && (
//                     <div className="prose prose-sm max-w-none">
//                       <p className="font-semibold">Prize Money:</p>
//                       <ul className="list-disc pl-5">
//                         <li>1st Place: {final_prize1 || "N/A"}</li>
//                         <li>2nd Place: {final_prize2 || "N/A"}</li>
//                         <li>3rd Place: {final_prize3 || "N/A"}</li>
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Box>
//       </Modal>

//       <ApplyModal
//         isOpen={isApplyModalOpen}
//         onClose={handleCloseApplyModal}
//         eventName={event_name}
//         eventCode={event_code}
//       />
//     </>
//   );
// };

// export default EventDetailModal;
