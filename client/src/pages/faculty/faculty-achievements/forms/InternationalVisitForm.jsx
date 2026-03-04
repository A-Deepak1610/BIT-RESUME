import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  Globe,
  Calendar,
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

const API_URL = import.meta.env.VITE_API_URL;

// Fund Type Options
const FUND_TYPE_OPTIONS = [
  "Click to choose",
  "Self",
  "Management",
  "Funding Agency",
];

export default function InternationalVisitForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    countryVisited: "",
    purposeOfVisit: "",
    fromDate: "",
    toDate: "",
    fundType: "",
    fundingAgencyName: "",
    apexProof: null,
    documentProof: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [apexDragActive, setApexDragActive] = useState(false);

  // Conditional field helpers
  const showApexProof = formData.fundType === "Management";
  const showFundingAgencyName = formData.fundType === "Funding Agency";

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

  const handleFileChange = (e, fieldName = "documentProof") => {
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

  const clearFile = (fieldName = "documentProof") => {
    setFormData((prev) => ({ ...prev, [fieldName]: null }));
  };

  // Drag and drop handlers
  const handleDrag = (e, setDragActiveState = setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveState(true);
    } else if (e.type === "dragleave") {
      setDragActiveState(false);
    }
  };

  const handleDrop = (
    e,
    fieldName = "documentProof",
    setDragActiveState = setDragActive,
  ) => {
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
    if (!formData.countryVisited)
      newErrors.countryVisited = "Country Visited is required";
    if (!formData.purposeOfVisit)
      newErrors.purposeOfVisit = "Purpose of Visit is required";
    if (!formData.fromDate) newErrors.fromDate = "From Date is required";
    if (!formData.toDate) newErrors.toDate = "To Date is required";
    if (!formData.fundType || formData.fundType === "Click to choose")
      newErrors.fundType = "Fund Type is required";

    // Conditional validations
    if (showApexProof && !formData.apexProof) {
      newErrors.apexProof = "Apex Proof is required";
    }
    if (showFundingAgencyName && !formData.fundingAgencyName) {
      newErrors.fundingAgencyName = "Funding Agency Name is required";
    }

    if (!formData.documentProof)
      newErrors.documentProof = "Document Proof is required";

    // Date Logic
    if (formData.fromDate && formData.toDate) {
      if (new Date(formData.toDate) < new Date(formData.fromDate)) {
        newErrors.toDate = "To Date cannot be before From Date";
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
        data.append("countryVisited", formData.countryVisited);
        data.append("purposeOfVisit", formData.purposeOfVisit);
        data.append("fromDate", formData.fromDate);
        data.append("toDate", formData.toDate);
        data.append("fundType", formData.fundType);

        if (showFundingAgencyName) {
          data.append("fundingAgencyName", formData.fundingAgencyName);
        }
        if (showApexProof && formData.apexProof) {
          data.append("apexProof", formData.apexProof);
        }
        data.append("documentProof", formData.documentProof);

        const response = await axios.post(
          `${API_URL}/api/faculty/internationalVisitPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("International Visit record submitted successfully");
          navigate("/faculty/achievement");
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
              Add International Trip Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for International Visits
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Task ID & Country */}
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
                <label
                  htmlFor="countryVisited"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country Visited <RequiredAst />
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="countryVisited"
                    id="countryVisited"
                    value={formData.countryVisited}
                    onChange={handleChange}
                    className={`block w-full pl-10 px-3 py-2 border ${errors.countryVisited ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Country Name"
                  />
                </div>
                {errors.countryVisited && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.countryVisited}
                  </p>
                )}
              </div>
            </div>

            {/* Purpose & Fund Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="purposeOfVisit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Purpose of Visit <RequiredAst />
                </label>
                <input
                  type="text"
                  name="purposeOfVisit"
                  id="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.purposeOfVisit ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Purpose"
                />
                {errors.purposeOfVisit && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.purposeOfVisit}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fundType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fund Type <RequiredAst />
                </label>
                <select
                  name="fundType"
                  id="fundType"
                  value={formData.fundType}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.fundType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {FUND_TYPE_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.fundType && (
                  <p className="mt-1 text-sm text-red-600">{errors.fundType}</p>
                )}
              </div>
            </div>

            {/* Conditional: Funding Agency Name */}
            {showFundingAgencyName && (
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
            )}

            {/* Conditional: Apex Proof for Management */}
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
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
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

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From Date <RequiredAst />
                </label>
                <input
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.fromDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.fromDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.fromDate}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="toDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Date <RequiredAst />
                </label>
                <input
                  type="date"
                  name="toDate"
                  id="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.toDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.toDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.toDate}</p>
                )}
              </div>
            </div>

            {/* Document Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload the relevant proof (1.Approval letter,2.Brochure
                /Poster/Invitation,3.Attendance sheet & 4.Photo ){" "}
                <RequiredAst />
              </label>
              <div
                className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${
                  errors.documentProof
                    ? "border-red-500"
                    : dragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300"
                } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <div className="space-y-1 text-center">
                  <UploadCloud
                    className={`mx-auto h-12 w-12 ${dragActive ? "text-indigo-600" : "text-gray-400"}`}
                  />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="documentProof"
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
              {formData.documentProof && (
                <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                  <FileText
                    size={16}
                    className="mr-2 flex-shrink-0 text-indigo-600"
                  />
                  <span className="font-medium mr-2 truncate">
                    {formData.documentProof.name}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({(formData.documentProof.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
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
                disabled={isSubmitting}
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center`}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Save Achievement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
