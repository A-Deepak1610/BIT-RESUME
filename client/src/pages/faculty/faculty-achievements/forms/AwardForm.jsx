import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  X,
  Trophy,
  Image as ImageIcon
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function AwardForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskID: "",
    specialLabsInvolved: "Choose an option",
    technicalSociety: "Choose an option",
    typeOfRecognition: "Choose an option",
    otherTypeOfRecognition: "",
    awardName: "",
    organizationType: "Choose an option",
    otherOrganizationType: "",
    awardingAgency: "",
    level: "Choose an option",
    receivedDate: "",
    natureOfRecognition: "Choose an option",
    otherNatureOfRecognition: "",
    photoProofs: null,
    documentProof: null,
  });

  const [errors, setErrors] = useState({});
  const [docProofDragActive, setDocProofDragActive] = useState(false);
  const [photoProofDragActive, setPhotoProofDragActive] = useState(false);

  // Options
  const specialLabsOptions = [
    "Choose an option",
    "Yes",
    "No"
  ];

  const technicalSocietyOptions = [
    "Choose an option",
    "Yes",
    "No"
  ];

  const typeOfRecognitionOptions = [
    "Choose an option",
    "Award",
    "Prize",
    "Honour",
    "Recognition",
    "Other"
  ];

  const organizationTypeOptions = [
    "Choose an option",
    "Government",
    "Private",
    "Industry",
    "Professional Body",
    "Other"
  ];

  const levelOptions = [
    "Choose an option",
    "International",
    "National",
    "State",
    "Regional",
    "Local"
  ];

  const natureOfRecognitionOptions = [
    "Choose an option",
    "Gold Medal",
    "Silver Medal",
    "Bronze Medal",
    "Certificate",
    "Cash Prize",
    "Memento",
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
    if (!formData.technicalSociety || formData.technicalSociety === "Choose an option") newErrors.technicalSociety = "Selection is required";
    
    if (!formData.typeOfRecognition || formData.typeOfRecognition === "Choose an option") newErrors.typeOfRecognition = "Type of Recognition is required";
    if (formData.typeOfRecognition === "Other" && !formData.otherTypeOfRecognition) newErrors.otherTypeOfRecognition = "Please specify Type of Recognition";

    if (!formData.awardName) newErrors.awardName = "Name of the Award is required";
    
    if (!formData.organizationType || formData.organizationType === "Choose an option") newErrors.organizationType = "Organization organizationType is required";
    if (formData.organizationType === "Other" && !formData.otherOrganizationType) newErrors.otherOrganizationType = "Please specify Organization Type";

    if (!formData.awardingAgency) newErrors.awardingAgency = "Name of the body / Awarding agency is required";
    if (!formData.level || formData.level === "Choose an option") newErrors.level = "Level is required";
    if (!formData.receivedDate) newErrors.receivedDate = "Received Date is required";
    
    if (!formData.natureOfRecognition || formData.natureOfRecognition === "Choose an option") newErrors.natureOfRecognition = "Nature of recognition is required";
    if (formData.natureOfRecognition === "Other" && !formData.otherNatureOfRecognition) newErrors.otherNatureOfRecognition = "Please specify Nature of Recognition";

    if (!formData.photoProofs) newErrors.photoProofs = "Photo Proofs are required";
    if (!formData.documentProof) newErrors.documentProof = "Document Proof is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting form for: Notable Achievement", formData);
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
                Add Notable Achievement Details
            </h1>
            <p className="text-sm text-gray-500">
                Create record for Awards and Achievements
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

            {/* Technical Society & Recognition Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="technicalSociety" className="block text-sm font-medium text-gray-700 mb-1">
                        Is this event involved under Technical Society ? <RequiredAst />
                    </label>
                    <select
                        name="technicalSociety"
                        id="technicalSociety"
                        value={formData.technicalSociety}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.technicalSociety ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {technicalSocietyOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.technicalSociety && <p className="mt-1 text-sm text-red-600">{errors.technicalSociety}</p>}
                </div>
                
                <div>
                    <label htmlFor="typeOfRecognition" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of recognition <RequiredAst />
                    </label>
                    <select
                        name="typeOfRecognition"
                        id="typeOfRecognition"
                        value={formData.typeOfRecognition}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.typeOfRecognition ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {typeOfRecognitionOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.typeOfRecognition && <p className="mt-1 text-sm text-red-600">{errors.typeOfRecognition}</p>}

                    {formData.typeOfRecognition === "Other" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherTypeOfRecognition"
                                value={formData.otherTypeOfRecognition}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherTypeOfRecognition ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Type of Recognition"
                            />
                            {errors.otherTypeOfRecognition && <p className="mt-1 text-sm text-red-600">{errors.otherTypeOfRecognition}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Award Name & Org Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="awardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name of the Award / Achievement <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="awardName"
                        id="awardName"
                        value={formData.awardName}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.awardName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Name"
                    />
                    {errors.awardName && <p className="mt-1 text-sm text-red-600">{errors.awardName}</p>}
                </div>

                 <div>
                    <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization type <RequiredAst />
                    </label>
                    <select
                        name="organizationType"
                        id="organizationType"
                        value={formData.organizationType}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.organizationType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {organizationTypeOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.organizationType && <p className="mt-1 text-sm text-red-600">{errors.organizationType}</p>}

                    {formData.organizationType === "Other" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherOrganizationType"
                                value={formData.otherOrganizationType}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherOrganizationType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Organization Type"
                            />
                            {errors.otherOrganizationType && <p className="mt-1 text-sm text-red-600">{errors.otherOrganizationType}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Awarding Agency & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="awardingAgency" className="block text-sm font-medium text-gray-700 mb-1">
                        Name of the body / Awarding agency <RequiredAst />
                    </label>
                    <input
                        type="text"
                        name="awardingAgency"
                        id="awardingAgency"
                        value={formData.awardingAgency}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.awardingAgency ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Enter Agency Name"
                    />
                    {errors.awardingAgency && <p className="mt-1 text-sm text-red-600">{errors.awardingAgency}</p>}
                </div>

                 <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                        Level <RequiredAst />
                    </label>
                    <select
                        name="level"
                        id="level"
                        value={formData.level}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.level ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                        {levelOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                </div>
            </div>

            {/* Date & Nature of Recognition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label htmlFor="receivedDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Received Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="receivedDate"
                        id="receivedDate"
                        value={formData.receivedDate}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.receivedDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.receivedDate && <p className="mt-1 text-sm text-red-600">{errors.receivedDate}</p>}
                </div>

                <div>
                    <label htmlFor="natureOfRecognition" className="block text-sm font-medium text-gray-700 mb-1">
                        Nature of recognition <RequiredAst />
                    </label>
                    <select
                        name="natureOfRecognition"
                        id="natureOfRecognition"
                        value={formData.natureOfRecognition}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.natureOfRecognition ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                         {natureOfRecognitionOptions.map(option => (
                            <option key={option} value={option} disabled={option === "Choose an option"}>{option}</option>
                        ))}
                    </select>
                    {errors.natureOfRecognition && <p className="mt-1 text-sm text-red-600">{errors.natureOfRecognition}</p>}

                    {formData.natureOfRecognition === "Other" && (
                         <div className="mt-2">
                             <input
                                type="text"
                                name="otherNatureOfRecognition"
                                value={formData.otherNatureOfRecognition}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.otherNatureOfRecognition ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Specify Nature of Recognition"
                            />
                            {errors.otherNatureOfRecognition && <p className="mt-1 text-sm text-red-600">{errors.otherNatureOfRecognition}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Files: Photos & Docs */}
            <div className="space-y-6">
                {/* Photo Proofs */}
               <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Photo Proofs <RequiredAst />
                    </label>
                    <div
                        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
                           errors.photoProofs ? 'border-red-500' : photoProofDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                        onDragEnter={(e) => handleDrag(e, setPhotoProofDragActive)}
                        onDragLeave={(e) => handleDrag(e, setPhotoProofDragActive)}
                        onDragOver={(e) => handleDrag(e, setPhotoProofDragActive)}
                        onDrop={(e) => handleDrop(e, 'photoProofs', setPhotoProofDragActive)}
                        onClick={() => document.getElementById('photo-upload').click()}
                    >
                         <div className="space-y-1 text-center">
                            <ImageIcon className={`mx-auto h-12 w-12 ${photoProofDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="photo-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="photo-upload" name="photoProofs" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'photoProofs')} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                     {formData.photoProofs && (
                         <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                            <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                            <span className="font-medium mr-2 truncate">{formData.photoProofs.name}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); clearFile('photoProofs'); }} className="ml-auto text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                        </div>
                    )}
                    {errors.photoProofs && <p className="mt-1 text-sm text-red-600">{errors.photoProofs}</p>}
                </div>

                 {/* Document Proof */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Proof <RequiredAst />
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
