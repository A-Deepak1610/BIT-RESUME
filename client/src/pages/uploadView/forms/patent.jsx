import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  ChevronLeft, Loader2, X, Check, CheckCircle,
  FileText, Users, Lightbulb, Info, Upload, Award, FileSignature, UploadCloud, Paperclip, MessageSquare, CalendarDays,
} from 'lucide-react';


// --- ADDED useAuth IMPORT ---
import useAuth from '../../../store/UseAuth';


const DEBUG_MODE = true;


const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_FORMATS_LABEL = `Supported formats: PDF, PNG, JPG (max ${MAX_FILE_SIZE_MB}MB)`;
const ACCEPT_STRING = ".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf";


const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;


// --- SHARED COMPONENTS (Unchanged) ---
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
        className={`mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 ${
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
        <UploadCloud className="mx-auto h-10 w-10 text-gray-400 mb-2" />
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
            <Paperclip size={16} className="inline mr-2 text-gray-500 flex-shrink-0" />
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




// --- Validation Functions (Unchanged) ---
const validateStep1_Patent = (formData) => {
  const errors = {};
  if (!formData.title?.trim()) {
    errors.title = 'Patent title is required.';
  }
  if (!formData.application_number?.trim()) {
    errors.application_number = 'Application number is required.';
  }
  if (!formData.date_of_filing) {
    errors.date_of_filing = 'Date of filing is required.';
  }
  return errors;
};


const validateStep2_Patent = (formData) => {
  const errors = {};
  if (!formData.patent_docs) {
    errors.patent_docs = 'Patent document(s) is required.';
  }
  if (!formData.link_to_patent_listing?.trim()) {
    errors.link_to_patent_listing = 'Link to patent listing is required.';
  } else {
    try {
      new URL(formData.link_to_patent_listing);
       if (!formData.link_to_patent_listing.startsWith('http://') && !formData.link_to_patent_listing.startsWith('https://')) {
          errors.link_to_patent_listing = 'Link must start with http:// or https://.';
      }
    } catch (_) {
      errors.link_to_patent_listing = 'Please enter a valid URL for the patent listing.';
    }
  }
  return errors;
};


const validateStep3_Patent = (formData) => {
  const errors = {};
  if (!formData.summary?.trim()) {
    errors.summary = 'Summary of the patent is required.';
  }
  if (!formData.usecase_of_patent?.trim()) {
    errors.usecase_of_patent = 'Use case / application domain is required.';
  }
  return errors;
};


// --- Step Components (Unchanged) ---
const PatentStep1_Details = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <div className="flex items-center mb-4">
      <FileSignature className="h-6 w-6 text-indigo-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-800">Patent Details</h2>
    </div>
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
        Title of Patent <RequiredAst />
      </label>
      <input
        type="text"
        name="title"
        id="title"
        value={formData.title}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        placeholder="Enter the official title of the patent"
      />
      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
    </div>
    <div>
      <label htmlFor="application_number" className="block text-sm font-medium text-gray-700 mb-1">
        Application Number <RequiredAst />
      </label>
      <input
        type="text"
        name="application_number"
        id="application_number"
        value={formData.application_number}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${errors.application_number ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        placeholder="Enter the patent application number"
      />
      {errors.application_number && <p className="mt-1 text-sm text-red-600">{errors.application_number}</p>}
    </div>
    <div>
      <label htmlFor="date_of_filing" className="block text-sm font-medium text-gray-700 mb-1">
        Date of Filing <RequiredAst />
      </label>
      <input
        type="date"
        name="date_of_filing"
        id="date_of_filing"
        value={formData.date_of_filing}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${errors.date_of_filing ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        placeholder="Select the date of filing"
      />
      {errors.date_of_filing && <p className="mt-1 text-sm text-red-600">{errors.date_of_filing}</p>}
    </div>
  </div>
);


const PatentStep2_Documentation = ({ formData, handleFileSelect, handleChange, errors, setFormError }) => (
  <div className="space-y-6">
    <div className="flex items-center mb-4">
      <UploadCloud className="h-6 w-6 text-indigo-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-800">Documentation</h2>
    </div>
    <FileUploadField
      id="patent_docs"
      name="patent_docs"
      label="Upload Patent Document(s)"
      selectedFile={formData.patent_docs}
      onFileSelect={handleFileSelect}
      error={errors.patent_docs}
      helperText="PDF, PNG, JPG file containing the patent filing document or granted patent."
      required
      setFormError={setFormError}
    />
    <FileUploadField
      id="supporting_files"
      name="supporting_files"
      label="Upload Supporting Files (Optional)"
      selectedFile={formData.supporting_files}
      onFileSelect={handleFileSelect}
      error={errors.supporting_files}
      helperText={`Optional - Prototype details, diagrams, prior art search, etc. ${SUPPORTED_FORMATS_LABEL}`}
      setFormError={setFormError}
    />
    <div>
      <label htmlFor="link_to_patent_listing" className="block text-sm font-medium text-gray-700 mb-1">
        Link to Patent Listing <RequiredAst />
      </label>
      <input
        type="url"
        name="link_to_patent_listing"
        id="link_to_patent_listing"
        value={formData.link_to_patent_listing}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${errors.link_to_patent_listing ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        placeholder="https://patents.google.com/patent/US1234567B2/en"
      />
      {errors.link_to_patent_listing && <p className="mt-1 text-sm text-red-600">{errors.link_to_patent_listing}</p>}
      <p className="mt-1 text-xs text-gray-500">URL to the official patent listing (e.g., USPTO, Google Patents).</p>
    </div>
  </div>
);


const PatentStep3_SummaryContext = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <div className="flex items-center mb-4">
      <MessageSquare className="h-6 w-6 text-indigo-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-800">Summary & Context</h2>
    </div>
    <div>
      <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
        Summary of the Patent <RequiredAst />
      </label>
      <textarea
        name="summary"
        id="summary"
        rows={5}
        value={formData.summary}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${errors.summary ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        placeholder="Provide a concise summary of your invention, its novelty, and key claims."
      />
      {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary}</p>}
    </div>
    <div>
      <label htmlFor="usecase_of_patent" className="block text-sm font-medium text-gray-700 mb-1">
        Use Case / Application Domain <RequiredAst />
      </label>
      <input
        type="text"
        name="usecase_of_patent"
        id="usecase_of_patent"
        value={formData.usecase_of_patent}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${errors.usecase_of_patent ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        placeholder="e.g., Medical Devices, Software, Renewable Energy"
      />
      {errors.usecase_of_patent && <p className="mt-1 text-sm text-red-600">{errors.usecase_of_patent}</p>}
      <p className="mt-1 text-xs text-gray-500">The industry or specific area where this patent applies.</p>
    </div>
    <div>
      <label htmlFor="faculty_remarks" className="block text-sm font-medium text-gray-700 mb-1">
        Faculty Remark / Additional Notes <span className="text-xs text-gray-500">(optional)</span>
      </label>
      <textarea
        name="faculty_remarks"
        id="faculty_remarks"
        rows={3}
        value={formData.faculty_remarks}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${errors.faculty_remarks ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        placeholder="Any faculty remarks, or other relevant information."
      />
      {errors.faculty_remarks && <p className="mt-1 text-sm text-red-600">{errors.faculty_remarks}</p>}
    </div>
  </div>
);


const PatentStep4_Review = ({ formData }) => {
    const DetailItem = ({ label, value, isFile = false }) => (
        <div>
            <strong className="text-sm text-gray-600 block mb-0.5">{label}:</strong>
            {isFile && value ? (
                <p className="text-sm text-gray-800 break-words">
                    <Paperclip size={14} className="inline mr-1 text-gray-500" />
                    {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
                </p>
            ) : (
                <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{value || 'N/A'}</p>
            )}
        </div>
    );


    return (
        <div className="space-y-8">
            <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Review Patent Submission</h2>
            </div>


            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <FileSignature size={20} className="mr-2 text-indigo-500" /> Patent Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailItem label="Patent Title" value={formData.title} />
                    <DetailItem label="Application Number" value={formData.application_number} />
                    <DetailItem label="Date of Filing" value={formData.date_of_filing} />
                </div>
            </section>


            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                     <UploadCloud size={20} className="mr-2 text-indigo-500" /> Documentation
                </h3>
                <div className="grid grid-cols-1 gap-y-4">
                    <DetailItem label="Patent Document(s)" value={formData.patent_docs} isFile />
                    <DetailItem label="Supporting Files (Optional)" value={formData.supporting_files} isFile />
                    <DetailItem label="Link to Patent Listing" value={formData.link_to_patent_listing} />
                </div>
            </section>


            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <MessageSquare size={20} className="mr-2 text-indigo-500" /> Summary & Context
                </h3>
                <div className="grid grid-cols-1 gap-y-4">
                    <div className="md:col-span-2">
                        <DetailItem label="Summary of the Patent" value={formData.summary} />
                    </div>
                    <DetailItem label="Use Case / Application Domain" value={formData.usecase_of_patent} />
                     <div className="md:col-span-2">
                        <DetailItem label="Faculty Remark / Additional Notes (Optional)" value={formData.faculty_remarks} />
                    </div>
                </div>
            </section>
        </div>
    );
};




// --- Main Patent Component (UPDATED) ---
const STEP_CONFIG_PATENT = [
  { title: 'Details', validate: validateStep1_Patent, icon: FileSignature },
  { title: 'Docs', validate: validateStep2_Patent, icon: UploadCloud },
  { title: 'Summary', validate: validateStep3_Patent, icon: MessageSquare },
  { title: 'Review', icon: Info },
];


const Patent = ({ onBack, initialData = {} }) => {
  // --- CHANGE 1: Get rollno from useAuth hook ---
  const { rollno } = useAuth();
 
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [formData, setFormData] = useState({
    title: initialData.title || '',
    application_number: initialData.application_number || '',
    date_of_filing: initialData.date_of_filing || '',
    patent_docs: initialData.patent_docs || null,
    supporting_files: initialData.supporting_files || null,
    link_to_patent_listing: initialData.link_to_patent_listing || '',
    summary: initialData.summary || '',
    usecase_of_patent: initialData.usecase_of_patent || '',
    faculty_remarks: initialData.faculty_remarks || '',
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
    const currentStepConfig = STEP_CONFIG_PATENT[currentStep];


    if (currentStepConfig && currentStepConfig.validate) {
      currentStepErrors = currentStepConfig.validate(formData);
    }


    const preservedFileErrors = {};
    if (errors.patent_docs) preservedFileErrors.patent_docs = errors.patent_docs;
    if (errors.supporting_files) preservedFileErrors.supporting_files = errors.supporting_files;


    setErrors({
        ...preservedFileErrors,
        ...currentStepErrors
    });


    return Object.keys(currentStepErrors).length === 0;
  }, [currentStep, formData, errors.patent_docs, errors.supporting_files]);


  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) {
        if (DEBUG_MODE) console.log("Validation failed for next step. Errors should be displayed.");
        window.scrollTo(0, 0);
        return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEP_CONFIG_PATENT.length - 1));
    window.scrollTo(0, 0);
  }, [validateCurrentStep]);


  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
    setErrors({});
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== STEP_CONFIG_PATENT.length - 1) {
        if (DEBUG_MODE) console.log("handleSubmit called, but not on review step. Current step:", currentStep);
        return;
    }
    setIsSubmitting(true);
    setErrors({});


    let allValid = true;
    let firstErrorStep = -1;
    const combinedValidationErrors = {};


    for (let i = 0; i < STEP_CONFIG_PATENT.length - 1; i++) {
      const stepConfig = STEP_CONFIG_PATENT[i];
      if (stepConfig.validate) {
        const stepErrors = stepConfig.validate(formData);
        if (Object.keys(stepErrors).length > 0) {
          allValid = false;
          if (firstErrorStep === -1) firstErrorStep = i;
          Object.assign(combinedValidationErrors, stepErrors);
        }
      }
    }


    if (errors.patent_docs) {
        allValid = false;
        combinedValidationErrors.patent_docs = errors.patent_docs;
        if (firstErrorStep === -1 || firstErrorStep > 1) firstErrorStep = 1;
    }
     if (errors.supporting_files) {
        allValid = false;
        combinedValidationErrors.supporting_files = errors.supporting_files;
         if (firstErrorStep === -1 || firstErrorStep > 1) firstErrorStep = 1;
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
      console.log(`[DEBUG] Submitting patent for rollno: ${rollno}`);
    }


    const payload = new FormData();
    // --- CHANGE 3: Add rollno to the payload ---
    payload.append('rollno', rollno);


    payload.append('title', formData.title.trim());
    payload.append('application_number', formData.application_number.trim());
    payload.append('date_of_filing', formData.date_of_filing);


    if (formData.patent_docs) {
        payload.append('patent_docs', formData.patent_docs, formData.patent_docs.name);
    }
    if (formData.supporting_files) {
        payload.append('supporting_files', formData.supporting_files, formData.supporting_files.name);
    }
    if (formData.link_to_patent_listing && formData.link_to_patent_listing.trim()) {
        payload.append('link_to_patent_listing', formData.link_to_patent_listing.trim());
    }
    payload.append('summary', formData.summary.trim());


    if (formData.usecase_of_patent && formData.usecase_of_patent.trim()) {
        payload.append('usecase_of_patent', formData.usecase_of_patent.trim());
    }
    if (formData.faculty_remarks && formData.faculty_remarks.trim()) {
        payload.append('faculty_remarks', formData.faculty_remarks.trim());
    }


    if (DEBUG_MODE) {
        console.log('[DEBUG] Submitting Patent data to /api/patents:');
        for (let [key, value] of payload.entries()) {
            console.log(key, value instanceof File ? `${value.name} (File)` : value);
        }
    }


    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/patents`, payload, {
        withCredentials: true,
      });


      if (DEBUG_MODE) console.log('Patent submission successful:', response.data);
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
      title: '',
      application_number: '',
      date_of_filing: '',
      patent_docs: null,
      supporting_files: null,
      link_to_patent_listing: '',
      summary: '',
      usecase_of_patent: '',
      faculty_remarks: '',
    });
    setCurrentStep(0);
    setSubmitSuccess(false);
    setErrors({});
    setIsSubmitting(false);
    window.scrollTo(0, 0);
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <PatentStep1_Details formData={formData} handleChange={handleChange} errors={errors} />;
      case 1: return <PatentStep2_Documentation formData={formData} handleFileSelect={handleFileSelect} handleChange={handleChange} errors={errors} setFormError={setFormErrorForFile} />;
      case 2: return <PatentStep3_SummaryContext formData={formData} handleChange={handleChange} errors={errors} />;
      case 3: return <PatentStep4_Review formData={formData} />;
      default: return null;
    }
  };


  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto bg-white py-10 px-4 sm:px-6 lg:px-8 mt-4 text-center rounded-lg shadow-xl">
        <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-6 ring-4 ring-green-200">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Patent Information Submitted!</h2>
        <p className="text-gray-600 mb-8 text-lg">Your patent information has been successfully submitted for review.</p>
        {errors.submit && <p className="my-4 text-md text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</p>}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={resetForm}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Another Patent
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
    <div className="max-w-3xl mx-auto bg-white py-4 md:py-8 px-4 sm:px-6 lg:px-10 mt-2 md:mt-4 rounded-lg shadow-xl">
      <div className="flex items-center mb-8 border-b pb-5 border-gray-200">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">Patent Submission</h1>
          <p className="mt-1.5 text-sm text-gray-500">Fill in the details for your patent filing.</p>
        </div>
      </div>


      <div className="mb-6 px-2 pt-2">
        <div className="md:hidden mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {STEP_CONFIG_PATENT[currentStep].title}
          </h2>
        </div>


        <nav aria-label="Progress" className="hidden md:block">
          <ol role="list" className="flex items-center">
            {STEP_CONFIG_PATENT.map((step, stepIdx) => (
              <li key={step.title} className={`relative ${stepIdx !== STEP_CONFIG_PATENT.length - 1 ? 'pr-8 sm:pr-10 md:pr-12' : ''} flex-1`}>
                {stepIdx < currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-1 w-full bg-indigo-600" />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setCurrentStep(stepIdx); setErrors({}); }}
                      className="relative w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Check className="w-6 h-6 text-white" aria-hidden="true" />
                      <span className="sr-only">{step.title} - Completed</span>
                      <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-medium text-indigo-600 truncate">{step.title}</span>
                    </button>
                  </>
                ) : stepIdx === currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-1 w-full bg-gray-200" />
                    </div>
                    <div
                      className="relative w-10 h-10 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full ring-2 ring-indigo-300"
                      aria-current="step"
                    >
                      {step.icon && <step.icon className="w-5 h-5 text-indigo-600" aria-hidden="true" />}
                      <span className="sr-only">{step.title} - Current</span>
                      <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-bold text-indigo-600 truncate">{step.title}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-1 w-full bg-gray-200" />
                    </div>
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




      <div className="bg-white ">
        <form noValidate onSubmit={handleSubmit}>
          <div className="min-h-[400px] px-1.5 mt-10">
            {renderStepContent()}
            {errors.submit && (
              <p className="mt-6 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {errors.submit}
              </p>
            )}
          </div>


          <div className="mt-3 pt-6 flex justify-between items-center border-t border-gray-200 px-1.5">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="px-7 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <div />
            )}


            {currentStep < STEP_CONFIG_PATENT.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:bg-indigo-400"
                onClick={handleSubmit}
              >
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


export default Patent;