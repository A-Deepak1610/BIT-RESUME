import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../../store/UseAuth";
import { ArrowLeft, Save, UploadCloud, FileText, X } from "lucide-react";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function Faculty_Industry_ProjectsForm() {
  const navigate = useNavigate();
  const { name } = useAuth();
  const [formData, setFormData] = useState({
    faculty: "",
    taskID: "",
    specialLabsInvolved: "Choose an option",
    specialLab: "",

    // Faculty Count
    numberOfFaculty: "0",
    faculty2: "",
    faculty2SIG: "",
    faculty3: "",
    faculty3SIG: "",
    faculty4: "",
    faculty4SIG: "",
    faculty5: "",
    faculty5SIG: "",

    // Students Count
    numberOfStudents: "0",
    student1: "",
    student2: "",
    student3: "",
    student4: "",
    student5: "",

    // Industry & Project Details
    industryName: "",
    typeOfIndustry: "Choose an option",
    othersSpecify: "",
    industryProject: "Choose an option",
    projectTitle: "",
    durationMonths: "",
    startDate: "",
    endDate: "",
    outcome: "",

    // Documents
    industryProjectProof: null,

    owiVerification: "Initiated",
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Auto-fill faculty name from logged-in user
  useEffect(() => {
    if (name) {
      setFormData((prev) => ({ ...prev, faculty: name }));
    }
  }, [name]);

  // Options
  const yesNoOptions = ["Choose an option", "yes", "No"];
  const typeOfIndustryOptions = [
    "Choose an option",
    "MNC",
    "Large Scale",
    "MSME",
    "Small Scale",
    "others",
  ];
  const industryProjectOptions = ["Choose an option", "Product", "Process"];
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
      setFormData((prev) => ({
        ...prev,
        industryProjectProof: e.target.files[0],
      }));
      if (errors.industryProjectProof) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.industryProjectProof;
          return newErrors;
        });
      }
    }
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, industryProjectProof: null }));
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
        industryProjectProof: e.dataTransfer.files[0],
      }));
      if (errors.industryProjectProof) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.industryProjectProof;
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
            typeof formData[key] !== "object"
          ) {
            data.append(key, formData[key]);
          }
        });

        // Append file
        if (formData.industryProjectProof) {
          data.append("industryProjectProof", formData.industryProjectProof);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/faculty/industryProjectPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("Industry Project details submitted successfully!");
          navigate("/faculty/outside-world-interaction");
        }
      } catch (error) {
        console.error("Error submitting Industry Project:", error);
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || "Unknown error";
        alert(`Failed to submit project details: ${errorMessage}`);
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
              Add Faculty Industry Project Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for Faculty Industry Projects
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

            {/* Additional Faculty Members */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Additional Faculty Members
            </h3>
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
                min="0"
                max="4"
                value={formData.numberOfFaculty}
                onChange={handleChange}
                className="mt-1 block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Count (0-4)"
              />
            </div>

            {parseInt(formData.numberOfFaculty) > 0 && (
              <div className="space-y-4">
                {[2, 3, 4, 5]
                  .slice(0, parseInt(formData.numberOfFaculty))
                  .map((num) => (
                    <div
                      key={num}
                      className="bg-gray-50 p-4 rounded-md border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Faculty {num} Name
                          </label>
                          <input
                            type="text"
                            name={`faculty${num}`}
                            value={formData[`faculty${num}`]}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Faculty {num} SIG
                          </label>
                          <input
                            type="text"
                            name={`faculty${num}SIG`}
                            value={formData[`faculty${num}SIG`]}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter SIG"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {/* Students Involved */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Students Involved
            </h3>
            <div>
              <label
                htmlFor="numberOfStudents"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                How many students are involved?
              </label>
              <input
                type="number"
                name="numberOfStudents"
                id="numberOfStudents"
                min="0"
                max="5"
                value={formData.numberOfStudents}
                onChange={handleChange}
                className="mt-1 block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Count (0-5)"
              />
            </div>

            {parseInt(formData.numberOfStudents) > 0 && (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5]
                  .slice(0, parseInt(formData.numberOfStudents))
                  .map((num) => (
                    <div
                      key={num}
                      className="bg-blue-50 p-4 rounded-md border border-blue-200"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student {num}
                        </label>
                        <input
                          type="text"
                          name={`student${num}`}
                          value={formData[`student${num}`]}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter Student Name"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Industry & Project Details */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Industry & Project Information
            </h3>

            <div>
              <label
                htmlFor="industryName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name of the Industry / Organization / Others
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
                  htmlFor="typeOfIndustry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Industry
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
              {formData.typeOfIndustry === "others" && (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="industryProject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Industry Project
                </label>
                <select
                  name="industryProject"
                  id="industryProject"
                  value={formData.industryProject}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {industryProjectOptions.map((option) => (
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
                  htmlFor="durationMonths"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (in months)
                </label>
                <input
                  type="number"
                  name="durationMonths"
                  id="durationMonths"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Duration"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="projectTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title of the Project
              </label>
              <input
                type="text"
                name="projectTitle"
                id="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Project Title"
              />
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
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="outcome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Outcome
              </label>
              <textarea
                name="outcome"
                id="outcome"
                rows={4}
                value={formData.outcome}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe the outcome of the project"
              />
            </div>

            {/* File Upload */}
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Documents
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry Project Proof
                <span className="block text-xs text-gray-500 mt-1">
                  (Approval Letter, Certificate, Project Report, Sample photos,
                  Joint IPR)
                </span>
              </label>
              <div
                className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                  errors.industryProjectProof
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
                        name="industryProjectProof"
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
              {formData.industryProjectProof && (
                <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                  <FileText
                    size={16}
                    className="mr-2 flex-shrink-0 text-indigo-600"
                  />
                  <span className="font-medium mr-2 truncate">
                    {formData.industryProjectProof.name}
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
              {errors.industryProjectProof && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.industryProjectProof}
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
                Save Industry Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
