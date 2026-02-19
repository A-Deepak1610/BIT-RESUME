import React, { useEffect, useState, useCallback } from "react";
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
  UserCheck,
  FileText,
  Shield,
  User,
  Loader2,
  AlertCircle,
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

// Helper component to display verification status badges
const VerificationStatusBadge = ({ status }) => {
    const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
        verified: "bg-green-100 text-green-800 border-green-300",
        rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return (
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium border rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
};


const EventDetailModal1 = ({ isOpen, onClose, eventData, onDelete }) => {
  const [mainTab, setMainTab] = useState("Event Details");
  const [detailsTab, setDetailsTab] = useState("Description");
  const [registrations, setRegistrations] = useState({ teams: [], individuals: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMainTab("Event Details");
      setDetailsTab("Description");
      setRegistrations({ teams: [], individuals: [] });
      setError(null);
    }
  }, [isOpen]);

  const handleRegisteredTeams = useCallback(async (eventCode) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/events/fetchregisteredteams/${eventCode}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch registered teams");
      }
      const data = await response.json();
      
      const allRegistrations = data || [];
      const teams = allRegistrations.filter(t => t.team_name && t.team_name !== "");
      const individuals = allRegistrations.filter(t => !t.team_name || t.team_name === "");

      setRegistrations({ teams, individuals });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isOpen || !eventData) return null;

  const { event_name, deadline, event_code, domains, min_team_size, max_team_size, description, rules, constraints, final_prize1, final_prize2, final_prize3, rounds, apply_link, online_rounds, offline_rounds } = eventData;
  const domainTags = domains ? String(domains).split(/[,;]/).map((tag) => tag.trim()).filter(Boolean) : [];
  const DETAIL_TABS = { Description: <Info size={16} />, Rounds: <GitCommitHorizontal size={16} />, Rules: <ListChecks size={16} />, Constraints: <AlertTriangle size={16} />, Rewards: <Award size={16} /> };
  const handleDeleteClick = async () => onDelete && await onDelete(eventData);

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="event-detail-modal-title">
      <Box sx={modalStyle}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200">
             <div className="flex justify-between items-start gap-4">
              <div className="flex-grow">
                <h2 id="event-detail-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{event_name}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Code: {event_code}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleDeleteClick} className="inline-flex cursor-pointer items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded" title="Delete event"><Trash2 size={14} /> Delete</button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Close modal"><X size={24} /></button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto">
            {/* Main Tabs */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-5 z-10">
              <nav className="flex space-x-4">
                <button onClick={() => setMainTab("Event Details")} className={`flex items-center gap-2 whitespace-nowrap py-3 px-2 border-b-2 font-semibold text-sm transition-colors focus:outline-none ${mainTab === "Event Details" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Event Details</button>
                <button onClick={() => {setMainTab("Registered Teams"); handleRegisteredTeams(event_code)}} className={`flex items-center gap-2 whitespace-nowrap py-3 px-2 border-b-2 font-semibold text-sm transition-colors focus:outline-none ${mainTab === "Registered Teams" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Registered Teams</button>
              </nav>
            </div>

            <div className="p-4 sm:p-5">
              {/* --- Event Details Content --- */}
              {mainTab === "Event Details" && (
                <div>
                  {/* === THIS IS THE FULLY RESTORED EVENT DETAILS SECTION === */}
                  <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Event Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div><h4 className="text-xs text-gray-500 font-semibold mb-1 flex items-center"><Users size={14} className="mr-1.5" />Team Size</h4><p className="text-gray-700">{min_team_size} - {max_team_size} members</p></div>
                      <div><h4 className="text-xs text-gray-500 font-semibold mb-1 flex items-center"><Laptop size={14} className="mr-1.5" />Online Rounds</h4><p className="text-gray-700">{online_rounds ?? "N/A"}</p></div>
                      <div><h4 className="text-xs text-gray-500 font-semibold mb-1 flex items-center"><Users2 size={14} className="mr-1.5" />Offline Rounds</h4><p className="text-gray-700">{offline_rounds ?? "N/A"}</p></div>
                      <div className="col-span-2 md:col-span-3"><h4 className="text-xs text-gray-500 font-semibold mb-1.5 flex items-center"><Tag size={14} className="mr-1.5" />Domains</h4><div className="flex flex-wrap gap-2">{domainTags.length > 0 ? (domainTags.map((tag, index) => <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">{tag}</span>)) : (<span className="text-xs text-gray-500">N/A</span>)}</div></div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
                    <div className="w-full sm:w-auto flex items-center justify-center text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg"><Clock size={16} className="mr-2" /> Deadline: <strong className="ml-1">{deadline || "N/A"}</strong></div>
                    <a href={apply_link || "#"} target="_blank" rel="noopener noreferrer" className={`text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center ${!apply_link && "pointer-events-none opacity-50"}`} title={apply_link ? "Open official website" : "No link provided"}>Official Website <ExternalLinkIcon size={14} className="ml-1" /></a>
                  </div>
                  <div>
                    <div className="border-b border-gray-200 mb-4">
                      <nav className="flex space-x-2 sm:space-x-4 -mb-px overflow-x-auto">{Object.entries(DETAIL_TABS).map(([tab, icon]) => (<button key={tab} onClick={() => setDetailsTab(tab)} className={`flex items-center gap-2 whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors focus:outline-none ${detailsTab === tab ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>{icon} {tab}</button>))}</nav>
                    </div>
                    <div className="text-sm text-gray-800 p-4 bg-gray-50 rounded-md min-h-[150px] prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                      {detailsTab === "Description" && <p>{description || "No description available."}</p>}
                      {detailsTab === "Rounds" && (<div className="space-y-4">{Array.isArray(rounds) && rounds.length > 0 ? (rounds.map((round, idx) => (<div key={round.round_number ?? idx} className="not-prose"><p className="font-bold text-sm text-gray-900">Round {round.round_number}: {round.description}</p>{(round.start_date || round.end_date) && (<p className="text-xs text-gray-500 font-medium">{round.start_date || "?"} to {round.end_date || "?"}</p>)}<p className="text-xs mt-1 bg-gray-100 p-1.5 rounded-md"><strong>RPs:</strong> I: {round.year1_rp ?? "-"}, II: {round.year2_rp ?? "-"}, III: {round.year3_rp ?? "-"}, IV: {round.year4_rp ?? "-"}</p></div>))) : (<p>No round details available.</p>)}</div>)}
                      {detailsTab === "Rules" && (<div>{rules ? (rules.split(/[\r\n]+/).map((line, index) => line.trim() && <p key={index}>{line.trim()}</p>)) : (<p>Rules for {event_name} will be updated soon.</p>)}</div>)}
                      {detailsTab === "Constraints" && (<div>{constraints && constraints.trim().toLowerCase() !== "na" ? (constraints.split(/[\r\n]+/).map((line, index) => line.trim() && <p key={index}>{line.trim()}</p>)) : (<p>No specific constraints provided.</p>)}</div>)}
                      {detailsTab === "Rewards" && (<div><p><strong>Prize Money & Rewards:</strong></p><ul className="list-disc list-inside"><li><span className="font-semibold">Winner:</span> {final_prize1 || "N/A"}</li><li><span className="font-semibold">1st Runner-up:</span> {final_prize2 || "N/A"}</li><li><span className="font-semibold">2nd Runner-up:</span> {final_prize3 || "N/A"}</li></ul></div>)}
                    </div>
                  </div>
                </div>
              )}

              {/* --- Registered Teams Content --- */}
              {mainTab === "Registered Teams" && (
                <div className="space-y-6">
                  {isLoading && <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin text-indigo-500" size={32} /><p className="ml-3 text-gray-600">Loading registrations...</p></div>}
                  {error && <div className="flex justify-center items-center p-8 bg-red-50 text-red-700 rounded-lg"><AlertCircle size={24} className="mr-3" /><p>Error: {error}</p></div>}
                  {!isLoading && !error && (
                    <>
                      {/* Registered Teams Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Registered Teams</h3>
                        {registrations.teams.length > 0 ? (
                          <div className="space-y-4">
                            {registrations.teams.map((team) => {
                              const members = team.team_mates_details.split(',').map(m => {
                                const [rollno, name, verified] = m.split(':');
                                return { rollno, name, verified };
                              });
                              const otherMembers = members.filter(m => m.rollno !== team.leader_rollno);
                              
                              return (
                                <div key={team.team_code} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                  <h4 className="text-base font-bold text-indigo-700">{team.team_name}</h4>
                                  <div className="mt-3 space-y-3 text-sm">
                                    <div className="flex items-center text-gray-700">
                                      <UserCheck size={14} className="mr-2 text-green-600" />
                                      <strong>Leader:</strong>&nbsp;{team.leader_name} ({team.leader_rollno})
                                      <VerificationStatusBadge status={members.find(m => m.rollno === team.leader_rollno)?.verified} />
                                    </div>
                                    <div className="flex items-start text-gray-700">
                                      <Users size={14} className="mr-2 mt-0.5 text-blue-600" />
                                      <div><strong>Members:</strong>
                                        <div className="flex flex-col gap-y-1 mt-1">
                                          {otherMembers.map(m => (<div key={m.rollno} className="flex items-center"><span className="text-xs">{m.name} ({m.rollno})</span><VerificationStatusBadge status={m.verified} /></div>))}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="flex items-start text-gray-700"><FileText size={14} className="mr-2 mt-0.5" /><strong>Problem:</strong>&nbsp;{team.problem_statement}</p>
                                    <p className="flex items-center text-gray-700"><Shield size={14} className="mr-2" /><strong>Domain:</strong>&nbsp;{team.domain}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (<p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">No teams have registered for this event yet.</p>)}
                      </div>

                      {/* Individual Participants Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Individual Participants</h3>
                        {registrations.individuals.length > 0 ? (
                          <div className="space-y-4">
                            {registrations.individuals.map((ind, index) => {
                               const [rollno, name, verified] = ind.team_mates_details.split(':');
                               return (
                                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center mb-3">
                                        <User size={16} className="mr-3 text-indigo-600"/>
                                        <h4 className="text-base font-bold text-indigo-700">{name} ({rollno})</h4>
                                        <VerificationStatusBadge status={verified} />
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-start text-gray-700"><FileText size={14} className="mr-2 mt-0.5" /><strong>Project:</strong>&nbsp;{ind.problem_statement}</p>
                                        <p className="flex items-center text-gray-700"><Shield size={14} className="mr-2" /><strong>Domain:</strong>&nbsp;{ind.domain}</p>
                                    </div>
                                </div>
                               );
                            })}
                          </div>
                        ) : (<p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">No individual participants have registered for this event yet.</p>)}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default EventDetailModal1;