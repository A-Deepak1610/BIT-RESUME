import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, UploadCloud, FileText, X } from "lucide-react";
import DepartmentDropdown from "../../../../components/shared/DepartmentDropdown";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function COEForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    faculty: "",
    sigNumber: "",
    taskID: "",
    coeName: "",
    centreClaimedDepartment: "",
    facultyIncharge: "",
    typeOfCOE: "Choose an option",
    collaborativeIndustry1: "",
    collaborativeIndustry2: "",
    areaInSqm: "",
    domain: "",

    // MoU Related
    isMoUPart: "Choose an option",
    mouName: "",

    // IRP Related
    isIRPResult: "Choose an option",
    irpVisits: "",

    // Stock & Financial
    stockRegisterMaintained: "Choose an option",
    totalAmountIncurred: "",
    bitContribution: "",
    industryContributionWithGST: "",
    industryContributionWithoutGST: "",

    // Academic
    studentsPerBatch: "",
    academicCourse: "",

    // Documents
    syllabusDocument: null,
    labPhoto: null,
    communicationProof: null,
    apexDocument: null,
    facilitiesReport: null,
    utilizationReport: null,

    owiVerification: "Initiated",
  });

  const [errors, setErrors] = useState({});
  const [dragActiveStates, setDragActiveStates] = useState({});

  // Options
  const yesNoOptions = ["Choose an option", "yes", "No"];
  const typeOfCOEOptions = [
    "Choose an option",
    "Industry sponsored lab",
    "Industry supported lab",
  ];
  const owiVerificationOptions = ["Initiated", "Approved", "Rejected"];

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

  const handleDrag = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveStates((prev) => ({ ...prev, [fieldName]: true }));
    } else if (e.type === "dragleave") {
      setDragActiveStates((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates((prev) => ({ ...prev, [fieldName]: false }));
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
    if (!formData.faculty) newErrors.faculty = "Faculty is required";
    if (!formData.sigNumber) newErrors.sigNumber = "SIG Number is required";
    if (!formData.taskID) newErrors.taskID = "Task ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const data = new FormData();

        // Append all text fields
        Object.keys(formData).forEach((key) => {
          if (
            formData[key] !== null &&
            typeof formData[key] !== "object" &&
            key !== "owiVerification"
          ) {
            data.append(key, formData[key]);
          }
        });

        // Append files
        const fileFields = [
          "syllabusDocument",
          "labPhoto",
          "communicationProof",
          "apexDocument",
          "facilitiesReport",
          "utilizationReport",
        ];
        fileFields.forEach((field) => {
          if (formData[field]) {
            data.append(field, formData[field]);
          }
        });

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}api/faculty/coePost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("COE details submitted successfully!");
          navigate("/faculty/outside-world-interaction");
        }
      } catch (error) {
        console.error("Error submitting COE:", error);
        alert("Failed to submit COE details. Please try again.");
      }
    }
  };

  const renderFileInput = (
    fieldName,
    label,
    acceptedTypes = "PDF, JPG, PNG",
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
          errors[fieldName]
            ? "border-red-500"
            : dragActiveStates[fieldName]
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300"
        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
        onDragEnter={(e) => handleDrag(e, fieldName)}
        onDragLeave={(e) => handleDrag(e, fieldName)}
        onDragOver={(e) => handleDrag(e, fieldName)}
        onDrop={(e) => handleDrop(e, fieldName)}
        onClick={() => document.getElementById(`${fieldName}-upload`).click()}
      >
        <div className="space-y-1 text-center">
          <UploadCloud
            className={`mx-auto h-12 w-12 ${dragActiveStates[fieldName] ? "text-indigo-600" : "text-gray-400"}`}
          />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`${fieldName}-upload`}
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
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
          <p className="text-xs text-gray-500">{acceptedTypes} up to 10MB</p>
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
              Add Centre of Excellence Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for Centre of Excellence
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="faculty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Faculty <RequiredAst />
                </label>
                <input
                  type="text"
                  name="faculty"
                  id="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.faculty ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Click to choose"
                />
                {errors.faculty && (
                  <p className="mt-1 text-sm text-red-600">{errors.faculty}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="sigNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SIG Number <RequiredAst />
                </label>
                <input
                  type="text"
                  name="sigNumber"
                  id="sigNumber"
                  value={formData.sigNumber}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.sigNumber ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Click to choose"
                />
                {errors.sigNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sigNumber}
                  </p>
                )}
              </div>
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
            </div>

            {/* COE Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Centre of Excellence Information
            </h3>

            <div>
              <label
                htmlFor="coeName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name of the Centre of Excellence
              </label>
              <input
                type="text"
                name="coeName"
                id="coeName"
                value={formData.coeName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter COE Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="centreClaimedDepartment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Centre Claimed Department
                </label>
                <DepartmentDropdown
                  name="centreClaimedDepartment"
                  id="centreClaimedDepartment"
                  value={formData.centreClaimedDepartment}
                  onChange={handleChange}
                  placeholder="Select Department"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="facultyIncharge"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of the Faculty Incharge
                </label>
                <input
                  type="text"
                  name="facultyIncharge"
                  id="facultyIncharge"
                  value={formData.facultyIncharge}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Faculty Incharge Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="typeOfCOE"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of COE
                </label>
                <select
                  name="typeOfCOE"
                  id="typeOfCOE"
                  value={formData.typeOfCOE}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {typeOfCOEOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Choose an option"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="domain"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Domain of the Centre
                </label>
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Domain"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="collaborativeIndustry1"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of the Collaborative Industry 1
                </label>
                <input
                  type="text"
                  name="collaborativeIndustry1"
                  id="collaborativeIndustry1"
                  value={formData.collaborativeIndustry1}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Industry Name"
                />
              </div>
              <div>
                <label
                  htmlFor="collaborativeIndustry2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of the Collaborative Industry 2
                </label>
                <input
                  type="text"
                  name="collaborativeIndustry2"
                  id="collaborativeIndustry2"
                  value={formData.collaborativeIndustry2}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Industry Name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="areaInSqm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Area in Sq.m
              </label>
              <input
                type="number"
                name="areaInSqm"
                id="areaInSqm"
                value={formData.areaInSqm}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Area"
              />
            </div>

            {/* MoU & IRP Relations */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              MoU & IRP Relations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="isMoUPart"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Is the centre established as part of the MoU?
                </label>
                <select
                  name="isMoUPart"
                  id="isMoUPart"
                  value={formData.isMoUPart}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {yesNoOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Choose an option"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {formData.isMoUPart === "yes" && (
                <div>
                  <label
                    htmlFor="mouName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name of the MoU
                  </label>
                  <input
                    type="text"
                    name="mouName"
                    id="mouName"
                    value={formData.mouName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter MoU Name"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="isIRPResult"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Is the establishment a result of the IRP visit?
                </label>
                <select
                  name="isIRPResult"
                  id="isIRPResult"
                  value={formData.isIRPResult}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {yesNoOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Choose an option"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {formData.isIRPResult === "yes" && (
                <div>
                  <label
                    htmlFor="irpVisits"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    IRP Visits
                  </label>
                  <input
                    type="text"
                    name="irpVisits"
                    id="irpVisits"
                    value={formData.irpVisits}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter IRP Visit Details"
                  />
                </div>
              )}
            </div>

            {/* Financial & Stock Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Financial & Stock Information
            </h3>

            <div>
              <label
                htmlFor="stockRegisterMaintained"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Register Maintained
              </label>
              <select
                name="stockRegisterMaintained"
                id="stockRegisterMaintained"
                value={formData.stockRegisterMaintained}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {yesNoOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    disabled={option === "Choose an option"}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="totalAmountIncurred"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Total Amount Incurred (in Rs.)
                </label>
                <input
                  type="number"
                  name="totalAmountIncurred"
                  id="totalAmountIncurred"
                  value={formData.totalAmountIncurred}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Amount"
                />
              </div>
              <div>
                <label
                  htmlFor="bitContribution"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  BIT Contribution (in Rs.)
                </label>
                <input
                  type="number"
                  name="bitContribution"
                  id="bitContribution"
                  value={formData.bitContribution}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="industryContributionWithGST"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Industry Contribution with GST (in Rs.)
                </label>
                <input
                  type="number"
                  name="industryContributionWithGST"
                  id="industryContributionWithGST"
                  value={formData.industryContributionWithGST}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Amount"
                />
              </div>
              <div>
                <label
                  htmlFor="industryContributionWithoutGST"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Industry Contribution without GST (in Rs.)
                </label>
                <input
                  type="number"
                  name="industryContributionWithoutGST"
                  id="industryContributionWithoutGST"
                  value={formData.industryContributionWithoutGST}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Amount"
                />
              </div>
            </div>

            {/* Academic Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Academic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="studentsPerBatch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No. of students accommodated for a single batch
                </label>
                <input
                  type="number"
                  name="studentsPerBatch"
                  id="studentsPerBatch"
                  value={formData.studentsPerBatch}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Number"
                />
              </div>
              <div>
                <label
                  htmlFor="academicCourse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Academic Course
                </label>
                <input
                  type="text"
                  name="academicCourse"
                  id="academicCourse"
                  value={formData.academicCourse}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Course Name"
                />
              </div>
            </div>

            {/* File Uploads */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderFileInput("syllabusDocument", "Upload the Syllabus")}
              {renderFileInput("labPhoto", "Lab Photo")}
              {renderFileInput(
                "communicationProof",
                "Upload Communication Proof",
              )}
              {renderFileInput("apexDocument", "Upload Apex Document")}
              {renderFileInput(
                "facilitiesReport",
                "Report of Facilities Available",
              )}
              {renderFileInput(
                "utilizationReport",
                "Report of Lab Utilization",
              )}
            </div>

            {/* Verification Status */}
            <div>
              <label
                htmlFor="owiVerification"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                OWI Verification
              </label>
              <select
                name="owiVerification"
                id="owiVerification"
                value={formData.owiVerification}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {owiVerificationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-5 flex items-center justify-end space-x-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save COE Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
