import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../store/UseAuth";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  User,
  Building2,
  Award,
  CheckSquare,
  Briefcase,
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function ProfessionalMembershipForm() {
  const navigate = useNavigate();
  const { name } = useAuth();
  const [formData, setFormData] = useState({
    membershipCategory: "",
    faculty: "",
    taskId: "",
    specialLabsInvolved: "",
    specialLab: "",
    nameOfProfessionalBody: "",
    membershipType: "",
    membershipId: "",
    nameOfGradeLevelPosition: "",
    category: "",
    validityType: "",
    apexDocumentProof: [],
    amount: "",
    ifOthers: "",
    amountIfOthers: "",
    documentProof: [],
    owiVerification: "Initiated",
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState({});

  // Auto-fill faculty name from logged-in user
  useEffect(() => {
    if (name) {
      setFormData((prev) => ({ ...prev, faculty: name }));
    }
  }, [name]);

  // Options
  const membershipCategoryOptions = [
    { value: "", label: "Choose an option" },
    { value: "Institute Membership", label: "Institute Membership" },
    { value: "Faculty Membership", label: "Faculty Membership" },
  ];

  const specialLabsOptions = [
    { value: "", label: "Choose an option" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const membershipTypeOptions = [
    { value: "", label: "Choose an option" },
    { value: "Annual", label: "Annual" },
    { value: "Lifetime", label: "Lifetime" },
  ];

  const categoryOptions = [
    { value: "", label: "Choose an option" },
    { value: "National", label: "National" },
    { value: "International", label: "International" },
  ];

  const validityTypeOptions = [
    { value: "", label: "Choose an option" },
    { value: "Self", label: "Self" },
    { value: "BIT", label: "BIT" },
    { value: "Others", label: "Others" },
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

  const renderFileUpload = (fieldName, label, isRequired = false, helperText = "") => (
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
          {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
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

    if (!formData.membershipCategory || formData.membershipCategory === "") {
      newErrors.membershipCategory = "Membership Category is required";
    }

    if (!formData.faculty.trim()) {
      newErrors.faculty = "Faculty is required";
    }

    if (!formData.taskId.trim()) {
      newErrors.taskId = "Task ID is required";
    }

    if (!formData.specialLabsInvolved) {
      newErrors.specialLabsInvolved = "Special Labs Involved is required";
    }

    if (formData.specialLabsInvolved === "yes" && !formData.specialLab.trim()) {
      newErrors.specialLab = "Special Lab Name is required";
    }

    if (!formData.nameOfProfessionalBody.trim()) {
      newErrors.nameOfProfessionalBody = "Name of the Professional Body is required";
    }

    if (!formData.membershipType || formData.membershipType === "") {
      newErrors.membershipType = "Membership Type is required";
    }

    if (!formData.membershipId.trim()) {
      newErrors.membershipId = "Membership ID is required";
    }

    if (!formData.nameOfGradeLevelPosition.trim()) {
      newErrors.nameOfGradeLevelPosition = "Name of the Grade/Level/Position is required";
    }

    if (!formData.category || formData.category === "") {
      newErrors.category = "Category is required";
    }

    if (!formData.validityType || formData.validityType === "") {
      newErrors.validityType = "Validity Type is required";
    }

    // Conditional validation based on Validity Type
    if (formData.validityType === "BIT") {
      if (!formData.apexDocumentProof || formData.apexDocumentProof.length === 0) {
        newErrors.apexDocumentProof = "Apex Document Proof is required";
      }
      if (!formData.amount.trim()) {
        newErrors.amount = "Amount, in Rs. is required";
      } else if (isNaN(formData.amount)) {
        newErrors.amount = "Amount must be a number";
      }
    } else if (formData.validityType === "Others") {
      if (!formData.ifOthers.trim()) {
        newErrors.ifOthers = "Please specify the others";
      }
      if (!formData.amountIfOthers.trim()) {
        newErrors.amountIfOthers = "Amount, in Rs. is required";
      } else if (isNaN(formData.amountIfOthers)) {
        newErrors.amountIfOthers = "Amount must be a number";
      }
    }

    // Document Proof fields are optional now
    // No validation required for document uploads

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        const submitData = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach((key) => {
          if (key !== 'apexDocumentProof' && key !== 'documentProof') {
            submitData.append(key, formData[key]);
          }
        });
        
        // Append files if exists (multiple files support)
        if (formData.apexDocumentProof && formData.apexDocumentProof.length > 0) {
          formData.apexDocumentProof.forEach((file) => {
            submitData.append("apexDocumentProof", file);
          });
        }
        
        if (formData.documentProof && formData.documentProof.length > 0) {
          formData.documentProof.forEach((file) => {
            submitData.append("documentProof", file);
          });
        }

        const response = await fetch(`${API_URL}api/owi/professionalMembership`, {
          method: "POST",
          body: submitData,
          credentials: "include",
        });
        if (response.ok) {
          console.log("Form submitted successfully");
          navigate("/faculty/outside-world-interaction");
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to submit form: ${errorData.error || errorData.details || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert(`Error submitting form: ${error.message || "Unknown error"}`);
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
              Professional Membership Details
            </h1>
            <p className="text-sm text-gray-500">
              Add Professional Membership details
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
                    htmlFor="membershipCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Membership Category <RequiredAst />
                  </label>
                  <select
                    name="membershipCategory"
                    id="membershipCategory"
                    value={formData.membershipCategory}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.membershipCategory ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {membershipCategoryOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.membershipCategory && (
                    <p className="mt-1 text-sm text-red-600">{errors.membershipCategory}</p>
                  )}
                </div>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="taskId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Task ID <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="taskId"
                    id="taskId"
                    value={formData.taskId}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.taskId ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Task ID"
                  />
                  {errors.taskId && (
                    <p className="mt-1 text-sm text-red-600">{errors.taskId}</p>
                  )}
                </div>

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
              </div>

              {formData.specialLabsInvolved === "yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              )}
            </div>

            {/* Membership Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Membership Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nameOfProfessionalBody"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name of the Professional Body <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="nameOfProfessionalBody"
                    id="nameOfProfessionalBody"
                    value={formData.nameOfProfessionalBody}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.nameOfProfessionalBody ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter professional body name"
                  />
                  {errors.nameOfProfessionalBody && (
                    <p className="mt-1 text-sm text-red-600">{errors.nameOfProfessionalBody}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="membershipType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Membership Type <RequiredAst />
                  </label>
                  <select
                    name="membershipType"
                    id="membershipType"
                    value={formData.membershipType}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.membershipType ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {membershipTypeOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.membershipType && (
                    <p className="mt-1 text-sm text-red-600">{errors.membershipType}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="membershipId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Membership ID <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="membershipId"
                    id="membershipId"
                    value={formData.membershipId}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.membershipId ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter membership ID"
                  />
                  {errors.membershipId && (
                    <p className="mt-1 text-sm text-red-600">{errors.membershipId}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="nameOfGradeLevelPosition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name of the Grade/Level/Position <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="nameOfGradeLevelPosition"
                    id="nameOfGradeLevelPosition"
                    value={formData.nameOfGradeLevelPosition}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.nameOfGradeLevelPosition ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter grade/level/position"
                  />
                  {errors.nameOfGradeLevelPosition && (
                    <p className="mt-1 text-sm text-red-600">{errors.nameOfGradeLevelPosition}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <RequiredAst />
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {categoryOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="validityType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Validity Type <RequiredAst />
                  </label>
                  <select
                    name="validityType"
                    id="validityType"
                    value={formData.validityType}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.validityType ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {validityTypeOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.validityType && (
                    <p className="mt-1 text-sm text-red-600">{errors.validityType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Conditional Amount/Details Section based on Validity Type */}
            {(formData.validityType === "BIT" || formData.validityType === "Others") && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  {formData.validityType === "BIT" ? "BIT Sponsored Details" : "Other Details"}
                </h3>
                
                {/* Show Apex Document Proof and Amount only for BIT */}
                {formData.validityType === "BIT" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderFileUpload(
                      "apexDocumentProof",
                      "Apex Document Proof",
                      true,
                      "Upload the apex document proof"
                    )}
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount, in Rs. <RequiredAst />
                      </label>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.amount ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter amount in Rs."
                      />
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Show If Others and Amount only for Others */}
                {formData.validityType === "Others" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="ifOthers"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        If Others, Please Specify <RequiredAst />
                      </label>
                      <input
                        type="text"
                        name="ifOthers"
                        id="ifOthers"
                        value={formData.ifOthers}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.ifOthers ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Please specify"
                      />
                      {errors.ifOthers && (
                        <p className="mt-1 text-sm text-red-600">{errors.ifOthers}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="amountIfOthers"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount, in Rs. <RequiredAst />
                      </label>
                      <input
                        type="number"
                        name="amountIfOthers"
                        id="amountIfOthers"
                        value={formData.amountIfOthers}
                        onChange={handleChange}
                        min="0"
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.amountIfOthers ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter amount in Rs."
                      />
                      {errors.amountIfOthers && (
                        <p className="mt-1 text-sm text-red-600">{errors.amountIfOthers}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Document Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Documents
              </h3>
              <div className="gap-6">
                {renderFileUpload(
                  "documentProof",
                  "Document Proof (Certificate Proof & Apex Proof if applicable)",
                  false,
                  "Upload certificate proof & apex proof (if applicable)"
                )}
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

