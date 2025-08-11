import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  Tag,
  Trash2,
  Clock,
  ExternalLinkIcon,
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

const EventDetailModal1 = ({ isOpen, onClose, eventData, onDelete }) => {
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    if (isOpen) setActiveTab("Description");
  }, [isOpen]);

  if (!isOpen || !eventData) return null;

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

  const handleDeleteClick = async () => {
    if (!onDelete) return;
    await onDelete(eventData);
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="event-detail-modal-title">
      <Box sx={modalStyle}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[90vh] sm:max-h-[95vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-grow">
                <h2
                  id="event-detail-modal-title"
                  className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
                >
                  {event_name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Code: {event_code}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteClick}
                  className="inline-flex cursor-pointer items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                  title="Delete event"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-grow">
            {/* Overview */}
            <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Event Overview</h3>
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

            {/* Faculty info row (no Apply button) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
              <div className="w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                <Clock size={16} className="mr-2" />
                Dead Line: <strong className="ml-1">{deadline || "N/A"}</strong>
              </div>
              <a
                href={apply_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center ${
                  !apply_link && "pointer-events-none opacity-50"
                }`}
                title={apply_link ? "Open official website" : "No link provided"}
              >
                Official Website
                <ExternalLinkIcon size={14} className="ml-1" />
              </a>
            </div>

            {/* Tabs */}
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

              {/* Tab content */}
              <div className="text-sm text-gray-800 p-4 bg-gray-50 rounded-md min-h-[150px] prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                {activeTab === "Description" && (
                  <p>{description || "No description available."}</p>
                )}

                {activeTab === "Rounds" && (
                  <div className="space-y-4">
                    {Array.isArray(rounds) && rounds.length > 0 ? (
                      rounds.map((round, idx) => (
                        <div key={round.round_number ?? idx} className="not-prose">
                          <p className="font-bold text-sm text-gray-900">
                            Round {round.round_number}: {round.description}
                          </p>
                          {(round.start_date || round.end_date) && (
                            <p className="text-xs text-gray-500 font-medium">
                              {round.start_date || "?"} to {round.end_date || "?"}
                            </p>
                          )}
                          <p className="text-xs mt-1 bg-gray-100 p-1.5 rounded-md">
                            <strong>RPs:</strong> I: {round.year1_rp ?? "-"}, II:{" "}
                            {round.year2_rp ?? "-"}, III: {round.year3_rp ?? "-"}, IV:{" "}
                            {round.year4_rp ?? "-"}
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
                        .map((line, index) => line.trim() && <p key={index}>{line.trim()}</p>)
                    ) : (
                      <p>Rules for {event_name} will be updated soon.</p>
                    )}
                  </div>
                )}

                {activeTab === "Constraints" && (
                  <div>
                    {constraints && constraints.trim().toLowerCase() !== "na" ? (
                      constraints
                        .split(/[\r\n]+/)
                        .map((line, index) => line.trim() && <p key={index}>{line.trim()}</p>)
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
                    <ul className="list-disc list-inside">
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
  );
};

export default EventDetailModal1;