import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  UserCheck,
  Loader2,
} from "lucide-react";
import SpecialLabDropdown from "../components/SpecialLabDropdown";

const API_URL = import.meta.env.VITE_API_URL;
const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function ResourcePersonForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "Choose an option",
    specialLab: "",
    resourcePersonCategory: "Choose an option",
    purposeOfInteraction: "",
    nameOfPanel: "",
    typeOfOrganisation: "Choose an option",
    visitingDepartmentIndustry: "",
    visitingDepartmentInstitute: "",
    organisationNameAndAddress: "",
    numberOfDays: "",
    fromDate: "",
    toDate: "",
    documentProof: null,
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Options
  const specialLabsOptions = ["Choose an option", "Yes", "No"];

  const resourcePersonCategoryOptions = [
    "Choose an option",
    "BoS Member",
    "Chief Guest",
    "Conference Session Chair",
    "DC member",
    "Energy Audit",
    "Examiner - Ph.D Viva voce",
    "External Academic Audit",
    "Internal Academic Audit",
    "Jury Member",
    "Quality Expert",
    "Technical Expert",
    "Thesis Evaluator",
    "Interaction",
    "Panel-Member",
  ];

  const typeOfOrganisationOptions = [
    "Choose an option",
    "Industry",
    "Institute",
  ];

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
      setFormData((prev) => ({ ...prev, documentProof: e.target.files[0] }));
      if (errors.documentProof) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.documentProof;
          return newErrors;
        });
      }
    }
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, documentProof: null }));
  };

  // Drag and drop handlers
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
        documentProof: e.dataTransfer.files[0],
      }));
      if (errors.documentProof) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.documentProof;
          return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.taskID) newErrors.taskID = "Task ID is required";
    if (formData.specialLabsInvolved === "Choose an option")
      newErrors.specialLabsInvolved = "Selection is required";

    // Special Lab required if specialLabsInvolved is "Yes"
    if (formData.specialLabsInvolved === "Yes" && !formData.specialLab) {
      newErrors.specialLab = "Special Lab is required";
    }

    if (formData.resourcePersonCategory === "Choose an option")
      newErrors.resourcePersonCategory = "Resource Person Category is required";

    // Conditional: If Interaction selected, purpose is required
    if (
      formData.resourcePersonCategory === "Interaction" &&
      !formData.purposeOfInteraction
    ) {
      newErrors.purposeOfInteraction = "Purpose of Interaction is required";
    }

    // Conditional: If Panel-Member selected, name of panel is required
    if (
      formData.resourcePersonCategory === "Panel-Member" &&
      !formData.nameOfPanel
    ) {
      newErrors.nameOfPanel = "Name of Panel is required";
    }

    if (formData.typeOfOrganisation === "Choose an option")
      newErrors.typeOfOrganisation = "Type of Organisation is required";

    // Conditional: If Industry, visiting department in industry required
    if (
      formData.typeOfOrganisation === "Industry" &&
      !formData.visitingDepartmentIndustry
    ) {
      newErrors.visitingDepartmentIndustry =
        "Visiting Department in Industry is required";
    }

    // Conditional: If Institute, visiting department in institute required
    if (
      formData.typeOfOrganisation === "Institute" &&
      !formData.visitingDepartmentInstitute
    ) {
      newErrors.visitingDepartmentInstitute =
        "Visiting Department in Institute is required";
    }

    if (!formData.organisationNameAndAddress)
      newErrors.organisationNameAndAddress =
        "Organization Name and Address is required";
    if (!formData.numberOfDays)
      newErrors.numberOfDays = "Number of Days is required";
    if (!formData.fromDate) newErrors.fromDate = "From Date is required";
    if (!formData.toDate) newErrors.toDate = "To Date is required";
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
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("taskID", formData.taskID);
      submitData.append("specialLabsInvolved", formData.specialLabsInvolved);
      submitData.append("specialLab", formData.specialLab || "");
      submitData.append(
        "resourcePersonCategory",
        formData.resourcePersonCategory,
      );
      submitData.append(
        "purposeOfInteraction",
        formData.purposeOfInteraction || "",
      );
      submitData.append("nameOfPanel", formData.nameOfPanel || "");
      submitData.append("typeOfOrganisation", formData.typeOfOrganisation);
      submitData.append(
        "visitingDepartmentIndustry",
        formData.visitingDepartmentIndustry || "",
      );
      submitData.append(
        "visitingDepartmentInstitute",
        formData.visitingDepartmentInstitute || "",
      );
      submitData.append(
        "organisationNameAndAddress",
        formData.organisationNameAndAddress,
      );
      submitData.append("numberOfDays", formData.numberOfDays);
      submitData.append("fromDate", formData.fromDate);
      submitData.append("toDate", formData.toDate);

      if (formData.documentProof) {
        submitData.append("documentProof", formData.documentProof);
      }

      const response = await axios.post(
        `${API_URL}api/faculty/resourcePersonPost`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        alert("Resource Person details submitted successfully!");
        navigate("/faculty/uploadview");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.error || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
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
              Add Resource Person Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for acting as a Resource Person
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Task ID & Special Labs Involved */}
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
                  {specialLabsOptions.map((option) => (
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
            </div>

            {/* Special Lab (conditional on Yes) */}
            {formData.specialLabsInvolved === "Yes" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Lab <RequiredAst />
                </label>
                <SpecialLabDropdown
                  name="specialLab"
                  value={formData.specialLab}
                  onChange={handleChange}
                  error={errors.specialLab}
                />
              </div>
            )}

            {/* Resource Person Category */}
            <div>
              <label
                htmlFor="resourcePersonCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resource Person Category <RequiredAst />
              </label>
              <select
                name="resourcePersonCategory"
                id="resourcePersonCategory"
                value={formData.resourcePersonCategory}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.resourcePersonCategory ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                {resourcePersonCategoryOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    disabled={option === "Choose an option"}
                  >
                    {option}
                  </option>
                ))}
              </select>
              {errors.resourcePersonCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.resourcePersonCategory}
                </p>
              )}
            </div>

            {/* Purpose of Interaction (conditional on Interaction) */}
            {formData.resourcePersonCategory === "Interaction" && (
              <div>
                <label
                  htmlFor="purposeOfInteraction"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mention the Purpose of Interaction <RequiredAst />
                </label>
                <textarea
                  name="purposeOfInteraction"
                  id="purposeOfInteraction"
                  rows="3"
                  value={formData.purposeOfInteraction}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.purposeOfInteraction ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter purpose of interaction"
                ></textarea>
                {errors.purposeOfInteraction && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.purposeOfInteraction}
                  </p>
                )}
              </div>
            )}

            {/* Name of Panel (conditional on Panel-Member) */}
            {formData.resourcePersonCategory === "Panel-Member" && (
              <div>
                <label
                  htmlFor="nameOfPanel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of the Panel <RequiredAst />
                </label>
                <input
                  type="text"
                  name="nameOfPanel"
                  id="nameOfPanel"
                  value={formData.nameOfPanel}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.nameOfPanel ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter name of the panel"
                />
                {errors.nameOfPanel && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nameOfPanel}
                  </p>
                )}
              </div>
            )}

            {/* Type of Organisation */}
            <div>
              <label
                htmlFor="typeOfOrganisation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type of Organisation <RequiredAst />
              </label>
              <select
                name="typeOfOrganisation"
                id="typeOfOrganisation"
                value={formData.typeOfOrganisation}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfOrganisation ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                {typeOfOrganisationOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    disabled={option === "Choose an option"}
                  >
                    {option}
                  </option>
                ))}
              </select>
              {errors.typeOfOrganisation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeOfOrganisation}
                </p>
              )}
            </div>

            {/* Visiting Department in Industry (conditional on Industry) */}
            {formData.typeOfOrganisation === "Industry" && (
              <div>
                <label
                  htmlFor="visitingDepartmentIndustry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Visiting Department in Industry <RequiredAst />
                </label>
                <input
                  type="text"
                  name="visitingDepartmentIndustry"
                  id="visitingDepartmentIndustry"
                  value={formData.visitingDepartmentIndustry}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.visitingDepartmentIndustry ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter visiting department in industry"
                />
                {errors.visitingDepartmentIndustry && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.visitingDepartmentIndustry}
                  </p>
                )}
              </div>
            )}

            {/* Visiting Department in Institute (conditional on Institute) */}
            {formData.typeOfOrganisation === "Institute" && (
              <div>
                <label
                  htmlFor="visitingDepartmentInstitute"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Visiting Department in Institute <RequiredAst />
                </label>
                <input
                  type="text"
                  name="visitingDepartmentInstitute"
                  id="visitingDepartmentInstitute"
                  value={formData.visitingDepartmentInstitute}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.visitingDepartmentInstitute ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter visiting department in institute"
                />
                {errors.visitingDepartmentInstitute && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.visitingDepartmentInstitute}
                  </p>
                )}
              </div>
            )}

            {/* Org Name & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="organisationNameAndAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Organization Name And Address <RequiredAst />
                </label>
                <textarea
                  name="organisationNameAndAddress"
                  id="organisationNameAndAddress"
                  rows="3"
                  value={formData.organisationNameAndAddress}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.organisationNameAndAddress ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Organization Details"
                ></textarea>
                {errors.organisationNameAndAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organisationNameAndAddress}
                  </p>
                )}
              </div>
              <div>
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
                  className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfDays ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g. 2"
                />
                {errors.numberOfDays && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.numberOfDays}
                  </p>
                )}
              </div>
            </div>

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
                Document Proof (PDF - max 2MB) <RequiredAst />
              </label>
              <div
                className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
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
                    PDF, JPG, PNG up to 2MB
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
                      clearFile();
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
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Achievement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
