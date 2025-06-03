import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios'; // <<<<<<<<<<<<< ADDED: Import axios
import {
CalendarDays as IconSchedule,
FileText as IconBasicDetails,
UploadCloud as IconUploads,
CheckSquare as IconLearning,
Info as IconReview,
MapPin as IconLocation,
Link as IconLink,
Loader2, X, Check, CheckCircle, Upload, ChevronDown, FileText, Users, Award as IconCertificate
} from 'lucide-react';

const DEBUG_MODE = true;

const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_FORMATS_LABEL = `Supported formats: PDF, PNG, JPG (max ${MAX_FILE_SIZE_MB}MB)`;
const ACCEPT_STRING = ".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf";

// --- Helper Components ---
const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

// --- Input Field Component ---
const InputField = ({ id, name, label, value, onChange, type = "text", placeholder, error, helperText, required, readOnly = false, className = "" }) => (

  <div className={`mb-4 ${className}`}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`mt-1 block w-full px-3 py-2 border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


// --- Select Field Component ---
const SelectField = ({ id, name, label, value, onChange, options, placeholder, error, helperText, required, className = "" }) => (

  <div className={`mb-4 ${className}`}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full px-3 py-2 pr-10 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none`}
      >
        <option value="">{placeholder || "Select an option"}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
    {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


// --- Textarea Field Component ---
const TextareaField = ({ id, name, label, value, onChange, placeholder, error, helperText, required, rows = 3, className = "" }) => (

  <div className={`mb-4 ${className}`}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`mt-1 block w-full px-3 py-2 border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
    />
    {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


// --- Radio Group Component ---
const RadioGroupField = ({ name, label, value, onChange, options, error, required, className = "" }) => (

  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <RequiredAst />}
    </label>
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          />
          <span className="text-sm text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


// --- File Upload Component ---
const FileUploadField = ({
id, name, label, onFileSelect, selectedFile, error, helperText, required, setFormError, className = ""
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
if(event.target) event.target.value = null; // Allow re-uploading the same file
};

const handleDrop = (event) => {
event.preventDefault();
event.stopPropagation();
setIsDragging(false);
if (event.dataTransfer.files && event.dataTransfer.files[0]) {
processFile(event.dataTransfer.files[0]);
if (event.dataTransfer.items) {
event.dataTransfer.items.clear();
} else {
event.dataTransfer.clearData();
}
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
<div className={`mb-6 ${className}`}>
<label className="block text-sm font-medium text-gray-700 mb-1">
{label} {required && <RequiredAst />}
</label>
<div
className={`mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 ${ error ? 'border-red-500' : 'border-gray-300' } border-dashed rounded-md transition-colors duration-150 ${ isDragging ? 'bg-indigo-50 border-indigo-500' : 'bg-white hover:border-gray-400' }`}
onDrop={handleDrop}
onDragOver={(e) => commonDragEvent(e)}
onDragEnter={(e) => commonDragEvent(e, true)}
onDragLeave={(e) => {
if (!e.currentTarget.contains(e.relatedTarget)) {
commonDragEvent(e, false)
}
}}
onClick={triggerFileInput}
style={{ cursor: 'pointer' }}
>
<Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
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


const eventTypeOptions = [
{ value: 'workshop', label: 'Workshop' }, { value: 'seminar', label: 'Seminar' },
{ value: 'conference', label: 'Conference' }, { value: 'webinar', label: 'Webinar' },
{ value: 'training', label: 'Training Program' }, { value: 'fdp', label: 'Faculty Development Program (FDP)' },
{ value: 'stp', label: 'Short Term Program (STP)' }, { value: 'hackathon', label: 'Hackathon' },
{ value: 'symposium', label: 'Symposium' }, { value: 'other', label: 'Other' },
];
const deliveryModeOptions = [
{ value: 'online', label: 'Online' }, { value: 'offline', label: 'Offline' },
{ value: 'hybrid', label: 'Hybrid' },
];
const eventNatureOptions = [
{ value: 'academic', label: 'Academic' }, { value: 'technical', label: 'Technical' },
{ value: 'professional_dev', label: 'Professional Development' }, { value: 'research_oriented', label: 'Research Oriented' },
{ value: 'skill_enhancement', label: 'Skill Enhancement' }, { value: 'entrepreneurship', label: 'Entrepreneurship' },
{ value: 'other', label: 'Other' },
];
const participationRoleOptions = [
{ value: 'attendee', label: 'Attendee' },
{ value: 'presenter', label: 'Presenter' },
{ value: 'both', label: 'Both' },
];

// --- Step Validation Functions ---
const validateStep1_Event = (formData) => {
const errors = {};
if (!formData.eventTitle.trim()) errors.eventTitle = 'Title of the Event is required.';
if (!formData.eventType) errors.eventType = 'Type of Event is required.';
if (!formData.deliveryMode) errors.deliveryMode = 'Mode of Delivery is required.';
if (!formData.eventNature) errors.eventNature = 'Event Nature is required.';
if (!formData.organizedBy.trim()) errors.organizedBy = 'Organized By is required.';
if (!formData.location.trim()) errors.location = 'Event Location / Platform is required.';
return errors;
};

const validateStep2_Event = (formData) => {
const errors = {};
if (!formData.eventStartDate) errors.eventStartDate = 'Event Start Date is required.';
if (!formData.eventEndDate) errors.eventEndDate = 'Event End Date is required.';
else if (formData.eventStartDate && new Date(formData.eventEndDate) < new Date(formData.eventStartDate)) {
errors.eventEndDate = 'End Date cannot be before Start Date.';
}
if (!formData.participationRole) errors.participationRole = 'Participation Role is required.';
return errors;
};

const validateStep3_Event = (formData) => {
const errors = {};
if (formData.isCertificateProvided && !formData.certificate) {
errors.certificate = 'Certificate of Participation is required as indicated.';
}
if (!formData.eventLink.trim()) {
    errors.eventLink = 'Link to Event Page / Recording is required.';
} else if (!/^https?:\/\/.+\..+/.test(formData.eventLink.trim())) {
    errors.eventLink = 'Please enter a valid URL (e.g., https://example.com).';
}
return errors;
};

const validateStep4_Event = (formData) => {
const errors = {};
if (!formData.topicsCovered.trim()) errors.topicsCovered = 'Topics Covered is required.';
if (!formData.skillsGained.trim()) errors.skillsGained = 'Skills or Knowledge Gained is required.';
if (!formData.relevance.trim()) errors.relevance = 'Relevance to Academic or Career Path is required.';
return errors;
};

// --- Step Components ---
const EventStep1_BasicDetails = ({ formData, handleChange, errors }) => (
  <div className="space-y-2">
     <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <IconBasicDetails className="h-6 w-6 text-indigo-600 mr-3" /> Basic Event Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <InputField
            id="eventTitle" name="eventTitle" label="Title of the Event"
            value={formData.eventTitle} onChange={handleChange} error={errors.eventTitle}
            placeholder="Enter event title" required className="md:col-span-2"
        />
        <SelectField
            id="eventType" name="eventType" label="Type of Event"
            value={formData.eventType} onChange={handleChange} options={eventTypeOptions}
            placeholder="Select event type" error={errors.eventType} required
        />
        <SelectField
            id="deliveryMode" name="deliveryMode" label="Mode of Delivery"
            value={formData.deliveryMode} onChange={handleChange} options={deliveryModeOptions}
            placeholder="Select delivery mode" error={errors.deliveryMode} required
        />
        <SelectField
            id="eventNature" name="eventNature" label="Event Nature"
            value={formData.eventNature} onChange={handleChange} options={eventNatureOptions}
            placeholder="Select event nature" error={errors.eventNature} required
        />
        <InputField
            id="organizedBy" name="organizedBy" label="Organized By"
            value={formData.organizedBy} onChange={handleChange} error={errors.organizedBy}
            placeholder="Organization name" required
        />
        <InputField
            id="location" name="location" label="Event Location / Platform"
            value={formData.location} onChange={handleChange} error={errors.location}
            placeholder="e.g., Grand Hall, New York / Online via Zoom"
            helperText="Specify the city, venue, or the online platform where the event was held."
            required className="md:col-span-2"
        />
    </div>
  </div>
);


const EventStep2_ScheduleParticipation = ({ formData, handleChange, errors }) => (
  <div className="space-y-2">
    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <IconSchedule className="h-6 w-6 text-indigo-600 mr-3" /> Schedule & Duration
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <InputField
            id="eventStartDate" name="eventStartDate" label="Event Start Date" type="date"
            value={formData.eventStartDate} onChange={handleChange} error={errors.eventStartDate} required
        />
        <InputField
            id="eventEndDate" name="eventEndDate" label="Event End Date" type="date"
            value={formData.eventEndDate} onChange={handleChange} error={errors.eventEndDate} required
        />
    </div>
    <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <Users className="h-5 w-5 text-indigo-500 mr-2" /> Participation Type
        </h3>
        <RadioGroupField
            name="participationRole" label="Participation Role"
            value={formData.participationRole} onChange={handleChange}
            options={participationRoleOptions} error={errors.participationRole} required
            className="md:col-span-2"
        />
    </div>
  </div>
);


const EventStep3_Documentation = ({ formData, handleFileSelect, handleChange, errors, setFormError }) => (
  <div className="space-y-2">
    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <IconUploads className="h-6 w-6 text-indigo-600 mr-3" /> Documentation & Links
    </h2>
    <div className="grid grid-cols-1 gap-y-0">
        <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    name="isCertificateProvided"
                    checked={formData.isCertificateProvided}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Certificate of Participation Provided?</span>
            </label>
            {errors.isCertificateProvided && <p className="mt-1 text-sm text-red-600">{errors.isCertificateProvided}</p>}
        </div>

{formData.isCertificateProvided && (
<FileUploadField
id="certificate" name="certificate" label="Upload Certificate"
selectedFile={formData.certificate} onFileSelect={handleFileSelect}
error={errors.certificate} required={formData.isCertificateProvided} setFormError={setFormError}
helperText={SUPPORTED_FORMATS_LABEL}
/>
)}

<InputField
    id="eventLink" name="eventLink" label="Link to Event Page / Recording / YouTube"
    value={formData.eventLink} onChange={handleChange} error={errors.eventLink}
    placeholder="e.g., https://example.com/event or https://youtu.be/videoID"
    helperText="A valid link to the event page or recording is required (e.g., https://example.com)"
    required
/>
</div>
  </div>
);


const EventStep4_LearningRelevance = ({ formData, handleChange, errors }) => (
  <div className="space-y-2">
    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <IconLearning className="h-6 w-6 text-indigo-600 mr-3" /> Learning & Relevance
    </h2>
    <div className="grid grid-cols-1 gap-4 md:gap-6">
        <TextareaField
            id="topicsCovered" name="topicsCovered" label="Topics Covered"
            value={formData.topicsCovered} onChange={handleChange} error={errors.topicsCovered}
            placeholder="List key topics covered, separated by commas (e.g., AI, CAD, Project Management)"
            rows={3} className="md:col-span-2" required
        />
        <TextareaField
            id="skillsGained" name="skillsGained" label="Skills or Knowledge Gained"
            value={formData.skillsGained} onChange={handleChange} error={errors.skillsGained}
            placeholder="Describe skills or knowledge you gained from this event"
            rows={4} className="md:col-span-2" required
        />
        <TextareaField
            id="relevance" name="relevance" label="Relevance to Academic or Career Path"
            value={formData.relevance} onChange={handleChange} error={errors.relevance}
            placeholder="How is this event relevant to your academic or career goals?"
            rows={4} className="md:col-span-2" required
        />
    </div>
  </div>
);


const EventStep5_Review = ({ formData }) => {
const DetailItem = ({ label, value, isFile = false, isBoolean = false }) => (
<div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
<dt className="text-sm font-medium text-gray-600">{label}:</dt>
<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-words whitespace-pre-wrap">
{isBoolean ? (value ? 'Yes' : 'No') :
isFile && value ? (
<span className="flex items-center">
<FileText size={14} className="inline mr-1 text-gray-500" />
{value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
</span>
) : ( value || 'N/A' )}
</dd>
</div>
);

return (
<div className="space-y-8">
<h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
<IconReview className="h-6 w-6 text-indigo-600 mr-3" /> Review Your Submission
</h2>
<p className="text-sm text-gray-500 mb-6">Please review all the information carefully before submitting.</p>

<div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Basic Event Details</h3>
        <dl className="divide-y divide-gray-200">
            <DetailItem label="Title of the Event" value={formData.eventTitle} />
            <DetailItem label="Type of Event" value={eventTypeOptions.find(o => o.value === formData.eventType)?.label} />
            <DetailItem label="Mode of Delivery" value={deliveryModeOptions.find(o => o.value === formData.deliveryMode)?.label} />
            <DetailItem label="Event Nature" value={eventNatureOptions.find(o => o.value === formData.eventNature)?.label} />
            <DetailItem label="Organized By" value={formData.organizedBy} />
            <DetailItem label="Event Location / Platform" value={formData.location} />
        </dl>
    </div>
    <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Schedule & Participation</h3>
        <dl className="divide-y divide-gray-200">
            <DetailItem label="Event Start Date" value={formData.eventStartDate} />
            <DetailItem label="Event End Date" value={formData.eventEndDate} />
            <DetailItem label="Participation Role" value={participationRoleOptions.find(o => o.value === formData.participationRole)?.label} />
        </dl>
    </div>
    <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Documentation & Links</h3>
        <dl className="divide-y divide-gray-200">
            <DetailItem label="Certificate Provided" value={formData.isCertificateProvided} isBoolean={true} />
            {formData.isCertificateProvided && <DetailItem label="Certificate Uploaded" value={formData.certificate} isFile />}
            <DetailItem label="Link to Event Page / Recording" value={formData.eventLink} />
        </dl>
    </div>
    <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Learning & Relevance</h3>
        <dl className="divide-y divide-gray-200">
            <DetailItem label="Topics Covered" value={formData.topicsCovered} />
            <DetailItem label="Skills or Knowledge Gained" value={formData.skillsGained} />
            <DetailItem label="Relevance to Academic or Career Path" value={formData.relevance} />
        </dl>
    </div>
</div>
);
};

// --- Main SeminarOrWorkshop Component ---
const STEP_CONFIG_EVENT = [
{ title: 'Basic Details', validate: validateStep1_Event, icon: IconBasicDetails },
{ title: 'Schedule & Participation', validate: validateStep2_Event, icon: IconSchedule },
{ title: 'Docs & Links', validate: validateStep3_Event, icon: IconUploads },
{ title: 'Learning & Relevance', validate: validateStep4_Event, icon: IconLearning },
{ title: 'Review', icon: IconReview },
];

const SeminarOrWorkshop = ({ onBack, initialData = {} }) => {
const [currentStep, setCurrentStep] = useState(0);
const [errors, setErrors] = useState({});
const [submitSuccess, setSubmitSuccess] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false); // <<<<<<<<<<<<< ADDED: isSubmitting state

const [formData, setFormData] = useState({
eventTitle: initialData.eventTitle || '',
eventType: initialData.eventType || '',
deliveryMode: initialData.deliveryMode || '',
eventNature: initialData.eventNature || '',
organizedBy: initialData.organizedBy || '',
location: initialData.location || '',
eventStartDate: initialData.eventStartDate || '',
eventEndDate: initialData.eventEndDate || '',
participationRole: initialData.participationRole || '',
isCertificateProvided: initialData.isCertificateProvided ?? false,
certificate: initialData.certificate || null,
eventLink: initialData.eventLink || '',
topicsCovered: initialData.topicsCovered || '',
skillsGained: initialData.skillsGained || '',
relevance: initialData.relevance || '',
});

const handleChange = useCallback((e) => {
const { name, value, type, checked } = e.target;

setErrors(prevErrors => {
const newErrors = { ...prevErrors };
delete newErrors[name];
if (name === 'isCertificateProvided' && !checked) {
delete newErrors.certificate;
}
return newErrors;
});

const valToSet = type === 'checkbox' ? checked : value;

setFormData(prev => {
const newState = { ...prev, [name]: valToSet };
if (name === 'isCertificateProvided' && !valToSet) {
newState.certificate = null;
}
return newState;
});
}, []);

const handleFileSelect = useCallback(({ target: { name, value } }) => {
setErrors(prevErrors => {
const newErrors = { ...prevErrors };
delete newErrors[name];
return newErrors;
});
setFormData(prev => ({ ...prev, [name]: value }));
}, []);

const setFormErrorForFile = useCallback((fieldName, errorMessage) => {
setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
}, []);


const validateCurrentStep = useCallback(() => {
const currentStepConfig = STEP_CONFIG_EVENT[currentStep];
let currentStepErrors = {};
if (currentStepConfig && currentStepConfig.validate) {
currentStepErrors = currentStepConfig.validate(formData);
}
setErrors(currentStepErrors);
return Object.keys(currentStepErrors).length === 0;
}, [currentStep, formData]);

const nextStep = useCallback(() => {
if (!validateCurrentStep()) {
if (DEBUG_MODE) console.log("[NextStep] Validation failed for current step:", currentStep, "Errors:", errors);
window.scrollTo(0, 0);
return;
}
setCurrentStep(prev => Math.min(prev + 1, STEP_CONFIG_EVENT.length - 1));
window.scrollTo(0, 0);
setErrors({});
}, [validateCurrentStep, currentStep, errors]);

const prevStep = useCallback(() => {
setCurrentStep(prev => Math.max(prev - 1, 0));
window.scrollTo(0, 0);
setErrors({});
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
if (currentStep !== STEP_CONFIG_EVENT.length - 1) {
if (DEBUG_MODE) console.warn("[handleSubmit] Called, but not on review step. Current step:", currentStep);
return;
}

setIsSubmitting(true); // <<<<<<<<<<<<< ADDED: Set submitting true
setErrors({}); // Clear previous submission errors

let allValid = true;
let firstErrorStep = -1;
const combinedValidationErrors = {};

for (let i = 0; i < STEP_CONFIG_EVENT.length -1; i++) {
const stepConfig = STEP_CONFIG_EVENT[i];
if (stepConfig.validate) {
const stepErrors = stepConfig.validate(formData);
if (Object.keys(stepErrors).length > 0) {
allValid = false;
if (firstErrorStep === -1) firstErrorStep = i;
Object.assign(combinedValidationErrors, stepErrors);
}
}
}

if (!allValid) {
setErrors(combinedValidationErrors);
if (firstErrorStep !== -1) {
setCurrentStep(firstErrorStep);
}
window.scrollTo(0,0);
if (DEBUG_MODE) console.error("[handleSubmit] Full form validation failed. Errors:", combinedValidationErrors);
setErrors(prev => ({ ...prev, submit: 'Please correct the errors highlighted in the form.' }));
setIsSubmitting(false); // <<<<<<<<<<<<< ADDED: Set submitting false
return;
}

const payload = new FormData();
payload.append('event_title', formData.eventTitle.trim());
payload.append('event_type', formData.eventType);
payload.append('delivery_mode', formData.deliveryMode);
payload.append('event_nature', formData.eventNature);
payload.append('organized_by', formData.organizedBy.trim());
payload.append('location', formData.location.trim());
payload.append('event_start_date', formData.eventStartDate);
payload.append('event_end_date', formData.eventEndDate);
payload.append('participation_role', formData.participationRole);
payload.append('is_certificate_provided', formData.isCertificateProvided.toString()); // 'true' or 'false'
payload.append('event_link', formData.eventLink.trim());
payload.append('topics_covered', formData.topicsCovered.trim());
payload.append('skills_gained', formData.skillsGained.trim());
payload.append('relevance', formData.relevance.trim());

if (formData.certificate instanceof File) {
    payload.append('certificate', formData.certificate, formData.certificate.name);
}


if (DEBUG_MODE) {
    console.log('[DEBUG] Submitting Event payload (snake_case):');
    for (let [key, value] of payload.entries()) {
        console.log(key, value instanceof File ? `${value.name} (File)` : value);
    }
}

try {
    const response = await axios.post('http://localhost:6001/api/workshops', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    if (DEBUG_MODE) console.log('Event submission successful:', response.data);
    setSubmitSuccess(true);
    window.scrollTo(0, 0);

} catch (error) {
    let errorMessage = 'Submission failed. Please try again.';
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
eventTitle: '', eventType: '', deliveryMode: '', eventNature: '',
organizedBy: '', location: '', eventStartDate: '', eventEndDate: '',
participationRole: '',
isCertificateProvided: false,
certificate: null, 
eventLink: '', topicsCovered: '', skillsGained: '', relevance: '',
});
setCurrentStep(0);
setSubmitSuccess(false);
setErrors({});
setIsSubmitting(false);
window.scrollTo(0, 0);
};

const renderStepContent = () => {
switch (currentStep) {
case 0: return <EventStep1_BasicDetails formData={formData} handleChange={handleChange} errors={errors} />;
case 1: return <EventStep2_ScheduleParticipation formData={formData} handleChange={handleChange} errors={errors} />;
case 2: return <EventStep3_Documentation formData={formData} handleFileSelect={handleFileSelect} handleChange={handleChange} errors={errors} setFormError={setFormErrorForFile} />;
case 3: return <EventStep4_LearningRelevance formData={formData} handleChange={handleChange} errors={errors} />;
case 4: return <EventStep5_Review formData={formData} />;
default: return null;
}
};

if (submitSuccess) {
return (
<div className="max-w-3xl mx-auto bg-white py-10 px-4 sm:px-6 lg:px-8 mt-4 text-center rounded-lg shadow-xl">
<div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-6 ring-4 ring-green-200">
<CheckCircle className="h-16 w-16 text-green-600" />
</div>
<h2 className="text-3xl font-bold text-gray-900 mb-3">Submission Successful!</h2>
<p className="text-gray-600 mb-8 text-lg">Your event details have been successfully submitted.</p>
 {errors.submit && <p className="my-4 text-md text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</p>}
<div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
<button
onClick={resetForm}
className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
Submit Another Event
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
<h1 className="text-3xl font-bold text-gray-900">Add Seminar / Workshop / Event</h1>
<p className="mt-1.5 text-sm text-gray-500">Log your participation or presentation in an event.</p>
</div>
</div>

<div className="mb-6 px-2 pt-2">
    <div className="md:hidden mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {STEP_CONFIG_EVENT[currentStep].title}
      </h2>
    </div>

<nav aria-label="Progress" className="hidden md:block">
  <ol role="list" className="flex items-center">
    {STEP_CONFIG_EVENT.map((step, stepIdx) => (
      <li key={step.title} className={`relative ${stepIdx !== STEP_CONFIG_EVENT.length - 1 ? 'pr-8 sm:pr-10 md:pr-12' : ''} flex-1`}>
        {stepIdx < currentStep ? (
          <>
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="h-1 w-full bg-indigo-600" />
            </div>
            <button
              type="button"
              onClick={() => { setCurrentStep(stepIdx); setErrors({}); }}
              disabled={isSubmitting} // <<<<<<<<<<<<< ADDED
              className="relative w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
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
            <div className={`group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full ${isSubmitting ? 'cursor-not-allowed' : ''}`}>
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
    <form noValidate>
      <div className="min-h-[400px] mb-8 px-1.5">
        {renderStepContent()}
        {errors.submit && (
          <p className="mt-6 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {errors.submit}
          </p>
        )}
      </div>

<div className="mt-10 pt-6 flex justify-between items-center border-t border-gray-200 px-1.5">
    {currentStep > 0 ? (
      <button
        type="button"
        onClick={prevStep}
        disabled={isSubmitting} // <<<<<<<<<<<<< ADDED
        className="px-7 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
      >
        Back
      </button>
    ) : (
      <div /> 
    )}

    {currentStep < STEP_CONFIG_EVENT.length - 1 ? (
      <button
        type="button"
        onClick={nextStep}
        disabled={isSubmitting} // <<<<<<<<<<<<< ADDED
        className="inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
      >
        Next
      </button>
    ) : (
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting} // <<<<<<<<<<<<< ADDED
        className="inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:bg-indigo-400"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    )}
  </div>
</form>
  </div>
</div>
);
};

export default SeminarOrWorkshop;