import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios'; // Added for API calls
import {
  ChevronLeft, Loader2, X, Check, CheckCircle,
  FileText, Users, Lightbulb, Info, Upload, 
  Briefcase, CalendarDays, Sparkles, 
  Award, MessageSquare, Target, AlertTriangle, UserCheck, UserPlus, Building, Type,
  MapPin // For location
} from 'lucide-react';

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

// --- Input Field Component (Copied from reference) ---
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

// --- Textarea Field Component (Copied from reference) ---
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

// --- Section Header Component (Copied from reference) ---
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center mb-6 pt-4">
    {Icon && <Icon className="h-6 w-6 text-indigo-600 mr-3" />}
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
  </div>
);

// --- Validation Functions for Paper Presentation ---
const validateStep1_PaperPresentation = (formData) => {
  const errors = {};
  if (!formData.paper_title?.trim()) errors.paper_title = 'Paper title is required.';
  if (!formData.conference_title?.trim()) errors.conference_title = 'Conference title is required.';
  if (!formData.location?.trim()) errors.location = 'Location is required.';
  if (!formData.date_of_presentation) errors.date_of_presentation = 'Date of presentation is required.';
  return errors;
};

const validateStep2_PaperPresentation = (formData) => {
  const errors = {};
  if (!formData.pdf) errors.pdf = 'Presentation PDF is required.';
  // certificate is optional, so no validation if not present unless there's an error from FileUpload (size/type)
  return errors;
};

const validateStep3_PaperPresentation = (formData) => {
  const errors = {};
  // award is optional
  return errors;
};

// --- Step Components for Paper Presentation ---

const PaperPresentationStep1_Details = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionHeader title="Presentation Core Details" icon={Type} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InputField id="paper_title" name="paper_title" label="Paper Title" value={formData.paper_title} onChange={handleChange} error={errors.paper_title} placeholder="e.g. Advancements in AI" required />
      <InputField id="conference_title" name="conference_title" label="Conference Title" value={formData.conference_title} onChange={handleChange} error={errors.conference_title} placeholder="e.g. International AI Summit" required />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InputField id="location" name="location" label="Location" value={formData.location} onChange={handleChange} error={errors.location} placeholder="e.g. San Francisco, CA or Virtual" required />
      <InputField id="date_of_presentation" name="date_of_presentation" label="Date of Presentation" type="date" value={formData.date_of_presentation} onChange={handleChange} error={errors.date_of_presentation} required className="appearance-none"/>
    </div>
  </div>
);

const PaperPresentationStep2_Documents = ({ formData, handleFileSelect, errors, setFormError }) => (
  <div className="space-y-6">
    <SectionHeader title="Supporting Documents" icon={Upload} />
    <FileUploadField
        id="pdf"
        name="pdf"
        label="Upload Presentation PDF"
        selectedFile={formData.pdf}
        onFileSelect={handleFileSelect}
        error={errors.pdf}
        helperText="The main presentation file (PDF, PNG, JPG)."
        required
        setFormError={setFormError}
        py="py-6"
    />
    <FileUploadField
        id="certificate"
        name="certificate"
        label="Upload Certificate (Optional)"
        selectedFile={formData.certificate}
        onFileSelect={handleFileSelect}
        error={errors.certificate}
        helperText="Certificate of presentation, if available (PDF, PNG, JPG)."
        setFormError={setFormError}
        py="py-6"
    />
  </div>
);

const PaperPresentationStep3_Achievements = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionHeader title="Award / Recognition (Optional)" icon={Award} />
    <TextareaField
        id="award"
        name="award"
        label="Award or Special Recognition Received"
        value={formData.award}
        onChange={handleChange}
        error={errors.award}
        placeholder="e.g. Best Paper Award, Honorable Mention. Describe any recognition."
        rows={3}
        helperText="If you received any award or special mention for this presentation, please describe it here."
    />
  </div>
);

const PaperPresentationStep4_Review = ({ formData }) => {
  const DetailItem = ({ label, value, isFile = false }) => (
    <div>
      <strong className="text-sm text-gray-600 block mb-0.5">{label}:</strong>
      {isFile && value ? (
        <p className="text-sm text-gray-800 break-words">
          <FileText size={14} className="inline mr-1 text-indigo-600" />
          {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      ) : (
        <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader title="Review Paper Presentation Submission" icon={Info} />

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Core Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <DetailItem label="Paper Title" value={formData.paper_title} />
          <DetailItem label="Conference Title" value={formData.conference_title} />
          <DetailItem label="Location" value={formData.location} />
          <DetailItem label="Date of Presentation" value={formData.date_of_presentation} />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Supporting Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <DetailItem label="Presentation PDF" value={formData.pdf} isFile />
          <DetailItem label="Certificate" value={formData.certificate} isFile />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Award / Recognition</h3>
        <DetailItem label="Award or Special Recognition" value={formData.award} />
      </section>
    </div>
  );
};


// --- Main Paper Presentation Component ---
const STEP_CONFIG_PAPER_PRESENTATION = [
  { title: 'Details', validate: validateStep1_PaperPresentation, icon: Type },
  { title: 'Documents', validate: validateStep2_PaperPresentation, icon: Upload },
  { title: 'Achievements', validate: validateStep3_PaperPresentation, icon: Award },
  { title: 'Review', icon: Info }, // No validation function for review step
];

const PaperPresentation = ({ onBack, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    paper_title: initialData.paper_title || '',
    conference_title: initialData.conference_title || '',
    location: initialData.location || '',
    date_of_presentation: initialData.date_of_presentation || '',
    pdf: initialData.pdf || null, // File, Required
    certificate: initialData.certificate || null, // File, Optional
    award: initialData.award || '', // Optional
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleFileSelect = useCallback(({ target: { name, value } }) => {
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
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
    const currentStepConfig = STEP_CONFIG_PAPER_PRESENTATION[currentStep];

    if (currentStepConfig && currentStepConfig.validate) {
      currentStepErrors = currentStepConfig.validate(formData);
    }
    
    // Preserve existing file errors if they were not re-validated in this step
    const preservedFileErrors = {};
    if (errors.pdf && !currentStepErrors.pdf) preservedFileErrors.pdf = errors.pdf;
    if (errors.certificate && !currentStepErrors.certificate) preservedFileErrors.certificate = errors.certificate;

    setErrors({
        ...preservedFileErrors,
        ...currentStepErrors
    });

    return Object.keys(currentStepErrors).length === 0;
  }, [currentStep, formData, errors.pdf, errors.certificate]);


  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      if (DEBUG_MODE) console.log("Validation failed for next step. Errors:", errors);
      window.scrollTo(0, 0);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEP_CONFIG_PAPER_PRESENTATION.length - 1));
    window.scrollTo(0, 0);
  }, [validateCurrentStep, errors]); // `errors` dependency added

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== STEP_CONFIG_PAPER_PRESENTATION.length - 1) {
        if (DEBUG_MODE) console.log("handleSubmit called, but not on review step. Current step:", currentStep);
        return;
    }
    setIsSubmitting(true);
    setErrors({});

    let allValid = true;
    let firstErrorStep = -1;
    const combinedValidationErrors = {};

    for (let i = 0; i < STEP_CONFIG_PAPER_PRESENTATION.length - 1; i++) {
      const stepConfig = STEP_CONFIG_PAPER_PRESENTATION[i];
      if (stepConfig.validate) {
        const stepErrors = stepConfig.validate(formData);
        if (Object.keys(stepErrors).length > 0) {
          allValid = false;
          if (firstErrorStep === -1) firstErrorStep = i;
          Object.assign(combinedValidationErrors, stepErrors);
        }
      }
    }

    // Manually add any persistent file errors
    if (errors.pdf) {
        allValid = false;
        combinedValidationErrors.pdf = errors.pdf;
        if (firstErrorStep === -1 || firstErrorStep > STEP_CONFIG_PAPER_PRESENTATION.findIndex(s => s.title === 'Documents')) {
            firstErrorStep = STEP_CONFIG_PAPER_PRESENTATION.findIndex(s => s.title === 'Documents');
        }
    }
     if (errors.certificate) { // Optional file, but if errored (e.g. size/type) it's an error
        allValid = false;
        combinedValidationErrors.certificate = errors.certificate;
         if (firstErrorStep === -1 || firstErrorStep > STEP_CONFIG_PAPER_PRESENTATION.findIndex(s => s.title === 'Documents')) {
            firstErrorStep = STEP_CONFIG_PAPER_PRESENTATION.findIndex(s => s.title === 'Documents');
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

    const payload = new FormData();
    payload.append('paper_title', formData.paper_title.trim());
    payload.append('conference_title', formData.conference_title.trim());
    payload.append('location', formData.location.trim());
    payload.append('date_of_presentation', formData.date_of_presentation);

    if (formData.pdf) { // This is required, so should always be present if validation passed
        payload.append('pdf', formData.pdf, formData.pdf.name);
    }
    if (formData.certificate) {
        payload.append('certificate', formData.certificate, formData.certificate.name);
    }
    if (formData.award && formData.award.trim()) {
        payload.append('award', formData.award.trim());
    }
    // 'id', 'rollno', 'approval_status', 'submitted_on' are handled by backend/faculty

    if (DEBUG_MODE) {
        console.log('[DEBUG] Submitting Paper Presentation data to API:');
        for (let [key, value] of payload.entries()) {
            console.log(key, value instanceof File ? `${value.name} (File)` : value);
        }
    }

    try {
      const response = await axios.post('http://YOUR_API_ENDPOINT/api/paper-presentations', payload, {
        withCredentials: true,
      });

      if (DEBUG_MODE) console.log('Paper Presentation submission successful:', response.data);
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
      paper_title: '', conference_title: '', location: '', date_of_presentation: '',
      pdf: null, certificate: null, award: '',
    });
    setCurrentStep(0);
    setSubmitSuccess(false);
    setErrors({});
    setIsSubmitting(false);
    window.scrollTo(0, 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <PaperPresentationStep1_Details formData={formData} handleChange={handleChange} errors={errors} />;
      case 1: return <PaperPresentationStep2_Documents formData={formData} handleFileSelect={handleFileSelect} errors={errors} setFormError={setFormErrorForFile} />;
      case 2: return <PaperPresentationStep3_Achievements formData={formData} handleChange={handleChange} errors={errors} />;
      case 3: return <PaperPresentationStep4_Review formData={formData} />;
      default: return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto bg-white py-10 px-4 sm:px-6 lg:px-8 mt-4 text-center rounded-lg shadow-xl">
        <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-6 ring-4 ring-green-200">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Presentation Details Submitted!</h2>
        <p className="text-gray-600 mb-8 text-lg">Your paper presentation information has been successfully submitted for review.</p>
        {errors.submit && <p className="my-4 text-md text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</p>}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={resetForm}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Another Presentation
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
          <h1 className="text-3xl font-bold text-gray-900">Paper Presentation Submission</h1>
          <p className="mt-1.5 text-sm text-gray-500">Fill in the details for your paper presentation.</p>
        </div>
      </div>

      <div className="mb-6 px-2 pt-2">
        <div className="md:hidden mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {STEP_CONFIG_PAPER_PRESENTATION[currentStep].title}
          </h2>
        </div>
        <nav aria-label="Progress" className="hidden md:block">
          <ol role="list" className="flex items-center">
            {STEP_CONFIG_PAPER_PRESENTATION.map((step, stepIdx) => (
              <li key={step.title} className={`relative ${stepIdx !== STEP_CONFIG_PAPER_PRESENTATION.length - 1 ? 'pr-8 sm:pr-10 md:pr-12' : ''} flex-1`}>
                {stepIdx < currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-1 w-full bg-indigo-600" /></div>
                    <button type="button" onClick={() => { setCurrentStep(stepIdx); /* setErrors({}); */ }}
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
          <div className="min-h-[250px] mb-8 px-1.5"> {/* Adjusted min-height for potentially less content per step */}
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

            {currentStep < STEP_CONFIG_PAPER_PRESENTATION.length - 1 ? (
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

export default PaperPresentation;