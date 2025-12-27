import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  Video,
  Monitor
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function OnlineCourseForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "Choose an option",
    modeOfCourse: "Click to choose",
    courseType: "Click to choose",
    otherCourseType: "",
    courseName: "",
    typeOfOrganizer: "Choose an option",
    otherTypeOfOrganizer: "",
    organizationName: "",
    organizationAddress: "",
    levelOfEvent: "Click to choose",
    duration: "Choose an option",
    otherDuration: "",
    startDate: "",
    endDate: "",
    courseCategory: "Click to choose",
    otherCourseCategory: "",
    gradeObtained: "",
    typeOfSponsorship: "Click to choose",
    otherTypeOfSponsorship: "",
    claimedFor: "Click to choose",
    otherClaimedFor: "",
    documentProof: null,
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Options
  const specialLabsOptions = [
    "Choose an option",
    "Yes",
    "No"
  ];

  const modeOfCourseOptions = [
    "Click to choose",
    "Online",
    "Offline",
    "Hybrid"
  ];

  const courseTypeOptions = [
    "Click to choose",
    "NPTEL",
    "Coursera",
    "Udemy",
    "Others"
  ];

   const typeOfOrganizerOptions = [
    "Choose an option",
    "Bit",
    "Industry",
    "Foreign institute",
    "Others",
    "Institute"
  ];

  const levelOfEventOptions = [
    "Click to choose",
    "International",
    "National",
    "State",
    "Regional",
    "Local"
  ];

  const durationOptions = [
    "Choose an option",
    "1 Week",
    "2 Weeks",
    "4 Weeks",
    "8 Weeks",
    "12 Weeks",
    "Other"
  ];

  const courseCategoryOptions = [
    "Click to choose",
    "FDP",
    "Certification",
    "Workshop",
    "Other"
  ];
  
  const typeOfSponsorshipOptions = [
      "Click to choose",
      "Self",
      "Bit",
      "Funding Agency",
      "Other"
  ];

  const claimedForOptions = [
    "Click to choose",
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
    if (!formData.specialLabsInvolved || formData.specialLabsInvolved === "Choose an option") newErrors.specialLabsInvolved = "Selection is required";
    if (!formData.modeOfCourse || formData.modeOfCourse === "Click to choose") newErrors.modeOfCourse = "Mode of Course is required";
    
    if (!formData.courseType || formData.courseType === "Click to choose") newErrors.courseType = "Course Type is required";
    if (formData.courseType === "Others" && !formData.otherCourseType) newErrors.otherCourseType = "Please specify Course Type";

    if (!formData.courseName) newErrors.courseName = "Course Name is required";
    
    if (!formData.typeOfOrganizer || formData.typeOfOrganizer === "Choose an option") newErrors.typeOfOrganizer = "Type of Organizer is required";
    if (formData.typeOfOrganizer === "Others" && !formData.otherTypeOfOrganizer) newErrors.otherTypeOfOrganizer = "Please specify Organizer Type";

    if (!formData.organizationName) newErrors.organizationName = "Organization Name is required";
    if (!formData.organizationAddress) newErrors.organizationAddress = "Organization Address is required";
    if (!formData.levelOfEvent || formData.levelOfEvent === "Click to choose") newErrors.levelOfEvent = "Level of Event is required";
    
    if (!formData.duration || formData.duration === "Choose an option") newErrors.duration = "Duration is required";
    if (formData.duration === "Other" && !formData.otherDuration) newErrors.otherDuration = "Please specify Duration";

    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";
    
    if (!formData.courseCategory || formData.courseCategory === "Click to choose") newErrors.courseCategory = "Course Category is required";
    if (formData.courseCategory === "Other" && !formData.otherCourseCategory) newErrors.otherCourseCategory = "Please specify Category";

    if (!formData.gradeObtained) newErrors.gradeObtained = "Grade Obtained is required";
    
    if (!formData.typeOfSponsorship || formData.typeOfSponsorship === "Click to choose") newErrors.typeOfSponsorship = "Type of Sponsorship is required";
    if (formData.typeOfSponsorship === "Other" && !formData.otherTypeOfSponsorship) newErrors.otherTypeOfSponsorship = "Please specify Sponsorship";

    if (!formData.claimedFor || formData.claimedFor === "Click to choose") newErrors.claimedFor = "Claimed For is required";
    if (formData.claimedFor === "Other" && !formData.otherClaimedFor) newErrors.otherClaimedFor = "Please specify";

    if (!formData.documentProof) newErrors.documentProof = "Certificate Proof is required";
    
    // Date Logic
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End Date cannot be before Start Date";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting form for: Online Courses", formData);
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
                Add Online Course Details
            </h1>
            <p className="text-sm text-gray-500">
                Create record for Online Courses completed
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

            {/* Mode & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="modeOfCourse" className="block text-sm font-medium text-gray-700 mb-1">
                        Mode of course <RequiredAst />
                    </label>
                    <select
                        name="modeOfCourse"
                        id="modeOfCourse"
                        value={formData.modeOfCourse}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.modeOfCourse ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {modeOfCourseOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.modeOfCourse && <p className="mt-1 text-sm text-red-600">{errors.modeOfCourse}</p>}
                </div>

                <div>
                    <label htmlFor="courseType" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Type <RequiredAst />
                    </label>
                    <select
                        name="courseType"
                        id="courseType"
                        value={formData.courseType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.courseType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {courseTypeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.courseType && <p className="mt-1 text-sm text-red-600">{errors.courseType}</p>}
                    
                    {formData.courseType === "Others" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherCourseType"
                                value={formData.otherCourseType}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherCourseType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Course Type"
                            />
                            {errors.otherCourseType && <p className="mt-1 text-sm text-red-600">{errors.otherCourseType}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Course Name & Organizer Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="courseName"
                        id="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.courseName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Course Name"
                    />
                    {errors.courseName && <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>}
                </div>

                 <div>
                    <label htmlFor="typeOfOrganizer" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of organizer <RequiredAst />
                    </label>
                    <select
                        name="typeOfOrganizer"
                        id="typeOfOrganizer"
                        value={formData.typeOfOrganizer}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfOrganizer ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {typeOfOrganizerOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.typeOfOrganizer && <p className="mt-1 text-sm text-red-600">{errors.typeOfOrganizer}</p>}

                    {formData.typeOfOrganizer === "Others" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherTypeOfOrganizer"
                                value={formData.otherTypeOfOrganizer}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherTypeOfOrganizer ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Organizer Type"
                            />
                            {errors.otherTypeOfOrganizer && <p className="mt-1 text-sm text-red-600">{errors.otherTypeOfOrganizer}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Organiztion Details */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="organizationName"
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Organization Name"
                    />
                    {errors.organizationName && <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>}
                </div>

                <div>
                    <label htmlFor="organizationAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Address <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="organizationAddress"
                        id="organizationAddress"
                        value={formData.organizationAddress}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.organizationAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                         placeholder="Enter Address"
                    />
                    {errors.organizationAddress && <p className="mt-1 text-sm text-red-600">{errors.organizationAddress}</p>}
                </div>
            </div>

            {/* Level & Duration */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="levelOfEvent" className="block text-sm font-medium text-gray-700 mb-1">
                        Level of Event <RequiredAst />
                    </label>
                    <select
                        name="levelOfEvent"
                        id="levelOfEvent"
                        value={formData.levelOfEvent}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.levelOfEvent ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {levelOfEventOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.levelOfEvent && <p className="mt-1 text-sm text-red-600">{errors.levelOfEvent}</p>}
                </div>

                 <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration <RequiredAst />
                    </label>
                     <select
                        name="duration"
                        id="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {durationOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                    
                    {formData.duration === "Other" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherDuration"
                                value={formData.otherDuration}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherDuration ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Duration"
                            />
                            {errors.otherDuration && <p className="mt-1 text-sm text-red-600">{errors.otherDuration}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Dates */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>
                 <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
            </div>
            
            {/* Category & Grade */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="courseCategory" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Category <RequiredAst />
                    </label>
                    <select
                        name="courseCategory"
                        id="courseCategory"
                        value={formData.courseCategory}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.courseCategory ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {courseCategoryOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.courseCategory && <p className="mt-1 text-sm text-red-600">{errors.courseCategory}</p>}

                    {formData.courseCategory === "Other" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherCourseCategory"
                                value={formData.otherCourseCategory}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherCourseCategory ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Category"
                            />
                            {errors.otherCourseCategory && <p className="mt-1 text-sm text-red-600">{errors.otherCourseCategory}</p>}
                        </div>
                    )}
                </div>

                 <div>
                    <label htmlFor="gradeObtained" className="block text-sm font-medium text-gray-700 mb-1">
                        Grade obtained <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="gradeObtained"
                        id="gradeObtained"
                        value={formData.gradeObtained}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.gradeObtained ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="e.g. A, 9.0"
                    />
                    {errors.gradeObtained && <p className="mt-1 text-sm text-red-600">{errors.gradeObtained}</p>}
                </div>
            </div>

            {/* Sponsorship & Claims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {typeOfSponsorshipOptions.map(option => (
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

                 <div>
                    <label htmlFor="claimedFor" className="block text-sm font-medium text-gray-700 mb-1">
                        Claimed for <RequiredAst />
                    </label>
                    <select
                        name="claimedFor"
                        id="claimedFor"
                        value={formData.claimedFor}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.claimedFor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {claimedForOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.claimedFor && <p className="mt-1 text-sm text-red-600">{errors.claimedFor}</p>}

                    {formData.claimedFor === "Other" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherClaimedFor"
                                value={formData.otherClaimedFor}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherClaimedFor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify"
                            />
                            {errors.otherClaimedFor && <p className="mt-1 text-sm text-red-600">{errors.otherClaimedFor}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Document Proof */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Certificate Proof <RequiredAst />
                </label>
                <div
                    className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${
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
