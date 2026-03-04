import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  Trophy,
  Image as ImageIcon,
} from "lucide-react";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

const API_URL = import.meta.env.VITE_API_URL;

// Technical Society & Chapter Options
const TECHNICAL_SOCIETY_OPTIONS = [
  "Click to choose",
  "ACM",
  "CSI",
  "CSIR",
  "IEEE",
  "ISTE",
  "SAE",
  "Other",
];

// Type of Recognition Options
const TYPE_OF_RECOGNITION_OPTIONS = ["Click to choose", "Award", "Achievement"];

// Award Types (when Type of Recognition = Award)
const AWARD_TYPE_OPTIONS = [
  "Click to choose",
  "Faculty Award",
  "Individual Recognition Award",
  "Teacher Award",
  "Mentor Award",
  "Outstanding Performance Award",
  "Research Award",
  "Scientist Award",
];

// Achievement Types (when Type of Recognition = Achievement)
const ACHIEVEMENT_TYPE_OPTIONS = [
  "Click to choose",
  "GATE Scorer",
  "NPTEL Gold Medal",
  "NPTEL Stars",
  "NPTEL Topper",
  "SIH Mentor",
  "Best Mentor",
  "Journal Editor",
  "Quality Journal Reviewer Recognition",
  "National Level Fellowship",
  "Invited as a Visiting Faculty",
  "Individual Recognition",
];

// Organization Type Options
const ORGANIZATION_TYPE_OPTIONS = [
  "Click to choose",
  "Government",
  "Private",
  "Others",
];

// Awarding Agency Options
const AWARDING_AGENCY_OPTIONS = [
  "Click to choose",
  "AICTE",
  "CSIR",
  "GATE",
  "NET",
  "SLET",
  "VIFRA",
  "Other",
];

// Level Options
const LEVEL_OPTIONS = [
  "Click to choose",
  "BIT",
  "State",
  "National",
  "International",
];

// Nature of Recognition Options
const NATURE_OF_RECOGNITION_OPTIONS = [
  "Click to choose",
  "Cash Prize",
  "Certificate",
  "Momento",
];

export default function AwardForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "no",
    specialLab: "",
    technicalSocietyInvolved: "no",
    technicalSocietyChapter: "",
    typeOfRecognition: "",
    awardType: "",
    achievementType: "",
    awardName: "",
    organizationType: "",
    otherOrganizationName: "",
    awardingAgency: "",
    level: "",
    receivedDate: "",
    natureOfRecognition: "",
    prizeAmount: "",
    photoProofs: null,
    documentProof: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docProofDragActive, setDocProofDragActive] = useState(false);
  const [photoProofDragActive, setPhotoProofDragActive] = useState(false);

  // Conditional field helpers
  const showSpecialLab = formData.specialLabsInvolved === "yes";
  const showTechnicalSocietyChapter =
    formData.technicalSocietyInvolved === "yes";
  const showAwardType = formData.typeOfRecognition === "Award";
  const showAchievementType = formData.typeOfRecognition === "Achievement";
  const showOtherOrganization = formData.organizationType === "Others";
  const showPrizeAmount = formData.natureOfRecognition === "Cash Prize";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files[0] }));
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const clearFile = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: null }));
  };

  // Drag and drop helper
  const handleDrag = (e, setDragActiveState) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveState(true);
    } else if (e.type === "dragleave") {
      setDragActiveState(false);
    }
  };

  const handleDrop = (e, fieldName, setDragActiveState) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveState(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e.dataTransfer.files[0],
      }));
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.taskID) newErrors.taskID = "Task ID is required";

    // Special Lab validation
    if (showSpecialLab && !formData.specialLab) {
      newErrors.specialLab = "Special Lab is required";
    }

    // Technical Society validation
    if (
      showTechnicalSocietyChapter &&
      (!formData.technicalSocietyChapter ||
        formData.technicalSocietyChapter === "Click to choose")
    ) {
      newErrors.technicalSocietyChapter =
        "Technical Society & Chapter is required";
    }

    // Type of Recognition validation
    if (
      !formData.typeOfRecognition ||
      formData.typeOfRecognition === "Click to choose"
    ) {
      newErrors.typeOfRecognition = "Type of Recognition is required";
    }

    // Award/Achievement type validation
    if (
      showAwardType &&
      (!formData.awardType || formData.awardType === "Click to choose")
    ) {
      newErrors.awardType = "Award type is required";
    }
    if (
      showAchievementType &&
      (!formData.achievementType ||
        formData.achievementType === "Click to choose")
    ) {
      newErrors.achievementType = "Achievement type is required";
    }

    if (!formData.awardName)
      newErrors.awardName = "Name of the Award/Achievement is required";

    if (
      !formData.organizationType ||
      formData.organizationType === "Click to choose"
    ) {
      newErrors.organizationType = "Organization type is required";
    }
    if (showOtherOrganization && !formData.otherOrganizationName) {
      newErrors.otherOrganizationName = "Organization Name is required";
    }

    if (
      !formData.awardingAgency ||
      formData.awardingAgency === "Click to choose"
    ) {
      newErrors.awardingAgency = "Awarding agency is required";
    }
    if (!formData.level || formData.level === "Click to choose")
      newErrors.level = "Level is required";
    if (!formData.receivedDate)
      newErrors.receivedDate = "Received Date is required";

    if (
      !formData.natureOfRecognition ||
      formData.natureOfRecognition === "Click to choose"
    ) {
      newErrors.natureOfRecognition = "Nature of recognition is required";
    }
    if (showPrizeAmount && !formData.prizeAmount) {
      newErrors.prizeAmount = "Prize Amount is required";
    }

    if (!formData.photoProofs)
      newErrors.photoProofs = "Photo Proofs are required";
    if (!formData.documentProof)
      newErrors.documentProof = "Document Proof is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("taskID", formData.taskID);
        data.append("specialLabsInvolved", formData.specialLabsInvolved);
        if (showSpecialLab) {
          data.append("specialLab", formData.specialLab);
        }
        data.append(
          "technicalSocietyInvolved",
          formData.technicalSocietyInvolved,
        );
        if (showTechnicalSocietyChapter) {
          data.append(
            "technicalSocietyChapter",
            formData.technicalSocietyChapter,
          );
        }
        data.append("typeOfRecognition", formData.typeOfRecognition);
        if (showAwardType) {
          data.append("awardType", formData.awardType);
        }
        if (showAchievementType) {
          data.append("achievementType", formData.achievementType);
        }
        data.append("awardName", formData.awardName);
        data.append("organizationType", formData.organizationType);
        if (showOtherOrganization) {
          data.append("otherOrganizationName", formData.otherOrganizationName);
        }
        data.append("awardingAgency", formData.awardingAgency);
        data.append("level", formData.level);
        data.append("receivedDate", formData.receivedDate);
        data.append("natureOfRecognition", formData.natureOfRecognition);
        if (showPrizeAmount) {
          data.append("prizeAmount", formData.prizeAmount);
        }
        data.append("photoProofs", formData.photoProofs);
        data.append("documentProof", formData.documentProof);

        const response = await axios.post(
          `${API_URL}api/faculty/awardPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("Award/Achievement record submitted successfully");
          navigate("/faculty/uploadview");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Unknown error";
        alert(`Failed to submit form: ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add Notable Achievement Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for Awards and Achievements
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Task ID & Special Labs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="taskID"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task ID <RequiredAst />
                </label>
                <input
                  type="text"
                  name="taskID"
                  id="taskID"
                  value={formData.taskID}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.taskID ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Task ID"
                />
                {errors.taskID && (
                  <p className="mt-1 text-sm text-red-600">{errors.taskID}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Labs Involved <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="specialLabsInvolved"
                      value="yes"
                      checked={formData.specialLabsInvolved === "yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="specialLabsInvolved"
                      value="no"
                      checked={formData.specialLabsInvolved === "no"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Conditional Special Lab Dropdown */}
            {showSpecialLab && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpecialLabDropdown
                  name="specialLab"
                  value={formData.specialLab}
                  onChange={handleChange}
                  error={errors.specialLab}
                  required={true}
                />
              </div>
            )}

            {/* Technical Society */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is this event involved under Technical Society?{" "}
                  <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="technicalSocietyInvolved"
                      value="yes"
                      checked={formData.technicalSocietyInvolved === "yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="technicalSocietyInvolved"
                      value="no"
                      checked={formData.technicalSocietyInvolved === "no"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Conditional Technical Society Chapter Dropdown */}
              {showTechnicalSocietyChapter && (
                <div>
                  <label
                    htmlFor="technicalSocietyChapter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Technical Society & Chapter <RequiredAst />
                  </label>
                  <select
                    name="technicalSocietyChapter"
                    id="technicalSocietyChapter"
                    value={formData.technicalSocietyChapter}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.technicalSocietyChapter ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {TECHNICAL_SOCIETY_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={option === "Click to choose"}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.technicalSocietyChapter && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.technicalSocietyChapter}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Type of Recognition & Conditional Award/Achievement Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="typeOfRecognition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Recognition <RequiredAst />
                </label>
                <select
                  name="typeOfRecognition"
                  id="typeOfRecognition"
                  value={formData.typeOfRecognition}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfRecognition ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {TYPE_OF_RECOGNITION_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.typeOfRecognition && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.typeOfRecognition}
                  </p>
                )}
              </div>

              {/* Award Type Dropdown */}
              {showAwardType && (
                <div>
                  <label
                    htmlFor="awardType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Award Type <RequiredAst />
                  </label>
                  <select
                    name="awardType"
                    id="awardType"
                    value={formData.awardType}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.awardType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {AWARD_TYPE_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={option === "Click to choose"}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.awardType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.awardType}
                    </p>
                  )}
                </div>
              )}

              {/* Achievement Type Dropdown */}
              {showAchievementType && (
                <div>
                  <label
                    htmlFor="achievementType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Achievement Type <RequiredAst />
                  </label>
                  <select
                    name="achievementType"
                    id="achievementType"
                    value={formData.achievementType}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.achievementType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {ACHIEVEMENT_TYPE_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={option === "Click to choose"}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.achievementType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.achievementType}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Award Name & Organization Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="awardName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of the Award / Achievement <RequiredAst />
                </label>
                <input
                  type="text"
                  name="awardName"
                  id="awardName"
                  value={formData.awardName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.awardName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Name"
                />
                {errors.awardName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.awardName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="organizationType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Organization Type <RequiredAst />
                </label>
                <select
                  name="organizationType"
                  id="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.organizationType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.organizationType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organizationType}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Other Organization Name */}
            {showOtherOrganization && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="otherOrganizationName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organization Name <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="otherOrganizationName"
                    id="otherOrganizationName"
                    value={formData.otherOrganizationName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.otherOrganizationName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Organization Name"
                  />
                  {errors.otherOrganizationName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.otherOrganizationName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Awarding Agency & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="awardingAgency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of the body / Awarding Agency <RequiredAst />
                </label>
                <select
                  name="awardingAgency"
                  id="awardingAgency"
                  value={formData.awardingAgency}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.awardingAgency ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {AWARDING_AGENCY_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.awardingAgency && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.awardingAgency}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Level <RequiredAst />
                </label>
                <select
                  name="level"
                  id="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.level ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {LEVEL_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.level && (
                  <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                )}
              </div>
            </div>

            {/* Date & Nature of Recognition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="receivedDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Received Date <RequiredAst />
                </label>
                <input
                  type="date"
                  name="receivedDate"
                  id="receivedDate"
                  value={formData.receivedDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.receivedDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.receivedDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.receivedDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="natureOfRecognition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nature of Recognition <RequiredAst />
                </label>
                <select
                  name="natureOfRecognition"
                  id="natureOfRecognition"
                  value={formData.natureOfRecognition}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.natureOfRecognition ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {NATURE_OF_RECOGNITION_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.natureOfRecognition && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.natureOfRecognition}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Prize Amount */}
            {showPrizeAmount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="prizeAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Prize Amount (in Rs.) <RequiredAst />
                  </label>
                  <input
                    type="number"
                    name="prizeAmount"
                    id="prizeAmount"
                    value={formData.prizeAmount}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.prizeAmount ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Prize Amount"
                    min="0"
                  />
                  {errors.prizeAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.prizeAmount}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Files: Photos & Docs */}
            <div className="space-y-6">
              {/* Photo Proofs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Proofs <RequiredAst />
                </label>
                <div
                  className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                    errors.photoProofs
                      ? "border-red-500"
                      : photoProofDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                  } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                  onDragEnter={(e) => handleDrag(e, setPhotoProofDragActive)}
                  onDragLeave={(e) => handleDrag(e, setPhotoProofDragActive)}
                  onDragOver={(e) => handleDrag(e, setPhotoProofDragActive)}
                  onDrop={(e) =>
                    handleDrop(e, "photoProofs", setPhotoProofDragActive)
                  }
                  onClick={() =>
                    document.getElementById("photo-upload").click()
                  }
                >
                  <div className="space-y-1 text-center">
                    <ImageIcon
                      className={`mx-auto h-12 w-12 ${photoProofDragActive ? "text-indigo-600" : "text-gray-400"}`}
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="photo-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="photo-upload"
                          name="photoProofs"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, "photoProofs")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                  </div>
                </div>
                {formData.photoProofs && (
                  <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <FileText
                      size={16}
                      className="mr-2 flex-shrink-0 text-indigo-600"
                    />
                    <span className="font-medium mr-2 truncate">
                      {formData.photoProofs.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile("photoProofs");
                      }}
                      className="ml-auto text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {errors.photoProofs && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.photoProofs}
                  </p>
                )}
              </div>

              {/* Document Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Proof <RequiredAst />
                </label>
                <div
                  className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                    errors.documentProof
                      ? "border-red-500"
                      : docProofDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                  } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                  onDragEnter={(e) => handleDrag(e, setDocProofDragActive)}
                  onDragLeave={(e) => handleDrag(e, setDocProofDragActive)}
                  onDragOver={(e) => handleDrag(e, setDocProofDragActive)}
                  onDrop={(e) =>
                    handleDrop(e, "documentProof", setDocProofDragActive)
                  }
                  onClick={() => document.getElementById("doc-upload").click()}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud
                      className={`mx-auto h-12 w-12 ${docProofDragActive ? "text-indigo-600" : "text-gray-400"}`}
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="doc-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="doc-upload"
                          name="documentProof"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, "documentProof")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                {formData.documentProof && (
                  <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <FileText
                      size={16}
                      className="mr-2 flex-shrink-0 text-indigo-600"
                    />
                    <span className="font-medium mr-2 truncate">
                      {formData.documentProof.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile("documentProof");
                      }}
                      className="ml-auto text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {errors.documentProof && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.documentProof}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 flex items-center justify-end space-x-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Achievement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
