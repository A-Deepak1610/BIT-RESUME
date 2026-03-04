import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, UploadCloud, FileText, X } from "lucide-react";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";
import DepartmentDropdown from "../../../../components/shared/DepartmentDropdown";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

const API_URL = import.meta.env.VITE_API_URL;

// Purpose of Visit Options
const PURPOSE_OF_VISIT_OPTIONS = [
  "Click to choose",
  "Central Valuation",
  "Flying Squad",
  "Hall invigilator",
  "Practical/Project viva External Examiner",
  "Question Paper Scrutiny",
  "QP Setter",
  "University Representative",
];

// Purposes that require Name of Examination
const EXAMINATION_NAME_PURPOSES = [
  "Central Valuation",
  "University Representative",
];

// Purposes that require Department/Subject of QP
const QP_RELATED_PURPOSES = ["Question Paper Scrutiny", "QP Setter"];

export default function ExternalExaminerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "no",
    specialLab: "",
    collegeName: "",
    instituteAddress: "",
    purposeOfVisit: "",
    nameOfExamination: "",
    departmentOfQP: "",
    subjectOfQP: "",
    documentProof: null,
    numberOfDays: "",
    fromDate: "",
    toDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const isExaminationNamePurpose = EXAMINATION_NAME_PURPOSES.includes(
    formData.purposeOfVisit,
  );
  const isQPRelatedPurpose = QP_RELATED_PURPOSES.includes(
    formData.purposeOfVisit,
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.taskID) newErrors.taskID = "Task ID is required";
    if (formData.specialLabsInvolved === "yes" && !formData.specialLab) {
      newErrors.specialLab = "Special Lab is required";
    }
    if (!formData.collegeName)
      newErrors.collegeName = "Name of College/University is required";
    if (!formData.instituteAddress)
      newErrors.instituteAddress = "Address is required";
    if (
      !formData.purposeOfVisit ||
      formData.purposeOfVisit === "Click to choose"
    ) {
      newErrors.purposeOfVisit = "Purpose of Visit is required";
    }
    // Validate examination name for Central Valuation/University Representative
    if (isExaminationNamePurpose) {
      if (!formData.nameOfExamination)
        newErrors.nameOfExamination = "Name of Examination is required";
    }
    // Validate QP-related fields for QP Setter/Question Paper Scrutiny
    if (isQPRelatedPurpose) {
      if (!formData.departmentOfQP)
        newErrors.departmentOfQP = "Department of QP is required";
      if (!formData.subjectOfQP)
        newErrors.subjectOfQP = "Subject of QP is required";
    }
    if (!formData.documentProof)
      newErrors.documentProof = "Document Proof is required";
    if (!formData.numberOfDays)
      newErrors.numberOfDays = "No. of Days is required";
    if (!formData.fromDate) newErrors.fromDate = "From Date is required";
    if (!formData.toDate) newErrors.toDate = "To Date is required";

    // Check Date logic
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
        data.append("specialLabsInvolved", formData.specialLabsInvolved);
        if (formData.specialLabsInvolved === "yes") {
          data.append("specialLab", formData.specialLab);
        }
        data.append("collegeName", formData.collegeName);
        data.append("instituteAddress", formData.instituteAddress);
        data.append("purposeOfVisit", formData.purposeOfVisit);
        if (isExaminationNamePurpose) {
          data.append("nameOfExamination", formData.nameOfExamination);
        }
        if (isQPRelatedPurpose) {
          data.append("departmentOfQP", formData.departmentOfQP);
          data.append("subjectOfQP", formData.subjectOfQP);
        }
        data.append("documentProof", formData.documentProof);
        data.append("numberOfDays", formData.numberOfDays);
        data.append("fromDate", formData.fromDate);
        data.append("toDate", formData.toDate);

        const response = await axios.post(
          `${API_URL}/api/faculty/externalExaminerPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("External Examiner record submitted successfully");
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
              Add External Examiner Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for External Examiner activities
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
                <div className="mt-2 flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="specialLabsInvolved"
                      value="yes"
                      checked={formData.specialLabsInvolved === "yes"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="specialLabsInvolved"
                      value="no"
                      checked={formData.specialLabsInvolved === "no"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Special Lab Dropdown - conditional */}
            {formData.specialLabsInvolved === "yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="specialLab"
                    className="block text-sm font-medium text-fuchsia-600 mb-1"
                  >
                    Special Lab <RequiredAst />
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
              </div>
            )}

            {/* College & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="collegeName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name of the external College/University <RequiredAst />
                </label>
                <input
                  type="text"
                  name="collegeName"
                  id="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.collegeName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter College Name"
                />
                {errors.collegeName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.collegeName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="instituteAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address of the Institute <RequiredAst />
                </label>
                <input
                  type="text"
                  name="instituteAddress"
                  id="instituteAddress"
                  value={formData.instituteAddress}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.instituteAddress ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter Address"
                />
                {errors.instituteAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.instituteAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Purpose of Visit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="purposeOfVisit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Purpose of Visit <RequiredAst />
                </label>
                <select
                  name="purposeOfVisit"
                  id="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.purposeOfVisit ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {PURPOSE_OF_VISIT_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option === "Click to choose"}
                    >
                      {option}
                    </option>
                  ))}
                </select>
                {errors.purposeOfVisit && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.purposeOfVisit}
                  </p>
                )}
              </div>
            </div>

            {/* Name of Examination - conditional for Central Valuation / University Representative */}
            {isExaminationNamePurpose && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nameOfExamination"
                    className="block text-sm font-medium text-fuchsia-600 mb-1"
                  >
                    Name of Examination <RequiredAst />
                  </label>
                  <input
                    type="text"
                    name="nameOfExamination"
                    id="nameOfExamination"
                    value={formData.nameOfExamination}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.nameOfExamination ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Examination Name"
                  />
                  {errors.nameOfExamination && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nameOfExamination}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* QP Related Fields - conditional for QP Setter / Question Paper Scrutiny */}
            {isQPRelatedPurpose && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="departmentOfQP"
                      className="block text-sm font-medium text-fuchsia-600 mb-1"
                    >
                      Department of QP <RequiredAst />
                    </label>
                    <DepartmentDropdown
                      name="departmentOfQP"
                      id="departmentOfQP"
                      value={formData.departmentOfQP}
                      onChange={handleChange}
                      error={errors.departmentOfQP}
                      placeholder="Select Department"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.departmentOfQP ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.departmentOfQP && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.departmentOfQP}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subjectOfQP"
                      className="block text-sm font-medium text-fuchsia-600 mb-1"
                    >
                      Subject of QP <RequiredAst />
                    </label>
                    <input
                      type="text"
                      name="subjectOfQP"
                      id="subjectOfQP"
                      value={formData.subjectOfQP}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.subjectOfQP ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter Subject"
                    />
                    {errors.subjectOfQP && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subjectOfQP}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Document Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Proof <RequiredAst />
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

            {/* No. of Days & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="numberOfDays"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No. of Days <RequiredAst />
                </label>
                <input
                  type="number"
                  name="numberOfDays"
                  id="numberOfDays"
                  value={formData.numberOfDays}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfDays ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g. 1"
                  min="1"
                />
                {errors.numberOfDays && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.numberOfDays}
                  </p>
                )}
              </div>

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
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center disabled:opacity-50"
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
