import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  Building2,
  User,
  Briefcase,
  Calendar,
  Award,
  Globe,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  CheckSquare,
  Ruler,
  GraduationCap,
  Target,
  ClipboardList,
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function LaboratoryByIndustryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    faculty: "",
    sigNumber: "",
    taskId: "",
    nameOfLaboratory: "",
    collaborativeIndustry: "",
    domainAreaOfIndustry: "",
    laboratoryArea: "",
    totalAmountIncurred: "",
    bitContribution: "",
    financialSupportFromIndustry: "",
    equipmentSponsored: "",
    equipmentEnhancement: "",
    layoutDesignEnhancement: "",
    curriculumMapping: "",
    expectedOutcomes: "",
    proofDocument: [],
    owiVerification: "",
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // OWI Verification options
  const owiVerificationOptions = [
    { value: "", label: "Choose an option" },
    { value: "Initiated", label: "Initiated" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
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
        [fieldName]: [...prev[fieldName], ...Array.from(e.target.files)],
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
    e.target.value = "";
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

      return { ...prev, [fieldName]: [] };
    });
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...Array.from(e.dataTransfer.files)],
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

    if (!formData.faculty.trim()) {
      newErrors.faculty = "Faculty is required";
    }

    if (!formData.sigNumber.trim()) {
      newErrors.sigNumber = "SIG Number is required";
    }

    if (!formData.taskId.trim()) {
      newErrors.taskId = "Task ID is required";
    }

    if (!formData.nameOfLaboratory.trim()) {
      newErrors.nameOfLaboratory = "Name of the Laboratory is required";
    }

    if (!formData.collaborativeIndustry.trim()) {
      newErrors.collaborativeIndustry = "Collaborative Industry is required";
    }

    if (!formData.domainAreaOfIndustry.trim()) {
      newErrors.domainAreaOfIndustry =
        "Domain area of the industry is required";
    }

    if (!formData.laboratoryArea.trim()) {
      newErrors.laboratoryArea = "Laboratory Area in Sq.m is required";
    } else if (
      isNaN(formData.laboratoryArea) ||
      parseFloat(formData.laboratoryArea) <= 0
    ) {
      newErrors.laboratoryArea = "Please enter a valid number";
    }

    if (!formData.totalAmountIncurred.trim()) {
      newErrors.totalAmountIncurred = "Total Amount Incurred is required";
    } else if (
      isNaN(formData.totalAmountIncurred) ||
      parseFloat(formData.totalAmountIncurred) < 0
    ) {
      newErrors.totalAmountIncurred = "Please enter a valid number";
    }

    if (!formData.bitContribution.trim()) {
      newErrors.bitContribution = "BIT Contribution is required";
    } else if (
      isNaN(formData.bitContribution) ||
      parseFloat(formData.bitContribution) < 0
    ) {
      newErrors.bitContribution = "Please enter a valid number";
    }

    if (
      formData.financialSupportFromIndustry &&
      isNaN(formData.financialSupportFromIndustry)
    ) {
      newErrors.financialSupportFromIndustry = "Please enter a valid number";
    }

    if (!formData.equipmentSponsored.trim()) {
      newErrors.equipmentSponsored =
        "Equipment sponsored information is required";
    }

    if (!formData.equipmentEnhancement.trim()) {
      newErrors.equipmentEnhancement =
        "Equipment enhancement information is required";
    }

    if (!formData.layoutDesignEnhancement.trim()) {
      newErrors.layoutDesignEnhancement =
        "Layout design / enhancement information is required";
    }

    if (!formData.curriculumMapping.trim()) {
      newErrors.curriculumMapping = "Curriculum Mapping is required";
    }

    if (!formData.expectedOutcomes.trim()) {
      newErrors.expectedOutcomes = "Expected Outcomes is required";
    }

    if (!formData.proofDocument || formData.proofDocument.length === 0) {
      newErrors.proofDocument =
        "Proof document is required (Bills & Invoices, Sample training/equipment sponsored, Photographs, Approval Letter from the Institute)";
    }

    if (!formData.owiVerification || formData.owiVerification === "") {
      newErrors.owiVerification = "OWI Verification status is required";
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

        // Append all text fields
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && key !== "proofDocument") {
            submitData.append(key, formData[key]);
          }
        });

        // Append files if exists (multiple files support)
        if (formData.proofDocument && formData.proofDocument.length > 0) {
          formData.proofDocument.forEach((file) => {
            submitData.append("proofDocument", file);
          });
        }

        const response = await fetch(`${API_URL}api/owi/laboratoryByIndustry`, {
          method: "POST",
          body: submitData,
          credentials: "include",
        });

        if (response.ok) {
          console.log("Form submitted successfully");
          navigate("/faculty/outside-world-interaction");
        } else {
          const errorData = await response.json();
          console.error("Submission failed:", errorData);
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
              Laboratory by Industry
            </h1>
            <p className="text-sm text-gray-500">
              Add Laboratory setup details by Industry collaboration
            </p>
          </div>
        </div>

        {/* Form Details */}
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.faculty}
                    </p>
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.sigNumber}
                    </p>
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
              </div>
            </div>

            {/* Laboratory Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Laboratory Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nameOfLaboratory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name of the Laboratory <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="nameOfLaboratory"
                    id="nameOfLaboratory"
                    value={formData.nameOfLaboratory}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.nameOfLaboratory
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter laboratory name"
                  />
                  {errors.nameOfLaboratory && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nameOfLaboratory}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="collaborativeIndustry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Collaborative Industry <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="collaborativeIndustry"
                    id="collaborativeIndustry"
                    value={formData.collaborativeIndustry}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.collaborativeIndustry
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter industry name"
                  />
                  {errors.collaborativeIndustry && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.collaborativeIndustry}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="domainAreaOfIndustry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Domain area of the industry <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="domainAreaOfIndustry"
                    id="domainAreaOfIndustry"
                    value={formData.domainAreaOfIndustry}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.domainAreaOfIndustry
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., AI/ML, Data Science, IoT"
                  />
                  {errors.domainAreaOfIndustry && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.domainAreaOfIndustry}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="laboratoryArea"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Laboratory Area in Sq.m <RequiredAst />
                  </label>
                  <input
                    type="number"
                    name="laboratoryArea"
                    id="laboratoryArea"
                    value={formData.laboratoryArea}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.laboratoryArea
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., 100"
                  />
                  {errors.laboratoryArea && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.laboratoryArea}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="totalAmountIncurred"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Total Amount Incurred (in Rs.) <RequiredAst />
                  </label>
                  <input
                    type="number"
                    name="totalAmountIncurred"
                    id="totalAmountIncurred"
                    value={formData.totalAmountIncurred}
                    onChange={handleChange}
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.totalAmountIncurred
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., 500000"
                  />
                  {errors.totalAmountIncurred && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.totalAmountIncurred}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="bitContribution"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    BIT Contribution (in Rs.) <RequiredAst />
                  </label>
                  <input
                    type="number"
                    name="bitContribution"
                    id="bitContribution"
                    value={formData.bitContribution}
                    onChange={handleChange}
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.bitContribution
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., 250000"
                  />
                  {errors.bitContribution && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bitContribution}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="financialSupportFromIndustry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Financial support from Industry (in Rs.)
                  </label>
                  <input
                    type="number"
                    name="financialSupportFromIndustry"
                    id="financialSupportFromIndustry"
                    value={formData.financialSupportFromIndustry}
                    onChange={handleChange}
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.financialSupportFromIndustry
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="e.g., 250000"
                  />
                  {errors.financialSupportFromIndustry && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.financialSupportFromIndustry}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Equipment & Infrastructure */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Equipment & Infrastructure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="equipmentSponsored"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Any equipment sponsored <RequiredAst />
                  </label>
                  <textarea
                    name="equipmentSponsored"
                    id="equipmentSponsored"
                    value={formData.equipmentSponsored}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.equipmentSponsored
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="List any equipment sponsored by the industry"
                  />
                  {errors.equipmentSponsored && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.equipmentSponsored}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="equipmentEnhancement"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Any equipment enhancement <RequiredAst />
                  </label>
                  <textarea
                    name="equipmentEnhancement"
                    id="equipmentEnhancement"
                    value={formData.equipmentEnhancement}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.equipmentEnhancement
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Describe any equipment enhancements"
                  />
                  {errors.equipmentEnhancement && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.equipmentEnhancement}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="layoutDesignEnhancement"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Layout design / enhancement <RequiredAst />
                </label>
                <textarea
                  name="layoutDesignEnhancement"
                  id="layoutDesignEnhancement"
                  value={formData.layoutDesignEnhancement}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.layoutDesignEnhancement
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Describe the layout design or enhancements made"
                />
                {errors.layoutDesignEnhancement && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.layoutDesignEnhancement}
                  </p>
                )}
              </div>
            </div>

            {/* Curriculum & Outcomes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                Curriculum & Outcomes
              </h3>
              <div>
                <label
                  htmlFor="curriculumMapping"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Curriculum Mapping (mention the course code & Name) for newly
                  set laboratories <RequiredAst />
                </label>
                <textarea
                  name="curriculumMapping"
                  id="curriculumMapping"
                  value={formData.curriculumMapping}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.curriculumMapping
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g., CS301 - Data Structures Lab, CS401 - Machine Learning Lab"
                />
                {errors.curriculumMapping && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.curriculumMapping}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="expectedOutcomes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expected Outcomes <RequiredAst />
                </label>
                <textarea
                  name="expectedOutcomes"
                  id="expectedOutcomes"
                  value={formData.expectedOutcomes}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.expectedOutcomes
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Describe the expected outcomes of the laboratory"
                />
                {errors.expectedOutcomes && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expectedOutcomes}
                  </p>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Documents
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proof : (Bills & Invoices, Sample training/equipment
                  sponsored, Photographs, Approval Letter from the Institute){" "}
                  <RequiredAst />
                </label>
                <div
                  className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                    errors.proofDocument
                      ? "border-red-500"
                      : dragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                  } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                  onDragEnter={(e) => handleDrag(e, setDragActive)}
                  onDragLeave={(e) => handleDrag(e, setDragActive)}
                  onDragOver={(e) => handleDrag(e, setDragActive)}
                  onDrop={(e) => handleDrop(e, "proofDocument", setDragActive)}
                  onClick={() => openFileDialog("proofDocument")}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud
                      className={`mx-auto h-12 w-12 ${
                        dragActive ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                    <div className="flex text-sm text-gray-600">
                      <span className="cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        Upload files
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  ref={(el) => (fileInputRefs.current["proofDocument"] = el)}
                  id="proof-upload"
                  name="proofDocument"
                  type="file"
                  style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "proofDocument")}
                />
                {formData.proofDocument &&
                  formData.proofDocument.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {formData.proofDocument.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200"
                        >
                          <FileText
                            size={16}
                            className="mr-2 flex-shrink-0 text-indigo-600"
                          />
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
                              clearFile("proofDocument", index);
                            }}
                            className="ml-auto text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                {errors.proofDocument && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.proofDocument}
                  </p>
                )}
              </div>
            </div>

            {/* OWI Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                OWI Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="owiVerification"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    OWI Verification Status <RequiredAst />
                  </label>
                  <select
                    name="owiVerification"
                    id="owiVerification"
                    value={formData.owiVerification}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 h-10 border ${
                      errors.owiVerification
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {owiVerificationOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.owiVerification && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.owiVerification}
                    </p>
                  )}
                </div>
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
