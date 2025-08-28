import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    UploadCloud, CheckCircle, FileText, Award, Sparkles,
    ChevronLeft, X, Check, Upload, Info, Loader2, Settings2 as StepIcon1, Award as StepIcon2
} from 'lucide-react';
import useAuth from '../../../store/UseAuth';
import HackathonDetails from './cerificateTypes/HackathonDetails';
import OnlineCourseDetails from './cerificateTypes/OnlineCourseDetails'
import ParticipationDetails from './cerificateTypes/ParticipationDetails';


const DEBUG_MODE = true;
const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_FORMATS_LABEL = `Supported formats: PDF, PNG, JPG (max ${MAX_FILE_SIZE_MB}MB)`;
const ACCEPT_STRING = ".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf";


const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;




const FileUploadField = ({
    id, name, label, onFileSelect, selectedFile, error, helperText, required, setFormError, py = "py-10", existingFileName
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);


    const processFile = (file) => {
        if (setFormError) setFormError(name, ''); // Clear previous error for this field
        if (file) {
            const fileSizeMB = file.size / 1024 / 1024;
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                if (setFormError) setFormError(name, `File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB.`);
                onFileSelect({ target: { name, value: null } }); // Clear selection
                if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
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
                if (setFormError) setFormError(name, `Invalid file type. ${SUPPORTED_FORMATS_LABEL.replace(`(max ${MAX_FILE_SIZE_MB}MB)`, '').trim()}`);
                onFileSelect({ target: { name, value: null } }); // Clear selection
                if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
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
            if (fileInputRef.current) fileInputRef.current.files = event.dataTransfer.files;
        }
    };


    const commonDragEvent = (event, enter) => {
        event.preventDefault();
        event.stopPropagation();
        if (enter !== undefined) setIsDragging(enter);
    };


    const triggerFileInput = () => { fileInputRef.current?.click(); };


    const clearFile = (e) => {
        e.stopPropagation();
        if (setFormError) setFormError(name, '');
        if (fileInputRef.current) fileInputRef.current.value = "";
        onFileSelect({ target: { name, value: null } });
    };


    return (
        <div className="mb-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <RequiredAst />}
            </label>
            <div
                className={`mt-1 flex flex-col items-center justify-center px-6 ${py} border-2 ${error ? 'border-red-500' : (isDragging ? 'border-primary' : 'border-gray-300')} border-dashed rounded-md transition-colors duration-150 ${isDragging ? 'bg-primary-50' : 'bg-white hover:border-gray-400'}`}
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={(e) => commonDragEvent(e)}
                onDragEnter={(e) => commonDragEvent(e, true)}
                onDragLeave={(e) => {
                    if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
                        commonDragEvent(e, false);
                    }
                }}
                style={{ cursor: 'pointer' }}
            >
                <UploadCloud className={`mx-auto h-8 w-8 ${isDragging ? 'text-primary' : 'text-gray-400'} mb-2`} />
                <p className="text-sm text-primary hover:text-primary-dark font-medium">
                    Drag & drop or <span className="underline">browse files</span>
                </p>
                <input id={id} name={name} type="file" className="sr-only" onChange={handleFileChange} accept={ACCEPT_STRING} ref={fileInputRef} />
                <p className="text-xs text-gray-500 mt-1">{SUPPORTED_FORMATS_LABEL}</p>
            </div>
            {selectedFile && !error && (
                <div className="mt-2 flex items-center justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <span className="truncate flex items-center">
                        <FileText size={16} className="inline mr-2 text-gray-500 flex-shrink-0" />
                        <span className="truncate" title={selectedFile.name}>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </span>
                    <button type="button" onClick={clearFile} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0 p-1"> <X size={18} /> </button>
                </div>
            )}
            {existingFileName && !selectedFile && !error && (
                <div className="mt-2 flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <FileText size={16} className="inline mr-2 text-green-500 flex-shrink-0" />
                    <span>Current file: {existingFileName}. Upload a new file to replace it.</span>
                </div>
            )}
            {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};


const InputField = ({ id, name, label, value, onChange, error, placeholder, type = "text", required, helperText, readOnly = false, className = "", max, min }) => (
    <div className="mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <RequiredAst />}
        </label>
        <input
            type={type} name={name} id={id} value={value || ''} onChange={onChange} readOnly={readOnly} placeholder={placeholder} max={max} min={min}
            className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        />
        {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);


const SelectField = ({ id, name, label, value, onChange, error, required, helperText, children }) => (
    <div className="mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <RequiredAst />}
        </label>
        <select
            id={id} name={name} value={value || ''} onChange={onChange}
            className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
        >
            {children}
        </select>
        {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);


const SectionHeader = ({ title, icon: IconComponent }) => (
    <div className="flex items-center mb-4 pt-2 border-t border-gray-200 first:border-t-0 first:pt-0">
        {IconComponent && <IconComponent className="h-5 w-5 text-primary mr-2.5" />}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
);


const CERTIFICATE_TYPES = [
    { id: 'online-course', label: 'Online Course', icon: <FileText size={24} /> },
    { id: 'hackathon', label: 'Hackathon / Competition', icon: <Award size={24} /> },
    { id: 'participation', label: 'Participation / Volunteering', icon: <Sparkles size={24} /> },
];


const validateCertificateType = (formData) => {
    const errors = {};
    if (!formData.certificateType) errors.certificateType = 'Certificate type is required';
    return errors;
};


const validateSpecificDetails = (formData) => {
    let errors = {};
    const typeLabel = CERTIFICATE_TYPES.find(ct => ct.id === formData.certificateType)?.label || 'this type';


    if (!formData.linkedinLink?.trim()) {
        errors.linkedinLink = 'LinkedIn Post URL is required.';
    } 


    switch (formData.certificateType) {
        case 'online-course':
            if (!formData.certificateTitle?.trim()) errors.certificateTitle = 'Certificate title/description is required';
            if (!formData.issuedBy?.trim()) errors.issuedBy = 'Issuing organization/body is required';
            if (!formData.issueDate) errors.issueDate = 'Issue date is required';
            if (!formData.platform?.trim()) errors.platform = 'Platform is required';
            if (!formData.courseLink?.trim()) {
                errors.courseLink = 'Course link is required.';
            } else if (!/^(https?:\/\/)/i.test(formData.courseLink)) {
                errors.courseLink = 'Please enter a valid URL (e.g., http://example.com)';
            }
            if (!formData.startDate) errors.startDate = 'Start date is required';
            if (!formData.endDate) errors.endDate = 'End date is required';
            if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
                errors.dateOrder = 'End date cannot be before start date for the course.';
            }
            break;
        case 'hackathon':
            if (!formData.eventTitle?.trim()) errors.eventTitle = 'Event name is required';
            if (!formData.eventCode?.trim()) errors.eventCode = 'Event code is required';
            if (!formData.summary?.trim()) {
                errors.summary = 'Event summary is required';
            } else {
                const wordCount = formData.summary.trim().split(/\s+/).filter(Boolean).length;
                if (wordCount > 15) {
                    errors.summary = 'Summary must not exceed 15 words.';
                }
            }
            if (!formData.participationType) errors.participationType = 'Participation type is required';
            if (formData.participationType === 'Team' && !formData.teamId?.trim()) {
                errors.teamId = 'Team ID / Name is required for team participation';
            }
            if (!formData.winResult) errors.winResult = 'Result / Achievement is required';
            if (!formData.issueDate) errors.issueDate = 'Issue date is required';
            break;
        case 'participation':
            if (!formData.activity_type?.trim()) errors.activity_type = 'Activity / Event Name is required';
            if (!formData.summary?.trim()) {
                errors.summary = 'Summary is required';
            } else {
                const wordCount = formData.summary.trim().split(/\s+/).filter(Boolean).length;
                if (wordCount > 25) {
                    errors.summary = 'Summary must not exceed 25 words.';
                }
            }
            if (!formData.duration?.trim()) errors.duration = 'Duration is required';
            if (!formData.location?.trim()) errors.location = 'Location of Activity / Event is required';
            if (!formData.issueDate) errors.issueDate = 'Date of Activity/Issue is required';
            break;
        default:
            errors.certificateType = 'A valid certificate type must be selected to provide details.';
            break;
    }


    if (formData.certificateType && (!formData.certificateFile && !formData.existingFileId)) {
        errors.certificateFile = `Certificate/Proof file is required for ${typeLabel}.`;
    }


    if (DEBUG_MODE) console.log('[DEBUG] validateSpecificDetails - final errors for type', formData.certificateType, ':', errors);
    return errors;
};


const validateCombinedDetails = (formData) => {
    return validateSpecificDetails(formData);
};


const SelectCertificateTypeStep = ({ formData, setFormData, errors }) => (
    <div className="space-y-4">
        <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
                Certificate Type <RequiredAst />
            </h3>
            <p className="mt-1 text-sm text-gray-500 mb-6">Select the type of certificate you are uploading</p>
            {errors.certificateType && <p className="mt-1 text-sm text-red-600">{errors.certificateType}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {CERTIFICATE_TYPES.map((type) => (
                <button
                    type="button"
                    key={type.id}
                    onClick={() => setFormData((prev) => ({ ...prev, certificateType: type.id }))}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm text-center hover:shadow-md transition-all duration-200 h-32
                        ${formData.certificateType === type.id ? 'border-primary bg-primary-50' : 'border-gray-300 bg-white'}`}
                >
                    <div className={`p-2 rounded-full mb-2 ${formData.certificateType === type.id ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}`}>
                        {type.icon}
                    </div>
                    <span className={`text-sm font-medium ${formData.certificateType === type.id ? 'text-primary-dark' : 'text-gray-700'}`}>
                        {type.label}
                    </span>
                </button>
            ))}
        </div>
    </div>
);


const CombinedDetailsStep = ({
    formData, handleChange, errors, handleFileSelect, setFormError,
}) => {
    const commonProps = {
        formData, handleChange, errors, handleFileSelect, setFormError,
        InputField, SelectField, FileUploadField, RequiredAst, SectionHeader, FileText
    };


    return (
        <div className="space-y-4">
            {(() => {
                switch (formData.certificateType) {
                    case 'online-course': return <OnlineCourseDetails {...commonProps} />;
                    case 'hackathon': return <HackathonDetails {...commonProps} />;
                    case 'participation': return <ParticipationDetails {...commonProps} />;
                    default:
                        return (
                            <div className="text-center text-gray-500 py-10">
                                Please select a certificate type to proceed.
                            </div>
                        );
                }
            })()}
        </div>
    );
};


const ReviewStep = ({ formData, handleChange, errors = {} }) => {
    const getCertificateTypeLabel = (typeId) => CERTIFICATE_TYPES.find((t) => t.id === typeId)?.label || 'N/A';
   
    if (!formData?.certificateType) {
        return <div className="text-center text-gray-500 py-10">No certificate data to review. Please complete the previous steps.</div>;
    }


    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Core Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
                    <div>
                        <strong className="text-gray-600 block mb-0.5">Certificate Type:</strong>
                        <p className="text-gray-800 break-words">{getCertificateTypeLabel(formData.certificateType)}</p>
                        {errors.certificateType && <p className="text-xs text-red-600">{errors.certificateType}</p>}
                    </div>
                    <div>
                        <strong className="text-gray-600 block mb-0.5">Certificate/Proof File:</strong>
                        <p className="text-gray-800 break-words">
                            {formData.certificateFile
                                ? `${formData.certificateFile.name} (${(formData.certificateFile.size / 1024 / 1024).toFixed(2)} MB)`
                                : formData.existingFileId
                                    ? `Previously uploaded: ${formData.existingFileName || 'file'}`
                                    : 'N/A'}
                        </p>
                        {errors.certificateFile && <p className="text-xs text-red-600">{errors.certificateFile}</p>}
                    </div>
                    <div>
                        <strong className="text-gray-600 block mb-0.5">LinkedIn Profile:</strong>
                        <p className="text-gray-800 break-words">{formData.linkedinLink || 'N/A'}</p>
                        {errors.linkedinLink && <p className="text-xs text-red-600">{errors.linkedinLink}</p>}
                    </div>
                </div>
            </div>


            <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks / Notes (Optional by Student)
                </label>
                <textarea
                    id="remarks" name="remarks" rows={3} value={formData.remarks || ''} onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary sm:text-sm"
                    placeholder="Add any additional notes or remarks about this certificate"
                />
            </div>
        </div>
    );
};


const STEP_CONFIG = [
    { title: 'Certificate Type', validate: validateCertificateType, icon: <StepIcon1 /> },
    { title: 'Details & Upload', validate: validateCombinedDetails, icon: <StepIcon2 /> },
    { title: 'Review & Submit', icon: <CheckCircle /> },
];


const CertificateUpload = ({ onBack, initialData = {} }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { rollno } = useAuth();


    const getInitialFormData = (data = {}) => {
        const defaults = {
            rollno: '',
            certificateType: '',
            certificateTitle: '', issuedBy: '', issueDate: '',
            platform: '', startDate: '', endDate: '', courseLink: '',
            credentialId: '',
            eventTitle: '', eventCode: '', participationType: '', teamId: '', winResult: '',
            summary: '',
            activity_type: '',
            duration: '',
            location: '',
            remarks: '',
            linkedinLink: '',
            certificateFile: null, existingFileId: null, existingFileName: null,
        };


        let initial = { ...defaults, ...data };


        if (data.certificateType === 'online-course') {
            if (data.title) initial.certificateTitle = data.title;
            if (data.platform) initial.platform = data.platform;
            if (data.issued_by) initial.issuedBy = data.issued_by;
            if (data.issue_date) initial.issueDate = data.issue_date;
            if (data.start_date) initial.startDate = data.start_date;
            if (data.end_date) initial.endDate = data.end_date;
            if (data.course_link) initial.courseLink = data.course_link;
            if (data.credential_id) initial.credentialId = data.credential_id;
        } else if (data.certificateType === 'hackathon') {
            if (data.event_name) initial.eventTitle = data.event_name;
            if (data.event_code) initial.eventCode = data.event_code;
            if (data.summary) initial.summary = data.summary;
            if (data.participation_type) initial.participationType = data.participation_type;
            if (data.team_code) initial.teamId = data.team_code;
            if (data.did_you_win) initial.winResult = data.did_you_win;
            if (data.issue_date) initial.issueDate = data.issue_date;
        } else if (data.certificateType === 'participation') {
            if (data.activity_type) initial.activity_type = data.activity_type;
            if (data.summary) initial.summary = data.summary;
            if (data.duration) initial.duration = data.duration;
            if (data.location) initial.location = data.location;
            if (data.issue_date) initial.issueDate = data.issue_date;
        }


        if (data.remarks) initial.remarks = data.remarks;
        if (data.linkedinLink) initial.linkedinLink = data.linkedinLink;
        if (data.certificate_pdf && typeof data.certificate_pdf === 'string' && (data.id || data.fileId)) {
            initial.existingFileId = data.id || data.fileId;
            initial.existingFileName = data.certificate_pdf.split('/').pop() || data.certificate_pdf;
            initial.certificateFile = null;
        } else if (data.fileId && data.existingFileName) {
            initial.existingFileId = data.fileId;
            initial.existingFileName = data.existingFileName;
            initial.certificateFile = null;
        }


        if (data.rollno) initial.rollno = data.rollno;


        ['issueDate', 'startDate', 'endDate'].forEach(dateKey => {
            if (initial[dateKey] && typeof initial[dateKey] === 'string' && initial[dateKey].includes('T')) {
                initial[dateKey] = initial[dateKey].split('T')[0];
            }
        });


        return initial;
    };


    const [formData, setFormData] = useState(() => {
        return getInitialFormData({ ...initialData, rollno: rollno });
    });


    useEffect(() => {
        if (rollno && !formData.rollno) {
            setFormData(prev => ({ ...prev, rollno: rollno }));
        }
    }, [rollno, formData.rollno]);


    useEffect(() => {
        if (currentStep === 0 && formData.certificateType) {
            setFormData(prev => {
                const baseDefaults = getInitialFormData({});
                const isSameTypeAsInitial = initialData.certificateType === prev.certificateType;


                let newFormState = {
                    rollno: initialData.rollno || prev.rollno || baseDefaults.rollno,
                    certificateType: prev.certificateType,
                    remarks: isSameTypeAsInitial ? initialData.remarks || baseDefaults.remarks : baseDefaults.remarks,
                    linkedinLink: isSameTypeAsInitial ? initialData.linkedinLink || baseDefaults.linkedinLink : baseDefaults.linkedinLink,
                    certificateFile: null,
                    existingFileId: isSameTypeAsInitial && initialData.existingFileId ? initialData.existingFileId : baseDefaults.existingFileId,
                    existingFileName: isSameTypeAsInitial && initialData.existingFileId ? initialData.existingFileName : baseDefaults.existingFileName,
                };


                switch (prev.certificateType) {
                    case 'online-course':
                        newFormState.certificateTitle = isSameTypeAsInitial ? (initialData.title || baseDefaults.certificateTitle) : baseDefaults.certificateTitle;
                        newFormState.issuedBy = isSameTypeAsInitial ? (initialData.issued_by || baseDefaults.issuedBy) : baseDefaults.issuedBy;
                        newFormState.issueDate = isSameTypeAsInitial ? (initialData.issue_date || baseDefaults.issueDate) : baseDefaults.issueDate;
                        newFormState.platform = isSameTypeAsInitial ? (initialData.platform || baseDefaults.platform) : baseDefaults.platform;
                        newFormState.startDate = isSameTypeAsInitial ? (initialData.start_date || baseDefaults.startDate) : baseDefaults.startDate;
                        newFormState.endDate = isSameTypeAsInitial ? (initialData.end_date || baseDefaults.endDate) : baseDefaults.endDate;
                        newFormState.courseLink = isSameTypeAsInitial ? (initialData.course_link || baseDefaults.courseLink) : baseDefaults.courseLink;
                        newFormState.credentialId = isSameTypeAsInitial ? (initialData.credential_id || baseDefaults.credentialId) : baseDefaults.credentialId;
                        break;
                    case 'hackathon':
                        newFormState.eventTitle = isSameTypeAsInitial ? (initialData.event_name || baseDefaults.eventTitle) : baseDefaults.eventTitle;
                        newFormState.eventCode = isSameTypeAsInitial ? (initialData.event_code || baseDefaults.eventCode) : baseDefaults.eventCode;
                        newFormState.summary = isSameTypeAsInitial ? (initialData.summary || baseDefaults.summary) : baseDefaults.summary;
                        newFormState.participationType = isSameTypeAsInitial ? (initialData.participation_type || baseDefaults.participationType) : baseDefaults.participationType;
                        newFormState.teamId = isSameTypeAsInitial ? (initialData.team_code || baseDefaults.teamId) : baseDefaults.teamId;
                        newFormState.winResult = isSameTypeAsInitial ? (initialData.did_you_win || baseDefaults.winResult) : baseDefaults.winResult;
                        newFormState.issueDate = isSameTypeAsInitial ? (initialData.issue_date || baseDefaults.issueDate) : baseDefaults.issueDate;
                        break;
                    case 'participation':
                        newFormState.activity_type = isSameTypeAsInitial ? (initialData.activity_type || baseDefaults.activity_type) : baseDefaults.activity_type;
                        newFormState.summary = isSameTypeAsInitial ? (initialData.summary || baseDefaults.summary) : baseDefaults.summary;
                        newFormState.duration = isSameTypeAsInitial ? (initialData.duration || baseDefaults.duration) : baseDefaults.duration;
                        newFormState.location = isSameTypeAsInitial ? (initialData.location || baseDefaults.location) : baseDefaults.location;
                        newFormState.issueDate = isSameTypeAsInitial ? (initialData.issue_date || baseDefaults.issueDate) : baseDefaults.issueDate;
                        break;
                }
                if (DEBUG_MODE) console.log('[DEBUG] useEffect type change - new FormData:', JSON.parse(JSON.stringify(newFormState)));
                return { ...baseDefaults, ...newFormState };
            });
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.certificateType, currentStep]);


    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            if ((name === 'startDate' || name === 'endDate') && formData.certificateType === 'online-course') {
                delete newErrors.dateOrder;
            }
            if (name === 'participationType' && formData.certificateType === 'hackathon' && value === 'Individual') {
                setFormData(prevFd => ({ ...prevFd, teamId: '' }));
            }
            return newErrors;
        });
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, [formData.certificateType]);


    const handleFileSelect = useCallback(({ target: { name, value: file } }) => {
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });
        setFormData(prev => ({
            ...prev,
            [name]: file,
            existingFileId: file ? null : prev.existingFileId,
            existingFileName: file ? null : prev.existingFileName,
        }));
    }, []);


    const setFormErrorForFile = useCallback((fieldName, errorMessage) => {
        setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
    }, []);


    const validateCurrentStep = useCallback(() => {
        let stepErrors = {};
        const currentStepConfig = STEP_CONFIG[currentStep];
        if (currentStepConfig && currentStepConfig.validate) {
            stepErrors = currentStepConfig.validate(formData);
        }


        if (errors.certificateFile && !stepErrors.certificateFile) {
            stepErrors.certificateFile = errors.certificateFile;
        }


        setErrors(stepErrors);
        const isValid = Object.keys(stepErrors).length === 0;


        if (!isValid && currentStep < STEP_CONFIG.length - 1) {
            const firstErrorKey = Object.keys(stepErrors)[0];
            let errorElementId = firstErrorKey;


            if (formData.certificateType === 'participation') {
                if (firstErrorKey === 'activity_type') errorElementId = 'activity_typeParticipation';
                else if (firstErrorKey === 'summary') errorElementId = 'summaryParticipation';
                else if (firstErrorKey === 'duration') errorElementId = 'durationParticipation';
                else if (firstErrorKey === 'location') errorElementId = 'locationParticipation';
                else if (firstErrorKey === 'issueDate') errorElementId = 'issueDateParticipation';
            } else if (formData.certificateType === 'hackathon') {
                if (firstErrorKey === 'eventTitle') errorElementId = 'hackathonEventTitle';
                else if (firstErrorKey === 'summary') errorElementId = 'hackathonSummary';
                else if (firstErrorKey === 'issueDate') errorElementId = 'issueDate';
            }


            let errorElement = document.getElementById(errorElementId) ||
                document.querySelector(`[name="${firstErrorKey}"]`) ||
                (firstErrorKey === 'certificateFile' ? document.querySelector('label[for^="certificateFile"]')?.closest('div.mb-1') : null);


            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.scrollTo(0, 0);
            }
        }
        return isValid;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep, formData, errors.certificateFile]);


    const nextStep = useCallback(() => {
        if (currentStep === 0 && !formData.certificateType) {
            setErrors({ certificateType: 'Certificate type is required before proceeding.' }); return;
        }
        if (!validateCurrentStep()) return;
        setCurrentStep((prev) => Math.min(prev + 1, STEP_CONFIG.length - 1));
        window.scrollTo(0, 0);
        setErrors({});
    }, [validateCurrentStep, currentStep, formData.certificateType]);


    const prevStep = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        window.scrollTo(0, 0);
        setErrors({});
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (DEBUG_MODE) console.log('[DEBUG] handleSubmit - Attempting submission. Raw FormData State:', JSON.parse(JSON.stringify(formData)));
        setIsSubmitting(true);
        setErrors({});


        let allValid = true;
        let firstErrorStep = -1;
        const combinedValidationErrors = {};


        const typeErrors = STEP_CONFIG[0].validate(formData);
        if (Object.keys(typeErrors).length > 0) {
            allValid = false;
            if (firstErrorStep === -1) firstErrorStep = 0;
            Object.assign(combinedValidationErrors, typeErrors);
        }


        if (formData.certificateType) {
            const detailsErrors = STEP_CONFIG[1].validate(formData);
            if (Object.keys(detailsErrors).length > 0) {
                allValid = false;
                if (firstErrorStep === -1) firstErrorStep = 1;
                Object.assign(combinedValidationErrors, detailsErrors);
            }
        } else if (!combinedValidationErrors.certificateType) {
            allValid = false;
            if (firstErrorStep === -1) firstErrorStep = 0;
            combinedValidationErrors.certificateType = "Certificate type is required.";
        }


        if (errors.certificateFile && !combinedValidationErrors.certificateFile && formData.certificateType) {
            allValid = false;
            combinedValidationErrors.certificateFile = errors.certificateFile;
            if (firstErrorStep === -1 || firstErrorStep > 1) firstErrorStep = 1;
        }


        if (!allValid) {
            setErrors(prev => ({ ...prev, ...combinedValidationErrors, submit: 'Please correct the errors highlighted in the form.' }));
            if (firstErrorStep !== -1 && firstErrorStep !== currentStep) {
                setCurrentStep(firstErrorStep);
            }
            setTimeout(() => {
                const firstErrorKey = Object.keys(combinedValidationErrors)[0];
                if (firstErrorKey) {
                    let errorElementId = firstErrorKey;
                    if (formData.certificateType === 'participation') {
                        if (firstErrorKey === 'activity_type') errorElementId = 'activity_typeParticipation';
                        else if (firstErrorKey === 'summary') errorElementId = 'summaryParticipation';
                        else if (firstErrorKey === 'duration') errorElementId = 'durationParticipation';
                        else if (firstErrorKey === 'location') errorElementId = 'locationParticipation';
                        else if (firstErrorKey === 'issueDate') errorElementId = 'issueDateParticipation';
                    } else if (formData.certificateType === 'hackathon') {
                        if (firstErrorKey === 'eventTitle') errorElementId = 'hackathonEventTitle';
                        else if (firstErrorKey === 'summary') errorElementId = 'hackathonSummary';
                        else if (firstErrorKey === 'issueDate') errorElementId = 'issueDate';
                    }


                    let errorElement = document.getElementById(errorElementId) || document.querySelector(`[name="${firstErrorKey}"]`) ||
                        (firstErrorKey === 'certificateFile' ? document.querySelector('label[for^="certificateFile"]')?.closest('div.mb-1') : null);
                    if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    else window.scrollTo(0, 0);
                } else {
                    window.scrollTo(0, 0);
                }
            }, 100);
            setIsSubmitting(false);
            return;
        }
        setErrors((prev) => { delete prev.submit; return { ...prev }; });


        const submissionPayload = new FormData();
        submissionPayload.append('rollno', rollno);
        submissionPayload.append('certificate_type', formData.certificateType);


        if (formData.certificateFile) {
            submissionPayload.append('certificate_pdf', formData.certificateFile, formData.certificateFile.name);
        }


        if (formData.linkedinLink?.trim()) {
            submissionPayload.append('linkedinLink', formData.linkedinLink.trim());
        }


        let apiEndpoint = '';
        const baseApiUrl = 'http://localhost:6001/api/certificates';
        let httpMethod = initialData.id ? 'put' : 'post';


        switch (formData.certificateType) {
            case 'online-course':
                apiEndpoint = `${baseApiUrl}/online-course${initialData.id ? `/${initialData.id}` : ''}`;
                submissionPayload.append('title', formData.certificateTitle.trim());
                submissionPayload.append('platform', formData.platform.trim());
                submissionPayload.append('issued_by', formData.issuedBy.trim());
                submissionPayload.append('issue_date', formData.issueDate);
                submissionPayload.append('start_date', formData.startDate);
                submissionPayload.append('end_date', formData.endDate);
                submissionPayload.append('course_link', formData.courseLink.trim());
                if (formData.credentialId?.trim()) {
                    submissionPayload.append('credential_id', formData.credentialId.trim());
                }
                break;
            case 'hackathon':
                apiEndpoint = `${baseApiUrl}/events${initialData.id ? `/${initialData.id}` : ''}`;
                submissionPayload.append('event_name', formData.eventTitle.trim());
                if (formData.eventCode && formData.eventCode.trim()) {
                    submissionPayload.append('event_code', formData.eventCode.trim());
                }
                if (formData.summary && formData.summary.trim()) {
                    submissionPayload.append('summary', formData.summary.trim());
                }
                submissionPayload.append('participation_type', formData.participationType);
                if (formData.participationType === 'Team' && formData.teamId?.trim()) {
                    submissionPayload.append('team_code', formData.teamId.trim());
                } else {
                    submissionPayload.append('team_code', '');
                }
                submissionPayload.append('did_you_win', formData.winResult);
                submissionPayload.append('issue_date', formData.issueDate);
                break;
            case 'participation':
                apiEndpoint = `${baseApiUrl}/participation${initialData.id ? `/${initialData.id}` : ''}`;
                submissionPayload.append('activity_type', formData.activity_type.trim());
                if (formData.summary && formData.summary.trim()) {
                    submissionPayload.append('summary', formData.summary.trim());
                }
                submissionPayload.append('duration', formData.duration.trim());
                submissionPayload.append('location', formData.location.trim());
                submissionPayload.append('issue_date', formData.issueDate);
                break;
            default:
                if (DEBUG_MODE) console.log(`[DEBUG] handleSubmit - Certificate_type '${formData.certificateType}' is not configured for submission. Aborting.`);
                const typeLabel = CERTIFICATE_TYPES.find(t => t.id === formData.certificateType)?.label || formData.certificateType || "Selected type";
                setErrors({ submit: `Submission for '${typeLabel}' certificates is not yet implemented.` });
                setIsSubmitting(false);
                return;
        }


        if (formData.remarks?.trim()) {
            submissionPayload.append('remarks', formData.remarks.trim());
        }


        console.group(`%c[API Submission] - ${httpMethod.toUpperCase()} to ${apiEndpoint}`, 'color: #1e40af; font-weight: bold; font-size: 1.1em;');
        console.log('%cPayload Contents (starting with Roll No):', 'color: #4b5563; font-weight: bold;');
        for (let [key, value] of submissionPayload.entries()) {
            if (value instanceof File) {
                console.log(`  %c${key}:`, 'color: #1e3a8a; font-weight: bold;', {
                    name: value.name,
                    size: `${(value.size / 1024).toFixed(2)} KB`,
                    type: value.type,
                });
            } else {
                console.log(`  %c${key}:`, 'color: #1e3a8a; font-weight: bold;', `'${value}'`);
            }
        }
        console.groupEnd();


        try {
            const response = await axios({
                method: httpMethod,
                url: apiEndpoint,
                data: submissionPayload,
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            if (DEBUG_MODE) console.log('Form submitted successfully via Axios:', response.data);
            setSubmitSuccess(true);
            window.scrollTo(0, 0);
        } catch (error) {
            let errorMessage = 'Upload failed. Please try again.';
            if (axios.isAxiosError(error)) {
                console.error('Axios submission error:', error.response?.data || error.message, error.config);
                if (error.response?.data) {
                    const errorData = error.response.data;
                    if (typeof errorData === 'string') errorMessage = errorData;
                    else if (errorData.message) errorMessage = errorData.message;
                    else if (errorData.error) errorMessage = errorData.error;
                    else if (errorData.detail) errorMessage = errorData.detail;
                    else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                        const fieldErrors = Object.entries(errorData).map(([field, messages]) =>
                            `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
                        ).join('; ');
                        errorMessage = fieldErrors || JSON.stringify(errorData);
                    } else errorMessage = JSON.stringify(errorData);
                } else { errorMessage = error.message; }
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
        if (initialData.id && onBack) {
            onBack();
            return;
        }
        setFormData(getInitialFormData({ rollno: rollno }));
        setCurrentStep(0);
        setSubmitSuccess(false);
        setErrors({});
        setIsSubmitting(false);
        window.scrollTo(0, 0);
    };


    const renderStepContent = () => (
        <>
            {currentStep === 0 && (<SelectCertificateTypeStep formData={formData} setFormData={setFormData} errors={errors} />)}
            {currentStep === 1 && (<CombinedDetailsStep formData={formData} handleChange={handleChange} errors={errors} handleFileSelect={handleFileSelect} setFormError={setFormErrorForFile} />)}
            {currentStep === 2 && <ReviewStep formData={formData} handleChange={handleChange} errors={errors} />}
        </>
    );


    if (submitSuccess) {
        return (
            <div className="max-w-3xl mx-auto bg-white py-10 px-4 sm:px-6 lg:px-8 mt-4 text-center rounded-lg shadow-xl">
                <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-6 ring-4 ring-green-200"><CheckCircle className="h-16 w-16 text-green-600" /></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Certificate {initialData.id ? 'Updated' : 'Submitted'} Successfully!</h2>
                <p className="text-gray-600 mb-8 text-lg">Your certificate details have been {initialData.id ? 'updated and are pending review' : 'submitted for faculty verification'}.</p>
                {errors.submit && (<p className="my-4 text-md text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</p>)}
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button onClick={resetForm} className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        {initialData.id ? 'Back to Dashboard' : 'Upload Another Certificate'}
                    </button>
                    {onBack && !initialData.id && (<button onClick={onBack} className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Back to Dashboard</button>)}
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-3xl mx-auto bg-white py-4 md:py-8 px-4 sm:px-6 lg:px-10 mt-2 md:mt-4 rounded-lg shadow-xl overflow-x-hidden">
            <div className="flex items-center mb-6 border-b pb-4 border-gray-200">
                {onBack && currentStep === 0 && (<button onClick={onBack} className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Back to previous page"><ChevronLeft className="h-6 w-6 text-gray-600" /></button>)}
                <div><h1 className="text-2xl font-bold text-gray-900">{initialData.id ? 'Edit Certificate' : 'Upload New Certificate'}</h1><p className="mt-1 text-sm text-gray-500">Add your achievements and get them verified by faculty</p></div>
            </div>


            <div className="mb-6 px-2 pt-2">
                <div className="md:hidden mb-4"><h2 className="text-lg font-semibold text-gray-800">{STEP_CONFIG[currentStep].title}</h2></div>
                <nav aria-label="Progress" className="hidden md:block">
                    <ol role="list" className="flex items-center">
                        {STEP_CONFIG.map((step, stepIdx) => (
                            <li key={step.title} className={`relative ${stepIdx !== STEP_CONFIG.length - 1 ? 'pr-8 sm:pr-10 md:pr-12' : ''} flex-1`}>
                                {stepIdx < currentStep ? (
                                    <><div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-1 w-full bg-primary" /></div>
                                        <button type="button" onClick={() => { if (stepIdx < STEP_CONFIG.length - 1) { setCurrentStep(stepIdx); setErrors({}); } }} className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-full hover:bg-primary-dark focus:outline-none cursor-pointer" aria-label={`Go to step ${stepIdx + 1}: ${step.title} - Completed`}>
                                            <Check className="w-6 h-6 text-white" aria-hidden="true" /><span className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max max-w-[120px] text-center text-xs font-medium text-primary truncate">{step.title}</span></button></>
                                ) : stepIdx === currentStep ? (
                                    <><div className="absolute inset-0 flex items-center" aria-hidden="true"><div className={`h-1 w-1/2 ${stepIdx > 0 ? 'bg-primary' : 'bg-gray-200'}`} /><div className="h-1 w-1/2 bg-gray-200" /></div>
                                        <div className="relative w-10 h-10 flex items-center justify-center bg-white border-2 border-primary rounded-full" aria-current="step">
                                            {React.cloneElement(STEP_CONFIG[stepIdx].icon, { className: 'w-5 h-5 text-primary' })}<span className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max max-w-[120px] text-center text-xs font-bold text-primary truncate">{step.title}</span></div></>
                                ) : (
                                    <><div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-1 w-full bg-gray-200" /></div>
                                        <div className="group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full cursor-not-allowed" aria-label={`Step ${stepIdx + 1}: ${step.title} - Upcoming`}>
                                            {React.cloneElement(STEP_CONFIG[stepIdx].icon, { className: 'w-5 h-5 text-gray-400' })}<span className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max max-w-[120px] text-center text-xs font-medium text-gray-500 truncate">{step.title}</span></div></>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>


            <div className="bg-white py-6">
                <form noValidate onSubmit={currentStep === STEP_CONFIG.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
                    <div className="min-h-[350px] mb-8 px-1">
                        {renderStepContent()}
                        {errors.submit && (<p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</p>)}
                    </div>
                    <div className="mt-10 pt-5 flex justify-between items-center border-t border-gray-200 px-1">
                        {currentStep > 0 ? (<button type="button" onClick={prevStep} disabled={isSubmitting} className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 disabled:opacity-50">Back</button>) : (<div />)}
                        {currentStep < STEP_CONFIG.length - 1 ? (
                            <button type="button" onClick={nextStep} disabled={isSubmitting} className={`inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 bg-primary hover:bg-primary-dark cursor-pointer disabled:opacity-50`}>Next</button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className={`inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 bg-primary hover:bg-primary-dark cursor-pointer disabled:opacity-50 disabled:bg-primary-light`}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isSubmitting ? 'Submitting...' : (initialData.id ? 'Update Certificate' : 'Submit Certificate')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};


export default CertificateUpload;