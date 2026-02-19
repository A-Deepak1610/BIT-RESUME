import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  MapPin,
  Calendar
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function EventsAttendedForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "",
    eventType: "",
    organizerType: "",
    eventLevel: "",
    eventTitle: "",
    organizationSector: "",
    eventOrganizer: "",
    eventMode: "",
    eventDuration: "",
    startDate: "",
    endDate: "",
    durationInDays: "",
    otherOrganizerName: "",
    sponsorshipType: "",
    outcome: "",
    certificateProof: null,
    geotagPhotos: null,
    claimedFor: ""
  });

  const [errors, setErrors] = useState({});
  const [certificateDragActive, setCertificateDragActive] = useState(false);
  const [geotagDragActive, setGeotagDragActive] = useState(false);

  // Options
  const eventTypeOptions = [
    "Select Option",
    "Certificate course",
    "Conference attended-without presentation",
    "Educational fair",
    "Faculty exchange programme",
    "FDP",
    "Guest Lecture",
    "Non-technical events",
    "One credit course",
    "Orientation programme",
    "Seminar",
    "Session chair",
    "STTP",
    "Summer School",
    "Training",
    "Value-Added course",
    "Webinar",
    "Winter School",
    "Workshop",
    "Hands-On Training",
    "PS-Certification (BIT)",
    "NPTEL-FDP",
    "AICTE-UHV-FDP",
    "Innovation Ambassador- IIC Certificate",
    "CEE-ACO & BEI panelist workshop certificate",
    "Other"
  ];

  const organizerTypeOptions = [
    "Choose an option",
    "Bit",
    "Industry",
    "Foreign institute",
    "Others",
    "Institute"
  ];
  
  const eventLevelOptions = [
    "Choose an option",
    "International",
    "National",
    "State", 
    "Regional",
    "Local"
  ];

  const organizationSectorOptions = [
    "Choose an option",
    "Government",
    "Private"
  ];

  const eventModeOptions = [
    "Choose an option",
    "Online",
    "Offline"
  ];

  const eventDurationOptions = [
    "Choose an option",
    "Less than 1 day",
    "1 day",
    "2-5 days",
    "One week", 
    "More than a week"
  ];

  const sponsorshipTypeOptions = [
    "Click to choose",
    "SELF",
    "BIT",
    "Funding agency",
    "Others"
  ];

  const outcomeOptions = [
    "Click to choose",
    "Knowledge Gain",
    "Skill Development",
    "Networking",
    "Certification",
    "Research Insight",
    "Other"
  ];

  const specialLabsOptions = [
    "Choose an option",
    "Yes",
    "No"
  ];

    const claimedForOptions = [
    "Select Option",
    "FAP",
    "Competency",
    "Other"
  ];

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

  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files[0] }));
      if (errors[fieldName]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const clearFile = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: null }));
  };

  // Drag and drop handlers
  const handleDrag = (e, setDragActiveState) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveState(true);
    } else if (e.type === "dragleave") {
      setDragActiveState(false);
    }
  };

  const handleDrop = (e, fieldName, setDragActiveState) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveState(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.dataTransfer.files[0] }));
      if (errors[fieldName]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.taskID) newErrors.taskID = "Task ID is required";
    if (!formData.specialLabsInvolved || formData.specialLabsInvolved === "Choose an option") newErrors.specialLabsInvolved = "Selection is required";
    if (!formData.eventType || formData.eventType === "Select Option") newErrors.eventType = "Event Type is required";
    if (!formData.organizerType || formData.organizerType === "Choose an option") newErrors.organizerType = "Organizer Type is required";
    if (!formData.eventLevel || formData.eventLevel === "Choose an option") newErrors.eventLevel = "Event Level is required";
    if (!formData.eventTitle) newErrors.eventTitle = "Event Title is required";
    if (!formData.organizationSector || formData.organizationSector === "Choose an option") newErrors.organizationSector = "Organization Sector is required";
    if (!formData.eventOrganizer) newErrors.eventOrganizer = "Event Organizer is required";
    if (!formData.eventMode || formData.eventMode === "Choose an option") newErrors.eventMode = "Event Mode is required";
    if (!formData.eventDuration || formData.eventDuration === "Choose an option") newErrors.eventDuration = "Event Duration is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";
    if (!formData.durationInDays) newErrors.durationInDays = "Duration in days is required";
    if (!formData.sponsorshipType || formData.sponsorshipType === "Click to choose") newErrors.sponsorshipType = "Sponsorship Type is required";
    if (!formData.outcome || formData.outcome === "Click to choose") newErrors.outcome = "Outcome is required";
    if (!formData.certificateProof) newErrors.certificateProof = "Certificate Proof is required";
    if (!formData.geotagPhotos) newErrors.geotagPhotos = "Geotag Photos are required";
    if (!formData.claimedFor) newErrors.claimedFor = "Claimed For is required";

    // Conditional generic checks (if needed in future)
    if (formData.organizerType === "Others" && !formData.otherOrganizerName) {
         // If user wants this mandatory when 'Others' is selected
         // newErrors.otherOrganizerName = "Other Organizer Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting form for: Events Attended", formData);
      navigate("/faculty/uploadview");
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
                Add Events Attended Details
            </h1>
            <p className="text-sm text-gray-500">
                Create record for events attended
            </p>
            </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            {/* Task ID & Labs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="taskID" className="block text-sm font-medium text-gray-700 mb-1">
                        Task ID <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="taskID"
                        id="taskID"
                        value={formData.taskID}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.taskID ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Task ID"
                    />
                    {errors.taskID && <p className="mt-1 text-sm text-red-600">{errors.taskID}</p>}
                </div>

                <div>
                    <label htmlFor="specialLabsInvolved" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Labs Involved <RequiredAst />
                    </label>
                    <select
                        name="specialLabsInvolved"
                        id="specialLabsInvolved"
                        value={formData.specialLabsInvolved}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.specialLabsInvolved ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {specialLabsOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.specialLabsInvolved && <p className="mt-1 text-sm text-red-600">{errors.specialLabsInvolved}</p>}
                </div>
            </div>

            {/* Event Type & Organizer Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type <RequiredAst />
                    </label>
                    <select
                        name="eventType"
                        id="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {eventTypeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Select Option"}>{option}</option>
                        ))}
                    </select>
                    {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
                </div>
                
                <div>
                    <label htmlFor="organizerType" className="block text-sm font-medium text-gray-700 mb-1">
                        Organizer Type <RequiredAst />
                    </label>
                    <select
                        name="organizerType"
                        id="organizerType"
                        value={formData.organizerType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.organizerType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {organizerTypeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.organizerType && <p className="mt-1 text-sm text-red-600">{errors.organizerType}</p>}
                </div>
            </div>

            {/* Event Level & Helper for Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="eventLevel" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Level <RequiredAst />
                    </label>
                    <select
                        name="eventLevel"
                        id="eventLevel"
                        value={formData.eventLevel}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventLevel ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {eventLevelOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.eventLevel && <p className="mt-1 text-sm text-red-600">{errors.eventLevel}</p>}
                </div>

                {formData.organizerType === "Others" && (
                    <div>
                        <label htmlFor="otherOrganizerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Other Organizer Name 
                        </label>
                        <input
                            type="text"
                            name="otherOrganizerName"
                            id="otherOrganizerName"
                            value={formData.otherOrganizerName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Specify Organizer"
                        />
                    </div>
                )}
            </div>

            {/* Title & Sector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="eventTitle"
                        id="eventTitle"
                        value={formData.eventTitle}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventTitle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Title"
                    />
                    {errors.eventTitle && <p className="mt-1 text-sm text-red-600">{errors.eventTitle}</p>}
                </div>

                <div>
                    <label htmlFor="organizationSector" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Sector <RequiredAst />
                    </label>
                    <select
                        name="organizationSector"
                        id="organizationSector"
                        value={formData.organizationSector}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.organizationSector ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {organizationSectorOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.organizationSector && <p className="mt-1 text-sm text-red-600">{errors.organizationSector}</p>}
                </div>
            </div>

            {/* Organizer & Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="eventOrganizer" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Organizer <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="eventOrganizer"
                        id="eventOrganizer"
                        value={formData.eventOrganizer}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventOrganizer ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Name of Organizer"
                    />
                    {errors.eventOrganizer && <p className="mt-1 text-sm text-red-600">{errors.eventOrganizer}</p>}
                </div>

                <div>
                    <label htmlFor="eventMode" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Mode <RequiredAst />
                    </label>
                    <select
                        name="eventMode"
                        id="eventMode"
                        value={formData.eventMode}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventMode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {eventModeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.eventMode && <p className="mt-1 text-sm text-red-600">{errors.eventMode}</p>}
                </div>
            </div>

            {/* Duration Category & Actual Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label htmlFor="eventDuration" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Duration <RequiredAst />
                    </label>
                    <select
                        name="eventDuration"
                        id="eventDuration"
                        value={formData.eventDuration}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventDuration ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {eventDurationOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.eventDuration && <p className="mt-1 text-sm text-red-600">{errors.eventDuration}</p>}
                </div>
                 <div>
                    <label htmlFor="durationInDays" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (in days) <RequiredAst />
                    </label>
                    <input
                        type="number"
                        name="durationInDays"
                        id="durationInDays"
                        value={formData.durationInDays}
                        onChange={handleChange}
                         className={`mt-1 block w-full px-3 py-2 border ${errors.durationInDays ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="e.g. 2"
                    />
                    {errors.durationInDays && <p className="mt-1 text-sm text-red-600">{errors.durationInDays}</p>}
                </div>
            </div>

             {/* Dates */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Date (Start) <RequiredAst />
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                    </div>
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>
                 <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <RequiredAst />
                    </label>
                     <div className="relative">
                        <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                     </div>
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
            </div>

             {/* Sponsorship & Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="sponsorshipType" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Sponsorship <RequiredAst />
                    </label>
                    <select
                        name="sponsorshipType"
                        id="sponsorshipType"
                        value={formData.sponsorshipType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.sponsorshipType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {sponsorshipTypeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.sponsorshipType && <p className="mt-1 text-sm text-red-600">{errors.sponsorshipType}</p>}
                </div>
                 <div>
                    <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-1">
                        Outcome of the attended event <RequiredAst />
                    </label>
                    <select
                        name="outcome"
                        id="outcome"
                        value={formData.outcome}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.outcome ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {outcomeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.outcome && <p className="mt-1 text-sm text-red-600">{errors.outcome}</p>}
                </div>
            </div>

             {/* Claimed For */}
            <div>
                 <label htmlFor="claimedFor" className="block text-sm font-medium text-gray-700 mb-1">
                        Claimed For <RequiredAst />
                </label>
                <select
                    name="claimedFor"
                    id="claimedFor"
                    value={formData.claimedFor}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.claimedFor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                        {claimedForOptions.map(option => (
                        <option key={option} value={option} disabled={option === "Select Option"}>{option}</option>
                    ))}
                </select>
                {errors.claimedFor && <p className="mt-1 text-sm text-red-600">{errors.claimedFor}</p>}
            </div>


            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certificate Proof */}
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Certificate Proof <RequiredAst />
                        </label>
                        <div
                            className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${
                                errors.certificateProof 
                                    ? 'border-red-500' 
                                    : certificateDragActive 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : 'border-gray-300'
                            } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                            onDragEnter={(e) => handleDrag(e, setCertificateDragActive)}
                            onDragLeave={(e) => handleDrag(e, setCertificateDragActive)}
                            onDragOver={(e) => handleDrag(e, setCertificateDragActive)}
                            onDrop={(e) => handleDrop(e, 'certificateProof', setCertificateDragActive)}
                            onClick={() => document.getElementById('cert-upload').click()}
                        >
                            <div className="space-y-1 text-center">
                                <UploadCloud className={`mx-auto h-12 w-12 ${certificateDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="cert-upload"
                                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="cert-upload"
                                            name="certificateProof"
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => handleFileChange(e, 'certificateProof')}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF, JPG, PNG up to 10MB
                                </p>
                            </div>
                        </div>
                        {formData.certificateProof && (
                            <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                                <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                                <span className="font-medium mr-2 truncate">
                                    {formData.certificateProof.name}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    ({(formData.certificateProof.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile('certificateProof');
                                    }}
                                    className="ml-auto text-red-500 hover:text-red-700 p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        {errors.certificateProof && <p className="mt-1 text-sm text-red-600">{errors.certificateProof}</p>}
                </div>

                {/* Geotag Photos */}
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Geotag Photos <RequiredAst />
                        </label>
                        <div
                            className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${
                                errors.geotagPhotos 
                                    ? 'border-red-500' 
                                    : geotagDragActive 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : 'border-gray-300'
                            } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                            onDragEnter={(e) => handleDrag(e, setGeotagDragActive)}
                            onDragLeave={(e) => handleDrag(e, setGeotagDragActive)}
                            onDragOver={(e) => handleDrag(e, setGeotagDragActive)}
                            onDrop={(e) => handleDrop(e, 'geotagPhotos', setGeotagDragActive)}
                            onClick={() => document.getElementById('geotag-upload').click()}
                        >
                            <div className="space-y-1 text-center">
                                <MapPin className={`mx-auto h-12 w-12 ${geotagDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="geotag-upload"
                                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="geotag-upload"
                                            name="geotagPhotos"
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => handleFileChange(e, 'geotagPhotos')}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    IMG, PNG, JPG up to 10MB
                                </p>
                            </div>
                        </div>
                         {formData.geotagPhotos && (
                            <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                                <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                                <span className="font-medium mr-2 truncate">
                                    {formData.geotagPhotos.name}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    ({(formData.geotagPhotos.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile('geotagPhotos');
                                    }}
                                    className="ml-auto text-red-500 hover:text-red-700 p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        {errors.geotagPhotos && <p className="mt-1 text-sm text-red-600">{errors.geotagPhotos}</p>}
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
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Achievement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
