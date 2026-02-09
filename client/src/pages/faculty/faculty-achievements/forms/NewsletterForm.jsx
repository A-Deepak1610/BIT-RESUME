import React, {useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {ArrowLeft, Save, UploadCloud, FileText, X} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const MAX_FILE_SIZE_MB = 10;
const SUPPORTED_FORMATS_LABEL = `Supported formats: PDF, PNG, JPG (max ${MAX_FILE_SIZE_MB}MB)`;
const ACCEPT_STRING =
  ".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf";
const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;
// Options
const NEWSLETTER_CATEGORIES = [
  "Choose an option",
  "institution-newsletter",
  "department-newsletter"
];

const DEPARTMENTS = [
  "Click to choose",
  "CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AIDS", "AIML", "CSBS"
];

const ACADEMIC_YEARS = [
  "Select Academic Year",
  "2024-2025", "2023-2024", "2022-2023", "2021-2022", "2020-2021"
];

const ISSUE_MONTHS = [
  "Choose an option",
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const EDITOR_COUNTS = [
  "Choose an option", "1", "2", "3", "4", "5", "6+"
];

// const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function NewsletterForm() {
  const API_URL=import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newsletterCategory: "",
    department: "",
    academicYear: "",
    dateOfPublication: "",
    volumeNumber: "",
    issueNumber: "",
    issueMonth: "",
    facultyEditorCount: "",
    studentEditorCount: "",
    proofDocument: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
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
        setErrors(prev => {
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

const validateForm = () => {
    const newErrors = {};
    if (!formData.newsletterCategory || formData.newsletterCategory === "Choose an option") newErrors.newsletterCategory = "Category is required";
    if (formData.newsletterCategory === "department-newsletter" && (!formData.department || formData.department === "Click to choose")) {
      newErrors.department = "Department is required";
    }
    if (!formData.academicYear || formData.academicYear === "Select Academic Year") newErrors.academicYear = "Academic Year is required";
    if (!formData.dateOfPublication) newErrors.dateOfPublication = "Date is required";
    if (!formData.volumeNumber) newErrors.volumeNumber = "Volume Number is required";
    if (!formData.issueNumber) newErrors.issueNumber = "Issue Number is required";
    if (!formData.issueMonth || formData.issueMonth === "Choose an option") newErrors.issueMonth = "Issue Month is required";
    if (!formData.facultyEditorCount || formData.facultyEditorCount === "Choose an option") newErrors.facultyEditorCount = "Required";
    if (!formData.studentEditorCount || formData.studentEditorCount === "Choose an option") newErrors.studentEditorCount = "Required";
    if (!formData.proofDocument) newErrors.proofDocument = "Proof is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      try {
        const response = await axios.post(`${API_URL}api/faculty/newsLetterFormsPost`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log("Submitting form for:  Newsletter Archive", formData);
          navigate("/faculty/uploadview");
        }
      } catch (error) {
        console.error("Error submitting form", error);
        alert("Failed to submit form. Please try again.");
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
              Add Newsletter Details
            </h1>
            <p className="text-sm text-gray-500">
              Create record for department or institution newsletters
            </p>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

            {/* Category & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="newsletterCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Newsletter Category <RequiredAst />
                </label>
                <select
                  name="newsletterCategory"
                  id="newsletterCategory"
                  value={formData.newsletterCategory}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.newsletterCategory ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {NEWSLETTER_CATEGORIES.map(option => (
                    <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                  ))}
                </select>
                {errors.newsletterCategory && <p className="mt-1 text-sm text-red-600">{errors.newsletterCategory}</p>}
              </div>

              {formData.newsletterCategory === "department-newsletter" && (
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department <RequiredAst />
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    {DEPARTMENTS.map(option => (
                      <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                </div>
              )}
            </div>

            {/* Academic Year & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <RequiredAst />
                </label>
                <select
                  name="academicYear"
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.academicYear ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {ACADEMIC_YEARS.map(option => (
                    <option key={option} value={option} disabled={option === "Select Academic Year"}>{option}</option>
                  ))}
                </select>
                {errors.academicYear && <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>}
              </div>

              <div>
                <label htmlFor="dateOfPublication" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Publication <RequiredAst />
                </label>
                <input
                  type="date"
                  name="dateOfPublication"
                  id="dateOfPublication"
                  value={formData.dateOfPublication}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.dateOfPublication ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.dateOfPublication && <p className="mt-1 text-sm text-red-600">{errors.dateOfPublication}</p>}
              </div>
            </div>

            {/* Volume & Issue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="volumeNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Volume Number <RequiredAst />
                </label>
                <input
                  type="text"
                  name="volumeNumber"
                  id="volumeNumber"
                  value={formData.volumeNumber}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.volumeNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g. 1"
                />
                {errors.volumeNumber && <p className="mt-1 text-sm text-red-600">{errors.volumeNumber}</p>}
              </div>

              <div>
                <label htmlFor="issueNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Number <RequiredAst />
                </label>
                <input
                  type="text"
                  name="issueNumber"
                  id="issueNumber"
                  value={formData.issueNumber}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.issueNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="e.g. 1"
                />
                {errors.issueNumber && <p className="mt-1 text-sm text-red-600">{errors.issueNumber}</p>}
              </div>

              <div>
                <label htmlFor="issueMonth" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Month <RequiredAst />
                </label>
                <select
                  name="issueMonth"
                  id="issueMonth"
                  value={formData.issueMonth}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.issueMonth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {ISSUE_MONTHS.map(option => (
                    <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                  ))}
                </select>
                {errors.issueMonth && <p className="mt-1 text-sm text-red-600">{errors.issueMonth}</p>}
              </div>
            </div>

            {/* Editors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facultyEditorCount" className="block text-sm font-medium text-gray-700 mb-1">
                  No. of Faculty Editor/Coordinator <RequiredAst />
                </label>
                <select
                  name="facultyEditorCount"
                  id="facultyEditorCount"
                  value={formData.facultyEditorCount}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.facultyEditorCount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {EDITOR_COUNTS.map(option => (
                    <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                  ))}
                </select>
                {errors.facultyEditorCount && <p className="mt-1 text-sm text-red-600">{errors.facultyEditorCount}</p>}
              </div>

              <div>
                <label htmlFor="studentEditorCount" className="block text-sm font-medium text-gray-700 mb-1">
                  No. of Student Editor/Coordinator <RequiredAst />
                </label>
                <select
                  name="studentEditorCount"
                  id="studentEditorCount"
                  value={formData.studentEditorCount}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.studentEditorCount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {EDITOR_COUNTS.map(option => (
                    <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                  ))}
                </select>
                {errors.studentEditorCount && <p className="mt-1 text-sm text-red-600">{errors.studentEditorCount}</p>}
              </div>
            </div>

            {/* Document Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proof Document (PDF, JPEG, PNG) <RequiredAst />
              </label>
              <div
                className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${errors.proofDocument
                    ? 'border-red-500'
                    : dragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300'
                  } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <div className="space-y-1 text-center">
                  <UploadCloud className={`mx-auto h-12 w-12 ${dragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="proofDocument"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              {formData.proofDocument && (
                <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                  <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                  <span className="font-medium mr-2 truncate">
                    {formData.proofDocument.name}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({(formData.proofDocument.size / 1024 / 1024).toFixed(2)} MB)
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
              {errors.proofDocument && <p className="mt-1 text-sm text-red-600">{errors.proofDocument}</p>}
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
                className={`px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus: ring-offset-2 focus: ring-blue-500 flex items-center transition-all duration-200 hover:shadow-lg ${isSubmitting ? "opacity-75 cursor-wait" : ""}`}
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                     Save Newsletter
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
