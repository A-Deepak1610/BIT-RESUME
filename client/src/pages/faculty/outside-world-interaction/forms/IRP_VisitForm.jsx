import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  Image as ImageIcon,
} from "lucide-react";
import DepartmentDropdown from "../../../../components/shared/DepartmentDropdown";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function IRP_VisitForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    faculty: "",
    sigNumber: "",
    taskID: "",
    specialLabsInvolved: "Choose an option",
    specialLab: "",
    numberOfFaculty: "",
    claimedForFaculty: "",
    claimedForDepartment: "",
    typeOfApproval: "Choose an option",
    isIrpVisitPartOfMou: "Choose an option",
    mouName: "",
    mouPointsDiscussed: "",
    fromDate: "",
    toDate: "",
    modeOfInteraction: "Choose an option",
    purposeOfVisit: "Choose an option",
    amountIncurred: "",
    numberOfIndustry: "",
    apexProof: null,
    geotagPhotos: null,
    irpFormSigned: null,
    consolidatedDocument: null,
    iqacVerification: "Initiated",
  });

  const [errors, setErrors] = useState({});
  const [dragActiveStates, setDragActiveStates] = useState({});

  // Options
  const specialLabsOptions = ["Choose an option", "Yes", "No"];
  const typeOfApprovalOptions = [
    "Choose an option",
    "Apex",
    "Non-Apex",
    "Dean",
    "Principal",
  ];
  const yesNoOptions = ["Choose an option", "Yes", "No"];
  const modeOfInteractionOptions = [
    "Choose an option",
    "Email",
    "Visit to compancy permises",
    "With in BIT",
    "Phone call",
    "others",
  ];
  const purposeOfVisitOptions = [
    "Choose an option",
    "Industry Interaction",
    "Field visit",
    "Exhibition",
    "IECC Planned Activity",
    "Pskill",
  ];
  const iqacVerificationOptions = ["Initiated", "Approved", "Rejected"];

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
    if (!formData.taskID) newErrors.taskID = "Task ID is required";
    if (
      !formData.specialLabsInvolved ||
      formData.specialLabsInvolved === "Choose an option"
    )
      newErrors.specialLabsInvolved = "Selection is required";
    if (formData.specialLabsInvolved === "Yes" && !formData.specialLab)
      newErrors.specialLab = "Special Lab name is required";

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
            key !== "iqacVerification"
          ) {
            data.append(key, formData[key]);
          }
        });

        // Append files
        if (formData.apexProof) data.append("apexProof", formData.apexProof);
        if (formData.irpFormSigned)
          data.append("irpFormSigned", formData.irpFormSigned);
        if (formData.consolidatedDocument)
          data.append("consolidatedDocument", formData.consolidatedDocument);
        if (formData.geotagPhotos)
          data.append("geotagPhotos", formData.geotagPhotos);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}api/faculty/irpVisitPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("IRP Visit details submitted successfully!");
          navigate("/faculty/outside-world-interaction");
        }
      } catch (error) {
        console.error("Error submitting IRP Visit:", error);
        alert("Failed to submit IRP Visit. Please try again.");
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
              Add IRP Visit Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for Intellectual Property Rights visits
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
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
                  htmlFor="sigNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SIG Number
                </label>
                <input
                  type="text"
                  name="sigNumber"
                  id="sigNumber"
                  value={formData.sigNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter SIG Number"
                />
              </div>
            </div>

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
                  htmlFor="numberOfFaculty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No. of Faculty
                </label>
                <input
                  type="number"
                  name="numberOfFaculty"
                  id="numberOfFaculty"
                  value={formData.numberOfFaculty}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Count"
                />
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
              {formData.specialLabsInvolved === "Yes" && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="claimedForFaculty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Claimed for Faculty
                </label>
                <input
                  type="text"
                  name="claimedForFaculty"
                  id="claimedForFaculty"
                  value={formData.claimedForFaculty}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Details"
                />
              </div>
              <div>
                <label
                  htmlFor="claimedForDepartment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Claimed for Department
                </label>
                <DepartmentDropdown
                  name="claimedForDepartment"
                  id="claimedForDepartment"
                  value={formData.claimedForDepartment}
                  onChange={handleChange}
                  placeholder="Select Department"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label
                  htmlFor="isIrpVisitPartOfMou"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Is the IRP visit part of the MoU?
                </label>
                <select
                  name="isIrpVisitPartOfMou"
                  id="isIrpVisitPartOfMou"
                  value={formData.isIrpVisitPartOfMou}
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
            </div>

            {/* Conditional MoU Fields */}
            {formData.isIrpVisitPartOfMou === "Yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md border border-gray-200">
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
                <div>
                  <label
                    htmlFor="mouPointsDiscussed"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Points discussed in relation with the MoU
                  </label>
                  <textarea
                    name="mouPointsDiscussed"
                    id="mouPointsDiscussed"
                    rows={2}
                    value={formData.mouPointsDiscussed}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Points"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="toDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  id="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="modeOfInteraction"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mode of the Interaction
                </label>
                <select
                  name="modeOfInteraction"
                  id="modeOfInteraction"
                  value={formData.modeOfInteraction}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {modeOfInteractionOptions.map((option) => (
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
                  htmlFor="purposeOfVisit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Purpose of Visit
                </label>
                <select
                  name="purposeOfVisit"
                  id="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {purposeOfVisitOptions.map((option) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="amountIncurred"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount Incurred in Rs.
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
                  htmlFor="numberOfIndustry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No. of Industry
                </label>
                <input
                  type="number"
                  name="numberOfIndustry"
                  id="numberOfIndustry"
                  value={formData.numberOfIndustry}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Number"
                />
              </div>
            </div>

            {/* File Uploads */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Documents
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  Proof Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFileInput("apexProof", "Upload Apex Proof")}
                  {renderFileInput("geotagPhotos", "Upload Geotag Photos")}
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  Form Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFileInput(
                    "irpFormSigned",
                    "Upload IRP form duly signed by Industry person",
                  )}
                  {renderFileInput(
                    "consolidatedDocument",
                    "Upload Consolidated Document",
                  )}
                </div>
              </div>
            </div>
            {/* Verification Status */}
            <div>
              <label
                htmlFor="iqacVerification"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                IQAC Verification
              </label>
              <select
                name="iqacVerification"
                id="iqacVerification"
                value={formData.iqacVerification}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {iqacVerificationOptions.map((option) => (
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
                Save IRP Visit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
