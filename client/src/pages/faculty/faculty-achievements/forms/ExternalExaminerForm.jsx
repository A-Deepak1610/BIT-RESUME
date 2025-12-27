import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  Building,
  MapPin,
  Calendar
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function ExternalExaminerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "Choose an option",
    collegeName: "",
    instituteAddress: "",
    purposeOfVisit: "Click to choose",
    numberOfDays: "",
    fromDate: "",
    toDate: "",
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

  const purposeOfVisitOptions = [
    "Click to choose",
    "Central Valuation",
    "Flying Squad",
    "Hall invigilator",
    "Practical/Project viva External Examiner",
    "Question Paper Scrutiny",
    "QP Setter",
    "University Representative",
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
    if (!formData.collegeName) newErrors.collegeName = "Name of College/University is required";
    if (!formData.instituteAddress) newErrors.instituteAddress = "Address is required";
    if (!formData.purposeOfVisit || formData.purposeOfVisit === "Click to choose") newErrors.purposeOfVisit = "Purpose of Visit is required";
    if (!formData.numberOfDays) newErrors.numberOfDays = "No. of Days is required";
    if (!formData.fromDate) newErrors.fromDate = "From Date is required";
    if (!formData.toDate) newErrors.toDate = "To Date is required";
    if (!formData.documentProof) newErrors.documentProof = "Document Proof is required";
    
    // Optional: Check Date logic
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
      console.log("Submitting form for: External Examiner", formData);
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
                Add External Examiner Details
            </h1>
            <p className="text-sm text-gray-500">
                Create record for External Examiner activities
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

            {/* College & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name of the external College/University <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="collegeName"
                        id="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.collegeName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter College Name"
                    />
                    {errors.collegeName && <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>}
                </div>
                
                <div>
                    <label htmlFor="instituteAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Address of the Institute <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="instituteAddress"
                        id="instituteAddress"
                        value={formData.instituteAddress}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.instituteAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Address"
                    />
                    {errors.instituteAddress && <p className="mt-1 text-sm text-red-600">{errors.instituteAddress}</p>}
                </div>
            </div>

            {/* Purpose & Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="purposeOfVisit" className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose of Visit <RequiredAst />
                    </label>
                    <select
                        name="purposeOfVisit"
                        id="purposeOfVisit"
                        value={formData.purposeOfVisit}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.purposeOfVisit ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {purposeOfVisitOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Click to choose"}>{option}</option>
                        ))}
                    </select>
                    {errors.purposeOfVisit && <p className="mt-1 text-sm text-red-600">{errors.purposeOfVisit}</p>}
                </div>

                 <div>
                    <label htmlFor="numberOfDays" className="block text-sm font-medium text-gray-700 mb-1">
                        No. of Days <RequiredAst />
                    </label>
                    <input
                        type="number"
                        name="numberOfDays"
                        id="numberOfDays"
                        value={formData.numberOfDays}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.numberOfDays ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="e.g. 1"
                    />
                    {errors.numberOfDays && <p className="mt-1 text-sm text-red-600">{errors.numberOfDays}</p>}
                </div>
            </div>

             {/* Dates */}
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
