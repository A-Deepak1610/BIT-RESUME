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

const NEWSLETTER_CATEGORIES = [
  {value: "", label: "Choose an option"},
  {value: "institution-newsletter", label: "Institution Newsletter"},
  {value: "department-newsletter", label: "Department Newsletter"},
];

const DEPARTMENTS = [
  {value: "", label: "Click to choose"},
  {value: "CSE", label: "Computer Science and Engineering"},
  {value: "ECE", label: "Electronics and Communication Engineering"},
  {value: "EEE", label: "Electrical and Electronics Engineering"},
  {value: "MECH", label: "Mechanical Engineering"},
  {value: "CIVIL", label: "Civil Engineering"},
  {value: "IT", label: "Information Technology"},
  {value: "AIDS", label: "Artificial Intelligence and Data Science"},
  {value: "AIML", label: "Artificial Intelligence and Machine Learning"},
  {value: "CSBS", label: "Computer Science and Business Systems"},
];

const ACADEMIC_YEARS = [
  {value: "", label: "Select Academic Year"},
  {value: "2024-2025", label: "2024-2025"},
  {value: "2023-2024", label: "2023-2024"},
  {value: "2022-2023", label: "2022-2023"},
  {value: "2021-2022", label: "2021-2022"},
  {value: "2020-2021", label: "2020-2021"},
];

const ISSUE_MONTHS = [
  {value: "", label: "Choose an option"},
  {value: "January", label: "January"},
  {value: "February", label: "February"},
  {value: "March", label: "March"},
  {value: "April", label: "April"},
  {value: "May", label: "May"},
  {value: "June", label: "June"},
  {value: "July", label: "July"},
  {value: "August", label: "August"},
  {value: "September", label: "September"},
  {value: "October", label: "October"},
  {value: "November", label: "November"},
  {value: "December", label: "December"},
];

const FACULTY_EDITOR_COUNT = [
  {value: "", label: "Choose an option"},
  {value: "1", label: "1"},
  {value: "2", label: "2"},
  {value: "3", label: "3"},
  {value: "4", label: "4"},
  {value: "5", label: "5"},
  {value: "6+", label: "6 or more"},
];

const STUDENT_EDITOR_COUNT = [
  {value: "", label: "Choose an option"},
  {value: "1", label: "1"},
  {value: "2", label: "2"},
  {value: "3", label: "3"},
  {value: "4", label: "4"},
  {value: "5", label: "5"},
  {value: "6+", label: "6 or more"},
];

const InputField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required,
  helperText,
  readOnly = false,
}) => (
  <div className="mb-5">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-gray-800 mb-2"
    >
      {label} {required && <RequiredAst />}
    </label>
    <input
      type={type}
      name={name}
      id={id}
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`block w-full px-4 py-3 border ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus: ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
    {helperText && !error && (
      <p className="mt-1. 5 text-xs text-gray-500">{helperText}</p>
    )}
    {error && (
      <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
    )}
  </div>
);

const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required,
  helperText,
  options = [],
}) => (
  <div className="mb-5">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-gray-800 mb-2"
    >
      {label} {required && <RequiredAst />}
    </label>
    <select
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`block w-full px-4 py-3 border ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {helperText && !error && (
      <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
    )}
    {error && (
      <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
    )}
  </div>
);

const FileUploadField = ({
  id,
  name,
  label,
  onFileSelect,
  selectedFile,
  error,
  required,
  setFormError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (setFormError) setFormError(name, "");
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        if (setFormError)
          setFormError(
            name,
            `File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB. `
          );
        onFileSelect({target: {name, value: null}});
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const acceptedTypes = ACCEPT_STRING.split(",").map((t) =>
        t.trim().toLowerCase()
      );
      const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
      const fileMimeType = file.type.toLowerCase();

      let isValidType =
        acceptedTypes.includes(fileExtension) ||
        acceptedTypes.includes(fileMimeType) ||
        (fileMimeType === "application/pdf" &&
          acceptedTypes.includes(".pdf")) ||
        (fileMimeType === "image/png" &&
          (acceptedTypes.includes("image/png") ||
            acceptedTypes.includes(".png"))) ||
        (fileMimeType === "image/jpeg" &&
          (acceptedTypes.includes("image/jpeg") ||
            acceptedTypes.includes(".jpg") ||
            acceptedTypes.includes(".jpeg")));

      if (!isValidType) {
        if (setFormError)
          setFormError(
            name,
            `Invalid file type. ${SUPPORTED_FORMATS_LABEL.replace(
              `(max ${MAX_FILE_SIZE_MB}MB)`,
              ""
            ).trim()}`
          );
        onFileSelect({target: {name, value: null}});
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      onFileSelect({target: {name, value: file}});
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    } else {
      onFileSelect({target: {name, value: null}});
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
      if (fileInputRef.current)
        fileInputRef.current.files = event.dataTransfer.files;
    }
  };

  const commonDragEvent = (event, enter) => {
    event.preventDefault();
    event.stopPropagation();
    if (enter !== undefined) setIsDragging(enter);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    if (setFormError) setFormError(name, "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect({target: {name, value: null}});
  };

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800 mb-2"
      >
        {label} {required && <RequiredAst />}
      </label>
      <div
        className={`flex flex-col items-center justify-center px-6 py-12 border-2 ${
          error
            ? "border-red-500 bg-red-50"
            : isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        } border-dashed rounded-lg transition-all duration-200 ${
          isDragging ? "" : "hover:border-blue-400 hover:bg-blue-50/50"
        }`}
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={(e) => commonDragEvent(e)}
        onDragEnter={(e) => commonDragEvent(e, true)}
        onDragLeave={(e) => {
          if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
            commonDragEvent(e, false);
          }
        }}
        style={{cursor: "pointer"}}
      >
        <UploadCloud
          className={`mx-auto h-12 w-12 ${
            isDragging ? "text-blue-500" : "text-gray-400"
          } mb-3`}
        />
        <p className="text-sm text-blue-600 hover:text-blue-700 font-semibold mb-1">
          <span className="underline">Click to browse</span> or drag and drop
        </p>
        <input
          id={id}
          name={name}
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          accept={ACCEPT_STRING}
          ref={fileInputRef}
        />
        <p className="text-xs text-gray-500 mt-1">{SUPPORTED_FORMATS_LABEL}</p>
      </div>
      {selectedFile && !error && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
          <span className="truncate flex items-center">
            <FileText
              size={18}
              className="inline mr-2 text-green-600 flex-shrink-0"
            />
            <span className="truncate font-medium" title={selectedFile.name}>
              {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </span>
          <button
            type="button"
            onClick={clearFile}
            className="text-red-500 hover:text-red-700 hover:bg-red-100 ml-3 flex-shrink-0 p-1.5 rounded-md transition-colors"
            title="Remove file"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

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
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: ""}));
    }
  };

  const handleFileSelect = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: ""}));
    }
  };

  const setFormError = (fieldName, errorMessage) => {
    setErrors((prev) => ({...prev, [fieldName]: errorMessage}));
  };

const validateForm = () => {
    const newErrors = {};

    if (!formData.newsletterCategory) {
      newErrors.newsletterCategory = "Newsletter Category is required";
    }

    if (
      formData.newsletterCategory === "department-newsletter" &&
      !formData.department
    ) {
      newErrors.department = "Department is required";
    }

    if (!formData.dateOfPublication) {
      newErrors.dateOfPublication = "Date of Publication is required";
    }

    if (!formData.volumeNumber?.trim()) {
      newErrors.volumeNumber = "Volume Number is required";
    }

    if (!formData.issueNumber?.trim()) {
      newErrors.issueNumber = "Issue Number is required";
    }

    if (!formData.issueMonth) {
      newErrors.issueMonth = "Issue Month is required";
    }

    if (!formData.facultyEditorCount) {
      newErrors.facultyEditorCount =
        "No. of Faculty Editor/Coordinator is required";
    }

    if (!formData.studentEditorCount) {
      newErrors.studentEditorCount =
        "No. of Student Editor/Coordinator is required";
    }

    if (!formData.proofDocument) {
      newErrors.proofDocument = "Proof Document is required";
    }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg: px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="mr-3 p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Newsletter Archive
            </h1>
            <p className="text-sm text-gray-600">
              Fill in the information below to add a new newsletter record to
              the archive
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Newsletter Category */}
              <SelectField
                id="newsletterCategory"
                name="newsletterCategory"
                label="Newsletter Category"
                value={formData.newsletterCategory}
                onChange={handleChange}
                error={errors.newsletterCategory}
                required
                options={NEWSLETTER_CATEGORIES}
              />

              {/* Department - Conditional */}
              {formData.newsletterCategory === "department-newsletter" && (
                <SelectField
                  id="department"
                  name="department"
                  label="Department"
                  value={formData.department}
                  onChange={handleChange}
                  error={errors.department}
                  required
                  options={DEPARTMENTS}
                />
              )}

              {/* Academic Year and Date - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SelectField
                  id="academicYear"
                  name="academicYear"
                  label="Academic Year"
                  value={formData.academicYear}
                  onChange={handleChange}
                  error={errors.academicYear}
                  options={ACADEMIC_YEARS}
                />

                <InputField
                  id="dateOfPublication"
                  name="dateOfPublication"
                  label="Date of Publication"
                  type="date"
                  value={formData.dateOfPublication}
                  onChange={handleChange}
                  error={errors.dateOfPublication}
                  required
                />
              </div>

              {/* Volume, Issue, Month - Three Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  id="volumeNumber"
                  name="volumeNumber"
                  label="Volume Number"
                  type="text"
                  value={formData.volumeNumber}
                  onChange={handleChange}
                  error={errors.volumeNumber}
                  required
                  placeholder="e.g., 1"
                />

                <InputField
                  id="issueNumber"
                  name="issueNumber"
                  label="Issue Number"
                  type="text"
                  value={formData.issueNumber}
                  onChange={handleChange}
                  error={errors.issueNumber}
                  required
                  placeholder="e.g., 1"
                />

                <SelectField
                  id="issueMonth"
                  name="issueMonth"
                  label="Issue Month"
                  value={formData.issueMonth}
                  onChange={handleChange}
                  error={errors.issueMonth}
                  required
                  options={ISSUE_MONTHS}
                />
              </div>

              {/* Editor Counts - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SelectField
                  id="facultyEditorCount"
                  name="facultyEditorCount"
                  label="No. of Faculty Editor/Coordinator"
                  value={formData.facultyEditorCount}
                  onChange={handleChange}
                  error={errors.facultyEditorCount}
                  required
                  options={FACULTY_EDITOR_COUNT}
                />

                <SelectField
                  id="studentEditorCount"
                  name="studentEditorCount"
                  label="No. of Student Editor/Coordinator"
                  value={formData.studentEditorCount}
                  onChange={handleChange}
                  error={errors.studentEditorCount}
                  required
                  options={STUDENT_EDITOR_COUNT}
                />
              </div>

              {/* Proof Document Upload */}
              <FileUploadField
                id="proofDocument"
                name="proofDocument"
                label="Proof Document"
                onFileSelect={handleFileSelect}
                selectedFile={formData.proofDocument}
                error={errors.proofDocument}
                required
                setFormError={setFormError}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 flex items-center justify-end space-x-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
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
