import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  Video,
  Monitor,
  ImageIcon,
} from "lucide-react";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

const API_URL = import.meta.env.VITE_API_URL;
const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

// Options constants
const MODE_OF_COURSE_OPTIONS = [
  "Click to choose",
  "Online",
  "Offline",
  "Hybrid",
];

const COURSE_TYPE_OPTIONS = [
  "Click to choose",
  "AICTE",
  "CEC",
  "CISCO",
  "COURSERA",
  "edX",
  "GOOGLE",
  "IBM",
  "IGNOU",
  "IIMB",
  "INI",
  "NITTTR",
  "MICROSOFT",
  "NMEICT",
  "NPTEL",
  "SWAYAM",
  "ICMR",
  "UDEMY",
  "UGC",
  "AICTE QIP PG certificate Programme",
  "AI Infinity",
  "Oracle",
  "Other",
];

const TYPE_OF_ORGANIZER_OPTIONS = ["Click to choose", "Private", "Government"];

const LEVEL_OF_EVENT_OPTIONS = [
  "Click to choose",
  "State",
  "National",
  "International",
];

const DURATION_OPTIONS = ["Click to choose", "Hours", "Weeks", "Days"];

const COURSE_CATEGORY_OPTIONS = [
  "Click to choose",
  "Proctored-Exam",
  "Self-paced with final assessment",
  "Self-paced without final assessment",
];

const TYPE_OF_SPONSORSHIP_OPTIONS = [
  "Click to choose",
  "Self",
  "BIT",
  "Funding Agency",
];

const CLAIMED_FOR_OPTIONS = [
  "Click to choose",
  "FAP",
  "Competency",
  "Not-Applicable",
];

export default function OnlineCourseForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "no",
    specialLab: "",
    modeOfCourse: "Click to choose",
    courseType: "Click to choose",
    otherCourseType: "",
    typeOfOrganizer: "Click to choose",
    courseName: "",
    organizationName: "",
    organizationAddress: "",
    levelOfEvent: "Click to choose",
    duration: "Click to choose",
    numberOfHours: "",
    numberOfWeeks: "",
    numberOfDays: "",
    startDate: "",
    endDate: "",
    courseCategory: "Click to choose",
    dateOfExamination: "",
    gradeObtained: "",
    markSheetProof: null,
    isApprovedFDP: "no",
    fdpProof: null,
    typeOfSponsorship: "Click to choose",
    apexProof: null,
    fundingAgencyName: "",
    certificateProof: null,
    claimedFor: "Click to choose",
  });

  const [errors, setErrors] = useState({});
  const [markSheetDragActive, setMarkSheetDragActive] = useState(false);
  const [fdpDragActive, setFdpDragActive] = useState(false);
  const [apexDragActive, setApexDragActive] = useState(false);
  const [certDragActive, setCertDragActive] = useState(false);

  // Conditional display helpers
  const showSpecialLab = formData.specialLabsInvolved === "yes";
  const showOtherCourseType = formData.courseType === "Other";
  const showNumberOfHours = formData.duration === "Hours";
  const showNumberOfWeeks = formData.duration === "Weeks";
  const showNumberOfDays = formData.duration === "Days";
  const showExamFields =
    formData.courseCategory === "Proctored-Exam" ||
    formData.courseCategory === "Self-paced with final assessment";
  const showFDPProof = formData.isApprovedFDP === "yes";
  const showApexProof = formData.typeOfSponsorship === "BIT";
  const showFundingAgencyName = formData.typeOfSponsorship === "Funding Agency";

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

  // Drag and drop handlers
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

    if (!formData.modeOfCourse || formData.modeOfCourse === "Click to choose") {
      newErrors.modeOfCourse = "Mode of Course is required";
    }

    if (!formData.courseType || formData.courseType === "Click to choose") {
      newErrors.courseType = "Course Type is required";
    }
    if (showOtherCourseType && !formData.otherCourseType) {
      newErrors.otherCourseType = "Please specify Course Type";
    }

    if (
      !formData.typeOfOrganizer ||
      formData.typeOfOrganizer === "Click to choose"
    ) {
      newErrors.typeOfOrganizer = "Type of Organizer is required";
    }

    if (!formData.courseName) newErrors.courseName = "Course Name is required";
    if (!formData.organizationName)
      newErrors.organizationName = "Organization Name is required";
    if (!formData.organizationAddress)
      newErrors.organizationAddress = "Organization Address is required";
    if (!formData.levelOfEvent || formData.levelOfEvent === "Click to choose") {
      newErrors.levelOfEvent = "Level of Event is required";
    }
    if (!formData.duration || formData.duration === "Click to choose") {
      newErrors.duration = "Duration is required";
    }
    if (showNumberOfHours && !formData.numberOfHours) {
      newErrors.numberOfHours = "Number of Hours is required";
    }
    if (showNumberOfWeeks && !formData.numberOfWeeks) {
      newErrors.numberOfWeeks = "Number of Weeks is required";
    }
    if (showNumberOfDays && !formData.numberOfDays) {
      newErrors.numberOfDays = "Number of Days is required";
    }

    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";

    if (
      !formData.courseCategory ||
      formData.courseCategory === "Click to choose"
    ) {
      newErrors.courseCategory = "Course Category is required";
    }

    // Exam fields validation (conditional)
    if (showExamFields) {
      if (!formData.dateOfExamination)
        newErrors.dateOfExamination = "Date of Examination is required";
      if (!formData.gradeObtained)
        newErrors.gradeObtained = "Grade Obtained is required";
      if (!formData.markSheetProof)
        newErrors.markSheetProof = "Mark Sheet Proof is required";
    }

    // FDP Proof validation (conditional)
    if (showFDPProof && !formData.fdpProof) {
      newErrors.fdpProof = "FDP Proof is required";
    }

    if (
      !formData.typeOfSponsorship ||
      formData.typeOfSponsorship === "Click to choose"
    ) {
      newErrors.typeOfSponsorship = "Type of Sponsorship is required";
    }
    if (showApexProof && !formData.apexProof) {
      newErrors.apexProof = "Apex Proof is required";
    }
    if (showFundingAgencyName && !formData.fundingAgencyName) {
      newErrors.fundingAgencyName = "Name of the Funding Agency is required";
    }

    if (!formData.certificateProof)
      newErrors.certificateProof = "Certificate Proof is required";

    if (!formData.claimedFor || formData.claimedFor === "Click to choose") {
      newErrors.claimedFor = "Claimed For is required";
    }

    // Date Logic
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End Date cannot be before Start Date";
      }
    }

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
        data.append("modeOfCourse", formData.modeOfCourse);
        data.append("courseType", formData.courseType);
        if (showOtherCourseType) {
          data.append("otherCourseType", formData.otherCourseType);
        }
        data.append("typeOfOrganizer", formData.typeOfOrganizer);
        data.append("courseName", formData.courseName);
        data.append("organizationName", formData.organizationName);
        data.append("organizationAddress", formData.organizationAddress);
        data.append("levelOfEvent", formData.levelOfEvent);
        data.append("duration", formData.duration);
        if (showNumberOfHours) {
          data.append("numberOfHours", formData.numberOfHours);
        }
        if (showNumberOfWeeks) {
          data.append("numberOfWeeks", formData.numberOfWeeks);
        }
        if (showNumberOfDays) {
          data.append("numberOfDays", formData.numberOfDays);
        }
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("courseCategory", formData.courseCategory);
        if (showExamFields) {
          data.append("dateOfExamination", formData.dateOfExamination);
          data.append("gradeObtained", formData.gradeObtained);
          data.append("markSheetProof", formData.markSheetProof);
        }
        data.append("isApprovedFDP", formData.isApprovedFDP);
        if (showFDPProof) {
          data.append("fdpProof", formData.fdpProof);
        }
        data.append("typeOfSponsorship", formData.typeOfSponsorship);
        if (showApexProof) {
          data.append("apexProof", formData.apexProof);
        }
        if (showFundingAgencyName) {
          data.append("fundingAgencyName", formData.fundingAgencyName);
        }
        data.append("certificateProof", formData.certificateProof);
        data.append("claimedFor", formData.claimedFor);

        const response = await axios.post(
          `${API_URL}/api/faculty/onlineCoursePost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("Online Course record submitted successfully");
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
              Add Online Course Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for Online Courses completed
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

            {/* Mode & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="modeOfCourse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mode of Course <RequiredAst />
                </label>
                <select
                  name="modeOfCourse"
                  id="modeOfCourse"
                  value={formData.modeOfCourse}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.modeOfCourse ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {MODE_OF_COURSE_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.modeOfCourse && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.modeOfCourse}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="courseType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Type <RequiredAst />
                </label>
                <select
                  name="courseType"
                  id="courseType"
                  value={formData.courseType}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.courseType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {COURSE_TYPE_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.courseType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.courseType}
                  </p>
                )}

                {showOtherCourseType && (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="otherCourseType"
                      value={formData.otherCourseType}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border ${errors.otherCourseType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Specify Course Type"
                    />
                    {errors.otherCourseType && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.otherCourseType}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Course Name & Type of Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="courseName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Name <RequiredAst />
                </label>
                <input
                  type="text"
                  name="courseName"
                  id="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.courseName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Course Name"
                />
                {errors.courseName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.courseName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="typeOfOrganizer"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Organizer <RequiredAst />
                </label>
                <select
                  name="typeOfOrganizer"
                  id="typeOfOrganizer"
                  value={formData.typeOfOrganizer}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfOrganizer ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {TYPE_OF_ORGANIZER_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.typeOfOrganizer && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.typeOfOrganizer}
                  </p>
                )}
              </div>
            </div>

            {/* Organization Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Organization Name <RequiredAst />
                </label>
                <input
                  type="text"
                  name="organizationName"
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.organizationName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Organization Name"
                />
                {errors.organizationName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organizationName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="organizationAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Organization Address <RequiredAst />
                </label>
                <input
                  type="text"
                  name="organizationAddress"
                  id="organizationAddress"
                  value={formData.organizationAddress}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.organizationAddress ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Address"
                />
                {errors.organizationAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organizationAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Level & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="levelOfEvent"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Level of Event <RequiredAst />
                </label>
                <select
                  name="levelOfEvent"
                  id="levelOfEvent"
                  value={formData.levelOfEvent}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.levelOfEvent ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {LEVEL_OF_EVENT_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.levelOfEvent && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.levelOfEvent}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration <RequiredAst />
                </label>
                <select
                  name="duration"
                  id="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.duration ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}

                {/* Conditional Duration Value Fields */}
                {showNumberOfHours && (
                  <div className="mt-3">
                    <label
                      htmlFor="numberOfHours"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Number of Hours <RequiredAst />
                    </label>
                    <input
                      type="number"
                      name="numberOfHours"
                      id="numberOfHours"
                      value={formData.numberOfHours}
                      onChange={handleChange}
                      min="1"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfHours ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter number of hours"
                    />
                    {errors.numberOfHours && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.numberOfHours}
                      </p>
                    )}
                  </div>
                )}

                {showNumberOfWeeks && (
                  <div className="mt-3">
                    <label
                      htmlFor="numberOfWeeks"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Number of Weeks <RequiredAst />
                    </label>
                    <input
                      type="number"
                      name="numberOfWeeks"
                      id="numberOfWeeks"
                      value={formData.numberOfWeeks}
                      onChange={handleChange}
                      min="1"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfWeeks ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter number of weeks"
                    />
                    {errors.numberOfWeeks && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.numberOfWeeks}
                      </p>
                    )}
                  </div>
                )}

                {showNumberOfDays && (
                  <div className="mt-3">
                    <label
                      htmlFor="numberOfDays"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Number of Days <RequiredAst />
                    </label>
                    <input
                      type="number"
                      name="numberOfDays"
                      id="numberOfDays"
                      value={formData.numberOfDays}
                      onChange={handleChange}
                      min="1"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfDays ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter number of days"
                    />
                    {errors.numberOfDays && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.numberOfDays}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date <RequiredAst />
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.startDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date <RequiredAst />
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.endDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Course Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="courseCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Category <RequiredAst />
                </label>
                <select
                  name="courseCategory"
                  id="courseCategory"
                  value={formData.courseCategory}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.courseCategory ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {COURSE_CATEGORY_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.courseCategory && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.courseCategory}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Exam Fields */}
            {showExamFields && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="dateOfExamination"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Examination <RequiredAst />
                    </label>
                    <input
                      type="date"
                      name="dateOfExamination"
                      id="dateOfExamination"
                      value={formData.dateOfExamination}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.dateOfExamination ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.dateOfExamination && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfExamination}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="gradeObtained"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Grade Obtained <RequiredAst />
                    </label>
                    <input
                      type="text"
                      name="gradeObtained"
                      id="gradeObtained"
                      value={formData.gradeObtained}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.gradeObtained ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="e.g. A, 9.0"
                    />
                    {errors.gradeObtained && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gradeObtained}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mark Sheet Proof Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Mark Sheet Proof <RequiredAst />
                  </label>
                  <div
                    className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                      errors.markSheetProof
                        ? "border-red-500"
                        : markSheetDragActive
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-300"
                    } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                    onDragEnter={(e) => handleDrag(e, setMarkSheetDragActive)}
                    onDragLeave={(e) => handleDrag(e, setMarkSheetDragActive)}
                    onDragOver={(e) => handleDrag(e, setMarkSheetDragActive)}
                    onDrop={(e) =>
                      handleDrop(e, "markSheetProof", setMarkSheetDragActive)
                    }
                    onClick={() =>
                      document.getElementById("marksheet-upload").click()
                    }
                  >
                    <div className="space-y-1 text-center">
                      <UploadCloud
                        className={`mx-auto h-10 w-10 ${markSheetDragActive ? "text-indigo-600" : "text-gray-400"}`}
                      />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="marksheet-upload"
                          className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="marksheet-upload"
                            name="markSheetProof"
                            type="file"
                            className="sr-only"
                            onChange={(e) =>
                              handleFileChange(e, "markSheetProof")
                            }
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>
                  </div>
                  {formData.markSheetProof && (
                    <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                      <FileText
                        size={16}
                        className="mr-2 flex-shrink-0 text-indigo-600"
                      />
                      <span className="font-medium mr-2 truncate">
                        {formData.markSheetProof.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile("markSheetProof");
                        }}
                        className="ml-auto text-red-500 hover:text-red-700 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {errors.markSheetProof && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.markSheetProof}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Is it an approved FDP? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is it an approved FDP? <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isApprovedFDP"
                      value="yes"
                      checked={formData.isApprovedFDP === "yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isApprovedFDP"
                      value="no"
                      checked={formData.isApprovedFDP === "no"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Conditional FDP Proof Upload */}
            {showFDPProof && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload FDP Proof <RequiredAst />
                </label>
                <div
                  className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                    errors.fdpProof
                      ? "border-red-500"
                      : fdpDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                  } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                  onDragEnter={(e) => handleDrag(e, setFdpDragActive)}
                  onDragLeave={(e) => handleDrag(e, setFdpDragActive)}
                  onDragOver={(e) => handleDrag(e, setFdpDragActive)}
                  onDrop={(e) => handleDrop(e, "fdpProof", setFdpDragActive)}
                  onClick={() => document.getElementById("fdp-upload").click()}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud
                      className={`mx-auto h-10 w-10 ${fdpDragActive ? "text-indigo-600" : "text-gray-400"}`}
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="fdp-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="fdp-upload"
                          name="fdpProof"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, "fdpProof")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                {formData.fdpProof && (
                  <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <FileText
                      size={16}
                      className="mr-2 flex-shrink-0 text-indigo-600"
                    />
                    <span className="font-medium mr-2 truncate">
                      {formData.fdpProof.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile("fdpProof");
                      }}
                      className="ml-auto text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {errors.fdpProof && (
                  <p className="mt-1 text-sm text-red-600">{errors.fdpProof}</p>
                )}
              </div>
            )}

            {/* Sponsorship & Claimed For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="typeOfSponsorship"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Sponsorship <RequiredAst />
                </label>
                <select
                  name="typeOfSponsorship"
                  id="typeOfSponsorship"
                  value={formData.typeOfSponsorship}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfSponsorship ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {TYPE_OF_SPONSORSHIP_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.typeOfSponsorship && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.typeOfSponsorship}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="claimedFor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Claimed For <RequiredAst />
                </label>
                <select
                  name="claimedFor"
                  id="claimedFor"
                  value={formData.claimedFor}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.claimedFor ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {CLAIMED_FOR_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.claimedFor && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.claimedFor}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Apex Proof (BIT) */}
            {showApexProof && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apex Proof <RequiredAst />
                </label>
                <div
                  className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                    errors.apexProof
                      ? "border-red-500"
                      : apexDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                  } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                  onDragEnter={(e) => handleDrag(e, setApexDragActive)}
                  onDragLeave={(e) => handleDrag(e, setApexDragActive)}
                  onDragOver={(e) => handleDrag(e, setApexDragActive)}
                  onDrop={(e) => handleDrop(e, "apexProof", setApexDragActive)}
                  onClick={() => document.getElementById("apex-upload").click()}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud
                      className={`mx-auto h-10 w-10 ${apexDragActive ? "text-indigo-600" : "text-gray-400"}`}
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="apex-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="apex-upload"
                          name="apexProof"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, "apexProof")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                {formData.apexProof && (
                  <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <FileText
                      size={16}
                      className="mr-2 flex-shrink-0 text-indigo-600"
                    />
                    <span className="font-medium mr-2 truncate">
                      {formData.apexProof.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile("apexProof");
                      }}
                      className="ml-auto text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {errors.apexProof && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.apexProof}
                  </p>
                )}
              </div>
            )}

            {/* Conditional Funding Agency Name */}
            {showFundingAgencyName && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fundingAgencyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name of the Funding Agency <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="fundingAgencyName"
                    id="fundingAgencyName"
                    value={formData.fundingAgencyName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.fundingAgencyName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Funding Agency Name"
                  />
                  {errors.fundingAgencyName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fundingAgencyName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Certificate Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Certificate Proof <RequiredAst />
              </label>
              <div
                className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${
                  errors.certificateProof
                    ? "border-red-500"
                    : certDragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300"
                } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                onDragEnter={(e) => handleDrag(e, setCertDragActive)}
                onDragLeave={(e) => handleDrag(e, setCertDragActive)}
                onDragOver={(e) => handleDrag(e, setCertDragActive)}
                onDrop={(e) =>
                  handleDrop(e, "certificateProof", setCertDragActive)
                }
                onClick={() => document.getElementById("cert-upload").click()}
              >
                <div className="space-y-1 text-center">
                  <UploadCloud
                    className={`mx-auto h-12 w-12 ${certDragActive ? "text-indigo-600" : "text-gray-400"}`}
                  />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="cert-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="cert-upload"
                        name="certificateProof"
                        type="file"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileChange(e, "certificateProof")
                        }
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
              {formData.certificateProof && (
                <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                  <FileText
                    size={16}
                    className="mr-2 flex-shrink-0 text-indigo-600"
                  />
                  <span className="font-medium mr-2 truncate">
                    {formData.certificateProof.name}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({(formData.certificateProof.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile("certificateProof");
                    }}
                    className="ml-auto text-red-500 hover:text-red-700 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {errors.certificateProof && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.certificateProof}
                </p>
              )}
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
                {isSubmitting ? "Saving..." : "Save Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
