import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../store/UseAuth";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  Check,
  Building2,
  Calendar,
  Users,
  Contact,
  ArrowRight
} from "lucide-react";

// --- Constants ---

const PROGRAMMES = [
  { value: "", label: "Select Programme" },
  { value: "UG", label: "UG (Undergraduate)" },
  { value: "PG", label: "PG (Postgraduate)" },
];

const INDUSTRY_TYPES = [
  { value: "", label: "Select Type" },
  { value: "MNC", label: "MNC" },
  { value: "Large Scale", label: "Large Scale" },
  { value: "MSME", label: "MSME" },
  { value: "Small Scale", label: "Small Scale" },
  { value: "Others", label: "Others" },
];

const YEAR_OF_STUDY = [
  { value: "", label: "Select Year" },
  { value: "First", label: "First Year" },
  { value: "Second", label: "Second Year" },
  { value: "Third", label: "Third Year" },
  { value: "Fourth", label: "Fourth Year" },
];

const SOURCES = [
  { value: "", label: "Select Source" },
  { value: "Self", label: "Self" },
  { value: "Department", label: "Department" },
  { value: "Special Lab", label: "Special Lab" },
  { value: "Institute", label: "Institute" },
];

const OWI_STATUS = [
  { value: "", label: "Select Status" },
  { value: "Initiated", label: "Initiated" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

// Placeholder Data
const FACULTY_LIST = [
  { value: "", label: "Select Faculty" },
  { value: "FAC001", label: "Dr. Smith (CSE)" },
  { value: "FAC002", label: "Prof. Johnson (ECE)" },
  { value: "FAC003", label: "Dr. Williams (MECH)" },
];

// --- Reusable Components ---

const RequiredAst = () => <span className="text-red-500 ml-1">*</span>;

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6 border-b border-gray-100 pb-2">
    <div className="flex items-center text-primary-600 mb-1">
      {Icon && <Icon size={20} className="mr-2 text-indigo-600" />}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {subtitle && <p className="text-sm text-gray-500 ml-7">{subtitle}</p>}
  </div>
);

const InputField = ({ label, name, value, onChange, placeholder, type = "text", required, error, disabled }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"}
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
        }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3, required, error, disabled }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"}
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required, error, disabled }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 h-10 border ${error ? "border-red-500" : "border-gray-300"}
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white transition-colors ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        }`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const FileUpload = React.forwardRef(({ label, name, files, onFilesSelect, error, required, disabled }, ref) => {
  const internalRef = React.useRef(null);

  // Use external ref if provided, otherwise use internal ref
  const fileInputRef = ref || internalRef;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(name, Array.from(e.target.files));
    }
  };

  const clearFile = (index = null) => {
    if (index !== null && files && files.length > 0) {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      onFilesSelect(name, newFiles);
    } else {
      onFilesSelect(name, []);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <RequiredAst />}
      </label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors bg-white ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "hover:border-indigo-500 cursor-pointer border-gray-300"}`}>
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 justify-center">
            <label className={`relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none ${disabled ? "cursor-not-allowed" : ""}`}>
              <span>Upload files</span>
              <input
                ref={fileInputRef}
                type="file"
                name={name}
                className="sr-only"
                onChange={handleFileChange}
                multiple
                disabled={disabled}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
                    <p className="text-xs text-gray-500">ex : PDF, PNG, JPG up to 10MB</p>
        </div>
      </div>
      {files && files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-indigo-50 rounded-md border border-indigo-100">
              <div className="flex items-center">
                <FileText size={16} className="text-indigo-600 mr-2" />
                <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-gray-400 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => clearFile(index)}
                disabled={disabled}
                className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

// --- Steps Components ---

const Step1_IndustryDetails = React.forwardRef(({ formData, handleChange, errors }, ref) => (
  <div className="space-y-6 animate-fadeIn">
    <SectionTitle icon={Building2} title="Industry & Organization Details" subtitle="Details about the organization for the visit." />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Name of the Industry" name="industryName" value={formData.industryName} onChange={handleChange} required error={errors.industryName} placeholder="Enter Industry Name" />
      <div>
        <SelectField label="Type of Industry" name="industryType" value={formData.industryType} onChange={handleChange} options={INDUSTRY_TYPES} required error={errors.industryType} />
        {formData.industryType === "Others" && (
          <div className="animate-fadeIn">
            <InputField label="Please Specify" name="industryTypeOther" value={formData.industryTypeOther} onChange={handleChange} required={formData.industryType === "Others"} error={errors.industryTypeOther} placeholder="Specify industry type" />
          </div>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Domain Area of the Industry" name="domainArea" value={formData.domainArea} onChange={handleChange} required error={errors.domainArea} placeholder="e.g., AI/ML, Finance" />
      <InputField label="Industry Website" name="industryWebsite" value={formData.industryWebsite} onChange={handleChange} placeholder="https://www.example.com" />
    </div>

    <TextAreaField label="Location" name="industryLocation" value={formData.industryLocation} onChange={handleChange} required error={errors.industryLocation} placeholder="Full address of the industry" rows={3} />

    <div className="border-t border-gray-100 pt-6 mt-6">
       <SectionTitle icon={Contact} title="Industry Contact Person" subtitle="Primary contact at the organization." />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Name of the Contact Person" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} required error={errors.contactPersonName} placeholder="Contact Person Name" />
          <InputField label="Designation" name="contactPersonDesignation" value={formData.contactPersonDesignation} onChange={handleChange} required error={errors.contactPersonDesignation} placeholder="Job Title" />
          <InputField label="E-mail ID" name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleChange} type="email" required error={errors.contactPersonEmail} placeholder="email@company.com" />
          <InputField label="Phone Number" name="contactPersonPhone" value={formData.contactPersonPhone} onChange={handleChange} required error={errors.contactPersonPhone} placeholder="10-digit Phone Number" />
       </div>
    </div>
  </div>
));

const Step2_VisitDetails = React.forwardRef(({ formData, handleChange, handleFileSelect, errors, faculty2Selected, setFaculty2Selected, faculty3Selected, setFaculty3Selected }, ref) => (
  <div className="space-y-6 animate-fadeIn">
    <SectionTitle icon={Calendar} title="Visit Information" subtitle="Dates and academic details." />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Start Date" name="visitStartDate" value={formData.visitStartDate} onChange={handleChange} type="date" required error={errors.visitStartDate} />
      <InputField label="End Date" name="visitEndDate" value={formData.visitEndDate} onChange={handleChange} type="date" required error={errors.visitEndDate} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <SelectField label="Programme" name="programme" value={formData.programme} onChange={handleChange} options={PROGRAMMES} required error={errors.programme} />
      <SelectField label="Year of Study" name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} options={YEAR_OF_STUDY} required error={errors.yearOfStudy} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <InputField label="Number of Students Visited" name="numberOfStudents" value={formData.numberOfStudents} onChange={handleChange} type="number" required error={errors.numberOfStudents} placeholder="Total" />
      <InputField label="No. of Male students" name="maleStudents" value={formData.maleStudents} onChange={handleChange} type="number" placeholder="Male count" />
      <InputField label="No. of Female students" name="femaleStudents" value={formData.femaleStudents} onChange={handleChange} type="number" placeholder="Female count" />
    </div>

    <TextAreaField label="Purpose of Visit" name="purposeOfVisit" value={formData.purposeOfVisit} onChange={handleChange} required error={errors.purposeOfVisit} rows={3} placeholder="Objective of the industrial visit" />

    {/* Faculty Logic */}
    <div className="border-t border-gray-100 pt-6 mt-6">
       <SectionTitle icon={Users} title="Faculty Co-ordinators" subtitle="Faculty members involved in the visit." />

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Faculty 1" name="faculty1" value={formData.faculty1} onChange={handleChange} required error={errors.faculty1} placeholder="Enter name" />
          
          <FacultyCard 
            label="Faculty 2" 
            name="faculty2" 
            value={formData.faculty2} 
            onChange={handleChange} 
            isSelected={faculty2Selected} 
            onToggle={() => setFaculty2Selected(!faculty2Selected)}
            placeholder="Enter faculty 2 name"
            error={errors.faculty2}
          />
          
          <FacultyCard 
            label="Faculty 3" 
            name="faculty3" 
            value={formData.faculty3} 
            onChange={handleChange} 
            isSelected={faculty3Selected} 
            onToggle={() => setFaculty3Selected(!faculty3Selected)}
            placeholder="Enter faculty 3 name"
            error={errors.faculty3}
            disabled={!faculty2Selected}
          />
       </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SelectField label="Source of Arrangement" name="sourceOfArrangement" value={formData.sourceOfArrangement} onChange={handleChange} options={SOURCES} required error={errors.sourceOfArrangement} />
      
    </div>

    <TextAreaField label="Curriculum Mapping" name="curriculumMapping" value={formData.curriculumMapping} onChange={handleChange} placeholder="Mention course code & Name (e.g., 21CSE301 - Machine Learning)" />
    <TextAreaField label="Outcome of the visit" name="outcomeOfVisit" value={formData.outcomeOfVisit} onChange={handleChange} required error={errors.outcomeOfVisit} placeholder="Describe the outcomes" />

    <FileUpload
      ref={ref}
      label="Proof (IV Approval Letter / Approval from Institute / IV Report / Student feedback)"
      name="proofDocument"
      files={formData.proofDocument}
      onFilesSelect={handleFileSelect}
      required
      error={errors.proofDocument}
    />
  <SelectField label="OWI Verification" name="owiVerification" value={formData.owiVerification} onChange={handleChange} options={OWI_STATUS} required error={errors.owiVerification} />
  </div>
));

// --- Faculty Card Component ---

const FacultyCard = ({ label, name, value, onChange, isSelected, onToggle, placeholder, error, disabled }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div 
      onClick={!disabled ? onToggle : undefined}
      className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
        disabled 
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60" 
          : isSelected 
            ? "border-indigo-500 bg-indigo-50 shadow-sm" 
            : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${disabled ? "text-gray-400" : isSelected ? "text-indigo-700" : "text-gray-600"}`}>
          {isSelected ? "✓ Selected - Enter Faculty Name" : "Click to Select Faculty"}
        </span>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          disabled 
            ? "border-gray-300" 
            : isSelected 
              ? "border-indigo-500 bg-indigo-500" 
              : "border-gray-300"
        }`}>
          {isSelected && !disabled && <Check size={12} className="text-white" />}
        </div>
      </div>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        disabled={disabled || !isSelected}
        placeholder={placeholder || "Enter faculty name"}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
          disabled || !isSelected
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-900 border-gray-300"
        }`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// --- Main Component ---

const STEPS = [
  { title: "Industry Details", component: Step1_IndustryDetails, icon: Building2 },
  { title: "Visit Details", component: Step2_VisitDetails, icon: Calendar },
];

export default function StudentsIndustrialVisitForm() {
  const navigate = useNavigate();
  const { name } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [faculty2Selected, setFaculty2Selected] = useState(false);
  const [faculty3Selected, setFaculty3Selected] = useState(false);
  
  // Stable ref for file input - persists across re-renders
  const fileInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    // Step 1
    faculty: "",
    sigNumber: "",
    taskId: "",
    programme: "",
    industryName: "",
    domainArea: "",
    industryType: "",
    industryTypeOther: "",
    industryLocation: "",
    industryWebsite: "",
    contactPersonName: "",
    contactPersonDesignation: "",
    contactPersonEmail: "",
    contactPersonPhone: "",

    // Step 2
    visitStartDate: "",
    visitEndDate: "",
    yearOfStudy: "",
    numberOfStudents: "",
    maleStudents: "",
    femaleStudents: "",
    purposeOfVisit: "",
    faculty2Status: "",
    faculty3Status: "",
    faculty1: "",
    faculty2: "",
    faculty3: "",
    sourceOfArrangement: "",
    curriculumMapping: "",
    outcomeOfVisit: "",
    owiVerification: "",
    proofDocument: []
  });

  // Auto-fill faculty name from logged-in user
  useEffect(() => {
    if (name) {
      setFormData((prev) => ({ ...prev, faculty: name }));
    }
  }, [name]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }, [errors]);

  const handleFileSelect = useCallback((name, files) => {
    setFormData(prev => ({ ...prev, [name]: files }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }, [errors]);

  const validateStep = (stepIndex) => {
    const newErrors = {};
    const d = formData;

    if (stepIndex === 0) {
      if (!d.industryName) newErrors.industryName = "Required";
      if (!d.industryType) newErrors.industryType = "Required";
      if (d.industryType === "Others" && !d.industryTypeOther) newErrors.industryTypeOther = "Required";
      if (!d.domainArea) newErrors.domainArea = "Required";
      if (!d.industryLocation) newErrors.industryLocation = "Required";
      if (!d.contactPersonName) newErrors.contactPersonName = "Required";
      if (!d.contactPersonDesignation) newErrors.contactPersonDesignation = "Required";
      if (!d.contactPersonEmail) newErrors.contactPersonEmail = "Required";
      if (!d.contactPersonPhone) newErrors.contactPersonPhone = "Required";
    }

    if (stepIndex === 1) {
      if (!d.visitStartDate) newErrors.visitStartDate = "Required";
      if (!d.visitEndDate) newErrors.visitEndDate = "Required";
      if (!d.programme) newErrors.programme = "Required";
      if (!d.yearOfStudy) newErrors.yearOfStudy = "Required";
      if (!d.numberOfStudents) newErrors.numberOfStudents = "Required";
      if (!d.purposeOfVisit) newErrors.purposeOfVisit = "Required";
      if (!d.faculty1) newErrors.faculty1 = "Required";
      if (!d.sourceOfArrangement) newErrors.sourceOfArrangement = "Required";
      if (!d.outcomeOfVisit) newErrors.outcomeOfVisit = "Required";
      if (!d.owiVerification) newErrors.owiVerification = "Required";
      if (!d.proofDocument || d.proofDocument.length === 0) newErrors.proofDocument = "Proof document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        const submitData = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach((key) => {
          if (key !== 'proofDocument') {
            submitData.append(key, formData[key]);
          }
        });
        
        // Append files if exists (multiple files support)
        if (formData.proofDocument && formData.proofDocument.length > 0) {
          formData.proofDocument.forEach((file) => {
            submitData.append("proofDocument", file);
          });
        }

        const response = await fetch(`${API_URL}/api/owi/studentsIndustrialVisit`, {
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

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students Industrial Visit</h1>
            <p className="text-sm text-gray-500">Add details for the industrial visit.</p>
          </div>
        </div>

        {/* Wizard Progress - Horizontal for Desktop */}
        <div className="mb-8 hidden md:block">
          <div className="flex items-center justify-center relative px-2">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={idx} className="flex flex-col items-center bg-gray-50 px-32">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200
                      ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' :
                      isCurrent ? 'bg-white border-indigo-600 text-indigo-600' : 'bg-white border-gray-300 text-gray-300'}`}>
                    {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                  </div>
                  <span className={`text-xs font-medium mt-2 ${isCurrent ? 'text-indigo-600' : 'text-gray-500'}`}>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="md:hidden mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <span className="font-medium text-gray-900">{STEPS[currentStep].title}</span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Step {currentStep + 1} of {STEPS.length}</span>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 min-h-[400px]">
            <CurrentStepComponent 
              ref={fileInputRef}
              formData={formData} 
              handleChange={handleChange} 
              handleFileSelect={handleFileSelect} 
              errors={errors} 
              faculty2Selected={faculty2Selected} 
              setFaculty2Selected={setFaculty2Selected} 
              faculty3Selected={faculty3Selected} 
              setFaculty3Selected={setFaculty3Selected} 
            />
          </form>

          {/* Footer Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg border text-sm font-medium transition-colors ${currentStep === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm'}`}
            >
              Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center"
              >
                Next <ArrowRight size={16} className="ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 shadow-sm transition-colors flex items-center"
              >
                <Save size={18} className="mr-2" /> Submit Record
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

