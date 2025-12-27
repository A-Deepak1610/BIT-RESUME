import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  BookOpen,
  Link as LinkIcon
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function JournalReviewerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "Choose an option",
    journalName: "",
    journalIndexing: "Choose an option",
    otherJournalIndexing: "",
    issnNo: "",
    publisherName: "",
    impactFactor: "",
    journalHomepageURL: "",
    recognitionType: "Choose an option",
    otherRecognitionType: "",
    numberOfPapersReviewed: "",
    date: "",
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

  const journalIndexingOptions = [
    "Choose an option",
    "SCI",
    "SCIE",
    "Scopus",
    "WoS",
    "UGC Care",
    "Other"
  ];

  const recognitionTypeOptions = [
    "Choose an option",
    "Certificate",
    "Letter of Appreciation",
    "Email Acknowledgement",
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
    if (!formData.journalName) newErrors.journalName = "Journal Name is required";
    if (!formData.journalIndexing || formData.journalIndexing === "Choose an option") newErrors.journalIndexing = "Journal Indexing is required";
    if (formData.journalIndexing === "Other" && !formData.otherJournalIndexing) newErrors.otherJournalIndexing = "Please specify";
    
    // ISSN No might be optional based on user prompt not having *, but let's check
    // User prompt: ISSN No (no star), Publisher Name*...
    // Only starred items are mandatory based on standard forms, but usually ISSN is good to have.
    // User prompt: ISSN No (no star). I will keep it optional.
    
    if (!formData.publisherName) newErrors.publisherName = "Publisher Name is required";
    // Impact Factor (no star)
    if (!formData.journalHomepageURL) newErrors.journalHomepageURL = "Journal Homepage URL is required";
    if (!formData.recognitionType || formData.recognitionType === "Choose an option") newErrors.recognitionType = "Types of Recognition is required";
    if (formData.recognitionType === "Other" && !formData.otherRecognitionType) newErrors.otherRecognitionType = "Please specify";

    if (!formData.numberOfPapersReviewed) newErrors.numberOfPapersReviewed = "Number of Papers Reviewed is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.documentProof) newErrors.documentProof = "Document Proof is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting form for: Journal Reviewer", formData);
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
                Add Journal Reviewer Details
            </h1>
            <p className="text-sm text-gray-500">
                Create record for Journal Reviewer activities
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

            {/* Journal Name & Indexing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="journalName" className="block text-sm font-medium text-gray-700 mb-1">
                        Journal Name <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="journalName"
                        id="journalName"
                        value={formData.journalName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.journalName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Journal Name"
                    />
                    {errors.journalName && <p className="mt-1 text-sm text-red-600">{errors.journalName}</p>}
                </div>
                
                <div>
                    <label htmlFor="journalIndexing" className="block text-sm font-medium text-gray-700 mb-1">
                        Journal Indexing <RequiredAst />
                    </label>
                    <select
                        name="journalIndexing"
                        id="journalIndexing"
                        value={formData.journalIndexing}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.journalIndexing ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {journalIndexingOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.journalIndexing && <p className="mt-1 text-sm text-red-600">{errors.journalIndexing}</p>}

                    {formData.journalIndexing === "Other" && (
                        <div className="mt-2">
                             <input
                                type="text"
                                name="otherJournalIndexing"
                                value={formData.otherJournalIndexing}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherJournalIndexing ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Indexing"
                            />
                            {errors.otherJournalIndexing && <p className="mt-1 text-sm text-red-600">{errors.otherJournalIndexing}</p>}
                        </div>
                    )}
                </div>
            </div>

             {/* ISSN & Publisher */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="issnNo" className="block text-sm font-medium text-gray-700 mb-1">
                        ISSN No
                    </label>
                    <input
                        type="text"
                        name="issnNo"
                        id="issnNo"
                        value={formData.issnNo}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter ISSN No"
                    />
                </div>

                <div>
                    <label htmlFor="publisherName" className="block text-sm font-medium text-gray-700 mb-1">
                        Publisher Name <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="publisherName"
                        id="publisherName"
                        value={formData.publisherName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.publisherName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Publisher Name"
                    />
                    {errors.publisherName && <p className="mt-1 text-sm text-red-600">{errors.publisherName}</p>}
                </div>
            </div>

            {/* Impact Factor & URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="impactFactor" className="block text-sm font-medium text-gray-700 mb-1">
                        Impact Factor of Journal
                    </label>
                    <input
                        type="text"
                        name="impactFactor"
                        id="impactFactor"
                        value={formData.impactFactor}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter Impact Factor"
                    />
                </div>

                <div>
                    <label htmlFor="journalHomepageURL" className="block text-sm font-medium text-gray-700 mb-1">
                        Journal Homepage URL <RequiredAst />
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="url"
                            name="journalHomepageURL"
                            id="journalHomepageURL"
                            value={formData.journalHomepageURL}
                            onChange={handleChange}
                            className={`block w-full pl-10 px-3 py-2 border ${errors.journalHomepageURL ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="https://example.com"
                        />
                    </div>
                    {errors.journalHomepageURL && <p className="mt-1 text-sm text-red-600">{errors.journalHomepageURL}</p>}
                </div>
            </div>

            {/* Recognition & Papers Reviewed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="recognitionType" className="block text-sm font-medium text-gray-700 mb-1">
                        Types of Recognition <RequiredAst />
                    </label>
                    <select
                        name="recognitionType"
                        id="recognitionType"
                        value={formData.recognitionType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.recognitionType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {recognitionTypeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.recognitionType && <p className="mt-1 text-sm text-red-600">{errors.recognitionType}</p>}
                    
                    {formData.recognitionType === "Other" && (
                        <div className="mt-2">
                             <input
                                type="text"
                                name="otherRecognitionType"
                                value={formData.otherRecognitionType}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherRecognitionType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Recognition"
                            />
                            {errors.otherRecognitionType && <p className="mt-1 text-sm text-red-600">{errors.otherRecognitionType}</p>}
                        </div>
                    )}
                </div>

                 <div>
                    <label htmlFor="numberOfPapersReviewed" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Papers Reviewed <RequiredAst />
                    </label>
                    <input
                        type="number"
                        name="numberOfPapersReviewed"
                        id="numberOfPapersReviewed"
                        value={formData.numberOfPapersReviewed}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfPapersReviewed ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="e.g. 5"
                    />
                    {errors.numberOfPapersReviewed && <p className="mt-1 text-sm text-red-600">{errors.numberOfPapersReviewed}</p>}
                </div>
            </div>

             {/* Dates */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                </div>
            </div>

            {/* Document Proof */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document proof (Mail/Letter/Certificate ‘as a single pdf’) <RequiredAst />
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
                            PDF only
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
