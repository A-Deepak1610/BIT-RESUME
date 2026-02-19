import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, UploadCloud, FileText, X } from "lucide-react";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function Faculty_Trained_by_IndustryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    faculty: "",
    taskID: "",
    specialLabsInvolved: "Choose an option",
    specialLab: "",

    // Training Program Details
    trainingProgramName: "",
    financialAssistance: "Choose an option",
    amountIncurred: "",
    typeOfApproval: "Choose an option",
    apexApprovalNo: "",

    // Industry Details
    industryName: "",
    domainArea: "",
    typeOfIndustry: "Choose an option",
    othersSpecify: "",

    // Training Details
    modeOfTraining: "Choose an option",
    durationInDays: "",
    startDate: "",
    endDate: "",
    industryWebsite: "",

    // Trainer 1
    trainer1Name: "",
    trainer1Designation: "",
    trainer1Email: "",
    trainer1Phone: "",

    // Trainer 2
    trainer2Applicable: "Choose an option",
    trainer2Name: "",
    trainer2Designation: "",
    trainer2Email: "",
    trainer2Phone: "",

    // Outcome & Documents
    outcome: "",
    proofDocument: null,

    owiVerification: "Initiated",
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Options
  const yesNoOptions = ["Choose an option", "yes", "No"];
  const financialAssistanceOptions = [
    "Choose an option",
    "Self",
    "Management",
    "NA",
  ];
  const typeOfApprovalOptions = [
    "Choose an option",
    "Apex",
    "Principal",
    "Dean",
  ];
  const typeOfIndustryOptions = [
    "Choose an option",
    "MNC",
    "Large Scale",
    "MSME",
    "Small Scale",
    "Others",
  ];
  const modeOfTrainingOptions = ["Choose an option", "Online", "Offline"];
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, proofDocument: e.target.files[0] }));
      if (errors.proofDocument) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.proofDocument;
          return newErrors;
        });
      }
    }
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, proofDocument: null }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({
        ...prev,
        proofDocument: e.dataTransfer.files[0],
      }));
      if (errors.proofDocument) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.proofDocument;
          return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.taskID) newErrors.taskID = "Task ID is required";
    if (
      !formData.specialLabsInvolved ||
      formData.specialLabsInvolved === "Choose an option"
    ) {
      newErrors.specialLabsInvolved = "Selection is required";
    }
    if (formData.specialLabsInvolved === "yes" && !formData.specialLab) {
      newErrors.specialLab = "Special Lab name is required";
    }
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.trainer1Designation)
      newErrors.trainer1Designation = "Trainer 1 Designation is required";
    if (formData.typeOfApproval === "Apex" && !formData.apexApprovalNo) {
      newErrors.apexApprovalNo = "Apex approval number is required";
    }
    if (
      formData.trainer2Applicable === "yes" &&
      !formData.trainer2Designation
    ) {
      newErrors.trainer2Designation = "Trainer 2 Designation is required";
    }

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

        // Append file
        if (formData.proofDocument) {
          data.append("proofDocument", formData.proofDocument);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}api/faculty/trainedByIndustryPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("Faculty training details submitted successfully!");
          navigate("/faculty/outside-world-interaction");
        }
      } catch (error) {
        console.error("Error submitting Faculty Training:", error);
        alert("Failed to submit training details. Please try again.");
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
              Add Faculty Training by Industry Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for Faculty Trained by Industry
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="faculty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Faculty
                </label>
                <input
                  type="text"
                  name="faculty"
                  id="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Faculty Name"
                />
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

            {/* Special Labs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="specialLabsInvolved"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Special Labs Involved <RequiredAst />
                </label>
                <select
                  name="specialLabsInvolved"
                  id="specialLabsInvolved"
                  value={formData.specialLabsInvolved}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.specialLabsInvolved ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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
                {errors.specialLabsInvolved && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.specialLabsInvolved}
                  </p>
                )}
              </div>
              {formData.specialLabsInvolved === "yes" && (
                <div>
                  <label
                    htmlFor="specialLab"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Special Lab Name <RequiredAst />
                  </label>
                  <SpecialLabDropdown
                    name="specialLab"
                    id="specialLab"
                    value={formData.specialLab}
                    onChange={handleChange}
                    error={errors.specialLab}
                    placeholder="Select Special Lab"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.specialLab ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.specialLab && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.specialLab}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Training Program Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Training Program Information
            </h3>

            <div>
              <label
                htmlFor="trainingProgramName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name of the Training Program
              </label>
              <input
                type="text"
                name="trainingProgramName"
                id="trainingProgramName"
                value={formData.trainingProgramName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Training Program Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="financialAssistance"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Financial Assistance
                </label>
                <select
                  name="financialAssistance"
                  id="financialAssistance"
                  value={formData.financialAssistance}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {financialAssistanceOptions.map((option) => (
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
                  htmlFor="amountIncurred"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount Incurred (in Rs)
                </label>
                <input
                  type="number"
                  name="amountIncurred"
                  id="amountIncurred"
                  value={formData.amountIncurred}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Amount"
                />
              </div>
              <div>
                <label
                  htmlFor="typeOfApproval"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Approval
                </label>
                <select
                  name="typeOfApproval"
                  id="typeOfApproval"
                  value={formData.typeOfApproval}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {typeOfApprovalOptions.map((option) => (
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
            </div>

            {formData.typeOfApproval === "Apex" && (
              <div>
                <label
                  htmlFor="apexApprovalNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Apex Approval No <RequiredAst />
                </label>
                <input
                  type="text"
                  name="apexApprovalNo"
                  id="apexApprovalNo"
                  value={formData.apexApprovalNo}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.apexApprovalNo ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Apex Approval Number"
                />
                {errors.apexApprovalNo && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.apexApprovalNo}
                  </p>
                )}
              </div>
            )}

            {/* Industry Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Industry Information
            </h3>

            <div>
              <label
                htmlFor="industryName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name of the Industry / Organization
              </label>
              <input
                type="text"
                name="industryName"
                id="industryName"
                value={formData.industryName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Industry/Organization Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="domainArea"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Domain Area of the Industry
                </label>
                <input
                  type="text"
                  name="domainArea"
                  id="domainArea"
                  value={formData.domainArea}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Domain Area"
                />
              </div>
              <div>
                <label
                  htmlFor="typeOfIndustry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Industry / Organization
                </label>
                <select
                  name="typeOfIndustry"
                  id="typeOfIndustry"
                  value={formData.typeOfIndustry}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {typeOfIndustryOptions.map((option) => (
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
            </div>

            {formData.typeOfIndustry === "Others" && (
              <div>
                <label
                  htmlFor="othersSpecify"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  If Others, Please Specify
                </label>
                <input
                  type="text"
                  name="othersSpecify"
                  id="othersSpecify"
                  value={formData.othersSpecify}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Specify Type"
                />
              </div>
            )}

            {/* Training Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Training Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="modeOfTraining"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mode of Training
                </label>
                <select
                  name="modeOfTraining"
                  id="modeOfTraining"
                  value={formData.modeOfTraining}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {modeOfTrainingOptions.map((option) => (
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
                  htmlFor="durationInDays"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (in days)
                </label>
                <input
                  type="number"
                  name="durationInDays"
                  id="durationInDays"
                  value={formData.durationInDays}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Duration"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
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

            <div>
              <label
                htmlFor="industryWebsite"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry Website
              </label>
              <input
                type="url"
                name="industryWebsite"
                id="industryWebsite"
                value={formData.industryWebsite}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com"
              />
            </div>

            {/* Trainer 1 Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Trainer 1 Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="trainer1Name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trainer 1 Name
                </label>
                <input
                  type="text"
                  name="trainer1Name"
                  id="trainer1Name"
                  value={formData.trainer1Name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Trainer Name"
                />
              </div>
              <div>
                <label
                  htmlFor="trainer1Designation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trainer 1 Designation <RequiredAst />
                </label>
                <input
                  type="text"
                  name="trainer1Designation"
                  id="trainer1Designation"
                  value={formData.trainer1Designation}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.trainer1Designation ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Designation"
                />
                {errors.trainer1Designation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.trainer1Designation}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="trainer1Email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trainer 1 Email ID
                </label>
                <input
                  type="email"
                  name="trainer1Email"
                  id="trainer1Email"
                  value={formData.trainer1Email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="trainer@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="trainer1Phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trainer 1 Phone Number
                </label>
                <input
                  type="tel"
                  name="trainer1Phone"
                  id="trainer1Phone"
                  value={formData.trainer1Phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Phone Number"
                />
              </div>
            </div>

            {/* Trainer 2 Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Trainer 2 Details (Optional)
            </h3>

            <div>
              <label
                htmlFor="trainer2Applicable"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Trainer 2 Details (if applicable)
              </label>
              <select
                name="trainer2Applicable"
                id="trainer2Applicable"
                value={formData.trainer2Applicable}
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

            {formData.trainer2Applicable === "yes" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="trainer2Name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Trainer 2 Name
                    </label>
                    <input
                      type="text"
                      name="trainer2Name"
                      id="trainer2Name"
                      value={formData.trainer2Name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter Trainer Name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="trainer2Designation"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Trainer 2 Designation <RequiredAst />
                    </label>
                    <input
                      type="text"
                      name="trainer2Designation"
                      id="trainer2Designation"
                      value={formData.trainer2Designation}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.trainer2Designation ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter Designation"
                    />
                    {errors.trainer2Designation && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.trainer2Designation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="trainer2Email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Trainer 2 Email ID
                    </label>
                    <input
                      type="email"
                      name="trainer2Email"
                      id="trainer2Email"
                      value={formData.trainer2Email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="trainer@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="trainer2Phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Trainer 2 Phone Number
                    </label>
                    <input
                      type="tel"
                      name="trainer2Phone"
                      id="trainer2Phone"
                      value={formData.trainer2Phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter Phone Number"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Outcome */}
            <div>
              <label
                htmlFor="outcome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Outcome of the Training
              </label>
              <textarea
                name="outcome"
                id="outcome"
                rows={4}
                value={formData.outcome}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe the outcome of the training"
              />
            </div>

            {/* File Upload */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Documents
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proof (Apex approval, Photos, Certificate, Bills/Invoices)
              </label>
              <div
                className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                  errors.proofDocument
                    ? "border-red-500"
                    : dragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300"
                } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("proof-upload").click()}
              >
                <div className="space-y-1 text-center">
                  <UploadCloud
                    className={`mx-auto h-12 w-12 ${dragActive ? "text-indigo-600" : "text-gray-400"}`}
                  />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="proof-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="proof-upload"
                        name="proofDocument"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
              {formData.proofDocument && (
                <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                  <FileText
                    size={16}
                    className="mr-2 flex-shrink-0 text-indigo-600"
                  />
                  <span className="font-medium mr-2 truncate">
                    {formData.proofDocument.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="ml-auto text-red-500 hover:text-red-700 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {errors.proofDocument && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.proofDocument}
                </p>
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
                Save Training Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
