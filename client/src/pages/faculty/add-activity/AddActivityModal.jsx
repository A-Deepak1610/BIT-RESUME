import React, { useState, useEffect, useCallback } from "react";
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
  Pilcrow,
  BookOpen,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import axios from "axios";

const eventTypes = ["Online", "Offline", "Hybrid"];
const years = ["year1", "year2", "year3", "year4"];
const STEP_TITLES = [
  "Basic Information",
  "Schedule & Rewards",
  "Event Content",
  "Review & Confirm",
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: "850px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "12px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

const InputField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required,
  min,
  max,
  readOnly = false,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <RequiredAst />}
    </label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full p-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        readOnly ? "bg-gray-100" : ""
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required,
  children,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <RequiredAst />}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border bg-white ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const TextareaField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  rows = 4,
  icon: Icon,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
    >
      {Icon && <Icon size={14} className="inline mr-1.5" />}
      {label} {required && <RequiredAst />}
    </label>
    <textarea
      rows={rows}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const ImageUploadField = ({ onFileChange, preview, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Event Image
    </label>
    <div
      className={`relative w-full h-48 border-2 border-dashed ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-lg flex items-center justify-center text-center text-gray-500 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500`}
    >
      {preview ? (
        <img
          src={preview}
          alt="Event Preview"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="flex flex-col items-center">
          <Upload size={32} className="mx-auto text-gray-400" />
          <p>Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
        </div>
      )}
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default function AddActivityModal({
  open,
  handleClose,
  onActivityCreated,
}) {
  const initialFormData = {
    event_name: "",
    type: "",
    deadline: "",
    min_team_size: 1,
    max_team_size: 1,
    no_of_rounds: 1,
    online_rounds: 0,
    offline_rounds: 0,
    location: "",
    apply_link: "",
    domains: "",
    image: null,
    imagePreview: "",
    roundsData: [],
    final_prize1:"",
    final_prize2:"",
    final_prize3:"",
    description: "",
    rules: "",
    constraints: "",
  };

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const count = parseInt(formData.no_of_rounds, 10) || 0;
    if (count > 0) {
      setFormData((currentData) => {
        const newRounds = [...currentData.roundsData];
        while (newRounds.length < count) {
          newRounds.push({
            start_date: "",
            end_date: "",
            reward_points: { year1: "", year2: "", year3: "", year4: "" },
          });
        }
        return { ...currentData, roundsData: newRounds.slice(0, count) };
      });
    } else {
      setFormData((currentData) => ({ ...currentData, roundsData: [] }));
    }
  }, [formData.no_of_rounds]);

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setStep(1);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleNestedChange = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      let temp = { ...prev };
      let current = temp;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return temp;
    });
    if (errors[path]) setErrors((prev) => ({ ...prev, [path]: null }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File is too large. Max 5MB.",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const {
      event_name,
      type,
      deadline,
      no_of_rounds,
      online_rounds,
      offline_rounds,
      description,
      apply_link,
      image,
    } = formData;

    if (step === 1) {
      if (!event_name.trim()) newErrors.event_name = "Event name is required.";
      if (!type) newErrors.type = "Event type is required.";
      if (!deadline) newErrors.deadline = "Registration deadline is required.";
      if (type === "Hybrid") {
        const total = parseInt(no_of_rounds, 10) || 0;
        const online = parseInt(online_rounds, 10) || 0;
        const offline = parseInt(offline_rounds, 10) || 0;
        if (online < 0 || offline < 0 || online + offline !== total) {
          newErrors.offline_rounds =
            "Sum of online/offline rounds must equal total rounds.";
        }
      }
    }
    if (step === 3) {
      if (!description.trim())
        newErrors.description = "A description of the event is required.";
      if (apply_link && !/^(https?:\/\/)/i.test(apply_link)) {
        newErrors.apply_link =
          "Please enter a valid URL (e.g., https://example.com).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleContinue = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);


  const handleSubmit = async () => {
    setIsSubmitting(true);
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (key === "image" && value instanceof File) {
        submissionData.append("image", value);
      } else if (key === "roundsData" ) {
            const roundsWithNumbers = value.map((round, index) => ({
                ...round,
                round_no: index + 1 
            }));
            submissionData.append(key, JSON.stringify(roundsWithNumbers));
    }
    else if (key !== "imagePreview") {
        submissionData.append(key, value);
      }
    });
    console.log(submissionData.get("roundsData"));
    const API_URL = "http://localhost:6001/api/addevents/create";
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: submissionData,
        credentials: "include",
      });
      onActivityCreated();
      // handleModalClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      setErrors({ submit: `Error creating event: ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Stepper = ({ current, titles }) => (
    <div className="flex items-center w-full px-6 py-3">
      {titles.map((title, index) => {
        const stepNum = index + 1;
        const isCompleted = current > stepNum;
        const isCurrent = current === stepNum;
        return (
          <React.Fragment key={title}>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isCompleted
                    ? "bg-indigo-600 text-white"
                    : isCurrent
                    ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={18} />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  isCurrent ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                {title}
              </span>
            </div>
            {index < titles.length - 1 && (
              <div
                className={`flex-auto border-t-2 mx-4 ${
                  isCompleted ? "border-indigo-600" : "border-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="text-indigo-600" size={28} />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Event
              </h2>
              <p className="text-sm text-gray-500">
                Follow the steps to publish your event
              </p>
            </div>
          </div>
          <IconButton onClick={handleModalClose} size="small">
            <X className="text-gray-500 hover:text-gray-700" />
          </IconButton>
        </div>

        <div className="border-b border-gray-200">
          <Stepper current={step} titles={STEP_TITLES} />
        </div>

        <div
          className="p-4 sm:p-6 flex-grow overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <InputField
                  id="event_name"
                  name="event_name"
                  label="Event Name"
                  value={formData.event_name}
                  onChange={handleChange}
                  error={errors.event_name}
                  placeholder="e.g., Hackathon 2024"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    id="type"
                    name="type"
                    label="Event Type"
                    value={formData.type}
                    onChange={handleChange}
                    error={errors.type}
                    required
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </SelectField>
                  <InputField
                    id="deadline"
                    name="deadline"
                    type="date"
                    label="Registration Deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    error={errors.deadline}
                    required
                  />
                  <InputField
                    id="min_team_size"
                    name="min_team_size"
                    type="number"
                    label="Min Team Size"
                    value={formData.min_team_size}
                    onChange={handleChange}
                    min="1"
                  />
                  <InputField
                    id="max_team_size"
                    name="max_team_size"
                    type="number"
                    label="Max Team Size"
                    value={formData.max_team_size}
                    onChange={handleChange}
                    min={formData.min_team_size}
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      id="no_of_rounds"
                      name="no_of_rounds"
                      type="number"
                      label="Number of Rounds"
                      value={formData.no_of_rounds}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                  {formData.type === "Hybrid" && (
                    <div className="sm:col-span-2 grid grid-cols-2 gap-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <InputField
                        id="online_rounds"
                        name="online_rounds"
                        type="number"
                        label="Online Rounds"
                        value={formData.online_rounds}
                        onChange={handleChange}
                        min="0"
                      />
                      <InputField
                        id="offline_rounds"
                        name="offline_rounds"
                        type="number"
                        label="Offline Rounds"
                        value={formData.offline_rounds}
                        onChange={handleChange}
                        min="0"
                        error={errors.offline_rounds}
                      />
                    </div>
                  )}
                </div>
                <InputField
                  id="location"
                  name="location"
                  label="Location / Platform"
                  icon={MapPin}
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., College Auditorium or Discord"
                />
                <InputField
                  id="domains"
                  name="domains"
                  label="Domains"
                  icon={Layers}
                  value={formData.domains}
                  onChange={handleChange}
                  placeholder="AI, Web Dev, Blockchain (comma-separated)"
                />
              </div>
              <div className="md:col-span-1">
                <ImageUploadField
                  onFileChange={handleImageChange}
                  preview={formData.imagePreview}
                  error={errors.image}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Award size={20} className="text-indigo-600" />
                  Round Schedule & Points
                </h3>
                <div className="space-y-4">
                  {formData.roundsData.map((round, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Round {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <InputField
                          id={`round_${index}_start_date`}
                          name={`roundsData.${index}.start_date`}
                          type="date"
                          label="Start Date"
                          value={round.start_date}
                          onChange={(e) =>
                            handleNestedChange(e.target.name, e.target.value)
                          }
                        />
                        <InputField
                          id={`round_${index}_end_date`}
                          name={`roundsData.${index}.end_date`}
                          type="date"
                          label="End Date"
                          value={round.end_date}
                          onChange={(e) =>
                            handleNestedChange(e.target.name, e.target.value)
                          }
                          error={errors[`round_${index}_end_date`]}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                        {years.map((yearKey, yearIndex) => (
                          <InputField
                            key={yearKey}
                            id={`round_${index}_${yearKey}`}
                            name={`roundsData.${index}.reward_points.${yearKey}`}
                            type="number"
                            label={`Year ${yearIndex + 1} Points`}
                            value={round.reward_points[yearKey]}
                            onChange={(e) =>
                              handleNestedChange(e.target.name, e.target.value)
                            }
                            placeholder="e.g., 1500"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {formData.no_of_rounds > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Award size={20} className="text-amber-500" />
                    Final Prize Money
                  </h3>
                  <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <InputField
                      id="prize_first"
                      name="final_prize1"
                      label="1st Place Prize"
                      value={formData.final_prize1}
                      onChange={(e) =>
                        handleNestedChange(e.target.name, e.target.value)
                      }
                      placeholder="e.g., $1000 cash, Swag Kit"
                    />
                    <InputField
                      id="prize_second"
                      name="final_prize2"
                      label="2nd Place Prize"
                      value={formData.final_prize2}
                      onChange={(e) =>
                        handleNestedChange(e.target.name, e.target.value)
                      }
                      placeholder="e.g., $500 cash"
                    />
                    <InputField
                      id="prize_third"
                      name="final_prize3"
                      label="3rd Place Prize"
                      value={formData.final_prize3}
                      onChange={(e) =>
                        handleNestedChange(e.target.name, e.target.value)
                      }
                      placeholder="e.g., $250 cash"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <TextareaField
                id="description"
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Describe the event, what it's about, and who should participate."
                required
                rows={6}
                icon={Pilcrow}
              />
              <TextareaField
                id="rules"
                name="rules"
                label="Rules & Guidelines"
                value={formData.rules}
                onChange={handleChange}
                placeholder="List the rules and guidelines for participants."
                icon={BookOpen}
              />
              <TextareaField
                id="constraints"
                name="constraints"
                label="Constraints"
                value={formData.constraints}
                onChange={handleChange}
                placeholder="List any technical or logistical constraints."
                rows={3}
                icon={AlertCircle}
              />
              <InputField
                id="apply_link"
                name="apply_link"
                type="url"
                label="Apply Link"
                value={formData.apply_link}
                onChange={handleChange}
                error={errors.apply_link}
                placeholder="https://forms.gle/your-link"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-sm">
              <div className="text-center text-gray-600 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                Please review all information carefully before creating the
                event.
              </div>
              {errors.submit && (
                <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {errors.submit}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold text-base text-gray-700 border-b pb-2 mb-3">
                      Basic Info
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <p>
                        <strong>Name:</strong> {formData.event_name || "N/A"}
                      </p>
                      <p>
                        <strong>Type:</strong> {formData.type || "N/A"}
                      </p>
                      <p>
                        <strong>Team Size:</strong> {formData.min_team_size} to{" "}
                        {formData.max_team_size}
                      </p>
                      <p>
                        <strong>Deadline:</strong>{" "}
                        {formData.deadline
                          ? new Date(formData.deadline).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="col-span-2">
                        <strong>Location:</strong> {formData.location || "N/A"}
                      </p>
                      <p className="col-span-2">
                        <strong>Domains:</strong> {formData.domains || "N/A"}
                      </p>
                      {formData.type === "Hybrid" && (
                        <p className="col-span-2">
                          <strong>Split:</strong> {formData.online_rounds || 0}{" "}
                          Online, {formData.offline_rounds || 0} Offline
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold text-base text-gray-700 border-b pb-2 mb-3">
                      Rounds & Rewards ({formData.no_of_rounds})
                    </h4>
                    {formData.roundsData.map((r, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 p-3 rounded border mb-2"
                      >
                        <p>
                          <strong>Round {i + 1} Date:</strong>{" "}
                          {r.start_date || "TBD"} to {r.end_date || "TBD"}
                        </p>
                        <div className="mt-2 text-xs grid grid-cols-2 gap-x-4">
                          {years.map((year, yi) => (
                            <p key={year}>
                              <strong>Yr {yi + 1} Pts:</strong>{" "}
                              {r.reward_points[year] || "0"}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="bg-amber-50 p-3 rounded border border-amber-200 mt-3 space-y-1">
                      <p>
                        <strong>1st Prize:</strong>{" "}
                        {formData.final_prize1 || "N/A"}
                      </p>
                      <p>
                        <strong>2nd Prize:</strong>{" "}
                        {formData.final_prize2 || "N/A"}
                      </p>
                      <p>
                        <strong>3rd Prize:</strong>{" "}
                        {formData.final_prize3 || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold text-base text-gray-700 border-b pb-2 mb-3">
                      Event Image
                    </h4>
                    {formData.imagePreview && (
                      <img
                        src={formData.imagePreview}
                        alt="Event Preview"
                        className="w-full rounded-md border"
                      />
                    )}
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold text-base text-gray-700 border-b pb-2 mb-3">
                      Content
                    </h4>
                    <p className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-xs">
                      <strong>Description:</strong>{" "}
                      {formData.description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Cancel
            </button>
            {step < STEP_TITLES.length && (
              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue <ArrowRight size={16} />
              </button>
            )}
            {step === STEP_TITLES.length && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
