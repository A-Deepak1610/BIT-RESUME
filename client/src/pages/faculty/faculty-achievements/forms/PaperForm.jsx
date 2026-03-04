import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  Users,
  Building2,
  GraduationCap,
  Award,
} from "lucide-react";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

const API_URL = import.meta.env.VITE_API_URL;
const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

// Options
const YES_NO_OPTIONS = ["Click to choose", "Yes", "No"];
const FACULTY_NA_OPTIONS = ["Click to choose", "Faculty", "NA"];
const STUDENT_NA_OPTIONS = ["Click to choose", "Student", "NA"];
const EVENT_MODE_OPTIONS = ["Click to choose", "Online", "Offline"];
const EVENT_ORGANIZER_OPTIONS = [
  "Click to choose",
  "BIT",
  "Industry",
  "Foreign Institute",
  "Institute",
  "Others",
];
const EVENT_LEVEL_OPTIONS = ["Click to choose", "International", "National"];
const SPONSORSHIP_OPTIONS = [
  "Click to choose",
  "Self",
  "BIT",
  "Funding Agency",
  "Others",
];
const YEAR_OF_STUDY_OPTIONS = [
  "Click to choose",
  "First",
  "Second",
  "Third",
  "Fourth",
];

export default function PaperForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "No",
    specialLab: "",

    // Other Authors from BIT
    otherAuthorsBIT: "No",
    chooseFirstFaculty: "Click to choose",
    firstFaculty: "",
    chooseSecondFaculty: "Click to choose",
    secondFaculty: "",
    chooseThirdFaculty: "Click to choose",
    thirdFaculty: "",
    chooseFourthFaculty: "Click to choose",
    fourthFaculty: "",
    chooseFifthFaculty: "Click to choose",
    fifthFaculty: "",

    // Faculty from Other Institute
    facultyOtherInstitute: "No",
    externalFaculty1: "",
    externalFaculty2: "",
    externalFaculty3: "",

    // Industrial Person
    industrialPersonInvolved: "No",
    industrialPerson1: "",
    industrialPerson2: "",
    industrialPerson3: "",

    // International Collaboration
    internationalCollaboration: "No",
    instituteName: "",

    // Conference Details
    conferenceName: "",
    eventMode: "Click to choose",
    eventLocation: "",
    eventOrganizer: "Click to choose",
    industryOrganizerName: "",
    instituteNameLocation: "",
    eventLevel: "Click to choose",
    paperTitle: "",
    eventStartDate: "",
    eventEndDate: "",
    eventDurationDays: "",

    // Publication
    publishedInProceedings: "No",
    pageFrom: "",
    pageTo: "",

    // Sponsorship
    typeOfSponsorship: "Click to choose",
    apexProof: null,
    fundingAgencyName: "",
    fundingAmount: "",

    // Students
    studentsInvolved: "No",
    firstStudent: "",
    firstStudentYear: "Click to choose",
    chooseSecondStudent: "Click to choose",
    secondStudent: "",
    secondStudentYear: "Click to choose",
    chooseThirdStudent: "Click to choose",
    thirdStudent: "",
    thirdStudentYear: "Click to choose",
    chooseFourthStudent: "Click to choose",
    fourthStudent: "",
    fourthStudentYear: "Click to choose",
    chooseFifthStudent: "Click to choose",
    fifthStudent: "",
    fifthStudentYear: "Click to choose",

    // Other
    registrationAmount: "",
    documentProof: null,
    awardReceived: "No",
    awardProof: null,
  });

  const [errors, setErrors] = useState({});
  const [documentDragActive, setDocumentDragActive] = useState(false);
  const [apexDragActive, setApexDragActive] = useState(false);
  const [awardDragActive, setAwardDragActive] = useState(false);

  // Conditional display helpers
  const showSpecialLab = formData.specialLabsInvolved === "Yes";
  const showOtherAuthorsBIT = formData.otherAuthorsBIT === "Yes";
  const showExternalFaculty = formData.facultyOtherInstitute === "Yes";
  const showIndustrialPerson = formData.industrialPersonInvolved === "Yes";
  const showInstituteName = formData.internationalCollaboration === "Yes";
  const showOrganizerDetails =
    formData.eventOrganizer !== "Click to choose" &&
    formData.eventOrganizer !== "BIT";
  const showPublicationPages = formData.publishedInProceedings === "Yes";
  const showApexProof = formData.typeOfSponsorship === "BIT";
  const showFundingAgency = formData.typeOfSponsorship === "Funding Agency";
  const showStudents = formData.studentsInvolved === "Yes";
  const showAwardProof = formData.awardReceived === "Yes";

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

    if (showSpecialLab && !formData.specialLab) {
      newErrors.specialLab = "Special Lab is required";
    }

    // Faculty validation when otherAuthorsBIT = Yes
    if (showOtherAuthorsBIT) {
      if (formData.chooseFirstFaculty === "Faculty" && !formData.firstFaculty) {
        newErrors.firstFaculty = "First Faculty is required";
      }
      if (
        formData.chooseSecondFaculty === "Faculty" &&
        !formData.secondFaculty
      ) {
        newErrors.secondFaculty = "Second Faculty is required";
      }
      if (formData.chooseThirdFaculty === "Faculty" && !formData.thirdFaculty) {
        newErrors.thirdFaculty = "Third Faculty is required";
      }
      if (
        formData.chooseFourthFaculty === "Faculty" &&
        !formData.fourthFaculty
      ) {
        newErrors.fourthFaculty = "Fourth Faculty is required";
      }
      if (formData.chooseFifthFaculty === "Faculty" && !formData.fifthFaculty) {
        newErrors.fifthFaculty = "Fifth Faculty is required";
      }
    }

    // Institute name validation
    if (showInstituteName && !formData.instituteName) {
      newErrors.instituteName = "Institute Name is required";
    }

    if (!formData.conferenceName)
      newErrors.conferenceName = "Conference Name is required";
    if (formData.eventMode === "Click to choose")
      newErrors.eventMode = "Event Mode is required";
    if (formData.eventOrganizer === "Click to choose")
      newErrors.eventOrganizer = "Event Organizer is required";

    // Organizer details validation
    if (showOrganizerDetails) {
      if (
        formData.eventOrganizer === "Industry" &&
        !formData.industryOrganizerName
      ) {
        newErrors.industryOrganizerName = "Industry/Organizer Name is required";
      }
      if (
        (formData.eventOrganizer === "Institute" ||
          formData.eventOrganizer === "Foreign Institute") &&
        !formData.instituteNameLocation
      ) {
        newErrors.instituteNameLocation =
          "Institute Name & Location is required";
      }
    }

    if (formData.eventLevel === "Click to choose")
      newErrors.eventLevel = "Event Level is required";
    if (!formData.paperTitle) newErrors.paperTitle = "Paper Title is required";
    if (!formData.eventStartDate)
      newErrors.eventStartDate = "Start Date is required";
    if (!formData.eventEndDate) newErrors.eventEndDate = "End Date is required";
    if (!formData.eventDurationDays)
      newErrors.eventDurationDays = "Duration is required";

    // Publication pages validation
    if (showPublicationPages) {
      if (!formData.pageFrom) newErrors.pageFrom = "Page From is required";
      if (!formData.pageTo) newErrors.pageTo = "Page To is required";
    }

    if (formData.typeOfSponsorship === "Click to choose") {
      newErrors.typeOfSponsorship = "Type of Sponsorship is required";
    }

    // Sponsorship-related validation
    if (showApexProof && !formData.apexProof) {
      newErrors.apexProof = "Apex Proof is required";
    }
    if (showFundingAgency) {
      if (!formData.fundingAgencyName)
        newErrors.fundingAgencyName = "Funding Agency Name is required";
      if (!formData.fundingAmount)
        newErrors.fundingAmount = "Funding Amount is required";
    }

    // Students validation
    if (showStudents) {
      if (!formData.firstStudent)
        newErrors.firstStudent = "First Student is required";
      if (formData.firstStudentYear === "Click to choose")
        newErrors.firstStudentYear = "Year of Study is required";

      if (formData.chooseSecondStudent === "Student") {
        if (!formData.secondStudent)
          newErrors.secondStudent = "Second Student is required";
        if (formData.secondStudentYear === "Click to choose")
          newErrors.secondStudentYear = "Year of Study is required";
      }
      if (formData.chooseThirdStudent === "Student") {
        if (!formData.thirdStudent)
          newErrors.thirdStudent = "Third Student is required";
        if (formData.thirdStudentYear === "Click to choose")
          newErrors.thirdStudentYear = "Year of Study is required";
      }
      if (formData.chooseFourthStudent === "Student") {
        if (!formData.fourthStudent)
          newErrors.fourthStudent = "Fourth Student is required";
        if (formData.fourthStudentYear === "Click to choose")
          newErrors.fourthStudentYear = "Year of Study is required";
      }
      if (formData.chooseFifthStudent === "Student") {
        if (!formData.fifthStudent)
          newErrors.fifthStudent = "Fifth Student is required";
        if (formData.fifthStudentYear === "Click to choose")
          newErrors.fifthStudentYear = "Year of Study is required";
      }
    }

    if (!formData.documentProof)
      newErrors.documentProof = "Document Proof is required";

    if (showAwardProof && !formData.awardProof) {
      newErrors.awardProof = "Award Proof is required";
    }

    // Date logic
    if (formData.eventStartDate && formData.eventEndDate) {
      if (new Date(formData.eventEndDate) < new Date(formData.eventStartDate)) {
        newErrors.eventEndDate = "End Date cannot be before Start Date";
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

        // Basic fields
        data.append("taskID", formData.taskID);
        data.append("specialLabsInvolved", formData.specialLabsInvolved);
        if (showSpecialLab) data.append("specialLab", formData.specialLab);

        // Other Authors from BIT
        data.append("otherAuthorsBIT", formData.otherAuthorsBIT);
        if (showOtherAuthorsBIT) {
          data.append("chooseFirstFaculty", formData.chooseFirstFaculty);
          if (formData.chooseFirstFaculty === "Faculty")
            data.append("firstFaculty", formData.firstFaculty);
          data.append("chooseSecondFaculty", formData.chooseSecondFaculty);
          if (formData.chooseSecondFaculty === "Faculty")
            data.append("secondFaculty", formData.secondFaculty);
          data.append("chooseThirdFaculty", formData.chooseThirdFaculty);
          if (formData.chooseThirdFaculty === "Faculty")
            data.append("thirdFaculty", formData.thirdFaculty);
          data.append("chooseFourthFaculty", formData.chooseFourthFaculty);
          if (formData.chooseFourthFaculty === "Faculty")
            data.append("fourthFaculty", formData.fourthFaculty);
          data.append("chooseFifthFaculty", formData.chooseFifthFaculty);
          if (formData.chooseFifthFaculty === "Faculty")
            data.append("fifthFaculty", formData.fifthFaculty);
        }

        // External Faculty
        data.append("facultyOtherInstitute", formData.facultyOtherInstitute);
        if (showExternalFaculty) {
          data.append("externalFaculty1", formData.externalFaculty1);
          data.append("externalFaculty2", formData.externalFaculty2);
          data.append("externalFaculty3", formData.externalFaculty3);
        }

        // Industrial Person
        data.append(
          "industrialPersonInvolved",
          formData.industrialPersonInvolved,
        );
        if (showIndustrialPerson) {
          data.append("industrialPerson1", formData.industrialPerson1);
          data.append("industrialPerson2", formData.industrialPerson2);
          data.append("industrialPerson3", formData.industrialPerson3);
        }

        // International Collaboration
        data.append(
          "internationalCollaboration",
          formData.internationalCollaboration,
        );
        if (showInstituteName)
          data.append("instituteName", formData.instituteName);

        // Conference Details
        data.append("conferenceName", formData.conferenceName);
        data.append("eventMode", formData.eventMode);
        data.append("eventLocation", formData.eventLocation);
        data.append("eventOrganizer", formData.eventOrganizer);
        if (showOrganizerDetails) {
          data.append("industryOrganizerName", formData.industryOrganizerName);
          data.append("instituteNameLocation", formData.instituteNameLocation);
        }
        data.append("eventLevel", formData.eventLevel);
        data.append("paperTitle", formData.paperTitle);
        data.append("eventStartDate", formData.eventStartDate);
        data.append("eventEndDate", formData.eventEndDate);
        data.append("eventDurationDays", formData.eventDurationDays);

        // Publication
        data.append("publishedInProceedings", formData.publishedInProceedings);
        if (showPublicationPages) {
          data.append("pageFrom", formData.pageFrom);
          data.append("pageTo", formData.pageTo);
        }

        // Sponsorship
        data.append("typeOfSponsorship", formData.typeOfSponsorship);
        if (showApexProof && formData.apexProof) {
          data.append("apexProof", formData.apexProof);
        }
        if (showFundingAgency) {
          data.append("fundingAgencyName", formData.fundingAgencyName);
          data.append("fundingAmount", formData.fundingAmount);
        }

        // Students
        data.append("studentsInvolved", formData.studentsInvolved);
        if (showStudents) {
          data.append("firstStudent", formData.firstStudent);
          data.append("firstStudentYear", formData.firstStudentYear);
          data.append("chooseSecondStudent", formData.chooseSecondStudent);
          if (formData.chooseSecondStudent === "Student") {
            data.append("secondStudent", formData.secondStudent);
            data.append("secondStudentYear", formData.secondStudentYear);
          }
          data.append("chooseThirdStudent", formData.chooseThirdStudent);
          if (formData.chooseThirdStudent === "Student") {
            data.append("thirdStudent", formData.thirdStudent);
            data.append("thirdStudentYear", formData.thirdStudentYear);
          }
          data.append("chooseFourthStudent", formData.chooseFourthStudent);
          if (formData.chooseFourthStudent === "Student") {
            data.append("fourthStudent", formData.fourthStudent);
            data.append("fourthStudentYear", formData.fourthStudentYear);
          }
          data.append("chooseFifthStudent", formData.chooseFifthStudent);
          if (formData.chooseFifthStudent === "Student") {
            data.append("fifthStudent", formData.fifthStudent);
            data.append("fifthStudentYear", formData.fifthStudentYear);
          }
        }

        // Other
        data.append("registrationAmount", formData.registrationAmount);
        data.append("documentProof", formData.documentProof);
        data.append("awardReceived", formData.awardReceived);
        if (showAwardProof && formData.awardProof) {
          data.append("awardProof", formData.awardProof);
        }

        const response = await axios.post(
          `${API_URL}/api/faculty/paperPresentationPost`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (response.status === 200) {
          alert("Paper Presentation record submitted successfully");
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

  // File upload component
  const FileUploadArea = ({
    fieldName,
    label,
    dragActive,
    setDragActive,
    required = false,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <RequiredAst />}
      </label>
      <div
        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
          errors[fieldName]
            ? "border-red-500"
            : dragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300"
        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
        onDragEnter={(e) => handleDrag(e, setDragActive)}
        onDragLeave={(e) => handleDrag(e, setDragActive)}
        onDragOver={(e) => handleDrag(e, setDragActive)}
        onDrop={(e) => handleDrop(e, fieldName, setDragActive)}
        onClick={() => document.getElementById(`${fieldName}-upload`).click()}
      >
        <div className="space-y-1 text-center">
          <UploadCloud
            className={`mx-auto h-10 w-10 ${dragActive ? "text-indigo-600" : "text-gray-400"}`}
          />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`${fieldName}-upload`}
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id={`${fieldName}-upload`}
                name={fieldName}
                type="file"
                className="sr-only"
                onChange={(e) => handleFileChange(e, fieldName)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>
      {formData[fieldName] && (
        <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
          <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
          <span className="font-medium mr-2 truncate">
            {formData[fieldName].name}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearFile(fieldName);
            }}
            className="ml-auto text-red-500 hover:text-red-700 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
      )}
    </div>
  );

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
              Add Paper Presentation Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for Paper Presentations in Conferences
            </p>
          </div>
        </div>

        {/* Form */}
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
                      value="Yes"
                      checked={formData.specialLabsInvolved === "Yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="specialLabsInvolved"
                      value="No"
                      checked={formData.specialLabsInvolved === "No"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Conditional Special Lab */}
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

            {/* Other Authors from BIT Section */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                BIT Faculty Authors
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Authors from BIT <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="otherAuthorsBIT"
                      value="Yes"
                      checked={formData.otherAuthorsBIT === "Yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="otherAuthorsBIT"
                      value="No"
                      checked={formData.otherAuthorsBIT === "No"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {showOtherAuthorsBIT && (
                <div className="space-y-4">
                  {/* First Faculty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose First Faculty
                      </label>
                      <select
                        name="chooseFirstFaculty"
                        value={formData.chooseFirstFaculty}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {FACULTY_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseFirstFaculty === "Faculty" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Faculty <RequiredAst />
                        </label>
                        <input
                          type="text"
                          name="firstFaculty"
                          value={formData.firstFaculty}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${errors.firstFaculty ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter Faculty Name"
                        />
                        {errors.firstFaculty && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstFaculty}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Second Faculty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Second Faculty
                      </label>
                      <select
                        name="chooseSecondFaculty"
                        value={formData.chooseSecondFaculty}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {FACULTY_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseSecondFaculty === "Faculty" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Second Faculty <RequiredAst />
                        </label>
                        <input
                          type="text"
                          name="secondFaculty"
                          value={formData.secondFaculty}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${errors.secondFaculty ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter Faculty Name"
                        />
                        {errors.secondFaculty && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.secondFaculty}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Third Faculty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Third Faculty
                      </label>
                      <select
                        name="chooseThirdFaculty"
                        value={formData.chooseThirdFaculty}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {FACULTY_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseThirdFaculty === "Faculty" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Third Faculty <RequiredAst />
                        </label>
                        <input
                          type="text"
                          name="thirdFaculty"
                          value={formData.thirdFaculty}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${errors.thirdFaculty ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter Faculty Name"
                        />
                        {errors.thirdFaculty && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.thirdFaculty}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fourth Faculty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Fourth Faculty
                      </label>
                      <select
                        name="chooseFourthFaculty"
                        value={formData.chooseFourthFaculty}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {FACULTY_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseFourthFaculty === "Faculty" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fourth Faculty <RequiredAst />
                        </label>
                        <input
                          type="text"
                          name="fourthFaculty"
                          value={formData.fourthFaculty}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${errors.fourthFaculty ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter Faculty Name"
                        />
                        {errors.fourthFaculty && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.fourthFaculty}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fifth Faculty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Fifth Faculty
                      </label>
                      <select
                        name="chooseFifthFaculty"
                        value={formData.chooseFifthFaculty}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {FACULTY_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseFifthFaculty === "Faculty" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fifth Faculty <RequiredAst />
                        </label>
                        <input
                          type="text"
                          name="fifthFaculty"
                          value={formData.fifthFaculty}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${errors.fifthFaculty ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter Faculty Name"
                        />
                        {errors.fifthFaculty && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.fifthFaculty}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* External Faculty Section */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                External Faculty & Industry
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Member from Other Institute <RequiredAst />
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="facultyOtherInstitute"
                        value="Yes"
                        checked={formData.facultyOtherInstitute === "Yes"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="facultyOtherInstitute"
                        value="No"
                        checked={formData.facultyOtherInstitute === "No"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Whether Industrial Person Involved <RequiredAst />
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="industrialPersonInvolved"
                        value="Yes"
                        checked={formData.industrialPersonInvolved === "Yes"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="industrialPersonInvolved"
                        value="No"
                        checked={formData.industrialPersonInvolved === "No"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* External Faculty Fields */}
              {showExternalFaculty && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      External Faculty 1 (Faculty name & Institution)
                    </label>
                    <input
                      type="text"
                      name="externalFaculty1"
                      value={formData.externalFaculty1}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Dr. John Doe, MIT"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      External Faculty 2 (Faculty name & Institution)
                    </label>
                    <input
                      type="text"
                      name="externalFaculty2"
                      value={formData.externalFaculty2}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Dr. Jane Smith, Stanford"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      External Faculty 3 (Faculty name & Institution)
                    </label>
                    <input
                      type="text"
                      name="externalFaculty3"
                      value={formData.externalFaculty3}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Prof. Robert Brown, Harvard"
                    />
                  </div>
                </div>
              )}

              {/* Industrial Person Fields */}
              {showIndustrialPerson && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of the person 1 & Industry name
                    </label>
                    <input
                      type="text"
                      name="industrialPerson1"
                      value={formData.industrialPerson1}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., John Doe, Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of the person 2 & Industry name
                    </label>
                    <input
                      type="text"
                      name="industrialPerson2"
                      value={formData.industrialPerson2}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Jane Smith, Microsoft"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of the person 3 & Industry name
                    </label>
                    <input
                      type="text"
                      name="industrialPerson3"
                      value={formData.industrialPerson3}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Robert Brown, Amazon"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* International Collaboration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collaboration with any International Institute / University{" "}
                  <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="internationalCollaboration"
                      value="Yes"
                      checked={formData.internationalCollaboration === "Yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="internationalCollaboration"
                      value="No"
                      checked={formData.internationalCollaboration === "No"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {showInstituteName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Name <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.instituteName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Institute Name"
                  />
                  {errors.instituteName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.instituteName}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Conference Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="conferenceName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of Conference <RequiredAst />
                </label>
                <input
                  type="text"
                  name="conferenceName"
                  id="conferenceName"
                  value={formData.conferenceName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.conferenceName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Conference Name"
                />
                {errors.conferenceName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.conferenceName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="eventMode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Mode <RequiredAst />
                </label>
                <select
                  name="eventMode"
                  id="eventMode"
                  value={formData.eventMode}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.eventMode ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {EVENT_MODE_OPTIONS.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      disabled={opt === "Click to choose"}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.eventMode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.eventMode}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="eventLocation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Location
                </label>
                <input
                  type="text"
                  name="eventLocation"
                  id="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Event Location"
                />
              </div>

              <div>
                <label
                  htmlFor="eventOrganizer"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Organizer <RequiredAst />
                </label>
                <select
                  name="eventOrganizer"
                  id="eventOrganizer"
                  value={formData.eventOrganizer}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.eventOrganizer ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {EVENT_ORGANIZER_OPTIONS.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      disabled={opt === "Click to choose"}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.eventOrganizer && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.eventOrganizer}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Organizer Details */}
            {showOrganizerDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(formData.eventOrganizer === "Industry" ||
                  formData.eventOrganizer === "Others") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of the Industry / Organizer Name <RequiredAst />
                    </label>
                    <input
                      type="text"
                      name="industryOrganizerName"
                      value={formData.industryOrganizerName}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.industryOrganizerName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter Industry/Organizer Name"
                    />
                    {errors.industryOrganizerName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.industryOrganizerName}
                      </p>
                    )}
                  </div>
                )}
                {(formData.eventOrganizer === "Institute" ||
                  formData.eventOrganizer === "Foreign Institute") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of the Institute & Location <RequiredAst />
                    </label>
                    <input
                      type="text"
                      name="instituteNameLocation"
                      value={formData.instituteNameLocation}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.instituteNameLocation ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter Institute Name & Location"
                    />
                    {errors.instituteNameLocation && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.instituteNameLocation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="eventLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Level <RequiredAst />
                </label>
                <select
                  name="eventLevel"
                  id="eventLevel"
                  value={formData.eventLevel}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.eventLevel ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {EVENT_LEVEL_OPTIONS.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      disabled={opt === "Click to choose"}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.eventLevel && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.eventLevel}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="paperTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Paper Title <RequiredAst />
                </label>
                <input
                  type="text"
                  name="paperTitle"
                  id="paperTitle"
                  value={formData.paperTitle}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.paperTitle ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Paper Title"
                />
                {errors.paperTitle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paperTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Event Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="eventStartDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Start Date <RequiredAst />
                </label>
                <input
                  type="date"
                  name="eventStartDate"
                  id="eventStartDate"
                  value={formData.eventStartDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.eventStartDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.eventStartDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.eventStartDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="eventEndDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event End Date <RequiredAst />
                </label>
                <input
                  type="date"
                  name="eventEndDate"
                  id="eventEndDate"
                  value={formData.eventEndDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.eventEndDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.eventEndDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.eventEndDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="eventDurationDays"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Duration (Days) <RequiredAst />
                </label>
                <input
                  type="number"
                  name="eventDurationDays"
                  id="eventDurationDays"
                  value={formData.eventDurationDays}
                  onChange={handleChange}
                  min="1"
                  className={`mt-1 block w-full px-3 py-2 border ${errors.eventDurationDays ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., 2"
                />
                {errors.eventDurationDays && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.eventDurationDays}
                  </p>
                )}
              </div>
            </div>

            {/* Publication Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paper Published in Conference Proceedings <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="publishedInProceedings"
                      value="Yes"
                      checked={formData.publishedInProceedings === "Yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="publishedInProceedings"
                      value="No"
                      checked={formData.publishedInProceedings === "No"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {showPublicationPages && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page From <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="pageFrom"
                    value={formData.pageFrom}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.pageFrom ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., 1"
                  />
                  {errors.pageFrom && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pageFrom}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page To <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="pageTo"
                    value={formData.pageTo}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.pageTo ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., 10"
                  />
                  {errors.pageTo && (
                    <p className="mt-1 text-sm text-red-600">{errors.pageTo}</p>
                  )}
                </div>
              </div>
            )}

            {/* Sponsorship Section */}
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
                  {SPONSORSHIP_OPTIONS.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      disabled={opt === "Click to choose"}
                    >
                      {opt}
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
                  htmlFor="registrationAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Registration Amount (in Rs.)
                </label>
                <input
                  type="number"
                  name="registrationAmount"
                  id="registrationAmount"
                  value={formData.registrationAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>

            {/* Conditional Apex Proof for BIT */}
            {showApexProof && (
              <FileUploadArea
                fieldName="apexProof"
                label="Apex Proof"
                dragActive={apexDragActive}
                setDragActive={setApexDragActive}
                required={true}
              />
            )}

            {/* Conditional Funding Agency */}
            {showFundingAgency && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of the Funding Agency <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="fundingAgencyName"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (in Rs.) <RequiredAst />
                  </label>
                  <input
                    type="number"
                    name="fundingAmount"
                    value={formData.fundingAmount}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.fundingAmount ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Amount"
                  />
                  {errors.fundingAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fundingAmount}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Students Section */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                Students Involved
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Students Involved <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="studentsInvolved"
                      value="Yes"
                      checked={formData.studentsInvolved === "Yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="studentsInvolved"
                      value="No"
                      checked={formData.studentsInvolved === "No"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {showStudents && (
                <div className="space-y-4">
                  {/* First Student (Always required when students involved) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Student <RequiredAst />
                      </label>
                      <input
                        type="text"
                        name="firstStudent"
                        value={formData.firstStudent}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.firstStudent ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Student Name"
                      />
                      {errors.firstStudent && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstStudent}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Student Year of Study <RequiredAst />
                      </label>
                      <select
                        name="firstStudentYear"
                        value={formData.firstStudentYear}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.firstStudentYear ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      >
                        {YEAR_OF_STUDY_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.firstStudentYear && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstStudentYear}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Second Student */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Second Student
                      </label>
                      <select
                        name="chooseSecondStudent"
                        value={formData.chooseSecondStudent}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {STUDENT_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseSecondStudent === "Student" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student <RequiredAst />
                          </label>
                          <input
                            type="text"
                            name="secondStudent"
                            value={formData.secondStudent}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.secondStudent ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Enter Student Name"
                          />
                          {errors.secondStudent && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.secondStudent}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year of Study <RequiredAst />
                          </label>
                          <select
                            name="secondStudentYear"
                            value={formData.secondStudentYear}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.secondStudentYear ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          >
                            {YEAR_OF_STUDY_OPTIONS.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                disabled={opt === "Click to choose"}
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.secondStudentYear && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.secondStudentYear}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Third Student */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Third Student
                      </label>
                      <select
                        name="chooseThirdStudent"
                        value={formData.chooseThirdStudent}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {STUDENT_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseThirdStudent === "Student" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student <RequiredAst />
                          </label>
                          <input
                            type="text"
                            name="thirdStudent"
                            value={formData.thirdStudent}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.thirdStudent ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Enter Student Name"
                          />
                          {errors.thirdStudent && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.thirdStudent}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year of Study <RequiredAst />
                          </label>
                          <select
                            name="thirdStudentYear"
                            value={formData.thirdStudentYear}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.thirdStudentYear ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          >
                            {YEAR_OF_STUDY_OPTIONS.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                disabled={opt === "Click to choose"}
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.thirdStudentYear && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.thirdStudentYear}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Fourth Student */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Fourth Student
                      </label>
                      <select
                        name="chooseFourthStudent"
                        value={formData.chooseFourthStudent}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {STUDENT_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseFourthStudent === "Student" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student <RequiredAst />
                          </label>
                          <input
                            type="text"
                            name="fourthStudent"
                            value={formData.fourthStudent}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.fourthStudent ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Enter Student Name"
                          />
                          {errors.fourthStudent && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.fourthStudent}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year of Study <RequiredAst />
                          </label>
                          <select
                            name="fourthStudentYear"
                            value={formData.fourthStudentYear}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.fourthStudentYear ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          >
                            {YEAR_OF_STUDY_OPTIONS.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                disabled={opt === "Click to choose"}
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.fourthStudentYear && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.fourthStudentYear}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Fifth Student */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Fifth Student
                      </label>
                      <select
                        name="chooseFifthStudent"
                        value={formData.chooseFifthStudent}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {STUDENT_NA_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            disabled={opt === "Click to choose"}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.chooseFifthStudent === "Student" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student <RequiredAst />
                          </label>
                          <input
                            type="text"
                            name="fifthStudent"
                            value={formData.fifthStudent}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.fifthStudent ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Enter Student Name"
                          />
                          {errors.fifthStudent && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.fifthStudent}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year of Study <RequiredAst />
                          </label>
                          <select
                            name="fifthStudentYear"
                            value={formData.fifthStudentYear}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.fifthStudentYear ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          >
                            {YEAR_OF_STUDY_OPTIONS.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                disabled={opt === "Click to choose"}
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.fifthStudentYear && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.fifthStudentYear}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Document Proof */}
            <FileUploadArea
              fieldName="documentProof"
              label="Document Proof (Certificate & Proceeding page if applicable)"
              dragActive={documentDragActive}
              setDragActive={setDocumentDragActive}
              required={true}
            />

            {/* Award Section */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-indigo-600" />
                Award Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Award / Cash / Prize received <RequiredAst />
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="awardReceived"
                      value="Yes"
                      checked={formData.awardReceived === "Yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="awardReceived"
                      value="No"
                      checked={formData.awardReceived === "No"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {showAwardProof && (
                <FileUploadArea
                  fieldName="awardProof"
                  label="Award Proof"
                  dragActive={awardDragActive}
                  setDragActive={setAwardDragActive}
                  required={true}
                />
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
                {isSubmitting ? "Saving..." : "Save Paper Presentation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
