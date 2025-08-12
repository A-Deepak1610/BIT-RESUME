import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios'; // Added for API calls
import {
  ChevronLeft, Loader2, X, Check, CheckCircle,
  FileText, Users, Lightbulb, Info, Upload, // Standard Icons
  Briefcase, CalendarDays, Sparkles, // Internship Specific Icons (LinkIcon removed as githubLink removed)
  Award, MessageSquare, Target, AlertTriangle, UserCheck, UserPlus, Building, Type
} from 'lucide-react';


import useAuth from '../../../store/UseAuth';


const DEBUG_MODE = true;


const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_FORMATS_LABEL = `Supported formats: PDF, PNG, JPG (max ${MAX_FILE_SIZE_MB}MB)`;
const ACCEPT_STRING = ".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf";


const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;


const FileUploadField = ({
  id,
  name,
  label,
  onFileSelect,
  selectedFile,
  error,
  helperText,
  required,
  setFormError,
  py = "py-10",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);


  const processFile = (file) => {
    if (setFormError) setFormError(name, '');


    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        if (setFormError) setFormError(name, `File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB.`);
        else if (DEBUG_MODE) console.error(`File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB.`);
        onFileSelect({ target: { name, value: null } });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }


      const acceptedTypes = ACCEPT_STRING.split(',').map(t => t.trim().toLowerCase());
      const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
      const fileMimeType = file.type.toLowerCase();


      let isValidType = acceptedTypes.includes(fileExtension) ||
                        acceptedTypes.includes(fileMimeType) ||
                        (fileMimeType === 'application/pdf' && acceptedTypes.includes('.pdf')) ||
                        (fileMimeType === 'image/png' && (acceptedTypes.includes('image/png') || acceptedTypes.includes('.png'))) ||
                        (fileMimeType === 'image/jpeg' && (acceptedTypes.includes('image/jpeg') || acceptedTypes.includes('.jpg') || acceptedTypes.includes('.jpeg')));




      if (!isValidType) {
        if (setFormError) setFormError(name, `Invalid file type. ${SUPPORTED_FORMATS_LABEL.replace(`(max ${MAX_FILE_SIZE_MB}MB)`,'').trim()}`);
        else if (DEBUG_MODE) console.error(`Invalid file type. ${SUPPORTED_FORMATS_LABEL.replace(`(max ${MAX_FILE_SIZE_MB}MB)`,'').trim()}`);
        onFileSelect({ target: { name, value: null } });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      onFileSelect({ target: { name, value: file } });
    }
  };


  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    } else {
      onFileSelect({ target: { name, value: null } });
    }
  };


  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
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
    if (setFormError) setFormError(name, '');
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect({ target: { name, value: null } });
  };


  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <RequiredAst />}
      </label>
      <div
        className={`mt-1 flex flex-col items-center justify-center px-6 ${py} border-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        } border-dashed rounded-md transition-colors duration-150 ${
          isDragging ? 'bg-indigo-50 border-indigo-500' : 'bg-white hover:border-gray-400'
        }`}
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={(e) => commonDragEvent(e)}
        onDragEnter={(e) => commonDragEvent(e, true)}
        onDragLeave={(e) => {
            if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
                commonDragEvent(e, false)
            }
        }}
        style={{ cursor: 'pointer' }}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
          Drag & drop your file or <span className="underline">browse files</span>
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
        <div className="mt-2 flex items-center justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-200">
          <span className="truncate flex items-center">
            <FileText size={16} className="inline mr-2 text-gray-500 flex-shrink-0" />
            <span className="truncate" title={selectedFile.name}>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
          </span>
          <button type="button" onClick={clearFile} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0 p-1">
            <X size={18} />
          </button>
        </div>
      )}
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};




// --- Input Field Component (Unchanged) ---
const InputField = ({ id, name, label, value, onChange, error, placeholder, type = "text", required, helperText, readOnly = false, className = "" }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
    {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


// --- Textarea Field Component (Unchanged) ---
const TextareaField = ({ id, name, label, value, onChange, error, placeholder, rows = 3, required, helperText }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <textarea
      name={name}
      id={id}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
    />
    {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


// --- Checkbox Field Component (Unchanged) ---
const CheckboxField = ({ id, name, label, checked, onChange, description }) => (
  <div className="relative flex items-start">
    <div className="flex items-center h-5">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="focus:outline-none focus:ring-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor={id} className="font-medium text-gray-700">
        {label}
      </label>
      {description && <p className="text-gray-500 text-xs">{description}</p>}
    </div>
  </div>
);


// --- Select Field Component (Unchanged) ---
const SelectField = ({ id, name, label, value, onChange, error, required, helperText, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
    >
      {children}
    </select>
    {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


// --- Section Header Component (Unchanged) ---
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center mb-6 pt-4">
    {Icon && <Icon className="h-6 w-6 text-indigo-600 mr-3" />}
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
  </div>
);




// --- Validation Functions for Internship (Unchanged) ---
const validateStep1_Internship = (formData) => {
  const errors = {};
  if (!formData.company_name?.trim()) errors.company_name = 'Organization/Company name is required.';
  if (!formData.roll?.trim()) errors.roll = 'Internship role/title is required.';
  if (!formData.domain?.trim()) errors.domain = 'Internship domain is required.';
  if (!formData.internship_type) errors.internship_type = 'Internship type is required.';
  if (!formData.start_date) errors.start_date = 'Start date is required.';
  if (!formData.end_date) errors.end_date = 'End date is required.';
  if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
    errors.end_date = 'End date cannot be before start date.';
  }
  return errors;
};


const validateStep2_Internship = (formData) => {
  const errors = {};
  if (formData.industry_mentor_contact && !/^\S+@\S+\.\S+$/.test(formData.industry_mentor_contact)) {
    errors.industry_mentor_contact = 'Please enter a valid email address for the industry mentor.';
  }
  return errors;
};


const validateStep3_Internship = (formData) => {
  const errors = {};
  if (!formData.offer_letter) errors.offer_letter = 'Offer letter (PDF, PNG, JPG) is required.';
  // report is optional, so no validation if not present
  return errors;
};


const validateStep4_Internship = (formData) => {
  const errors = {};
  if (!formData.skill_gained?.trim()) errors.skill_gained = 'Skills gained is required.';
  if (!formData.outcomes?.trim()) errors.outcomes = 'Key outcomes or achievements are required.';
  return errors;
};




// --- Step Components for Internship (Unchanged) ---


const InternshipStep1_CoreDetails = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionHeader title="Internship Core Details" icon={Briefcase} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InputField id="company_name" name="company_name" label="Organization / Company Name" value={formData.company_name} onChange={handleChange} error={errors.company_name} placeholder="e.g. Tech Solutions Inc." required />
      <InputField id="roll" name="roll" label="Internship Role / Title" value={formData.roll} onChange={handleChange} error={errors.roll} placeholder="e.g. Software Developer Intern" required />
      <InputField id="domain" name="domain" label="Internship Domain" value={formData.domain} onChange={handleChange} error={errors.domain} placeholder="e.g. Web Development, AI, Cloud Computing" required />
      <SelectField id="internship_type" name="internship_type" label="Internship Type" value={formData.internship_type} onChange={handleChange} error={errors.internship_type} required>
        <option value="">Select internship type</option>
        <option value="Fulltime">Full-time</option>
        <option value="Part-Time">Part-time</option>
        {/* Add other ENUM options from your DB if available */}
      </SelectField>
    </div>


    <SectionHeader title="Duration & Stipend" icon={CalendarDays} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InputField id="start_date" name="start_date" label="Start Date" type="date" value={formData.start_date} onChange={handleChange} error={errors.start_date} required className="appearance-none"/>
      <InputField id="end_date" name="end_date" label="End Date" type="date" value={formData.end_date} onChange={handleChange} error={errors.end_date} required className="appearance-none"/>
    </div>
    <CheckboxField id="is_stipend" name="is_stipend" label="This was a paid internship (received stipend)" checked={formData.is_stipend} onChange={handleChange} description="Check this if you received a stipend" />
  </div>
);


const InternshipStep2_Supervision = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionHeader title="Supervision Details" icon={Users} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InputField id="consulted_faculty_name" name="consulted_faculty_name" label="Consulted Faculty Name (Optional)" value={formData.consulted_faculty_name} onChange={handleChange} error={errors.consulted_faculty_name} placeholder="e.g. Dr. Smith" />
      <InputField id="industry_mentor_name" name="industry_mentor_name" label="Industry Mentor Name (Optional)" value={formData.industry_mentor_name} onChange={handleChange} error={errors.industry_mentor_name} placeholder="e.g. John Doe" />
    </div>
    <InputField id="industry_mentor_contact" name="industry_mentor_contact" label="Industry Mentor Contact (Optional)" value={formData.industry_mentor_contact} onChange={handleChange} error={errors.industry_mentor_contact} placeholder="e.g. john@company.com" type="email" helperText="Email or phone number of industry mentor" />
  </div>
);


const InternshipStep3_Documentation = ({ formData, handleFileSelect, errors, setFormError }) => (
  <div className="space-y-6">
    <SectionHeader title="Documentation" icon={FileText} />
    <FileUploadField
        id="offer_letter"
        name="offer_letter"
        label="Upload Offer Letter"
        selectedFile={formData.offer_letter}
        onFileSelect={handleFileSelect}
        error={errors.offer_letter}
        helperText="PDF, PNG, or JPG file of your offer letter."
        required
        setFormError={setFormError}
        py="py-6"
    />
    <FileUploadField
        id="report"
        name="report"
        label="Upload Internship Report (Optional)"
        selectedFile={formData.report}
        onFileSelect={handleFileSelect}
        error={errors.report}
        helperText="PDF, PNG, or JPG file of your internship report, if applicable."
        setFormError={setFormError}
        py="py-6"
    />
  </div>
);


const InternshipStep4_Reflections = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionHeader title="Skills & Outcomes" icon={Sparkles} />
    <TextareaField
        id="skill_gained"
        name="skill_gained"
        label="Skills Gained"
        value={formData.skill_gained}
        onChange={handleChange}
        error={errors.skill_gained}
        placeholder="e.g. React, Node.js, Project Management, Technical Writing"
        required
        rows={3}
        helperText="List the key skills you acquired or improved (comma separated)."
    />
    <TextareaField
        id="outcomes"
        name="outcomes"
        label="Key Outcomes or Achievements"
        value={formData.outcomes}
        onChange={handleChange}
        error={errors.outcomes}
        placeholder="Describe your main responsibilities, projects completed, and significant accomplishments."
        required
        rows={5}
    />
  </div>
);


const InternshipStep5_Review = ({ formData }) => {
  const DetailItem = ({ label, value, isFile = false, isBoolean = false }) => (
    <div>
      <strong className="text-sm text-gray-600 block mb-0.5">{label}:</strong>
      {isFile && value ? (
        <p className="text-sm text-gray-800 break-words">
          <FileText size={14} className="inline mr-1 text-indigo-600" />
          {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      ) : isBoolean ? (
         <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{value ? 'Yes' : 'No'}</p>
      ) : (
        <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{value || 'N/A'}</p>
      )}
    </div>
  );


  return (
    <div className="space-y-8">
      <SectionHeader title="Review Internship Submission" icon={Info} />


      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Core Details & Duration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <DetailItem label="Organization / Company Name" value={formData.company_name} />
          <DetailItem label="Internship Role / Title" value={formData.roll} />
          <DetailItem label="Internship Domain" value={formData.domain} />
          <DetailItem label="Internship Type" value={formData.internship_type} />
          <DetailItem label="Start Date" value={formData.start_date} />
          <DetailItem label="End Date" value={formData.end_date} />
          <DetailItem label="Received Stipend" value={formData.is_stipend} isBoolean />
        </div>
      </section>


      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Supervision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <DetailItem label="Consulted Faculty Name" value={formData.consulted_faculty_name} />
          <DetailItem label="Industry Mentor Name" value={formData.industry_mentor_name} />
          <DetailItem label="Industry Mentor Contact" value={formData.industry_mentor_contact} />
        </div>
      </section>


      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <DetailItem label="Offer Letter" value={formData.offer_letter} isFile />
          <DetailItem label="Internship Report" value={formData.report} isFile />
        </div>
      </section>


      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Skills & Outcomes</h3>
        <div className="space-y-4">
          <DetailItem label="Skills Gained" value={formData.skill_gained} />
          <DetailItem label="Key Outcomes or Achievements" value={formData.outcomes} />
        </div>
      </section>
    </div>
  );
};




// --- Main Internship Component (UPDATED) ---
const STEP_CONFIG_INTERNSHIP = [
  { title: 'Core Details', validate: validateStep1_Internship, icon: Briefcase },
  { title: 'Supervision', validate: validateStep2_Internship, icon: Users },
  { title: 'Documentation', validate: validateStep3_Internship, icon: FileText },
  { title: 'Reflections', validate: validateStep4_Internship, icon: Sparkles },
  { title: 'Review', icon: Info }, // No validation function for review step
];


const Internship = ({ onBack, initialData = {} }) => {
  // --- CHANGE 1: Moved useAuth() hook inside the component ---
  const { rollno } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  const [formData, setFormData] = useState({
    // From Step 1
    company_name: initialData.company_name || '',
    roll: initialData.roll || '', // Internship Role/Title
    domain: initialData.domain || '',
    internship_type: initialData.internship_type || '', // ENUM: 'Fulltime', 'Part-Time'
    start_date: initialData.start_date || '',
    end_date: initialData.end_date || '',
    is_stipend: initialData.is_stipend || false, // TINYINT(1) -> boolean


    // From Step 2
    consulted_faculty_name: initialData.consulted_faculty_name || '', // Optional
    industry_mentor_name: initialData.industry_mentor_name || '', // Optional
    industry_mentor_contact: initialData.industry_mentor_contact || '', // Optional


    // From Step 3
    offer_letter: initialData.offer_letter || null, // File, Required
    report: initialData.report || null, // File, Optional


    // From Step 4
    skill_gained: initialData.skill_gained || '',
    outcomes: initialData.outcomes || '',
  });


  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      if (name === 'start_date' || name === 'end_date') {
        delete newErrors.end_date; // Clear end_date error if start_date changes or vice-versa
      }
      return newErrors;
    });
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);


  const handleFileSelect = useCallback(({ target: { name, value } }) => {
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name]; // Clear specific file error on new selection/clear
      return newErrors;
    });
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);


  const setFormErrorForFile = useCallback((fieldName, errorMessage) => {
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
  }, []);




  const validateCurrentStep = useCallback(() => {
    let currentStepErrors = {};
    const currentStepConfig = STEP_CONFIG_INTERNSHIP[currentStep];


    if (currentStepConfig && currentStepConfig.validate) {
      currentStepErrors = currentStepConfig.validate(formData);
    }


    // Preserve existing file errors if they were not re-validated in this step
    const preservedFileErrors = {};
    if (errors.offer_letter && !currentStepErrors.offer_letter) preservedFileErrors.offer_letter = errors.offer_letter;
    if (errors.report && !currentStepErrors.report) preservedFileErrors.report = errors.report;




    setErrors({
        ...preservedFileErrors, // Keep old file errors if not part of current step validation
        ...currentStepErrors
    });


    return Object.keys(currentStepErrors).length === 0;
  }, [currentStep, formData, errors.offer_letter, errors.report]);




  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      if (DEBUG_MODE) console.log("Validation failed for next step. Errors:", errors);
      window.scrollTo(0, 0);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEP_CONFIG_INTERNSHIP.length - 1));
    window.scrollTo(0, 0);
  }, [validateCurrentStep, errors]);


  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== STEP_CONFIG_INTERNSHIP.length - 1) {
        if (DEBUG_MODE) console.log("handleSubmit called, but not on review step. Current step:", currentStep);
        return;
    }
    setIsSubmitting(true);
    setErrors({}); // Clear previous submission errors


    let allValid = true;
    let firstErrorStep = -1;
    const combinedValidationErrors = {};


    // Validate all steps programmatically before submission
    for (let i = 0; i < STEP_CONFIG_INTERNSHIP.length - 1; i++) { // Exclude review step
      const stepConfig = STEP_CONFIG_INTERNSHIP[i];
      if (stepConfig.validate) {
        const stepErrors = stepConfig.validate(formData);
        if (Object.keys(stepErrors).length > 0) {
          allValid = false;
          if (firstErrorStep === -1) firstErrorStep = i;
          Object.assign(combinedValidationErrors, stepErrors);
        }
      }
    }


    if (errors.offer_letter) {
        allValid = false;
        combinedValidationErrors.offer_letter = errors.offer_letter;
        if (firstErrorStep === -1 || firstErrorStep > STEP_CONFIG_INTERNSHIP.findIndex(s => s.title === 'Documentation')) {
            firstErrorStep = STEP_CONFIG_INTERNSHIP.findIndex(s => s.title === 'Documentation');
        }
    }
     if (errors.report) { // Though report is optional, if there's an error (e.g. size/type), it's still an error
        allValid = false;
        combinedValidationErrors.report = errors.report;
         if (firstErrorStep === -1 || firstErrorStep > STEP_CONFIG_INTERNSHIP.findIndex(s => s.title === 'Documentation')) {
            firstErrorStep = STEP_CONFIG_INTERNSHIP.findIndex(s => s.title === 'Documentation');
        }
    }


    if (!allValid) {
        setErrors(prev => ({...prev, ...combinedValidationErrors}));
        if (firstErrorStep !== -1) {
            setCurrentStep(firstErrorStep);
        }
        window.scrollTo(0,0);
        if (DEBUG_MODE) console.log("Full form validation failed on submit:", combinedValidationErrors);
        setIsSubmitting(false);
        return;
    }


    // --- CHANGE 2: Console log the roll number ---
    if (DEBUG_MODE) {
      console.log(`[DEBUG] Submitting form for rollno: ${rollno}`);
    }


    const payload = new FormData();


    // --- CHANGE 3: Add rollno to the payload ---
    payload.append('rollno', rollno);


    payload.append('company_name', formData.company_name.trim());
    payload.append('roll', formData.roll.trim());
    payload.append('domain', formData.domain.trim());
    payload.append('internship_type', formData.internship_type);
    payload.append('is_stipend', formData.is_stipend ? '1' : '0');
    payload.append('start_date', formData.start_date);
    payload.append('end_date', formData.end_date);


    if (formData.consulted_faculty_name && formData.consulted_faculty_name.trim()) {
        payload.append('consulted_faculty_name', formData.consulted_faculty_name.trim());
    }
    if (formData.industry_mentor_name && formData.industry_mentor_name.trim()) {
        payload.append('industry_mentor_name', formData.industry_mentor_name.trim());
    }
    if (formData.industry_mentor_contact && formData.industry_mentor_contact.trim()) {
        payload.append('industry_mentor_contact', formData.industry_mentor_contact.trim());
    }


    if (formData.offer_letter) {
        payload.append('offer_letter', formData.offer_letter, formData.offer_letter.name);
    }
    if (formData.report) {
        payload.append('report', formData.report, formData.report.name);
    }


    payload.append('skill_gained', formData.skill_gained.trim());
    payload.append('outcomes', formData.outcomes.trim());


    if (DEBUG_MODE) {
        console.log('[DEBUG] Submitting Internship data to API:');
        for (let [key, value] of payload.entries()) {
            console.log(key, value instanceof File ? `${value.name} (File)` : value);
        }
    }


    try {
      const response = await axios.post('http://localhost:6001/api/internships', payload, {
        withCredentials: true,
      });


      if (DEBUG_MODE) console.log('Internship submission successful:', response.data);
      setSubmitSuccess(true);
      window.scrollTo(0, 0);


    } catch (error) {
      let errorMessage = 'Upload failed. Please try again.';
      if (axios.isAxiosError(error)) {
        console.error('Axios submission error:', error.response?.data || error.message);
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else {
            errorMessage = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
          }
        } else {
          errorMessage = error.message;
        }
      } else {
        console.error('Non-Axios submission error:', error);
        errorMessage = error.message || 'An unexpected error occurred.';
      }
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };


  const resetForm = () => {
    setFormData({
      company_name: '', roll: '', domain: '', internship_type: '',
      start_date: '', end_date: '', is_stipend: false,
      consulted_faculty_name: '', industry_mentor_name: '', industry_mentor_contact: '',
      offer_letter: null, report: null,
      skill_gained: '', outcomes: '',
    });
    setCurrentStep(0);
    setSubmitSuccess(false);
    setErrors({});
    setIsSubmitting(false);
    window.scrollTo(0, 0);
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <InternshipStep1_CoreDetails formData={formData} handleChange={handleChange} errors={errors} />;
      case 1: return <InternshipStep2_Supervision formData={formData} handleChange={handleChange} errors={errors} />;
      case 2: return <InternshipStep3_Documentation formData={formData} handleFileSelect={handleFileSelect} errors={errors} setFormError={setFormErrorForFile} />;
      case 3: return <InternshipStep4_Reflections formData={formData} handleChange={handleChange} errors={errors} />;
      case 4: return <InternshipStep5_Review formData={formData} />;
      default: return null;
    }
  };


  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto bg-white py-10 px-4 sm:px-6 lg:px-8 mt-4 text-center rounded-lg shadow-xl">
        <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-6 ring-4 ring-green-200">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Internship Details Submitted!</h2>
        <p className="text-gray-600 mb-8 text-lg">Your internship information has been successfully submitted for review.</p>
        {errors.submit && <p className="my-4 text-md text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</p>}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={resetForm}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Another Internship
          </button>
          {onBack && (
             <button
                onClick={onBack}
                className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
             </button>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto bg-white py-4 md:py-8 px-4 sm:px-6 lg:px-10 mt-2 md:mt-4 rounded-lg shadow-xl mb-10">
      <div className="flex items-center mb-8 border-b pb-5 border-gray-200">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">Internship Submission</h1>
          <p className="mt-1.5 text-sm text-gray-500">Fill in the details for your internship experience.</p>
        </div>
      </div>


      <div className="mb-6 px-2 pt-2">
        <div className="md:hidden mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {STEP_CONFIG_INTERNSHIP[currentStep].title}
          </h2>
        </div>
        <nav aria-label="Progress" className="hidden md:block">
          <ol role="list" className="flex items-center">
            {STEP_CONFIG_INTERNSHIP.map((step, stepIdx) => (
              <li key={step.title} className={`relative ${stepIdx !== STEP_CONFIG_INTERNSHIP.length - 1 ? 'pr-8 sm:pr-10 md:pr-12' : ''} flex-1`}>
                {stepIdx < currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-1 w-full bg-indigo-600" /></div>
                    <button type="button" onClick={() => { setCurrentStep(stepIdx); }}
                      className="relative w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <Check className="w-6 h-6 text-white" aria-hidden="true" />
                      <span className="sr-only">{step.title} - Completed</span>
                      <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-medium text-indigo-600 truncate">{step.title}</span>
                    </button>
                  </>
                ) : stepIdx === currentStep ? (
                   <>
                      <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-1 w-full bg-gray-200" /></div>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full ring-2 ring-indigo-300" aria-current="step">
                        {step.icon && <step.icon className="w-5 h-5 text-indigo-600" aria-hidden="true" />}
                        <span className="sr-only">{step.title} - Current</span>
                        <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-bold text-indigo-600 truncate">{step.title}</span>
                      </div>
                  </>
                ) : (
                   <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-1 w-full bg-gray-200" /></div>
                    <div className="group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full cursor-not-allowed">
                       {step.icon && <step.icon className="w-5 h-5 text-gray-400" aria-hidden="true" />}
                       <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-medium text-gray-500 truncate">{step.title}</span>
                       <span className="sr-only">{step.title} - Upcoming</span>
                    </div>
                   </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>


      <div className="bg-white py-6">
        <form noValidate onSubmit={handleSubmit}>
          <div className="min-h-[300px] mb-8 px-1.5">
            {renderStepContent()}
            {errors.submit && (
              <p className="mt-6 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {errors.submit}
              </p>
            )}
          </div>


          <div className="mt-10 pt-6 flex justify-between items-center border-t border-gray-200 px-1.5">
            {currentStep > 0 ? (
              <button type="button" onClick={prevStep} disabled={isSubmitting}
                className="px-7 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50">
                Back
              </button>
            ) : <div />}


            {currentStep < STEP_CONFIG_INTERNSHIP.length - 1 ? (
              <button type="button" onClick={nextStep} disabled={isSubmitting}
                className="inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 cursor-pointer disabled:opacity-50">
                Next
              </button>
            ) : (
              <button type="button" onClick={handleSubmit}
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:bg-indigo-400`}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Submitting...' : 'Submit for Faculty Review'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};


export default Internship;