import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  User,
  Building2,
  Calendar,
  Award,
  Globe,
  DollarSign,
  CheckSquare,
  Briefcase,
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function TrainingToIndustryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    faculty: "",
    sigNumber: "",
    specialLabsInvolved: "",
    specialLab: "",
    eventName: "",
    eventNameOther: "",
    industryName: "",
    industryAddress: "",
    domainArea: "",
    industryType: "Choose an option",
    industryTypeOther: "",
    modeOfTraining: "Choose an option",
    industryWebsite: "",
    numberOfPersonsTrained: "",
    durationDays: "",
    startDate: "",
    endDate: "",
    outcomeOfTraining: "",
    honorariumReceived: "",
    communicationProof: [],
    approvalLetter: [],
    geotagPhotos: [],
    participantsAttendance: [],
    paymentProofs: [],
    consolidatedDocument: [],
    owiVerification: "Initiated",
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState({});

  // Options
  const specialLabsOptions = [
    { value: "", label: "Choose an option" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const eventNameOptions = [
    "Choose an option",
    "Conference",
    "Workshop",
    "Industry Training",
    "Seminar",
    "Others",
  ];

  const industryTypeOptions = [
    "Choose an option",
    "MNC",
    "Government",
    "Private",
    "Startup",
    "Others",
  ];

  const modeOfTrainingOptions = [
    "Choose an option",
    "Online",
    "Offline",
  ];

  const owiVerificationOptions = [
    "Initiated",
    "Approved",
    "Rejected",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const fileInputRefs = useRef({});

  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...Array.from(e.target.files)]
      }));
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const openFileDialog = (fieldName) => {
    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].click();
    }
  };

  const clearFile = (fieldName, index = null) => {
    setFormData((prev) => {
      if (index !== null) {
        // Remove specific file from array
        const newFiles = [...prev[fieldName]];
        newFiles.splice(index, 1);
        return { ...prev, [fieldName]: newFiles };
      }
      // Clear all files
      return { ...prev, [fieldName]: [] };
    });
  };

  const handleDrag = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [fieldName]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [fieldName]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...Array.from(e.dataTransfer.files)]
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

  const renderFileUpload = (fieldName, label, isRequired = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {isRequired && <RequiredAst />}
      </label>
      <div
        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
          errors[fieldName]
            ? "border-red-500"
            : dragActive[fieldName]
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300"
        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
        onDragEnter={(e) => handleDrag(e, fieldName)}
        onDragLeave={(e) => handleDrag(e, fieldName)}
        onDragOver={(e) => handleDrag(e, fieldName)}
        onDrop={(e) => handleDrop(e, fieldName)}
        onClick={() => openFileDialog(fieldName)}
      >
        <div className="space-y-1 text-center">
          <UploadCloud
            className={`mx-auto h-12 w-12 ${
              dragActive[fieldName] ? "text-indigo-600" : "text-gray-400"
            }`}
          />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={fieldName}
              className="cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
            >
              <span>Upload files</span>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
        </div>
      </div>
      <input
        ref={(el) => (fileInputRefs.current[fieldName] = el)}
        id={fieldName}
        name={fieldName}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => handleFileChange(e, fieldName)}
      />
      {formData[fieldName] && formData[fieldName].length > 0 && (
        <div className="mt-2 space-y-2">
          {formData[fieldName].map((file, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
              <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
              <span className="font-medium mr-2 truncate flex-1">
                {file.name}
              </span>
              <span className="text-xs text-gray-400 mr-2">
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile(fieldName, index);
                }}
                className="ml-auto text-red-500 hover:text-red-700 p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
      )}
    </div>
  );

  const validate = () => {
    const newErrors = {};

    if (!formData.faculty.trim()) {
      newErrors.faculty = "Faculty is required";
    }

    if (!formData.sigNumber.trim()) {
      newErrors.sigNumber = "SIG Number is required";
    }

    if (!formData.specialLabsInvolved) {
      newErrors.specialLabsInvolved = "Special Labs Involved is required";
    }

    if (formData.specialLabsInvolved === "yes" && !formData.specialLab.trim()) {
      newErrors.specialLab = "Special Lab Name is required";
    }

    if (!formData.eventName || formData.eventName === "Choose an option") {
      newErrors.eventName = "Name of the Event is required";
    }

    if (formData.eventName === "Others" && !formData.eventNameOther.trim()) {
      newErrors.eventNameOther = "Please specify the event name";
    }

    if (!formData.industryName.trim()) {
      newErrors.industryName = "Name of the Industry / Organization is required";
    }

    if (!formData.industryAddress.trim()) {
      newErrors.industryAddress = "Address of the Industry is required";
    }

    if (!formData.domainArea.trim()) {
      newErrors.domainArea = "Domain Area of the Industry is required";
    }

    if (!formData.industryType || formData.industryType === "Choose an option") {
      newErrors.industryType = "Type of Industry / Organization is required";
    }

    if (formData.industryType === "Others" && !formData.industryTypeOther.trim()) {
      newErrors.industryTypeOther = "Please specify the industry type";
    }

    if (!formData.modeOfTraining || formData.modeOfTraining === "Choose an option") {
      newErrors.modeOfTraining = "Mode of Training is required";
    }

    if (!formData.numberOfPersonsTrained.trim()) {
      newErrors.numberOfPersonsTrained = "Number of Industry persons trained is required";
    }

    if (!formData.durationDays.trim()) {
      newErrors.durationDays = "Duration, in days is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.outcomeOfTraining.trim()) {
      newErrors.outcomeOfTraining = "Outcome of the Training is required";
    }

    if (formData.honorariumReceived && isNaN(formData.honorariumReceived)) {
      newErrors.honorariumReceived = "Honorarium must be a number";
    }

    if (!formData.communicationProof || formData.communicationProof.length === 0) {
      newErrors.communicationProof = "Communication Proof is required";
    }

    if (!formData.approvalLetter || formData.approvalLetter.length === 0) {
      newErrors.approvalLetter = "Approval letter from BIT is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        const submitData = new FormData();
        
        // Define file field names
        const fileFields = ['communicationProof', 'approvalLetter', 'geotagPhotos', 'participantsAttendance', 'paymentProofs', 'consolidatedDocument'];
        
        // Append all text fields
        Object.keys(formData).forEach((key) => {
          if (!fileFields.includes(key)) {
            submitData.append(key, formData[key]);
          }
        });
        
        // Append files if exists (multiple files support)
        fileFields.forEach((fieldName) => {
          if (formData[fieldName] && formData[fieldName].length > 0) {
            formData[fieldName].forEach((file) => {
              submitData.append(fieldName, file);
            });
          }
        });

        const response = await fetch(`${API_URL}api/owi/trainingToIndustry`, {
          method: "POST",
          body: submitData,
          credentials: "include",
        });
        if (response.ok) {
          console.log("Form submitted successfully");
          navigate("/faculty/outside-world-interaction");
        } else {
          alert("Failed to submit form. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error submitting form. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Full Width at Top */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Training to Industry Details
            </h1>
            <p className="text-sm text-gray-500">
              Add Training to Industry details
            </p>
          </div>
        </div>
      </div>

      {/* Form Card - Centered */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Faculty Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Faculty Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.faculty ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter faculty name"
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
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.sigNumber ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter SIG Number"
                  />
                  {errors.sigNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.sigNumber}</p>
                  )}
                </div>
              </div>

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
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.specialLabsInvolved ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {specialLabsOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.specialLabsInvolved && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialLabsInvolved}</p>
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
                    <input
                      type="text"
                      name="specialLab"
                      id="specialLab"
                      value={formData.specialLab}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.specialLab ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter special lab name"
                    />
                    {errors.specialLab && (
                      <p className="mt-1 text-sm text-red-600">{errors.specialLab}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="eventName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name of the Event <RequiredAst />
                  </label>
                  <select
                    name="eventName"
                    id="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.eventName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {eventNameOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={option === "Choose an option"}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.eventName && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventName}</p>
                  )}
                </div>

                {formData.eventName === "Others" && (
                  <div>
                    <label
                      htmlFor="eventNameOther"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      If Others, Please Specify <RequiredAst />
                    </label>
                    <input
                      type="text"
                      name="eventNameOther"
                      id="eventNameOther"
                      value={formData.eventNameOther}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.eventNameOther ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Please specify"
                    />
                    {errors.eventNameOther && (
                      <p className="mt-1 text-sm text-red-600">{errors.eventNameOther}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Industry Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Industry / Organization Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="industryName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name of the Industry / Organization <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="industryName"
                    id="industryName"
                    value={formData.industryName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.industryName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter industry/organization name"
                  />
                  {errors.industryName && (
                    <p className="mt-1 text-sm text-red-600">{errors.industryName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="domainArea"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Domain Area of the Industry <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="domainArea"
                    id="domainArea"
                    value={formData.domainArea}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.domainArea ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., AI/ML, Finance, Healthcare"
                  />
                  {errors.domainArea && (
                    <p className="mt-1 text-sm text-red-600">{errors.domainArea}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="industryType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type of Industry / Organization <RequiredAst />
                  </label>
                  <select
                    name="industryType"
                    id="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.industryType ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {industryTypeOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={option === "Choose an option"}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.industryType && (
                    <p className="mt-1 text-sm text-red-600">{errors.industryType}</p>
                  )}
                </div>

                {formData.industryType === "Others" && (
                  <div>
                    <label
                      htmlFor="industryTypeOther"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      If Others, Please Specify <RequiredAst />
                    </label>
                    <input
                      type="text"
                      name="industryTypeOther"
                      id="industryTypeOther"
                      value={formData.industryTypeOther}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.industryTypeOther ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Please specify"
                    />
                    {errors.industryTypeOther && (
                      <p className="mt-1 text-sm text-red-600">{errors.industryTypeOther}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="modeOfTraining"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mode of Training <RequiredAst />
                  </label>
                  <select
                    name="modeOfTraining"
                    id="modeOfTraining"
                    value={formData.modeOfTraining}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.modeOfTraining ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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
                  {errors.modeOfTraining && (
                    <p className="mt-1 text-sm text-red-600">{errors.modeOfTraining}</p>
                  )}
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
                    placeholder="https://www.company.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="industryAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address of the Industry <RequiredAst />
                </label>
                <textarea
                  name="industryAddress"
                  id="industryAddress"
                  value={formData.industryAddress}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.industryAddress ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter complete address of the industry/organization"
                />
                {errors.industryAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.industryAddress}</p>
                )}
              </div>
            </div>

            {/* Training Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Training Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="numberOfPersonsTrained"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Industry persons trained <RequiredAst />
                  </label>
                  <input
                    type="number"
                    name="numberOfPersonsTrained"
                    id="numberOfPersonsTrained"
                    value={formData.numberOfPersonsTrained}
                    onChange={handleChange}
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.numberOfPersonsTrained ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter number of persons"
                  />
                  {errors.numberOfPersonsTrained && (
                    <p className="mt-1 text-sm text-red-600">{errors.numberOfPersonsTrained}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="durationDays"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration, in days <RequiredAst />
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    id="durationDays"
                    value={formData.durationDays}
                    onChange={handleChange}
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.durationDays ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter duration in days"
                  />
                  {errors.durationDays && (
                    <p className="mt-1 text-sm text-red-600">{errors.durationDays}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start date <RequiredAst />
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End date <RequiredAst />
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="outcomeOfTraining"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Outcome of the Training <RequiredAst />
                  </label>
                  <textarea
                    name="outcomeOfTraining"
                    id="outcomeOfTraining"
                    value={formData.outcomeOfTraining}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.outcomeOfTraining ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter outcome of the training"
                  />
                  {errors.outcomeOfTraining && (
                    <p className="mt-1 text-sm text-red-600">{errors.outcomeOfTraining}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="honorariumReceived"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Honorarium received from the Industry (in Rs.)
                  </label>
                  <input
                    type="number"
                    name="honorariumReceived"
                    id="honorariumReceived"
                    value={formData.honorariumReceived}
                    onChange={handleChange}
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.honorariumReceived ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter honorarium amount"
                  />
                  {errors.honorariumReceived && (
                    <p className="mt-1 text-sm text-red-600">{errors.honorariumReceived}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFileUpload("communicationProof", "Upload Communication Proof", true)}
                {renderFileUpload("approvalLetter", "Approval letter from BIT", true)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFileUpload("geotagPhotos", "Upload Geotag Photos")}
                {renderFileUpload("participantsAttendance", "Upload participant's attendance")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFileUpload("paymentProofs", "Upload Payment Proofs")}
                {renderFileUpload("consolidatedDocument", "Upload Consolidated Document")}
              </div>
            </div>

            {/* OWI Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                OWI Verification
              </h3>
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
                  className="mt-1 block w-full px-3 py-2 h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {owiVerificationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
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
                Save Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

