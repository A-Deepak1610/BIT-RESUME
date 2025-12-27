import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  Image as ImageIcon
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function GuestLectureForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "Choose an option",
    eventType: "Certification course",
    topic: "",
    modeOfConduct: "Choose an option",
    eventLevel: "Choose an option",
    eventName: "",
    fromDate: "",
    toDate: "",
    typeOfOrganization: "Choose an option",
    numberOfParticipants: "",
    typeOfAudience: "Choose an option",
    documentProof: null,
    apexProof: null,
    photos: null,
  });

  const [errors, setErrors] = useState({});
  const [docProofDragActive, setDocProofDragActive] = useState(false);
  const [apexProofDragActive, setApexProofDragActive] = useState(false);
  const [photosDragActive, setPhotosDragActive] = useState(false);

  // Options
  const specialLabsOptions = [
    "Choose an option",
    "Yes",
    "No"
  ];

  const modeOfConductOptions = [
    "Choose an option",
    "Online",
    "Offline"
  ];

  const eventLevelOptions = [
    "Choose an option",
    "International",
    "National",
    "State", 
    "Regional",
    "Local"
  ];

  const typeOfOrganizationOptions = [
    "Choose an option",
    "Bit",
    "Industry",
    "Foreign institute",
    "Others",
    "Institute"
  ];

  const typeOfAudienceOptions = [
    "Choose an option",
    "Students",
    "Faculty",
    "Research Scholars"
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

  // Drag and drop helper
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
    if (!formData.eventType) newErrors.eventType = "Event Type is required";
    if (!formData.topic) newErrors.topic = "Topic is required";
    if (!formData.modeOfConduct || formData.modeOfConduct === "Choose an option") newErrors.modeOfConduct = "Mode of Conduct is required";
    if (!formData.eventLevel || formData.eventLevel === "Choose an option") newErrors.eventLevel = "Event Level is required";
    if (!formData.eventName) newErrors.eventName = "Name of the Event is required";
    if (!formData.fromDate) newErrors.fromDate = "From Date is required";
    if (!formData.toDate) newErrors.toDate = "To Date is required";
    if (!formData.typeOfOrganization || formData.typeOfOrganization === "Choose an option") newErrors.typeOfOrganization = "Type of Organization is required";
    if (!formData.numberOfParticipants) newErrors.numberOfParticipants = "No of participants is required";
    if (!formData.typeOfAudience || formData.typeOfAudience === "Choose an option") newErrors.typeOfAudience = "Type of Audience is required";
    
    if (!formData.documentProof) newErrors.documentProof = "Document Proof is required";
    // Apex Proof (no star in prompt? But standard forms often require it. User prompt says simply 'Apex Proof'. I will keep it optional if not specified)
    // Actually user prompt looks like: Apex Proof \n No file chosen...
    // Let's assume generic file field. I won't mark it mandatory unless * is present. User prompt: "Apex Proof" (no star).
    // Wait, prompt: "Document Proof ... *", "Apex Proof", "Sample Photographs ... *"
    
    if (!formData.photos) newErrors.photos = "Sample Photographs are required";
    
    if (formData.fromDate && formData.toDate) {
      if (new Date(formData.toDate) < new Date(formData.fromDate)) {
        newErrors.toDate = "To Date cannot be before From Date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting form for: Guest Lectures", formData);
      navigate("/faculty/uploadview");
    }
  };

  // Helper function to calculate duration (No of Days)
  // This is read-only in the UI if based on dates, or can be an input. User prompt has 'No of Days*' as input.
  // I will make it an input but maybe auto-calc? Let's just make it input as per prompt.

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
                Add Guest Lecture Details
            </h1>
            <p className="text-sm text-gray-500">
                Create record for Guest Lecture Delivered
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

            {/* Event Type & Topic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="eventType"
                        id="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="e.g. Certification course"
                    />
                    {/* Assuming text input as user prompt shows "Certification course" text not dropdown choice */}
                    {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
                </div>
                
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                        Topic <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="topic"
                        id="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.topic ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Topic"
                    />
                    {errors.topic && <p className="mt-1 text-sm text-red-600">{errors.topic}</p>}
                </div>
            </div>

            {/* Mode & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="modeOfConduct" className="block text-sm font-medium text-gray-700 mb-1">
                        Mode of Conduct <RequiredAst />
                    </label>
                    <select
                        name="modeOfConduct"
                        id="modeOfConduct"
                        value={formData.modeOfConduct}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.modeOfConduct ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {modeOfConductOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.modeOfConduct && <p className="mt-1 text-sm text-red-600">{errors.modeOfConduct}</p>}
                </div>

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
            </div>

            {/* Name & Dates */}
             <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name of the Event <RequiredAst />
                </label>
                <input
                    type="text"
                    name="eventName"
                    id="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.eventName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter Event Name"
                />
                {errors.eventName && <p className="mt-1 text-sm text-red-600">{errors.eventName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
                        From Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="fromDate"
                        id="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.fromDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.fromDate && <p className="mt-1 text-sm text-red-600">{errors.fromDate}</p>}
                </div>
                <div>
                     <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
                        To Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="toDate"
                        id="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.toDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.toDate && <p className="mt-1 text-sm text-red-600">{errors.toDate}</p>}
                </div>
            </div>
            
            {/* Type Org & Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="typeOfOrganization" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Organization <RequiredAst />
                    </label>
                    <select
                        name="typeOfOrganization"
                        id="typeOfOrganization"
                        value={formData.typeOfOrganization}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfOrganization ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {typeOfOrganizationOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.typeOfOrganization && <p className="mt-1 text-sm text-red-600">{errors.typeOfOrganization}</p>}
                </div>

                <div>
                    <label htmlFor="numberOfParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                        No of participants attended <RequiredAst />
                    </label>
                    <input
                        type="number"
                        name="numberOfParticipants"
                        id="numberOfParticipants"
                        value={formData.numberOfParticipants}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfParticipants ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="e.g. 50"
                    />
                    {errors.numberOfParticipants && <p className="mt-1 text-sm text-red-600">{errors.numberOfParticipants}</p>}
                </div>
            </div>

            {/* Audience */}
             <div>
                <label htmlFor="typeOfAudience" className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Audience Covered <RequiredAst />
                </label>
                <select
                    name="typeOfAudience"
                    id="typeOfAudience"
                    value={formData.typeOfAudience}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfAudience ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                    {typeOfAudienceOptions.map(option => (
                        <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                    ))}
                </select>
                {errors.typeOfAudience && <p className="mt-1 text-sm text-red-600">{errors.typeOfAudience}</p>}
            </div>

            {/* Files: Doc, Apex, Contact */}
            <div className="space-y-6">
                {/* 1. Document Proof */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Proof (1.Request Letter / Mail Copy , 2.Confirmation Letter / Appreciation Letter, 3. Brochure as a single document) <RequiredAst />
                    </label>
                    <div
                        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                            errors.documentProof ? 'border-red-500' : docProofDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                        onDragEnter={(e) => handleDrag(e, setDocProofDragActive)}
                        onDragLeave={(e) => handleDrag(e, setDocProofDragActive)}
                        onDragOver={(e) => handleDrag(e, setDocProofDragActive)}
                        onDrop={(e) => handleDrop(e, 'documentProof', setDocProofDragActive)}
                        onClick={() => document.getElementById('doc-upload').click()}
                    >
                        <div className="space-y-1 text-center">
                            <UploadCloud className={`mx-auto h-12 w-12 ${docProofDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="doc-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="doc-upload" name="documentProof" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'documentProof')} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                     {formData.documentProof && (
                        <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                            <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                            <span className="font-medium mr-2 truncate">{formData.documentProof.name}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); clearFile('documentProof'); }} className="ml-auto text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                        </div>
                    )}
                    {errors.documentProof && <p className="mt-1 text-sm text-red-600">{errors.documentProof}</p>}
                </div>

                 {/* 2. Apex Proof (Optional as per implicit prompt, but lets check. Prompt says: Apex Proof [No file chosen]. Usually mandatory but no * char in prompt text supplied.) */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apex Proof
                    </label>
                    <div
                        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                            apexProofDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                        onDragEnter={(e) => handleDrag(e, setApexProofDragActive)}
                        onDragLeave={(e) => handleDrag(e, setApexProofDragActive)}
                        onDragOver={(e) => handleDrag(e, setApexProofDragActive)}
                        onDrop={(e) => handleDrop(e, 'apexProof', setApexProofDragActive)}
                        onClick={() => document.getElementById('apex-upload').click()}
                    >
                         <div className="space-y-1 text-center">
                            <UploadCloud className={`mx-auto h-12 w-12 ${apexProofDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="apex-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="apex-upload" name="apexProof" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'apexProof')} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                    {formData.apexProof && (
                         <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                            <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                            <span className="font-medium mr-2 truncate">{formData.apexProof.name}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); clearFile('apexProof'); }} className="ml-auto text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                        </div>
                    )}
                </div>

                {/* 3. Sample Photographs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sample Photographs (If online, screenshot is required. If offline, photograph is required) <RequiredAst />
                    </label>
                    <div
                        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                           errors.photos ? 'border-red-500' : photosDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                        onDragEnter={(e) => handleDrag(e, setPhotosDragActive)}
                        onDragLeave={(e) => handleDrag(e, setPhotosDragActive)}
                        onDragOver={(e) => handleDrag(e, setPhotosDragActive)}
                        onDrop={(e) => handleDrop(e, 'photos', setPhotosDragActive)}
                        onClick={() => document.getElementById('photo-upload').click()}
                    >
                         <div className="space-y-1 text-center">
                            <ImageIcon className={`mx-auto h-12 w-12 ${photosDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="photo-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="photo-upload" name="photos" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'photos')} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                    {formData.photos && (
                         <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                            <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                            <span className="font-medium mr-2 truncate">{formData.photos.name}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); clearFile('photos'); }} className="ml-auto text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                        </div>
                    )}
                    {errors.photos && <p className="mt-1 text-sm text-red-600">{errors.photos}</p>}
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
