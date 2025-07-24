import React, { useState, useEffect } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import {
  X,
  FileText,
  Upload,
  Link2,
  Calendar,
  Users,
  MapPin,
  Award,
  Layers,
  Hash,
  Pilcrow,
  BookOpen,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const eventTypes = ["Online", "Offline", "Hybrid"];
const years = ["year1", "year2", "year3", "year4"]; // Helper for mapping

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: "800px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "12px",
  overflow: "hidden",
};

export default function AddActivityModal({
  open,
  handleClose,
  onActivityCreated,
}) {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);

  // Step 1 State
  const [event_name, setEventName] = useState("");
  const [event_code, setEventCode] = useState("");
  const [type, setType] = useState("");
  const [deadline, setDeadline] = useState("");
  const [min_team_size, setMinTeamSize] = useState(1);
  const [max_team_size, setMaxTeamSize] = useState(1);
  const [no_of_rounds, setNoOfRounds] = useState(1);
  const [online_rounds, setOnlineRounds] = useState("");
  const [offline_rounds, setOfflineRounds] = useState("");
  const [location, setLocation] = useState("");
  const [apply_link, setApplyLink] = useState("");
  const [domains, setDomains] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Step 2 & 3 State
  const [roundsData, setRoundsData] = useState([]);
  const [final_prizes, setFinalPrizes] = useState({
    first: "",
    second: "",
    third: "",
  });

  // Step 4 State
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [constraints, setConstraints] = useState("");

  // --- LOGIC AND HANDLERS ---
  useEffect(() => {
    const count = parseInt(no_of_rounds, 10) || 0;
    if (count > 0) {
      setRoundsData((currentData) => {
        const newData = [...currentData];
        while (newData.length < count) {
          // **CHANGED**: Initialize with new year-wise point structure
          newData.push({
            start_date: "",
            end_date: "",
            reward_points: { year1: "", year2: "", year3: "", year4: "" },
          });
        }
        return newData.slice(0, count);
      });
    } else {
      setRoundsData([]);
    }
  }, [no_of_rounds]);

  const handleRoundDataChange = (index, field, value) => {
    const newData = [...roundsData];
    newData[index][field] = value;
    setRoundsData(newData);
  };

  // **NEW**: Dedicated handler for nested reward points state
  const handlePointChange = (roundIndex, yearKey, value) => {
    const newData = [...roundsData];
    newData[roundIndex].reward_points[yearKey] = value;
    setRoundsData(newData);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleContinue = () => {
    // Validations remain the same
    // if (step === 1) {
    //     if (!event_name || !type || !deadline) {
    //         alert('Please fill out Event Name, Type, and Deadline.');
    //         return;
    //     }
    //     if (type === 'Hybrid' && (parseInt(online_rounds || 0) + parseInt(offline_rounds || 0) !== parseInt(no_of_rounds))) {
    //          alert('The sum of online and offline rounds must equal the total number of rounds.');
    //          return;
    //     }
    // }
    // if (step === 4) {
    //      if (!description) {
    //         alert('Please provide a Description before continuing.');
    //         return;
    //     }
    // }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const formData = new FormData();
    // The submission logic automatically handles the new nested state structure
    // No changes needed here as long as the state is correct.
    formData.append("event_name", event_name);
    formData.append("type", type);
    formData.append("deadline", deadline);
    formData.append("min_team_size", min_team_size);
    formData.append("max_team_size", max_team_size);
    formData.append("no_of_rounds", no_of_rounds);
    if (type === "Hybrid") {
      formData.append("online_rounds", online_rounds);
      formData.append("offline_rounds", offline_rounds);
    }
    formData.append("location", location);
    formData.append("apply_link", apply_link);
    formData.append("domains", domains);
    if (image) formData.append("image", image);
    formData.append("rounds_data", JSON.stringify(roundsData));
    formData.append("final_prizes", JSON.stringify(final_prizes));
    formData.append("description", description);
    formData.append("rules", rules);
    formData.append("constraints", constraints);
    console.log("--- Submitting To Backend: FormData Entries ---");
    // for (const [key, value] of formData.entries()) {
    //     if (value instanceof File) console.log(`${key}:`, { name: value.name, size: value.size, type: value.type });
    //     else console.log(`${key}:`, value);
    // }
    // console.log("-----------------------------------------------");
    const API_URL = "http://localhost:6001/api/addevents/create";
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        credentials: "include", // Same as withCredentials: true in axios
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      console.log("Event created successfully!");
    //   onActivityCreated();
    //   handleClose();
    //   setTimeout(() => setStep(1), 500);
    } catch (error) {
      console.error("Error creating event:", error.message);
    }
  };

  const stepTitles = [
    "Basic Information",
    "Round Schedule",
    "Rewards & Points",
    "Event Content",
    "Review & Confirm",
  ];

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="text-primary" size={28} />
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Create New Event
              </h2>
              <p className="text-sm text-gray-500">
                Step {step} of 5: {stepTitles[step - 1]}
              </p>
            </div>
          </div>
          <IconButton onClick={handleClose} size="small">
            <X className="text-gray-500 hover:text-gray-700" />
          </IconButton>
        </div>

        {/* --- BODY --- */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            /* =================== STEP 1: BASIC INFO (Unchanged) =================== */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      value={event_name}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g., Hackathon 2024"
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Event Type *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="" disabled>
                        Select Type
                      </option>
                      {eventTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Registration Deadline *
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Min Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={min_team_size}
                      onChange={(e) => setMinTeamSize(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      min={min_team_size}
                      value={max_team_size}
                      onChange={(e) => setMaxTeamSize(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Number of Rounds
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={no_of_rounds}
                      onChange={(e) => setNoOfRounds(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {type === "Hybrid" && (
                    <div className="sm:col-span-2 grid grid-cols-2 gap-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Online Rounds
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={online_rounds}
                          onChange={(e) => setOnlineRounds(e.target.value)}
                          className="w-full p-2 border-gray-300 rounded-md focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Offline Rounds
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={offline_rounds}
                          onChange={(e) => setOfflineRounds(e.target.value)}
                          className="w-full p-2 border-gray-300 rounded-md focus:ring-primary"
                        />
                      </div>
                      <p className="col-span-2 text-xs text-gray-500 text-center">
                        Must sum to {no_of_rounds} total rounds.
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    <MapPin size={14} className="inline mr-1" />
                    Location / Platform
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., College Auditorium or Discord"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    <Layers size={14} className="inline mr-1" />
                    Domains
                  </label>
                  <input
                    type="text"
                    value={domains}
                    onChange={(e) => setDomains(e.target.value)}
                    placeholder="AI, Web Dev, Blockchain (comma-separated)"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Event Image
                </label>
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 relative focus-within:border-primary focus-within:ring-2 focus-within:ring-primary">
                  {!imagePreview ? (
                    <div className="text-center">
                      <Upload size={32} className="mx-auto" />
                      <p>Click to upload</p>
                    </div>
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Event Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            /* =================== STEP 2: ROUND SCHEDULE (Unchanged) =================== */
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Round Dates
              </h3>
              <div className="space-y-4">
                {roundsData.map((round, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Round {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={round.start_date}
                          onChange={(e) =>
                            handleRoundDataChange(
                              index,
                              "start_date",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={round.end_date}
                          onChange={(e) =>
                            handleRoundDataChange(
                              index,
                              "end_date",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            // =================== STEP 3: REWARDS & POINTS (**CHANGED**) ===================
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Award size={20} className="text-primary" />
                  College Reward Points (Per Year)
                </h3>
                <div className="space-y-4">
                  {roundsData.map((round, roundIndex) => (
                    <div
                      key={roundIndex}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Round {roundIndex + 1} Points
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                        {years.map((yearKey, yearIndex) => (
                          <div key={yearKey}>
                            <label className="text-sm font-medium text-gray-600">
                              Year {yearIndex + 1} Points
                            </label>
                            <input
                              type="number"
                              value={round.reward_points[yearKey]}
                              onChange={(e) =>
                                handlePointChange(
                                  roundIndex,
                                  yearKey,
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 1500"
                              className="w-full mt-1 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {no_of_rounds > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Award size={20} className="text-amber-500" />
                    Final Round Prize Money
                  </h3>
                  <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        1st Place Prize
                      </label>
                      <input
                        type="text"
                        value={final_prizes.first}
                        onChange={(e) =>
                          setFinalPrizes((p) => ({
                            ...p,
                            first: e.target.value,
                          }))
                        }
                        placeholder="e.g., $1000 cash, Swag Kit"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        2nd Place Prize
                      </label>
                      <input
                        type="text"
                        value={final_prizes.second}
                        onChange={(e) =>
                          setFinalPrizes((p) => ({
                            ...p,
                            second: e.target.value,
                          }))
                        }
                        placeholder="e.g., $500 cash"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        3rd Place Prize
                      </label>
                      <input
                        type="text"
                        value={final_prizes.third}
                        onChange={(e) =>
                          setFinalPrizes((p) => ({
                            ...p,
                            third: e.target.value,
                          }))
                        }
                        placeholder="e.g., $250 cash"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            /* =================== STEP 4: EVENT CONTENT (Unchanged) =================== */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Pilcrow size={14} className="inline mr-1" />
                  Description *
                </label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the event, what it's about, and who should participate."
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <BookOpen size={14} className="inline mr-1" />
                  Rules & Guidelines
                </label>
                <textarea
                  rows="4"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="List the rules and guidelines for participants."
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <AlertCircle size={14} className="inline mr-1" />
                  Constraints
                </label>
                <textarea
                  rows="3"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="List any technical or logistical constraints."
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Link2 size={14} className="inline mr-1" />
                  Apply Link
                </label>
                <input
                  type="url"
                  value={apply_link}
                  onChange={(e) => setApplyLink(e.target.value)}
                  placeholder="https://forms.gle/your-link"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            // =================== STEP 5: REVIEW (**CHANGED**) ===================
            <div className="space-y-6 text-sm">
              <p className="text-center text-gray-600 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                Please review all information carefully before creating the
                event.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-bold text-base text-gray-700 border-b pb-1 mb-2">
                    Basic Info
                  </h4>
                  <p>
                    <strong>Name:</strong> {event_name || "N/A"}
                  </p>
                  <p>
                    <strong>Type:</strong> {type || "N/A"}
                  </p>
                  {type === "Hybrid" && (
                    <p>
                      <strong>Hybrid Split:</strong> {online_rounds || 0}{" "}
                      Online, {offline_rounds || 0} Offline
                    </p>
                  )}
                  <p>
                    <strong>Team Size:</strong> {min_team_size} (min) to{" "}
                    {max_team_size} (max)
                  </p>
                  <p>
                    <strong>Registration Deadline:</strong>{" "}
                    {deadline ? new Date(deadline).toLocaleDateString() : "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {location || "N/A"}
                  </p>
                  <p>
                    <strong>Domains:</strong> {domains || "N/A"}
                  </p>
                  <h4 className="font-bold text-base text-gray-700 border-b pb-1 mt-4 mb-2">
                    Content
                  </h4>
                  <p className="whitespace-pre-wrap bg-gray-50 p-2 rounded">
                    <strong>Description:</strong> {description || "N/A"}
                  </p>
                  <h4 className="font-bold text-base text-gray-700 border-b pb-1 mt-4 mb-2">
                    Rounds & Rewards
                  </h4>
                  {roundsData.map((r, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded border">
                      <p>
                        <strong>Round {i + 1} Date:</strong>{" "}
                        {r.start_date || "TBD"} to {r.end_date || "TBD"}
                      </p>
                      <div className="mt-2 text-xs grid grid-cols-2 gap-x-4">
                        <p>
                          <strong>Year 1 Points:</strong>{" "}
                          {r.reward_points.year1 || "0"}
                        </p>
                        <p>
                          <strong>Year 2 Points:</strong>{" "}
                          {r.reward_points.year2 || "0"}
                        </p>
                        <p>
                          <strong>Year 3 Points:</strong>{" "}
                          {r.reward_points.year3 || "0"}
                        </p>
                        <p>
                          <strong>Year 4 Points:</strong>{" "}
                          {r.reward_points.year4 || "0"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-amber-50 p-3 rounded border border-amber-200 mt-2">
                    <p>
                      <strong>1st Place Prize:</strong>{" "}
                      {final_prizes.first || "N/A"}
                    </p>
                    <p>
                      <strong>2nd Place Prize:</strong>{" "}
                      {final_prizes.second || "N/A"}
                    </p>
                    <p>
                      <strong>3rd Place Prize:</strong>{" "}
                      {final_prizes.third || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-1 space-y-4">
                  <h4 className="font-bold text-base text-gray-700 border-b pb-1">
                    Event Image
                  </h4>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Event Preview"
                      className="w-full rounded-md border"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-200 bg-slate-50">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            {step < 5 && (
              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Continue <ArrowRight size={16} />
              </button>
            )}
            {step === 5 && (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle size={18} /> Create Event
              </button>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
