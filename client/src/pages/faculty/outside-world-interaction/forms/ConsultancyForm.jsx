import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Building2,
  IndianRupee,
  Briefcase,
  FileCheck,
} from "lucide-react";
import DepartmentDropdown from "../../../../components/shared/DepartmentDropdown";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

export default function ConsultancyForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    faculty: "",
    taskID: "",
    specialLabsInvolved: "Choose an option",
    specialLab: "",

    // Additional Faculty
    faculty2Involved: "NA",
    faculty2: "",
    faculty2SIG: "",
    faculty3Involved: "NA",
    faculty3: "",
    faculty3SIG: "",
    faculty4Involved: "NA",
    faculty4: "",
    faculty4SIG: "",
    faculty5Involved: "NA",
    faculty5: "",
    faculty5SIG: "",

    consultancyClaimingDepartment: "",
    typeOfConsultant: "Choose an option",
    sectorOfConsultant: "Choose an option",
    organizationName: "",
    organizationAddress: "",
    coreSector: "Choose an option",
    consultancyProjectTitle: "",
    consultancyCategory: "Choose an option",
    scopeOfWork: "Choose an option",
    durationYear: "",
    durationMonth: "",
    durationDay: "",
    fromDate: "",
    toDate: "",

    isPartOfMoU: "Choose an option",
    mouName: "",
    isInitiatedByIRP: "Choose an option",
    irpVisits: "",
    isFesemRelated: "Choose an option",
    isRoiRelated: "Choose an option",

    // Financials
    consultancyAmount: "",
    includedWithGST: "Choose an option",
    amountAfterGST: "",
    ownershipRightsDescription: "",
    consultantAgreementDescription: "",
    paymentDate: "",

    // Resources & Shares
    collegeResourcesUtilized: "No",
    facultySharePercentage: "60",
    instituteSharePercentage: "40",
    resourceList: "",

    collegeTransportUtilized: "No",
    areaVisited: "",
    distanceTravelled: "",
    petrolCostPerKm: "",
    transportCost: "",

    collegeConsumablesUtilized: "No",
    consumablesList: "",
    consumablesCharge: "",

    // Shares
    facultyShareAmount: "",
    instituteShareAmount: "",
    netFacultyShareAmount: "",
    netInstituteShareAmount: "",

    // Documents
    consultancyAgreement: null,
    communicationProof: null,
    auditDocuments: null,
    workLogs: null,
    invoiceReceipt: null,
    transactionProof: null,
    geotagPhotos: null,
    consultancyReport: null,
    consolidatedDocument: null,
    visitingCard: null,
    partnershipDeed: null,
    nocPremises: null,
    nonDisclosureAgreement: null,

    iqacVerification: "Initiated",
  });

  const [errors, setErrors] = useState({});
  const [dragActiveStates, setDragActiveStates] = useState({});

  // Options
  const yesNoOptions = ["Choose an option", "Yes", "No"];
  const involvedOptions = ["yes", "NA"]; // User requested specifically "yes", "NA"
  const typeOfConsultantOptions = ["Choose an option", "Industry", "Institute"];
  const sectorOfConsultantOptions = [
    "Choose an option",
    "Private",
    "Government",
  ];
  const coreSectorOptions = [
    "Choose an option",
    "Manufacturing",
    "Consulting",
    "Healthcare",
    "Technology",
    "Non-profit (Public Service)",
    "Research",
    "Start Ups",
    "UG Student Project",
    "PG student project",
  ];
  const consultancyCategoryOptions = [
    "Choose an option",
    "Service Based",
    "Product based",
  ];
  const scopeOfWorkOptions = [
    "Choose an option",
    "Testing Service using Instrument Facility",
    "Product development",
    "Hardware Module Prototype design",
    "Software testing",
    "Software application development",
    "Self-Knowledge transfer",
  ];
  const iqacVerificationOptions = ["Initiated", "Approved", "Rejected"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
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
        setErrors((prev) => {
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

  const handleDrag = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveStates((prev) => ({ ...prev, [fieldName]: true }));
    } else if (e.type === "dragleave") {
      setDragActiveStates((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates((prev) => ({ ...prev, [fieldName]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e.dataTransfer.files[0],
      }));
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    // Basic validation logic for each step
    if (step === 1) {
      if (!formData.taskID) newErrors.taskID = "Task ID is required";
      // Add more required fields for step 1
    }
    // Add more validation logic as needed per step

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      try {
        const data = new FormData();

        // Append all text fields
        Object.keys(formData).forEach((key) => {
          if (
            formData[key] !== null &&
            typeof formData[key] !== "object" &&
            key !== "iqacVerification"
          ) {
            data.append(key, formData[key]);
          }
        });

        // Append files
        const fileFields = [
          "consultancyAgreement",
          "communicationProof",
          "auditDocuments",
          "workLogs",
          "invoiceReceipt",
          "transactionProof",
          "geotagPhotos",
          "consultancyReport",
          "consolidatedDocument",
          "visitingCard",
          "partnershipDeed",
          "nocPremises",
          "nonDisclosureAgreement",
        ];
        fileFields.forEach((field) => {
          if (formData[field]) {
            data.append(field, formData[field]);
          }
        });

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}api/faculty/consultancyPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("Consultancy details submitted successfully!");
          navigate("/faculty/outside-world-interaction");
        }
      } catch (error) {
        console.error("Error submitting Consultancy:", error);
        alert("Failed to submit consultancy details. Please try again.");
      }
    }
  };

  const renderFileInput = (
    fieldName,
    label,
    acceptedTypes = "PDF, JPG, PNG",
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
          errors[fieldName]
            ? "border-red-500"
            : dragActiveStates[fieldName]
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300"
        } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
        onDragEnter={(e) => handleDrag(e, fieldName)}
        onDragLeave={(e) => handleDrag(e, fieldName)}
        onDragOver={(e) => handleDrag(e, fieldName)}
        onDrop={(e) => handleDrop(e, fieldName)}
        onClick={() => document.getElementById(`${fieldName}-upload`).click()}
      >
        <div className="space-y-1 text-center">
          <UploadCloud
            className={`mx-auto h-12 w-12 ${dragActiveStates[fieldName] ? "text-indigo-600" : "text-gray-400"}`}
          />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`${fieldName}-upload`}
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id={`${fieldName}-upload`}
                name={fieldName}
                type="file"
                className="sr-only"
                onChange={(e) => handleFileChange(e, fieldName)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">{acceptedTypes} up to 10MB</p>
        </div>
      </div>
      {formData[fieldName] && (
        <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
          <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
          <span className="font-medium mr-2 truncate">
            {formData[fieldName].name}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearFile(fieldName);
            }}
            className="ml-auto text-red-500 hover:text-red-700 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Faculty & Team Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faculty Name
          </label>
          <input
            type="text"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task ID <RequiredAst />
          </label>
          <input
            type="text"
            name="taskID"
            value={formData.taskID}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.taskID ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="Enter Task ID"
          />
          {errors.taskID && (
            <p className="mt-1 text-sm text-red-600">{errors.taskID}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Labs Involved <RequiredAst />
          </label>
          <select
            name="specialLabsInvolved"
            value={formData.specialLabsInvolved}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {yesNoOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
        {formData.specialLabsInvolved === "Yes" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Lab Name
            </label>
            <SpecialLabDropdown
              name="specialLab"
              value={formData.specialLab}
              onChange={handleChange}
              placeholder="Select Special Lab"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Additional Faculty Loop logic could be cleaner, but explicit for clarity */}
      {[2, 3, 4, 5].map((num) => (
        <div
          key={num}
          className="bg-gray-50 p-4 rounded-md border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 custom-faculty-grid">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty {num} Involved?
              </label>
              <select
                name={`faculty${num}Involved`}
                value={formData[`faculty${num}Involved`]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {involvedOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {formData[`faculty${num}Involved`] === "yes" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty {num} Name
                  </label>
                  <input
                    type="text"
                    name={`faculty${num}`}
                    value={formData[`faculty${num}`]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty {num} SIG
                  </label>
                  <input
                    type="text"
                    name={`faculty${num}SIG`}
                    value={formData[`faculty${num}SIG`]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Consultancy Claiming Department
        </label>
        <DepartmentDropdown
          name="consultancyClaimingDepartment"
          value={formData.consultancyClaimingDepartment}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Select Department"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Organization & Project Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type of Consultant
          </label>
          <select
            name="typeOfConsultant"
            value={formData.typeOfConsultant}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {typeOfConsultantOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sector of Consultant
          </label>
          <select
            name="sectorOfConsultant"
            value={formData.sectorOfConsultant}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {sectorOfConsultantOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name of the Organization
        </label>
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address of the Organization
        </label>
        <textarea
          name="organizationAddress"
          rows={3}
          value={formData.organizationAddress}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Core Sector
          </label>
          <select
            name="coreSector"
            value={formData.coreSector}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {coreSectorOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category of Consultancy
          </label>
          <select
            name="consultancyCategory"
            value={formData.consultancyCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {consultancyCategoryOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title of the Consultancy Project
        </label>
        <input
          type="text"
          name="consultancyProjectTitle"
          value={formData.consultancyProjectTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scope of Work
        </label>
        <select
          name="scopeOfWork"
          value={formData.scopeOfWork}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {scopeOfWorkOptions.map((opt) => (
            <option key={opt} value={opt} disabled={opt === "Choose an option"}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Years)
          </label>
          <input
            type="number"
            name="durationYear"
            value={formData.durationYear}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Months)
          </label>
          <input
            type="number"
            name="durationMonth"
            value={formData.durationMonth}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Days)
          </label>
          <input
            type="number"
            name="durationDay"
            value={formData.durationDay}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        MoU, IRP & Financials
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Result of MoU?
          </label>
          <select
            name="isPartOfMoU"
            value={formData.isPartOfMoU}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {yesNoOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
        {formData.isPartOfMoU === "Yes" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of MoU
            </label>
            <input
              type="text"
              name="mouName"
              value={formData.mouName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Result of IRP Visit?
          </label>
          <select
            name="isInitiatedByIRP"
            value={formData.isInitiatedByIRP}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {yesNoOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
        {formData.isInitiatedByIRP === "Yes" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IRP Visits Details
            </label>
            <input
              type="text"
              name="irpVisits"
              value={formData.irpVisits}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            FESEM Related?
          </label>
          <select
            name="isFesemRelated"
            value={formData.isFesemRelated}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {yesNoOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ROI Related?
          </label>
          <select
            name="isRoiRelated"
            value={formData.isRoiRelated}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {yesNoOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                disabled={opt === "Choose an option"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-3">Financial Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultancy Amount (Rs.)
            </label>
            <input
              type="number"
              name="consultancyAmount"
              value={formData.consultancyAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Included with GST?
            </label>
            <select
              name="includedWithGST"
              value={formData.includedWithGST}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {yesNoOptions.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  disabled={opt === "Choose an option"}
                >
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount After 18% GST Deduction
            </label>
            <input
              type="number"
              name="amountAfterGST"
              value={formData.amountAfterGST}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Payment
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description of Ownership rights
        </label>
        <textarea
          name="ownershipRightsDescription"
          rows={2}
          value={formData.ownershipRightsDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description of Consultant agreement
        </label>
        <textarea
          name="consultantAgreementDescription"
          rows={2}
          value={formData.consultantAgreementDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Resources & Shares
      </h3>

      {/* Resource Utilization */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Resources Utilized?
            </label>
            <select
              name="collegeResourcesUtilized"
              value={formData.collegeResourcesUtilized}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {yesNoOptions.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  disabled={opt === "Choose an option"}
                >
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              List the Resources
            </label>
            <input
              type="text"
              name="resourceList"
              value={formData.resourceList}
              onChange={handleChange}
              disabled={formData.collegeResourcesUtilized !== "Yes"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty Share %
            </label>
            <input
              type="number"
              name="facultySharePercentage"
              value={formData.facultySharePercentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institute Share %
            </label>
            <input
              type="number"
              name="instituteSharePercentage"
              value={formData.instituteSharePercentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="space-y-4 pt-4 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Transport Utilized?
            </label>
            <select
              name="collegeTransportUtilized"
              value={formData.collegeTransportUtilized}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {yesNoOptions.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  disabled={opt === "Choose an option"}
                >
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        {formData.collegeTransportUtilized === "Yes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <input
              type="text"
              name="areaVisited"
              value={formData.areaVisited}
              onChange={handleChange}
              placeholder="Area Visited"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="number"
              name="distanceTravelled"
              value={formData.distanceTravelled}
              onChange={handleChange}
              placeholder="Distance (km)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="number"
              name="petrolCostPerKm"
              value={formData.petrolCostPerKm}
              onChange={handleChange}
              placeholder="Petrol cost/km"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="number"
              name="transportCost"
              value={formData.transportCost}
              onChange={handleChange}
              placeholder="Total Transport Cost"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Consumables */}
      <div className="space-y-4 pt-4 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Consumables Utilized?
            </label>
            <select
              name="collegeConsumablesUtilized"
              value={formData.collegeConsumablesUtilized}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {yesNoOptions.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  disabled={opt === "Choose an option"}
                >
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        {formData.collegeConsumablesUtilized === "Yes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <input
              type="text"
              name="consumablesList"
              value={formData.consumablesList}
              onChange={handleChange}
              placeholder="List Consumables"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="number"
              name="consumablesCharge"
              value={formData.consumablesCharge}
              onChange={handleChange}
              placeholder="Consumables Charge"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Final Shares */}
      <div className="bg-green-50 p-4 rounded-md border border-green-200">
        <h4 className="font-medium text-green-800 mb-3">Net Shares</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty Share (Before Deduction)
            </label>
            <input
              type="number"
              name="facultyShareAmount"
              value={formData.facultyShareAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institute Share (Before Addition)
            </label>
            <input
              type="number"
              name="instituteShareAmount"
              value={formData.instituteShareAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Net Faculty Share
            </label>
            <input
              type="number"
              name="netFacultyShareAmount"
              value={formData.netFacultyShareAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Net Institute Share
            </label>
            <input
              type="number"
              name="netInstituteShareAmount"
              value={formData.netInstituteShareAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Documents & Verification
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFileInput(
          "consolidatedDocument",
          "Upload Consolidated Document",
        )}
        {renderFileInput(
          "consultancyAgreement",
          "Upload Consultancy Agreement",
        )}
        {renderFileInput("communicationProof", "Upload Communication Proof")}
        {renderFileInput(
          "auditDocuments",
          "Upload Audit Documents (Annexures)",
        )}
        {renderFileInput("workLogs", "Upload Work Logs")}
        {renderFileInput("invoiceReceipt", "Upload Invoice Receipt")}
        {renderFileInput("transactionProof", "Upload Transaction Proof")}
        {renderFileInput("geotagPhotos", "Upload Geotag Photos")}
        {renderFileInput("consultancyReport", "Upload Consultancy Report")}
        {renderFileInput("visitingCard", "Upload Visiting Card")}
        {renderFileInput("partnershipDeed", "Upload Partnership Deed")}
        {renderFileInput("nocPremises", "Upload NOC of Premises")}
        {renderFileInput(
          "nonDisclosureAgreement",
          "Upload Non-Disclosure Agreement",
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          IQAC Verification
        </label>
        <select
          name="iqacVerification"
          value={formData.iqacVerification}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {iqacVerificationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const stepIcons = {
    1: <User size={20} />,
    2: <Building2 size={20} />,
    3: <IndianRupee size={20} />,
    4: <Briefcase size={20} />,
    5: <FileCheck size={20} />,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add Consultancy Details
              </h1>
              <p className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step <= currentStep ? "bg-indigo-600 text-white shadow-lg scale-110" : "bg-gray-300 text-gray-500"}`}
              >
                {step < currentStep ? <Check size={20} /> : stepIcons[step]}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-gray-500 px-2 lg:px-0">
            <span>Faculty</span>
            <span className="hidden sm:inline">Org & Project</span>
            <span className="hidden sm:inline">Financials</span>
            <span className="hidden sm:inline">Resources</span>
            <span>Docs</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            {/* Actions */}
            <div className="pt-8 flex items-center justify-between border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Submit Consultancy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
