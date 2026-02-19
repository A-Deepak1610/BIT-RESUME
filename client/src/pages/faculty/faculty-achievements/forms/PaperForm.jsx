import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  CreditCard,
  User,
  Users
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function PaperForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "Choose an option",
    otherAuthorsBIT: "Choose an option",
    facultyOtherInstitute: "Choose an option",
    industrialPersonInvolved: "Choose an option",
    internationalCollaboration: "Choose an option",
    conferenceName: "",
    eventMode: "Choose an option",
    eventOrganizer: "Choose an option",
    otherEventOrganizer: "",
    eventLevel: "Choose an option",
    paperTitle: "",
    eventStartDate: "",
    eventEndDate: "",
    eventDurationDays: "",
    publishedInProceedings: "Choose an option",
    typeOfSponsorship: "Click to choose",
    otherTypeOfSponsorship: "",
    studentsInvolved: "Choose an option",
    registrationAmount: "",
    documentProof: null,
    awardCashPrizeReceiver: ""
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Options
  const yesNoOptions = ["Choose an option", "Yes", "No"];
  const eventModeOptions = ["Choose an option", "Online", "Offline", "Hybrid"];
  const eventOrganizerOptions = ["Choose an option", "Bit", "Industry", "Foreign institute", "Others", "Institute"];
  const eventLevelOptions = ["Choose an option", "International", "National", "State", "Regional", "Local"];
  const sponsorshipOptions = ["Click to choose", "Self", "Bit", "Funding Agency", "Other"];

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
      setFormData((prev) => ({ ...prev, documentProof: e.target.files[0] }));
      if (errors.documentProof) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.documentProof;
          return newErrors;
        });
      }
    }
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, documentProof: null }));
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({ ...prev, documentProof: e.dataTransfer.files[0] }));
      if (errors.documentProof) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.documentProof;
            return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.taskID) newErrors.taskID = "Task ID is required";
    if (formData.specialLabsInvolved === "Choose an option") newErrors.specialLabsInvolved = "Selection is required";
    if (formData.otherAuthorsBIT === "Choose an option") newErrors.otherAuthorsBIT = "Selection is required";
    if (formData.facultyOtherInstitute === "Choose an option") newErrors.facultyOtherInstitute = "Selection is required";
    if (formData.industrialPersonInvolved === "Choose an option") newErrors.industrialPersonInvolved = "Selection is required";
    if (formData.internationalCollaboration === "Choose an option") newErrors.internationalCollaboration = "Selection is required";
    
    if (!formData.conferenceName) newErrors.conferenceName = "Conference Name is required";
    if (formData.eventMode === "Choose an option") newErrors.eventMode = "Event Mode is required";
    
    if (formData.eventOrganizer === "Choose an option") newErrors.eventOrganizer = "Event Organizer is required";
    if (formData.eventOrganizer === "Others" && !formData.otherEventOrganizer) newErrors.otherEventOrganizer = "Please specify Event Organizer";

    if (formData.eventLevel === "Choose an option") newErrors.eventLevel = "Event Level is required";
    if (!formData.paperTitle) newErrors.paperTitle = "Paper Title is required";
    
    if (!formData.eventStartDate) newErrors.eventStartDate = "Start Date is required";
    if (!formData.eventEndDate) newErrors.eventEndDate = "End Date is required";
    if (!formData.eventDurationDays) newErrors.eventDurationDays = "Duration is required";
    
    if (formData.publishedInProceedings === "Choose an option") newErrors.publishedInProceedings = "Selection is required";
    
    if (formData.typeOfSponsorship === "Click to choose") newErrors.typeOfSponsorship = "Sponsorship Type is required";
    if (formData.typeOfSponsorship === "Other" && !formData.otherTypeOfSponsorship) newErrors.otherTypeOfSponsorship = "Please specify Sponsorship";

    if (formData.studentsInvolved === "Choose an option") newErrors.studentsInvolved = "Selection is required";
    
    if (!formData.documentProof) newErrors.documentProof = "Proof Document is required";
    if (!formData.awardCashPrizeReceiver) newErrors.awardCashPrizeReceiver = "Award / Cash / Prize received detail is required";

     // Date Logic
    if (formData.eventStartDate && formData.eventEndDate) {
      if (new Date(formData.eventEndDate) < new Date(formData.eventStartDate)) {
        newErrors.eventEndDate = "End Date cannot be before Start Date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting form for: Paper Presentation", formData);
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
                Add Paper Presentation Details
            </h1>
            <p className="text-sm text-gray-500">
                Create record for Paper Presentations in Conferences
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
                        {yesNoOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.specialLabsInvolved && <p className="mt-1 text-sm text-red-600">{errors.specialLabsInvolved}</p>}
                </div>
            </div>

            {/* Authors & Collaboration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="otherAuthorsBIT" className="block text-sm font-medium text-gray-700 mb-1">
                        Other Authors from BIT <RequiredAst />
                    </label>
                    <select
                        name="otherAuthorsBIT"
                        id="otherAuthorsBIT"
                        value={formData.otherAuthorsBIT}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.otherAuthorsBIT ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {yesNoOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.otherAuthorsBIT && <p className="mt-1 text-sm text-red-600">{errors.otherAuthorsBIT}</p>}
                </div>

                <div>
                    <label htmlFor="facultyOtherInstitute" className="block text-sm font-medium text-gray-700 mb-1">
                        Faculty Member from Other Institute <RequiredAst />
                    </label>
                    <select
                        name="facultyOtherInstitute"
                        id="facultyOtherInstitute"
                        value={formData.facultyOtherInstitute}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.facultyOtherInstitute ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {yesNoOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.facultyOtherInstitute && <p className="mt-1 text-sm text-red-600">{errors.facultyOtherInstitute}</p>}
                </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label htmlFor="industrialPersonInvolved" className="block text-sm font-medium text-gray-700 mb-1">
                        Whether Industrial Person Involved <RequiredAst />
                    </label>
                    <select
                        name="industrialPersonInvolved"
                        id="industrialPersonInvolved"
                        value={formData.industrialPersonInvolved}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.industrialPersonInvolved ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {yesNoOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.industrialPersonInvolved && <p className="mt-1 text-sm text-red-600">{errors.industrialPersonInvolved}</p>}
                </div>
                 <div>
                     <label htmlFor="internationalCollaboration" className="block text-sm font-medium text-gray-700 mb-1">
                        Collaboration with any International Institute / University <RequiredAst />
                    </label>
                    <select
                        name="internationalCollaboration"
                        id="internationalCollaboration"
                        value={formData.internationalCollaboration}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.internationalCollaboration ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {yesNoOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.internationalCollaboration && <p className="mt-1 text-sm text-red-600">{errors.internationalCollaboration}</p>}
                </div>
             </div>

            {/* Conference Details */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="conferenceName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name of Conference <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="conferenceName"
                        id="conferenceName"
                        value={formData.conferenceName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.conferenceName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Conference Name"
                    />
                    {errors.conferenceName && <p className="mt-1 text-sm text-red-600">{errors.conferenceName}</p>}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="eventOrganizer" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Organizer <RequiredAst />
                    </label>
                    <select
                        name="eventOrganizer"
                        id="eventOrganizer"
                        value={formData.eventOrganizer}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventOrganizer ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {eventOrganizerOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                     {errors.eventOrganizer && <p className="mt-1 text-sm text-red-600">{errors.eventOrganizer}</p>}

                     {formData.eventOrganizer === "Others" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherEventOrganizer"
                                value={formData.otherEventOrganizer}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherEventOrganizer ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Event Organizer"
                            />
                            {errors.otherEventOrganizer && <p className="mt-1 text-sm text-red-600">{errors.otherEventOrganizer}</p>}
                        </div>
                    )}
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

            {/* Paper Title & Dates */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="paperTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Paper Title <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="paperTitle"
                        id="paperTitle"
                        value={formData.paperTitle}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.paperTitle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Paper Title"
                    />
                     {errors.paperTitle && <p className="mt-1 text-sm text-red-600">{errors.paperTitle}</p>}
                </div>
                 <div>
                     <label htmlFor="eventDurationDays" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Duration (Days) <RequiredAst />
                    </label>
                    <input
                        type="number"
                        name="eventDurationDays"
                        id="eventDurationDays"
                        value={formData.eventDurationDays}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eventDurationDays ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                         placeholder="e.g. 2"
                    />
                    {errors.eventDurationDays && <p className="mt-1 text-sm text-red-600">{errors.eventDurationDays}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label htmlFor="eventStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                         Event Start Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="eventStartDate"
                        id="eventStartDate"
                        value={formData.eventStartDate}
                        onChange={handleChange}
                         className={`mt-1 block w-full px-3 py-2 border ${errors.eventStartDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.eventStartDate && <p className="mt-1 text-sm text-red-600">{errors.eventStartDate}</p>}
                </div>
                 <div>
                     <label htmlFor="eventEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                         Event End Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="eventEndDate"
                        id="eventEndDate"
                        value={formData.eventEndDate}
                        onChange={handleChange}
                         className={`mt-1 block w-full px-3 py-2 border ${errors.eventEndDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.eventEndDate && <p className="mt-1 text-sm text-red-600">{errors.eventEndDate}</p>}
                </div>
            </div>

            {/* Publication, Sponsorship & Others */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="publishedInProceedings" className="block text-sm font-medium text-gray-700 mb-1">
                        Paper Published in Conference Proceedings <RequiredAst />
                    </label>
                    <select
                        name="publishedInProceedings"
                        id="publishedInProceedings"
                        value={formData.publishedInProceedings}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.publishedInProceedings ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {yesNoOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.publishedInProceedings && <p className="mt-1 text-sm text-red-600">{errors.publishedInProceedings}</p>}
                </div>
                 <div>
                    <label htmlFor="typeOfSponsorship" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Sponsorship <RequiredAst />
                    </label>
                     <select
                        name="typeOfSponsorship"
                        id="typeOfSponsorship"
                        value={formData.typeOfSponsorship}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfSponsorship ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {sponsorshipOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.typeOfSponsorship && <p className="mt-1 text-sm text-red-600">{errors.typeOfSponsorship}</p>}

                    {formData.typeOfSponsorship === "Other" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherTypeOfSponsorship"
                                value={formData.otherTypeOfSponsorship}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherTypeOfSponsorship ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Sponsorship"
                            />
                            {errors.otherTypeOfSponsorship && <p className="mt-1 text-sm text-red-600">{errors.otherTypeOfSponsorship}</p>}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="studentsInvolved" className="block text-sm font-medium text-gray-700 mb-1">
                        Students Involved <RequiredAst />
                    </label>
                    <select
                        name="studentsInvolved"
                        id="studentsInvolved"
                        value={formData.studentsInvolved}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.studentsInvolved ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {yesNoOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.studentsInvolved && <p className="mt-1 text-sm text-red-600">{errors.studentsInvolved}</p>}
                </div>
                 <div>
                    <label htmlFor="registrationAmount" className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Amount (in Rs.)
                    </label>
                    <input
                        type="number"
                        name="registrationAmount"
                        id="registrationAmount"
                        value={formData.registrationAmount}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g. 5000"
                    />
                </div>
            </div>

             {/* Award Prize */}
            <div>
                 <label htmlFor="awardCashPrizeReceiver" className="block text-sm font-medium text-gray-700 mb-1">
                     Award / Cash / Prize received <RequiredAst />
                 </label>
                 <textarea
                    name="awardCashPrizeReceiver"
                    id="awardCashPrizeReceiver"
                    rows="3"
                    value={formData.awardCashPrizeReceiver}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.awardCashPrizeReceiver ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Provide details if any person involved ask his details and options"
                ></textarea>
                 {errors.awardCashPrizeReceiver && <p className="mt-1 text-sm text-red-600">{errors.awardCashPrizeReceiver}</p>}
            </div>

             {/* Document Proof */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Proof (Certificate & Proceeding page if applicable) <RequiredAst />
                </label>
                <div
                    className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                        errors.documentProof 
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
                                    name="documentProof"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PDF, JPG, PNG up to 10MB
                        </p>
                    </div>
                </div>
                {formData.documentProof && (
                    <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                        <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                        <span className="font-medium mr-2 truncate">
                            {formData.documentProof.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                            ({(formData.documentProof.size / 1024 / 1024).toFixed(2)} MB)
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
                {errors.documentProof && <p className="mt-1 text-sm text-red-600">{errors.documentProof}</p>}
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
