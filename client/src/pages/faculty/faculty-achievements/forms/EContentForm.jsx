import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  Link as LinkIcon
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

const API_URL = import.meta.env.VITE_API_URL;

export default function EContentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "no",
    eContentType: "",
    topicName: "",
    publisherName: "",
    publisherAddress: "",
    contactNo: "",
    urlOfContent: "",
    claimedFor: "",
    otherClaimedFor: "",
    dateOfPublication: "",
    documentProof: null,
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  // Options for dropdowns
  const eContentTypeOptions = [
    "Select Type",
    "E-Learning Material",
    "Video Lecture",
    "Animation",
    "Simulation",
    "Virtual Lab",
    "Other"
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
    
    // Clear error when user types
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
    if (!formData.eContentType || formData.eContentType === "Select Type") newErrors.eContentType = "E-Content Type is required";
    if (!formData.topicName) newErrors.topicName = "Topic Name is required";
    if (!formData.publisherName) newErrors.publisherName = "Publisher Name is required";
    if (!formData.publisherAddress) newErrors.publisherAddress = "Publisher Address is required";
    if (!formData.contactNo) newErrors.contactNo = "Contact No. is required";
    if (!formData.urlOfContent) newErrors.urlOfContent = "URL is required";
    if (!formData.claimedFor || formData.claimedFor === "Select Option") newErrors.claimedFor = "Claimed For is required";
    if (formData.claimedFor === "Other" && !formData.otherClaimedFor) newErrors.otherClaimedFor = "Please specify";
    if (!formData.dateOfPublication) newErrors.dateOfPublication = "Date is required";
    if (!formData.documentProof) newErrors.documentProof = "Document Proof is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const data = new FormData();
        data.append("taskID", formData.taskID);
        data.append("specialLabsInvolved", formData.specialLabsInvolved);
        data.append("eContentType", formData.eContentType);
        data.append("topicName", formData.topicName);
        data.append("publisherName", formData.publisherName);
        data.append("publisherAddress", formData.publisherAddress);
        data.append("contactNo", formData.contactNo);
        data.append("urlOfContent", formData.urlOfContent);
        data.append("claimedFor", formData.claimedFor);
         if (formData.claimedFor === "Other") {
            data.append("otherClaimedFor", formData.otherClaimedFor);
        }
        data.append("dateOfPublication", formData.dateOfPublication);
        data.append("documentProof", formData.documentProof);

        const response = await axios.post(
          `${API_URL}api/faculty/eContentFormPost`, 
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          alert("E-Content submitted successfully");
          navigate("/faculty/achievement");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || "Unknown error";
        alert(`Failed to submit form: ${errorMessage}`);
      }
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
                Add E-Content Details
            </h1>
            <p className="text-sm text-gray-500">
                Create E-Content Developed Record
            </p>
            </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            {/* ID & Type Section */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Labs Involved <RequiredAst />
                    </label>
                    <div className="mt-2 flex space-x-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="specialLabsInvolved"
                                value="yes"
                                checked={formData.specialLabsInvolved === "yes"}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="specialLabsInvolved"
                                value="no"
                                checked={formData.specialLabsInvolved === "no"}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Content Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="eContentType" className="block text-sm font-medium text-gray-700 mb-1">
                        E-Content Type <RequiredAst />
                    </label>
                    <select
                        name="eContentType"
                        id="eContentType"
                        value={formData.eContentType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.eContentType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {eContentTypeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Select Type"}>{option}</option>
                        ))}
                    </select>
                    {errors.eContentType && <p className="mt-1 text-sm text-red-600">{errors.eContentType}</p>}
                </div>
                
                <div>
                    <label htmlFor="topicName" className="block text-sm font-medium text-gray-700 mb-1">
                        Topic Name <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="topicName"
                        id="topicName"
                        value={formData.topicName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.topicName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Topic Name"
                    />
                    {errors.topicName && <p className="mt-1 text-sm text-red-600">{errors.topicName}</p>}
                </div>
            </div>

            {/* Publisher Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <div>
                    <label htmlFor="publisherAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Publisher Address <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="publisherAddress"
                        id="publisherAddress"
                        value={formData.publisherAddress}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.publisherAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Publisher Address"
                    />
                    {errors.publisherAddress && <p className="mt-1 text-sm text-red-600">{errors.publisherAddress}</p>}
                </div>
            </div>

            {/* Contact & URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact No. <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="contactNo"
                        id="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.contactNo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Contact Number"
                    />
                    {errors.contactNo && <p className="mt-1 text-sm text-red-600">{errors.contactNo}</p>}
                </div>
                
                <div>
                    <label htmlFor="urlOfContent" className="block text-sm font-medium text-gray-700 mb-1">
                        URL of Content <RequiredAst />
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="url"
                            name="urlOfContent"
                            id="urlOfContent"
                            value={formData.urlOfContent}
                            onChange={handleChange}
                            className={`block w-full pl-10 px-3 py-2 border ${errors.urlOfContent ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="https://example.com"
                        />
                    </div>
                    {errors.urlOfContent && <p className="mt-1 text-sm text-red-600">{errors.urlOfContent}</p>}
                </div>
            </div>

            {/* Claimed For & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    
                    {formData.claimedFor === "Other" && (
                        <div className="mt-3">
                            <label htmlFor="otherClaimedFor" className="block text-sm font-medium text-gray-700 mb-1">
                                Specify Other <RequiredAst />
                            </label>
                            <input
                                type="text"
                                name="otherClaimedFor"
                                id="otherClaimedFor"
                                value={formData.otherClaimedFor}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherClaimedFor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify here"
                            />
                            {errors.otherClaimedFor && <p className="mt-1 text-sm text-red-600">{errors.otherClaimedFor}</p>}
                        </div>
                    )}
                </div>
                
                <div>
                    <label htmlFor="dateOfPublication" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Publication <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="dateOfPublication"
                        id="dateOfPublication"
                        value={formData.dateOfPublication}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.dateOfPublication ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.dateOfPublication && <p className="mt-1 text-sm text-red-600">{errors.dateOfPublication}</p>}
                </div>
            </div>

            {/* Document Proof */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Proof <RequiredAst />
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
