import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../../store/UseAuth";
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
} from "lucide-react";
import DepartmentDropdown from "../../../../components/shared/DepartmentDropdown";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

// --- Constants & Options ---

const SPECIAL_LABS_OPTIONS = [
  { value: "", label: "Choose an option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const MOU_TYPE_OPTIONS = [
  { value: "", label: "Choose an option" },
  { value: "National", label: "National" },
  { value: "International", label: "International" },
];

const INDUSTRY_TYPE_OPTIONS = [
  { value: "", label: "Choose an option" },
  { value: "MNC", label: "MNC" },
  { value: "Large Scale", label: "Large Scale" },
  { value: "MSME", label: "MSME" },
  { value: "Small Scale", label: "Small Scale" },
  { value: "Others", label: "Others" },
];

const MOU_BASED_ON_OPTIONS = [
  { value: "", label: "Choose an option" },
  { value: "Industry", label: "Industry" },
  { value: "Institute", label: "Institute" },
];

const PURPOSE_OPTIONS = [
  { value: "", label: "Choose an option" },
  { value: "Internship", label: "Internship" },
  { value: "centre of Excellence", label: "Centre of Excellence" },
  { value: "faculty training", label: "Faculty Training" },
  { value: "World Skil Training", label: "World Skill Training" },
  { value: "Certificate Course", label: "Certificate Course" },
  { value: "Placement traininf", label: "Placement Training" },
  { value: "Colloborative Projects", label: "Collaborative Projects" },
  { value: "Laboratory enhancement", label: "Laboratory Enhancement" },
  { value: "Consultancy", label: "Consultancy" },
  { value: "Sharing facilities", label: "Sharing Facilities" },
  { value: "Product Development", label: "Product Development" },
  { value: "Publication", label: "Publication" },
  { value: "Funding", label: "Funding" },
  { value: "Patents", label: "Patents" },
  { value: "Organizing events", label: "Organizing Events" },
  { value: "students Projects", label: "Students Projects" },
  { value: "one Credit Course", label: "One Credit Course" },
  { value: "placement offers", label: "Placement Offers" },
  {
    value: "Syllabus Framing for Curriculum",
    label: "Syllabus Framing for Curriculum",
  },
  {
    value: "Syllabus framing for one credit",
    label: "Syllabus Framing for One Credit",
  },
  { value: "Students Training", label: "Students Training" },
  { value: "others", label: "Others" },
];

const OWI_VERIFICATION_OPTIONS = [
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

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
  disabled,
}) => (
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
      className={`w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
        disabled ? "bg-gray-100 text-gray-500" : "bg-white"
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
  error,
}) => (
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
      className={`w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <RequiredAst />}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
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

const FileUpload = ({
  label,
  name,
  file,
  onFileSelect,
  dragActive,
  onDrag,
  onDrop,
  error,
  required,
}) => {
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
        className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${
          error
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
          <UploadCloud
            className={`mx-auto h-10 w-10 ${dragActive ? "text-indigo-600" : "text-gray-400"}`}
          />
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
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// --- Step Components ---

const Step1_FacultyInfo = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={User}
      title="Faculty Information"
      subtitle="Basic details about the faculty initiator and department."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Faculty Name"
        name="faculty"
        value={formData.faculty}
        onChange={handleChange}
        placeholder="Auto-filled from profile"
        disabled
      />
      <InputField
        label="SIG Number"
        name="sigNumber"
        value={formData.sigNumber}
        onChange={handleChange}
        placeholder="Enter SIG number"
      />
      <InputField
        label="Task ID"
        name="taskID"
        value={formData.taskID}
        onChange={handleChange}
        required
        error={errors.taskID}
        placeholder="Enter Task ID"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          MoU Claiming Department
        </label>
        <DepartmentDropdown
          name="mouClaimingDepartment"
          value={formData.mouClaimingDepartment}
          onChange={handleChange}
          placeholder="Select Department"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SelectField
        label="Special Labs Involved"
        name="specialLabsInvolved"
        value={formData.specialLabsInvolved}
        onChange={handleChange}
        options={SPECIAL_LABS_OPTIONS}
        required
        error={errors.specialLabsInvolved}
      />
      {formData.specialLabsInvolved === "Yes" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Lab Name <span className="text-red-500">*</span>
          </label>
          <SpecialLabDropdown
            name="specialLab"
            value={formData.specialLab}
            onChange={handleChange}
            error={errors.specialLab}
            placeholder="Select Special Lab"
            className={`w-full px-3 py-2 border ${
              errors.specialLab ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.specialLab && (
            <p className="mt-1 text-sm text-red-600">{errors.specialLab}</p>
          )}
        </div>
      )}
    </div>
  </div>
);

const Step2_MoUClassification = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Globe}
      title="MoU Classification"
      subtitle="Define the category and domain of the agreement."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SelectField
        label="Type of MoU"
        name="typeOfMoU"
        value={formData.typeOfMoU}
        onChange={handleChange}
        options={MOU_TYPE_OPTIONS}
      />
      <SelectField
        label="Type of Industry / Organization"
        name="typeOfIndustry"
        value={formData.typeOfIndustry}
        onChange={handleChange}
        options={INDUSTRY_TYPE_OPTIONS}
      />
      <SelectField
        label="MoU Based On"
        name="mouBasedOn"
        value={formData.mouBasedOn}
        onChange={handleChange}
        options={MOU_BASED_ON_OPTIONS}
      />
      <InputField
        label="Domain Area"
        name="domainArea"
        value={formData.domainArea}
        onChange={handleChange}
        placeholder="e.g., AI, VLSI, Civil"
      />
    </div>
  </div>
);

const Step3_TimelinePurpose = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Calendar}
      title="Timeline & Purpose"
      subtitle="Agreement dates and the primary objective of the MoU."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Date of Agreement"
        name="dateOfAgreement"
        type="date"
        value={formData.dateOfAgreement}
        onChange={handleChange}
      />
      <InputField
        label="Duration"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        placeholder="e.g., 5 Years"
      />
      <InputField
        label="MoU Effect From"
        name="mouEffectFrom"
        type="date"
        value={formData.mouEffectFrom}
        onChange={handleChange}
      />
      <InputField
        label="MoU Effect Till"
        name="mouEffectTill"
        type="date"
        value={formData.mouEffectTill}
        onChange={handleChange}
      />
    </div>
    <SelectField
      label="Purpose of the MoU"
      name="purposeOfMoU"
      value={formData.purposeOfMoU}
      onChange={handleChange}
      options={PURPOSE_OPTIONS}
    />
  </div>
);

const Step4_CollaboratorDetails = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Briefcase}
      title="Collaborator Details"
      subtitle="Information about the industry partner or organization."
    />
    <InputField
      label="Legal Name of the Industry Collaborator"
      name="legalNameOfIndustry"
      value={formData.legalNameOfIndustry}
      onChange={handleChange}
      placeholder="Enter full legal name"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Industry Location"
        name="industryLocation"
        value={formData.industryLocation}
        onChange={handleChange}
        placeholder="City, State, Country"
      />
      <InputField
        label="Industry Website"
        name="industryWebsite"
        value={formData.industryWebsite}
        onChange={handleChange}
        placeholder="https://..."
      />
    </div>
    <TextAreaField
      label="Address of the Industry"
      name="industryAddress"
      value={formData.industryAddress}
      onChange={handleChange}
      placeholder="Full postal address"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Industry Contact Number"
        name="industryContact"
        value={formData.industryContact}
        onChange={handleChange}
        placeholder="Direct phone number"
      />
      <InputField
        label="Industry Email ID"
        name="industryEmail"
        value={formData.industryEmail}
        onChange={handleChange}
        placeholder="official@industry.com"
      />
    </div>
  </div>
);

const Step5_AgreementScope = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Layout}
      title="Agreement Scope"
      subtitle="Define what the agreement covers and its goals."
    />
    <TextAreaField
      label="Scope of the Agreement"
      name="scopeOfAgreement"
      value={formData.scopeOfAgreement}
      onChange={handleChange}
      rows={4}
    />
    <TextAreaField
      label="Objectives and Goals"
      name="objectivesAndGoals"
      value={formData.objectivesAndGoals}
      onChange={handleChange}
      rows={4}
    />
    <TextAreaField
      label="Boundaries and Limitation"
      name="boundariesAndLimitation"
      value={formData.boundariesAndLimitation}
      onChange={handleChange}
      rows={4}
    />
  </div>
);

const Step6_Responsibilities = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Shield}
      title="Roles & Responsibilities"
      subtitle="Specific duties of each party involved."
    />
    <TextAreaField
      label="BIT's Roles and Responsibilities"
      name="bitRolesAndResponsibilities"
      value={formData.bitRolesAndResponsibilities}
      onChange={handleChange}
      rows={5}
    />
    <TextAreaField
      label="Collaborator's Roles and Responsibilities"
      name="collaboratorRolesAndResponsibilities"
      value={formData.collaboratorRolesAndResponsibilities}
      onChange={handleChange}
      rows={5}
    />
  </div>
);

const Step7_SPOCDetails = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Users}
      title="SPOC & Final Details"
      subtitle="Single Point of Contact and faculty involvement."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Name of the SPOC"
        name="spocName"
        value={formData.spocName}
        onChange={handleChange}
        placeholder="Industry SPOC name"
      />
      <InputField
        label="Designation of the SPOC"
        name="spocDesignation"
        value={formData.spocDesignation}
        onChange={handleChange}
        placeholder="SPOC designation"
      />
      <InputField
        label="E-mail ID of the SPOC"
        name="spocEmail"
        value={formData.spocEmail}
        onChange={handleChange}
        placeholder="SPOC email"
      />
      <InputField
        label="Phone Number of the SPOC"
        name="spocPhone"
        value={formData.spocPhone}
        onChange={handleChange}
        placeholder="SPOC phone number"
      />
      <InputField
        label="Signing Initiated Through"
        name="mouSigningInitiatedThrough"
        value={formData.mouSigningInitiatedThrough}
        onChange={handleChange}
        placeholder="Initiation source"
      />
      <InputField
        label="No. of Faculty Involved"
        name="noOfFaculty"
        type="number"
        value={formData.noOfFaculty}
        onChange={handleChange}
        placeholder="Count"
      />
    </div>
  </div>
);

const Step8_Documents = ({
  formData,
  handleChange,
  handleFileSelect,
  handleDrag,
  handleDrop,
  dragActiveStates,
  errors,
}) => (
  <div className="space-y-6">
    <SectionTitle
      icon={UploadCloud}
      title="Documents Upload"
      subtitle="Upload all necessary proofs and legal documents."
    />

    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-1">
          Approval & Communication
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload
            label="Apex Proof"
            name="apexProof"
            file={formData.apexProof}
            onFileSelect={handleFileSelect}
            dragActive={dragActiveStates.apexProof}
            onDrag={handleDrag}
            onDrop={handleDrop}
            error={errors.apexProof}
          />
          <FileUpload
            label="Email Communication Proof"
            name="emailProof"
            file={formData.emailProof}
            onFileSelect={handleFileSelect}
            dragActive={dragActiveStates.emailProof}
            onDrag={handleDrag}
            onDrop={handleDrop}
            error={errors.emailProof}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-1">
          MoU & Legal Documents
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload
            label="Signed MoU Document"
            name="signedMoU"
            file={formData.signedMoU}
            onFileSelect={handleFileSelect}
            dragActive={dragActiveStates.signedMoU}
            onDrag={handleDrag}
            onDrop={handleDrop}
            error={errors.signedMoU}
          />
          <FileUpload
            label="Party's Rights Papers"
            name="partyRights"
            file={formData.partyRights}
            onFileSelect={handleFileSelect}
            dragActive={dragActiveStates.partyRights}
            onDrag={handleDrag}
            onDrop={handleDrop}
            error={errors.partyRights}
          />
          <FileUpload
            label="Nondisclosure Affidavit"
            name="nondisclosureAffidavit"
            file={formData.nondisclosureAffidavit}
            onFileSelect={handleFileSelect}
            dragActive={dragActiveStates.nondisclosureAffidavit}
            onDrag={handleDrag}
            onDrop={handleDrop}
            error={errors.nondisclosureAffidavit}
          />
          <FileUpload
            label="Geotag Photos"
            name="geotagPhotos"
            file={formData.geotagPhotos}
            onFileSelect={handleFileSelect}
            dragActive={dragActiveStates.geotagPhotos}
            onDrag={handleDrag}
            onDrop={handleDrop}
            error={errors.geotagPhotos}
          />
        </div>
      </div>

      <FileUpload
        label="Consolidated Document (Single File)"
        name="allDocuments"
        file={formData.allDocuments}
        onFileSelect={handleFileSelect}
        dragActive={dragActiveStates.allDocuments}
        onDrag={handleDrag}
        onDrop={handleDrop}
        error={errors.allDocuments}
      />
    </div>

    <div className="mt-8">
      <SelectField
        label="OWI Verification Status"
        name="owiVerification"
        value={formData.owiVerification}
        onChange={handleChange}
        options={OWI_VERIFICATION_OPTIONS}
      />
    </div>
  </div>
);

const Step9_Review = ({ formData }) => {
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
        <ReviewItem label="SIG Number" value={formData.sigNumber} />
        <ReviewItem label="Dept" value={formData.mouClaimingDepartment} />
        <ReviewItem label="Special Labs" value={formData.specialLabsInvolved} />
        {formData.specialLabsInvolved === "Yes" && (
          <ReviewItem label="Lab Name" value={formData.specialLab} />
        )}
      </Section>

      <Section title="MoU Details">
        <ReviewItem label="Type" value={formData.typeOfMoU} />
        <ReviewItem label="Industry Type" value={formData.typeOfIndustry} />
        <ReviewItem label="Based On" value={formData.mouBasedOn} />
        <ReviewItem label="Domain" value={formData.domainArea} />
        <ReviewItem label="Purpose" value={formData.purposeOfMoU} />
      </Section>

      <Section title="Collaborator Info">
        <ReviewItem label="Company Name" value={formData.legalNameOfIndustry} />
        <ReviewItem label="Location" value={formData.industryLocation} />
        <ReviewItem label="Website" value={formData.industryWebsite} />
        <ReviewItem label="Email" value={formData.industryEmail} />
        <ReviewItem label="Contact" value={formData.industryContact} />
      </Section>

      <Section title="Timeline">
        <ReviewItem label="Agreement Date" value={formData.dateOfAgreement} />
        <ReviewItem label="Duration" value={formData.duration} />
        <ReviewItem label="From" value={formData.mouEffectFrom} />
        <ReviewItem label="Till" value={formData.mouEffectTill} />
      </Section>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-gray-700 text-sm tracking-wide uppercase">
          Scope & Responsibilities
        </div>
        <div className="p-4 space-y-4">
          <ReviewItem label="Scope" value={formData.scopeOfAgreement} />
          <ReviewItem
            label="BIT Responsibilities"
            value={formData.bitRolesAndResponsibilities}
          />
          <ReviewItem
            label="Collaborator Responsibilities"
            value={formData.collaboratorRolesAndResponsibilities}
          />
        </div>
      </div>

      <Section title="Documents">
        <ReviewItem label="Apex Proof" value={formData.apexProof?.name} />
        <ReviewItem label="Email Proof" value={formData.emailProof?.name} />
        <ReviewItem label="Signed MoU" value={formData.signedMoU?.name} />
        <ReviewItem label="Consolidated" value={formData.allDocuments?.name} />
      </Section>
    </div>
  );
};

// --- Main Wizard Component ---

const STEPS = [
  { title: "Faculty Info", component: Step1_FacultyInfo, icon: User },
  { title: "Classification", component: Step2_MoUClassification, icon: Globe },
  { title: "Timeline", component: Step3_TimelinePurpose, icon: Calendar },
  {
    title: "Collaborator",
    component: Step4_CollaboratorDetails,
    icon: Briefcase,
  },
  { title: "Scope", component: Step5_AgreementScope, icon: Layout },
  {
    title: "Responsibilities",
    component: Step6_Responsibilities,
    icon: Shield,
  },
  { title: "SPOC", component: Step7_SPOCDetails, icon: Users },
  { title: "Documents", component: Step8_Documents, icon: UploadCloud },
  { title: "Review", component: Step9_Review, icon: CheckCircle },
];

export default function MoUForm() {
  const navigate = useNavigate();
  const { name, rollno } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [dragActiveStates, setDragActiveStates] = useState({});

  const [formData, setFormData] = useState({
    faculty: "",
    sigNumber: "",
    taskID: "",
    specialLabsInvolved: "",
    specialLab: "",
    mouClaimingDepartment: "",
    typeOfMoU: "",
    typeOfIndustry: "",
    mouBasedOn: "",
    domainArea: "",
    dateOfAgreement: "",
    legalNameOfIndustry: "",
    industryLocation: "",
    industryAddress: "",
    industryWebsite: "",
    industryContact: "",
    industryEmail: "",
    duration: "",
    mouEffectFrom: "",
    mouEffectTill: "",
    purposeOfMoU: "",
    scopeOfAgreement: "",
    objectivesAndGoals: "",
    boundariesAndLimitation: "",
    bitRolesAndResponsibilities: "",
    collaboratorRolesAndResponsibilities: "",
    spocName: "",
    spocDesignation: "",
    spocEmail: "",
    spocPhone: "",
    mouSigningInitiatedThrough: "",
    noOfFaculty: "",
    apexProof: null,
    emailProof: null,
    signedMoU: null,
    partyRights: null,
    nondisclosureAffidavit: null,
    geotagPhotos: null,
    allDocuments: null,
    owiVerification: "Initiated",
  });

  // Auto-fill faculty name from logged-in user
  useEffect(() => {
    if (name) {
      setFormData((prev) => ({ ...prev, faculty: name }));
    }
  }, [name]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors],
  );

  const handleFileSelect = useCallback(
    (name, file) => {
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));  
    },
    [errors],
  );

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
      if (!d.taskID) newErrors.taskID = "Required";
      if (!d.specialLabsInvolved)
        newErrors.specialLabsInvolved = "Selection required";
      if (d.specialLabsInvolved === "Yes" && !d.specialLab)
        newErrors.specialLab = "Required";
    }

    // Add more step-specific validation as needed

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
      try {
        const data = new FormData();

        // Append all text fields
        Object.keys(formData).forEach((key) => {
          if (
            formData[key] !== null &&
            typeof formData[key] !== "object" &&
            key !== "owiVerification"
          ) {
            data.append(key, formData[key]);
          }
        });

        // Append files
        if (formData.apexProof) data.append("apexProof", formData.apexProof);
        if (formData.signedMoU) data.append("signedMoU", formData.signedMoU);
        if (formData.emailProof) data.append("emailProof", formData.emailProof);
        if (formData.partyRights)
          data.append("partyRights", formData.partyRights);
        if (formData.nondisclosureAffidavit)
          data.append(
            "nondisclosureAffidavit",
            formData.nondisclosureAffidavit,
          );
        if (formData.geotagPhotos)
          data.append("geotagPhotos", formData.geotagPhotos);
        if (formData.allDocuments)
          data.append("allDocuments", formData.allDocuments);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}api/faculty/mouPost`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          alert("MoU submitted successfully!");
          navigate("/faculty/outside-world-interaction");
        }
      } catch (error) {
        console.error("Error submitting MoU:", error);
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || "Unknown error";
        alert(`Failed to submit MoU: ${errorMessage}`);
      }
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add MoU Details
              </h1>
              <p className="text-sm text-gray-500">
                Memorandum of Understanding Wizard
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
                                        ${
                                          isCompleted
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
                className="flex items-center px-10 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all duration-200 active:scale-95 animate-pulse-slow"
              >
                <Save size={18} className="mr-2" /> Finalize & Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
