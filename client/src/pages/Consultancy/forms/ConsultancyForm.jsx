import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../store/UseAuth";
import DepartmentDropdown from "../../../components/shared/DepartmentDropdown";
import SpecialLabDropdown from "../../../components/shared/SpecialLabDropdown";

import {
    ArrowLeft,
    Save,
    UploadCloud,
    FileText,
    X,
    Check,
    CheckCircle,
    User,
    Users,
    Calendar,
    Briefcase,
    Layout,
    Globe,
    Shield,
    FileCheck,
    ChevronRight,
    ChevronLeft,
    IndianRupee,
    Activity
} from "lucide-react";

// --- Constants & Options ---
const YES_NO_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
];

const YES_NA_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Yes", label: "Yes" },
    { value: "NA", label: "NA" },
];

const ADDITIONAL_FACULTY_COUNT_OPTIONS = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
];

const TYPE_OF_CONSULTANT_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Industry", label: "Industry" },
    { value: "Institute", label: "Institute" },
];

const SECTOR_OF_CONSULTANT_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Private", label: "Private" },
    { value: "Government", label: "Government" },
];

const CORE_SECTOR_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Consulting", label: "Consulting" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Technology", label: "Technology" },
    { value: "Non-profit (Public Service)", label: "Non-profit (Public Service)" },
    { value: "Research", label: "Research" },
    { value: "Start Ups", label: "Start Ups" },
    { value: "UG Student Project", label: "UG Student Project" },
    { value: "PG Student Project", label: "PG Student Project" },
];

const CATEGORY_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Service Based", label: "Service Based" },
    { value: "Product based", label: "Product based" },
];

const SCOPE_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Testing Service using Instrument Facility", label: "Testing Service using Instrument Facility" },
    { value: "Product development", label: "Product development" },
    { value: "Hardware Module Prototype design", label: "Hardware Module Prototype design" },
    { value: "Software testing", label: "Software testing" },
    { value: "Software application development", label: "Software application development" },
    { value: "Self-Knowledge transfer", label: "Self-Knowledge transfer" },
];

const DURATION_UNIT_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "Year", label: "Year" },
    { value: "Month", label: "Month" },
    { value: "Day", label: "Day" },
];

const SHARE_PERCENTAGE_OPTIONS = [
    { value: "", label: "Choose an option" },
    { value: "60-40", label: "Faculty: 60%, Institute: 40%" },
    { value: "70-30", label: "Faculty: 70%, Institute: 30%" },
];

const VERIFICATION_OPTIONS = [
    { value: "Initiated", label: "Initiated" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
];

// --- Reusable Atomic Components ---
const RequiredAst = () => <span className="text-red-500 ml-1">*</span>;

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-6 border-b border-gray-100 pb-2">
        <div className="flex items-center text-indigo-600 mb-1">
            {Icon && <Icon size={20} className="mr-2" />}
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {subtitle && <p className="text-sm text-gray-500 ml-7">{subtitle}</p>}
    </div>
);

const InputField = ({ label, name, value, onChange, placeholder, type = "text", required, error, disabled }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <RequiredAst />}
        </label>
        <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"
                }`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3, required, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <RequiredAst />}
        </label>
        <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <RequiredAst />}
        </label>
        <select
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white transition-colors`}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const FileUpload = ({ label, name, file, onFileSelect, dragActive, onDrag, onDrop, error, required }) => {
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(name, e.target.files[0]);
        }
    };

    const clearFile = () => {
        onFileSelect(name, null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <RequiredAst />}
            </label>
            <div
                className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${error
                    ? "border-red-500"
                    : dragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300"
                    } border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors bg-white`}
                onDragEnter={(e) => onDrag(e, name)}
                onDragLeave={(e) => onDrag(e, name)}
                onDragOver={(e) => onDrag(e, name)}
                onDrop={(e) => onDrop(e, name)}
                onClick={() => fileInputRef.current.click()}
            >
                <div className="space-y-1 text-center">
                    <UploadCloud className={`mx-auto h-10 w-10 ${dragActive ? "text-indigo-600" : "text-gray-400"}`} />
                    <div className="flex text-sm text-gray-600">
                        <span className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                            Upload a file
                            <input
                                ref={fileInputRef}
                                id={`${name}-upload`}
                                name={name}
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </span>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
            </div>
            {file && (
                <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                    <span className="font-medium mr-2 truncate">{file.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); clearFile(); }} className="ml-auto text-red-500 hover:text-red-700 p-1">
                        <X size={16} />
                    </button>
                </div>
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

// --- Step Components ---
const Step1_FacultyInfo = ({ formData, handleChange, errors }) => (
    <div className="space-y-6">
        <SectionTitle icon={User} title="Faculty Information" subtitle="Basic details about the faculty members involved." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Faculty Name" name="faculty" value={formData.faculty} onChange={handleChange} placeholder={"Enter your name"} required error={errors.faculty} />
            <InputField label="Task ID" name="taskID" value={formData.taskID} onChange={handleChange} placeholder={"Enter your task ID"} required error={errors.taskID} />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultancy Claiming Department</label>
                <DepartmentDropdown name="consultancyClaimingDepartment" value={formData.consultancyClaimingDepartment} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
            </div>

            <SelectField label="Special Labs Involved" name="specialLabsInvolved" value={formData.specialLabsInvolved} onChange={handleChange} options={YES_NO_OPTIONS} required error={errors.specialLabsInvolved} />

            {formData.specialLabsInvolved === "Yes" ? (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Lab Name</label>
                    <SpecialLabDropdown name="specialLab" value={formData.specialLab} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                </div>
            ) : (
                <div></div>
            )}

            {/* Empty div for right column in case Special Lab is visible, to push the next section down evenly */}
            <div></div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Additional Faculty (if applicable)</h4>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                    label="Number of additional faculty involved"
                    name="numberOfAdditionalFaculty"
                    value={formData.numberOfAdditionalFaculty}
                    onChange={handleChange}
                    options={ADDITIONAL_FACULTY_COUNT_OPTIONS}
                />
            </div>

            {Array.from({ length: parseInt(formData.numberOfAdditionalFaculty || "0") }).map((_, idx) => {
                const facNum = idx + 2;
                return (
                    <div key={facNum} className="mb-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm transition-all hover:shadow-md">
                        <h5 className="text-sm font-semibold text-indigo-600 mb-4 flex items-center">
                            <User size={16} className="mr-2" /> Faculty {facNum} Details
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label={`Faculty ${facNum} Name`} name={`faculty${facNum}`} value={formData[`faculty${facNum}`]} onChange={handleChange} placeholder="Enter name" />
                            <InputField label={`Faculty ${facNum} SIG`} name={`faculty${facNum}SIG`} value={formData[`faculty${facNum}SIG`]} onChange={handleChange} placeholder="Enter SIG" />
                            <InputField label={`Faculty ${facNum} Requirements`} name={`faculty${facNum}Requirements`} value={formData[`faculty${facNum}Requirements`]} onChange={handleChange} placeholder="Enter requirements" />
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const Step2_ProjectDetails = ({ formData, handleChange, errors }) => (
    <div className="space-y-6">
        <SectionTitle icon={Briefcase} title="Consultancy Overview" subtitle="Details regarding the consultant organization and project scope." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Title of the Consultancy Project" name="consultancyProjectTitle" value={formData.consultancyProjectTitle} onChange={handleChange} placeholder={"Enter the title of the consultancy project"} required error={errors.consultancyProjectTitle} />
            <SelectField label="Category of Consultancy Project" name="consultancyCategory" value={formData.consultancyCategory} onChange={handleChange} options={CATEGORY_OPTIONS} />

            <SelectField label="Type of Consultant" name="typeOfConsultant" value={formData.typeOfConsultant} onChange={handleChange} options={TYPE_OF_CONSULTANT_OPTIONS} />
            <SelectField label="Sector of Consultant" name="sectorOfConsultant" value={formData.sectorOfConsultant} onChange={handleChange} options={SECTOR_OF_CONSULTANT_OPTIONS} />

            <SelectField label="Scope of Work" name="scopeOfWork" value={formData.scopeOfWork} onChange={handleChange} options={SCOPE_OPTIONS} />
            <SelectField label="Core Sector" name="coreSector" value={formData.coreSector} onChange={handleChange} options={CORE_SECTOR_OPTIONS} />
        </div>
        <div className="grid grid-cols-1 gap-4">
            <InputField label="Name of the Organization" name="organizationName" value={formData.organizationName} placeholder={"Enter the name of the organization"} onChange={handleChange} />
            <TextAreaField label="Address of the Organization" name="organizationAddress" value={formData.organizationAddress} placeholder={"Enter the address of the organization"} onChange={handleChange} rows={3} />
        </div>
    </div>
);

const Step3_TimelineAndOrigin = ({ formData, handleChange, errors }) => (
    <div className="space-y-6">
        <SectionTitle icon={Calendar} title="Timeline & Origin" subtitle="Project duration and how it was initiated." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="Duration Unit" name="durationUnit" value={formData.durationUnit} onChange={handleChange} options={DURATION_UNIT_OPTIONS} />
            <InputField label="Duration Value" name="durationValue" value={formData.durationValue} onChange={handleChange} type="number" placeholder="e.g. 6" />
            <InputField label="From Date" name="fromDate" type="date" value={formData.fromDate} onChange={handleChange} />
            <InputField label="To Date" name="toDate" type="date" value={formData.toDate} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="Is the consultancy work a result of the MoU?" name="isMoUResult" value={formData.isMoUResult} onChange={handleChange} options={YES_NO_OPTIONS} />
            {formData.isMoUResult === "Yes" && (
                <InputField label="Name of the MoU" name="mouName" value={formData.mouName} onChange={handleChange} />
            )}

            <SelectField label="Is the consultancy initiated as a result of the IRP visit?" name="isIRPResult" value={formData.isIRPResult} onChange={handleChange} options={YES_NO_OPTIONS} />
            {formData.isIRPResult === "Yes" && (
                <InputField label="IRP Visits Details" name="irpVisits" value={formData.irpVisits} onChange={handleChange} />
            )}

            <SelectField label="Is this FESEM Related Consultancy?" name="isFESEMRelated" value={formData.isFESEMRelated} onChange={handleChange} options={YES_NO_OPTIONS} />
            <SelectField label="Is this ROI Related Consultancy?" name="isROIRelated" value={formData.isROIRelated} onChange={handleChange} options={YES_NO_OPTIONS} />
        </div>
    </div>
);

const Step4_Financials = ({ formData, handleChange, errors }) => (
    <div className="space-y-6">
        <SectionTitle icon={IndianRupee} title="Financial Details" subtitle="Amounts, GST, and Payment information." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Consultancy Amount (in Rs.)" name="consultancyAmount" type="number" value={formData.consultancyAmount} onChange={handleChange} />
            <SelectField label="Included with GST" name="includedWithGST" value={formData.includedWithGST} onChange={handleChange} options={YES_NO_OPTIONS} />
            <InputField label="Amount After 18% GST Deduction" name="amountAfterGST" type="number" value={formData.amountAfterGST} onChange={handleChange} />
            <InputField label="Date of Payment" name="dateOfPayment" type="date" value={formData.dateOfPayment} onChange={handleChange} />
        </div>
        <TextAreaField label="Description of Ownership rights" name="ownershipRightsDesc" value={formData.ownershipRightsDesc} onChange={handleChange} rows={2} />
        <TextAreaField label="Description of Consultant agreement" name="consultantAgreementDesc" value={formData.consultantAgreementDesc} onChange={handleChange} rows={2} />
    </div>
);

const Step5_ResourceUtilization = ({ formData, handleChange, errors }) => (
    <div className="space-y-6">
        <SectionTitle icon={Activity} title="Resource & Transport utilized" subtitle="Details on college facilities and transit used." />

        <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-1">College Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="College Resources Utilized" name="collegeResourcesUtilized" value={formData.collegeResourcesUtilized} onChange={handleChange} options={YES_NO_OPTIONS} />
                {formData.collegeResourcesUtilized === "Yes" && (
                    <InputField label="List the Resources" name="listResources" value={formData.listResources} onChange={handleChange} />
                )}
            </div>
        </div>

        <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-1">Transport</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="College transport Utilized" name="collegeTransportUtilized" value={formData.collegeTransportUtilized} onChange={handleChange} options={YES_NO_OPTIONS} />
            </div>
            {formData.collegeTransportUtilized === "Yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InputField label="Area visited with the college transport" name="transportAreaVisited" value={formData.transportAreaVisited} onChange={handleChange} />
                    <InputField label="Distance travelled in km." name="distanceTravelled" type="number" value={formData.distanceTravelled} onChange={handleChange} />
                    <InputField label="Default petrol cost per km" name="defaultPetrolCost" type="number" value={formData.defaultPetrolCost} onChange={handleChange} />
                    <InputField label="Transport Cost" name="transportCost" type="number" value={formData.transportCost} onChange={handleChange} />
                </div>
            )}
        </div>

        <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-1">Consumables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Is College Consumables Utilized" name="collegeConsumablesUtilized" value={formData.collegeConsumablesUtilized} onChange={handleChange} options={YES_NO_OPTIONS} />
            </div>
            {formData.collegeConsumablesUtilized === "Yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InputField label="List the consumables" name="listConsumables" value={formData.listConsumables} onChange={handleChange} />
                    <InputField label="Consumables Charge" name="consumablesCharge" type="number" value={formData.consumablesCharge} onChange={handleChange} />
                </div>
            )}
        </div>
    </div>
);

const Step6_ShareCalculations = ({ formData, handleChange, errors }) => (
    <div className="space-y-6">
        <SectionTitle icon={IndianRupee} title="Share Distribution" subtitle="Breakdown of final faculty and institute shares." />

        <SelectField label="Share Percentage Split" name="sharePercentageSplit" value={formData.sharePercentageSplit} onChange={handleChange} options={SHARE_PERCENTAGE_OPTIONS} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Faculty Share Amount (Before Deduction), in Rs." name="facultyShareAmountBefore" type="number" value={formData.facultyShareAmountBefore} onChange={handleChange} />
            <InputField label="Institute Share Amount (Before Addition), in Rs" name="instituteShareAmountBefore" type="number" value={formData.instituteShareAmountBefore} onChange={handleChange} />

            <InputField label="Net Faculty Share Amount, in Rs" name="netFacultyShare" type="number" value={formData.netFacultyShare} onChange={handleChange} />
            <InputField label="Net Institute Share Amount, in Rs." name="netInstituteShare" type="number" value={formData.netInstituteShare} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <InputField label="Based on number of faculty members" name="basedOnFacultyCount" type="number" value={formData.basedOnFacultyCount} onChange={handleChange} />
        </div>
    </div>
);

const Step7_Documents = ({
    formData,
    handleChange,
    handleFileSelect,
    handleDrag,
    handleDrop,
    dragActiveStates,
    errors,
}) => (
    <div className="space-y-6">
        <SectionTitle icon={UploadCloud} title="Documents Upload" subtitle="Upload required proofs and files." />

        <div className="space-y-6">
            <FileUpload label="Upload Consolidated Document*" name="consolidatedDocument" file={formData.consolidatedDocument} onFileSelect={handleFileSelect} dragActive={dragActiveStates.consolidatedDocument} onDrag={handleDrag} onDrop={handleDrop} required error={errors.consolidatedDocument} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <FileUpload label="Upload Consultancy agreement" name="consultancyAgreement" file={formData.consultancyAgreement} onFileSelect={handleFileSelect} dragActive={dragActiveStates.consultancyAgreement} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Communication Proof" name="communicationProof" file={formData.communicationProof} onFileSelect={handleFileSelect} dragActive={dragActiveStates.communicationProof} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Audit Documents Proof(Annexures 1/Annexures 2)" name="auditDocuments" file={formData.auditDocuments} onFileSelect={handleFileSelect} dragActive={dragActiveStates.auditDocuments} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Work Logs Proof" name="workLogsProof" file={formData.workLogsProof} onFileSelect={handleFileSelect} dragActive={dragActiveStates.workLogsProof} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Invoice Receipt" name="invoiceReceipt" file={formData.invoiceReceipt} onFileSelect={handleFileSelect} dragActive={dragActiveStates.invoiceReceipt} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Transaction Proof" name="transactionProof" file={formData.transactionProof} onFileSelect={handleFileSelect} dragActive={dragActiveStates.transactionProof} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Geotag Photos" name="geotagPhotos" file={formData.geotagPhotos} onFileSelect={handleFileSelect} dragActive={dragActiveStates.geotagPhotos} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Consultancy Report Proof" name="consultancyReportProof" file={formData.consultancyReportProof} onFileSelect={handleFileSelect} dragActive={dragActiveStates.consultancyReportProof} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Visiting card of the organization" name="visitingCard" file={formData.visitingCard} onFileSelect={handleFileSelect} dragActive={dragActiveStates.visitingCard} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Partnership Deed Documents Proof" name="partnershipDeed" file={formData.partnershipDeed} onFileSelect={handleFileSelect} dragActive={dragActiveStates.partnershipDeed} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload NOC of the Business Premises Proof" name="nocBusinessPremises" file={formData.nocBusinessPremises} onFileSelect={handleFileSelect} dragActive={dragActiveStates.nocBusinessPremises} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Upload Non-Disclosure Agreement (Mutual) Proof" name="ndaMutual" file={formData.ndaMutual} onFileSelect={handleFileSelect} dragActive={dragActiveStates.ndaMutual} onDrag={handleDrag} onDrop={handleDrop} />
                <FileUpload label="Rent agreement:" name="rentAgreement" file={formData.rentAgreement} onFileSelect={handleFileSelect} dragActive={dragActiveStates.rentAgreement} onDrag={handleDrag} onDrop={handleDrop} />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <SelectField label="IQAC Verification Status" name="iqacVerification" value={formData.iqacVerification} onChange={handleChange} options={VERIFICATION_OPTIONS} />
            </div>
        </div>
    </div>
);

const Step8_Review = ({ formData }) => {
    const ReviewItem = ({ label, value }) => (
        <div className="py-2 border-b border-gray-50 last:border-0">
            <span className="text-xs text-gray-500 block uppercase tracking-wider font-semibold">
                {label}
            </span>
            <span className="text-sm text-gray-900 block mt-0.5 break-words">
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </span>
        </div>
    );

    const Section = ({ title, children }) => (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-gray-700 text-sm tracking-wide uppercase">
                {title}
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <SectionTitle
                icon={CheckCircle}
                title="Review & Submit"
                subtitle="Please verify all information before finalizing."
            />

            <Section title="Faculty & Basic Info">
                <ReviewItem label="Faculty" value={formData.faculty} />
                <ReviewItem label="Task ID" value={formData.taskID} />
                <ReviewItem label="Claiming Dept" value={formData.consultancyClaimingDepartment} />
                <ReviewItem label="Special Labs Involved" value={formData.specialLabsInvolved} />
                {formData.specialLabsInvolved === "Yes" && (
                    <ReviewItem label="Lab Name" value={formData.specialLab} />
                )}
            </Section>

            <Section title="Project Details">
                <ReviewItem label="Title" value={formData.consultancyProjectTitle} />
                <ReviewItem label="Category" value={formData.consultancyCategory} />
                <ReviewItem label="Scope" value={formData.scopeOfWork} />
                <ReviewItem label="Organization" value={formData.organizationName} />
            </Section>

            <Section title="Financials">
                <ReviewItem label="Amount" value={formData.consultancyAmount} />
                <ReviewItem label="Includes GST" value={formData.includedWithGST} />
                <ReviewItem label="Amount After GST" value={formData.amountAfterGST} />
            </Section>

            <Section title="Documents">
                <ReviewItem label="Consolidated" value={formData.consolidatedDocument?.name} />
                <ReviewItem label="Agreement" value={formData.consultancyAgreement?.name} />
                <ReviewItem label="Invoice Receipt" value={formData.invoiceReceipt?.name} />
            </Section>
        </div>
    );
};

// --- Main Wizard Component ---

const STEPS = [
    { title: "Faculty Info", component: Step1_FacultyInfo, icon: User },
    { title: "Project", component: Step2_ProjectDetails, icon: Briefcase },
    { title: "Timeline", component: Step3_TimelineAndOrigin, icon: Calendar },
    { title: "Financials", component: Step4_Financials, icon: IndianRupee },
    { title: "Resources", component: Step5_ResourceUtilization, icon: Activity },
    { title: "Shares", component: Step6_ShareCalculations, icon: IndianRupee },
    { title: "Documents", component: Step7_Documents, icon: UploadCloud },
    { title: "Review", component: Step8_Review, icon: CheckCircle },
];

// Serialise only text fields (File objects cannot be stored in localStorage)
const TEXT_DEFAULTS = {
    faculty: "",
    taskID: "",
    specialLabsInvolved: "",
    specialLab: "",
    numberOfAdditionalFaculty: "0",
    faculty2: "", faculty2SIG: "", faculty2Requirements: "",
    faculty3: "", faculty3SIG: "", faculty3Requirements: "",
    faculty4: "", faculty4SIG: "", faculty4Requirements: "",
    faculty5: "", faculty5SIG: "", faculty5Requirements: "",
    consultancyClaimingDepartment: "",
    typeOfConsultant: "", sectorOfConsultant: "",
    organizationName: "", organizationAddress: "", coreSector: "",
    consultancyProjectTitle: "", consultancyCategory: "", scopeOfWork: "",
    durationUnit: "", durationValue: "", fromDate: "", toDate: "",
    isMoUResult: "", mouName: "", isIRPResult: "", irpVisits: "",
    isFESEMRelated: "", isROIRelated: "",
    consultancyAmount: "", includedWithGST: "", amountAfterGST: "",
    ownershipRightsDesc: "", consultantAgreementDesc: "", dateOfPayment: "",
    collegeResourcesUtilized: "", sharePercentageSplit: "", listResources: "",
    collegeTransportUtilized: "", transportAreaVisited: "",
    distanceTravelled: "", defaultPetrolCost: "", transportCost: "",
    collegeConsumablesUtilized: "", listConsumables: "", consumablesCharge: "",
    facultyShareAmountBefore: "", instituteShareAmountBefore: "",
    netFacultyShare: "", netInstituteShare: "", basedOnFacultyCount: "",
    iqacVerification: "Initiated",
};

const FILE_FIELDS = [
    "consultancyAgreement", "communicationProof", "auditDocuments", "workLogsProof",
    "invoiceReceipt", "transactionProof", "geotagPhotos", "consultancyReportProof",
    "consolidatedDocument", "visitingCard", "partnershipDeed", "nocBusinessPremises",
    "ndaMutual", "rentAgreement",
];

function buildInitialState(storageKey) {
    try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            const saved = JSON.parse(raw);
            return {
                step: typeof saved.step === "number" ? saved.step : 0,
                // merge saved text fields over defaults; file fields stay null
                formData: {
                    ...TEXT_DEFAULTS,
                    ...Object.fromEntries(
                        Object.keys(TEXT_DEFAULTS).map((k) => [k, saved[k] ?? TEXT_DEFAULTS[k]])
                    ),
                    ...Object.fromEntries(FILE_FIELDS.map((k) => [k, null])),
                },
            };
        }
    } catch (_) { /* ignore corrupt data */ }
    return {
        step: 0,
        formData: { ...TEXT_DEFAULTS, ...Object.fromEntries(FILE_FIELDS.map((k) => [k, null])) },
    };
}

export default function ConsultancyForm({ consultancyWorkId = null, onSuccess = null, onClose = null } = {}) {
    const navigate = useNavigate();
    const { name } = useAuth();

    // One stable key per work (or a generic key for standalone use)
    const STORAGE_KEY = `consultancy_form_draft_${consultancyWorkId ?? "standalone"}`;

    const [currentStep, setCurrentStep] = useState(() => buildInitialState(STORAGE_KEY).step);
    const [errors, setErrors] = useState({});
    const [dragActiveStates, setDragActiveStates] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitProgress, setSubmitProgress] = useState(0);
    const submitTimerRef = useRef(null);

    const [formData, setFormData] = useState(() => buildInitialState(STORAGE_KEY).formData);

    // Auto-save text fields + current step to localStorage on every change
    useEffect(() => {
        try {
            const textSnapshot = Object.fromEntries(
                Object.keys(TEXT_DEFAULTS).map((k) => [k, formData[k]])
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...textSnapshot, step: currentStep }));
        } catch (_) { /* quota exceeded or private mode — silently skip */ }
    }, [formData, currentStep, STORAGE_KEY]);

    const clearDraft = () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }, [errors]);

    const handleFileSelect = useCallback((name, file) => {
        setFormData((prev) => ({ ...prev, [name]: file }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }, [errors]);

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
            handleFileSelect(fieldName, e.dataTransfer.files[0]);
        }
    };

    const validateStep = (index) => {
        const newErrors = {};
        const d = formData;

        if (index === 0) {
            if (!d.faculty) newErrors.faculty = "Required";
            if (!d.taskID) newErrors.taskID = "Required";
            if (!d.specialLabsInvolved) newErrors.specialLabsInvolved = "Selection required";
            if (d.specialLabsInvolved === "Yes" && !d.specialLab) newErrors.specialLab = "Required";
        }

        if (index === 1) {
            if (!d.consultancyProjectTitle) newErrors.consultancyProjectTitle = "Required";
        }

        if (index === 6) {
            if (!d.consolidatedDocument) newErrors.consolidatedDocument = "Required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            setIsSubmitting(true);
            setSubmitProgress(0);
            let prog = 0;
            submitTimerRef.current = setInterval(() => {
                prog = Math.min(prog + Math.random() * 7 + 3, 85);
                setSubmitProgress(Math.round(prog));
                if (prog >= 85) clearInterval(submitTimerRef.current);
            }, 180);
            try {
                const data = new FormData();

                // Append all text fields
                Object.keys(formData).forEach((key) => {
                    if (formData[key] !== null && typeof formData[key] !== "object") {
                        data.append(key, formData[key]);
                    }
                });

                // Link this submission to the workflow work, if applicable
                if (consultancyWorkId) {
                    data.append("consultancyWorkId", consultancyWorkId);
                }

                // Append files
                const fileFields = [
                    "consultancyAgreement", "communicationProof", "auditDocuments", "workLogsProof",
                    "invoiceReceipt", "transactionProof", "geotagPhotos", "consultancyReportProof",
                    "consolidatedDocument", "visitingCard", "partnershipDeed", "nocBusinessPremises",
                    "ndaMutual", "rentAgreement"
                ];

                fileFields.forEach(field => {
                    if (formData[field]) data.append(field, formData[field]);
                });

                const BASE_URL = import.meta.env.VITE_API_URL || "";
                const response = await axios.post(
                    `${BASE_URL}/api/faculty/consultancyPost`,
                    data,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                if (response.status === 200) {
                    clearInterval(submitTimerRef.current);
                    setSubmitProgress(100);
                    await new Promise((r) => setTimeout(r, 700));
                    clearDraft();
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        alert("Consultancy form submitted successfully!");
                        navigate("/faculty/outside-world-interaction");
                    }
                }
            } catch (error) {
                console.error("Error submitting consultancy form:", error);
                const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || "Unknown error";
                alert(`Failed to submit: ${errorMessage}`);
            } finally {
                clearInterval(submitTimerRef.current);
                setIsSubmitting(false);
                setSubmitProgress(0);
            }
        }
    };

    const CurrentStepComponent = STEPS[currentStep].component;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* ── Submission Loading Overlay ── */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                        {/* Spinner + title */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-16 h-16 mb-4">
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FileCheck size={22} className="text-indigo-600" />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Submitting Consultancy Form</h2>
                            <p className="text-sm text-gray-500 mt-1">Please wait, uploading your details&hellip;</p>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                style={{ width: `${submitProgress}%` }}
                            />
                        </div>
                        <p className="text-center text-xs font-semibold text-indigo-600 mb-5">{submitProgress}% complete</p>
                        {/* Steps checklist */}
                        <div className="space-y-1.5">
                            {STEPS.map((step, idx) => {
                                const threshold = ((idx + 1) / STEPS.length) * 100;
                                const active = submitProgress >= (idx / STEPS.length) * 100 && submitProgress < threshold;
                                const done = submitProgress >= threshold;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-3 py-1.5 px-3 rounded-lg transition-all duration-300 ${
                                            done ? "bg-green-50" : active ? "bg-indigo-50" : ""
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                                done ? "bg-green-500" : active ? "bg-indigo-600" : "bg-gray-200"
                                            }`}
                                        >
                                            {done ? (
                                                <Check size={13} className="text-white" />
                                            ) : active ? (
                                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <step.icon size={12} className="text-gray-400" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-medium transition-colors duration-300 ${
                                                done ? "text-green-700" : active ? "text-indigo-700" : "text-gray-400"
                                            }`}
                                        >
                                            {step.title}
                                        </span>
                                        {done && <CheckCircle size={14} className="ml-auto text-green-500" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => onClose ? onClose() : navigate(-1)}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Add Consultancy Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                Consultancy Wizard
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Tracker */}
                <div className="mb-8 hidden lg:block px-4">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-5 transform -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                        <div
                            className="absolute left-0 top-5 transform -translate-y-1/2 h-0.5 bg-indigo-600 -z-10 transition-all duration-300"
                            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        />

                        {STEPS.map((step, idx) => {
                            const isCompleted = idx < currentStep;
                            const isCurrent = idx === currentStep;
                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center group cursor-pointer"
                                    onClick={() =>
                                        (idx < currentStep || validateStep(currentStep)) &&
                                        setCurrentStep(idx)
                                    }
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                                        ${isCompleted
                                                ? "bg-green-500 border-green-500 text-white shadow-green-100"
                                                : isCurrent
                                                    ? "bg-white border-indigo-600 text-indigo-600 shadow-indigo-100 scale-110 ring-4 ring-indigo-50"
                                                    : "bg-white border-gray-300 text-gray-400"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check size={20} />
                                        ) : (
                                            <step.icon size={18} />
                                        )}
                                    </div>
                                    <span
                                        className={`text-[10px] font-bold mt-2 uppercase tracking-tighter transition-colors duration-300 ${isCurrent ? "text-indigo-600" : isCompleted ? "text-green-600" : "text-gray-400"}`}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile/Compact Indicator */}
                <div className="lg:hidden mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mr-3">
                            {currentStep + 1}
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                                {STEPS[currentStep].title}
                            </h2>
                            <p className="text-[10px] text-gray-500 font-medium">
                                Step {currentStep + 1} of {STEPS.length}
                            </p>
                        </div>
                    </div>
                    <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden transition-all duration-500">
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 min-h-[450px]">
                        <CurrentStepComponent
                            formData={formData}
                            handleChange={handleChange}
                            handleFileSelect={handleFileSelect}
                            handleDrag={handleDrag}
                            handleDrop={handleDrop}
                            dragActiveStates={dragActiveStates}
                            errors={errors}
                        />
                    </form>

                    {/* Footer Buttons */}
                    <div className="bg-gray-50/80 backdrop-blur-sm px-8 py-5 flex justify-between items-center border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={`flex items-center px-5 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 
                                ${currentStep === 0 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"}`}
                        >
                            <ChevronLeft size={18} className="mr-2" /> Back
                        </button>

                        {currentStep < STEPS.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all duration-200 active:scale-95"
                            >
                                Continue <ChevronRight size={18} className="ml-2" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`flex items-center px-10 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 active:scale-95 ${
                                    isSubmitting
                                        ? "bg-green-400 cursor-not-allowed shadow-green-100"
                                        : "bg-green-600 hover:bg-green-700 shadow-green-100 animate-pulse-slow"
                                }`}
                            >
                                {isSubmitting ? (
                                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Submitting...</>
                                ) : (
                                    <><Save size={18} className="mr-2" />Finalize & Save</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}