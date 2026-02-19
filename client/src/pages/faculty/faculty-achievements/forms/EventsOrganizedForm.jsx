import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  DollarSign,
  Briefcase,
  Layout,
  Award,
} from "lucide-react";
import DepartmentDropdown from "../../../../components/shared/DepartmentDropdown";
import SpecialLabDropdown from "../../../../components/shared/SpecialLabDropdown";

// --- Constants & Options ---

// Department data is now fetched from the backend API via DepartmentDropdown component

const ROLES = [
  { value: "", label: "Choose an option" },
  { value: "Convener", label: "Convener" },
  { value: "Co-Convener", label: "Co-Convener" },
  { value: "Co-ordinator", label: "Co-ordinator" },
  { value: "Organizing Secretary", label: "Organizing Secretary" },
];

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

const EVENT_MODES = [
  { value: "", label: "Choose an option" },
  { value: "Offline", label: "Offline" },
  { value: "Online", label: "Online" },
  { value: "Hybrid", label: "Hybrid" },
];

const EVENT_LEVELS = [
  { value: "", label: "Choose an option" },
  { value: "International", label: "International" },
  { value: "National", label: "National" },
  { value: "State", label: "State" },
  { value: "Regional", label: "Regional" },
  { value: "Institute", label: "Institute" },
  { value: "Department", label: "Department" },
];

const INSTITUTION_TYPES = [
  { value: "", label: "Choose an option" },
  { value: "International", label: "International" },
  { value: "National", label: "National (Within India)" },
  { value: "State", label: "State (Within Tamil Nadu)" },
  { value: "Industry", label: "Industry" },
  { value: "Other", label: "Other" },
];

// Placeholder Data for Dynamic Dropdowns
// Special labs data is now fetched from the backend API via SpecialLabDropdown component

const TECH_SOCIETIES = [
  { value: "", label: "Click to choose" },
  { value: "IEEE", label: "IEEE" },
  { value: "ISTE", label: "ISTE" },
  { value: "CSI", label: "CSI" },
];

const MOU_IDS = [
  { value: "", label: "Click to choose" },
  { value: "MOU001", label: "MOU-001: Industry Partner A" },
  { value: "MOU002", label: "MOU-002: Academic Partner B" },
];

const IRP_IDS = [
  { value: "", label: "Click to choose" },
  { value: "IRP001", label: "IRP-001: Visit to Factory X" },
];

const COE_IDS = [
  { value: "", label: "Click to choose" },
  { value: "COE001", label: "COE-AI: AI Centre of Excellence" },
];

const INDUSTRY_LAB_IDS = [
  { value: "", label: "Click to choose" },
  { value: "ILAB001", label: "ILAB-IoT: IoT Innovation Lab" },
];

const FACULTY_LIST = [
  { value: "", label: "Click to choose" },
  { value: "FAC001", label: "Dr. Smith (CSE)" },
  { value: "FAC002", label: "Prof. Johnson (ECE)" },
  { value: "FAC003", label: "Dr. Williams (MECH)" },
];

// --- Reusable Components (Inline for simplicity) ---

const RequiredAst = () => <span className="text-red-500 ml-1">*</span>;

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6 border-b border-gray-100 pb-2">
    <div className="flex items-center text-primary-600 mb-1">
      {Icon && <Icon size={20} className="mr-2 text-indigo-600" />}
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

const FileUpload = ({ label, name, file, onFileSelect, error, required }) => {
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
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors bg-white">
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 justify-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
              <span>Upload a file</span>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
        </div>
      </div>
      {file && (
        <div className="mt-2 flex items-center justify-between p-2 bg-indigo-50 rounded-md border border-indigo-100">
          <div className="flex items-center">
            <FileText size={16} className="text-indigo-600 mr-2" />
            <span className="text-sm text-gray-700 truncate max-w-xs">
              {file.name}
            </span>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// --- Steps Components ---

const Step1_BasicInfo = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={User}
      title="Organizer & Department Details"
      subtitle="Enter details about the faculty organizer and department associations."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Name of the Faculty"
        name="facultyName"
        value={formData.facultyName}
        onChange={handleChange}
        required
        error={errors.facultyName}
        placeholder="Enter faculty name"
      />
      <InputField
        label="Task ID"
        name="taskId"
        value={formData.taskId}
        onChange={handleChange}
        required
        error={errors.taskId}
        placeholder="Enter Task ID"
      />
      <SelectField
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={ROLES}
        required
        error={errors.role}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Claimed Department <span className="text-red-500">*</span>
        </label>
        <DepartmentDropdown
          name="claimedDepartment"
          value={formData.claimedDepartment}
          onChange={handleChange}
          error={errors.claimedDepartment}
          placeholder="Select Department"
          className={`w-full px-3 py-2 border ${
            errors.claimedDepartment ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.claimedDepartment && (
          <p className="mt-1 text-sm text-red-600">
            {errors.claimedDepartment}
          </p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <SelectField
          label="Special Labs Involved"
          name="specialLabsInvolved"
          value={formData.specialLabsInvolved}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.specialLabsInvolved}
        />
        {formData.specialLabsInvolved === "Yes" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Lab <span className="text-red-500">*</span>
            </label>
            <SpecialLabDropdown
              name="specialLabName"
              value={formData.specialLabName}
              onChange={handleChange}
              error={errors.specialLabName}
              placeholder="Select Special Lab"
              className={`w-full px-3 py-2 border ${
                errors.specialLabName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.specialLabName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.specialLabName}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <SelectField
          label="Whether this event comes under IIC"
          name="isIIC"
          value={formData.isIIC}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.isIIC}
        />
        {formData.isIIC === "Yes" && (
          <SelectField
            label="Is this event upload under IIC"
            name="iicUploadType"
            value={formData.iicUploadType}
            onChange={handleChange}
            options={YES_NO_OPTIONS}
            required
            error={errors.iicUploadType}
          />
        )}
      </div>

      <SelectField
        label="Is this event belongs to Department Association"
        name="isDeptAssociation"
        value={formData.isDeptAssociation}
        onChange={handleChange}
        options={YES_NO_OPTIONS}
        required
        error={errors.isDeptAssociation}
      />
      <SelectField
        label="Is this event organized by R & D"
        name="isRnd"
        value={formData.isRnd}
        onChange={handleChange}
        options={YES_NO_OPTIONS}
        required
        error={errors.isRnd}
      />

      <div className="space-y-4">
        <SelectField
          label="Is this event involved under Technical Society ?"
          name="isTechSociety"
          value={formData.isTechSociety}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.isTechSociety}
        />
        {formData.isTechSociety === "Yes" && (
          <SelectField
            label="Technical Society & Chapter"
            name="techSocietyName"
            value={formData.techSocietyName}
            onChange={handleChange}
            options={TECH_SOCIETIES}
            required
            error={errors.techSocietyName}
          />
        )}
      </div>

      <div className="space-y-4">
        <SelectField
          label="Is this event an outcome of MoU?"
          name="isMouOutcome"
          value={formData.isMouOutcome}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.isMouOutcome}
        />
        {formData.isMouOutcome === "Yes" && (
          <SelectField
            label="BIP ID of MoU entry"
            name="mouId"
            value={formData.mouId}
            onChange={handleChange}
            options={MOU_IDS}
            required
            error={errors.mouId}
          />
        )}
      </div>

      <div className="space-y-4">
        <SelectField
          label="Is this event an outcome of an IRP visit?"
          name="isIrpOutcome"
          value={formData.isIrpOutcome}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.isIrpOutcome}
        />
        {formData.isIrpOutcome === "Yes" && (
          <SelectField
            label="BIP ID of IRP Visits"
            name="irpId"
            value={formData.irpId}
            onChange={handleChange}
            options={IRP_IDS}
            required
            error={errors.irpId}
          />
        )}
      </div>

      <div className="space-y-4">
        <SelectField
          label="Is this event organized through the Centre of Excellence?"
          name="isCoe"
          value={formData.isCoe}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.isCoe}
        />
        {formData.isCoe === "Yes" && (
          <SelectField
            label="Centre Of Excellence BIP ID"
            name="coeId"
            value={formData.coeId}
            onChange={handleChange}
            options={COE_IDS}
            required
            error={errors.coeId}
          />
        )}
      </div>

      <div className="space-y-4">
        <SelectField
          label="Is this event organized through Industry Supported Laboratories?"
          name="isIndustryLab"
          value={formData.isIndustryLab}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.isIndustryLab}
        />
        {formData.isIndustryLab === "Yes" && (
          <SelectField
            label="BIP ID of CoE (Industry Lab) entry"
            name="industryLabId"
            value={formData.industryLabId}
            onChange={handleChange}
            options={INDUSTRY_LAB_IDS}
            required
            error={errors.industryLabId}
          />
        )}
      </div>
    </div>
  </div>
);

const Step2_Committee = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Users}
      title="Organizing Committee"
      subtitle="Add internal faculty and student members involved."
    />

    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">
        Internal Faculty Members
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((num) => (
          <div
            key={`facultyGroup${num}`}
            className="bg-white p-3 rounded-md border border-gray-200"
          >
            <SelectField
              label={`${num === 1 ? "First" : num === 2 ? "Second" : num === 3 ? "Third" : "Fourth"} internal faculty member, if involved (Organizing committee member)`}
              name={`internalFaculty${num}Status`}
              value={formData[`internalFaculty${num}Status`]}
              onChange={handleChange}
              options={YES_NA_OPTIONS}
              required
              error={errors[`internalFaculty${num}Status`]}
            />

            {formData[`internalFaculty${num}Status`] === "Yes" && (
              <div className="pl-4 border-l-2 border-indigo-100 mt-2 space-y-2">
                <SelectField
                  label={`Faculty ${num}`}
                  name={`internalFaculty${num}Name`}
                  value={formData[`internalFaculty${num}Name`]}
                  onChange={handleChange}
                  options={FACULTY_LIST}
                  required
                  error={errors[`internalFaculty${num}Name`]}
                />
                <SelectField
                  label={`Faculty ${num} Role`}
                  name={`internalFaculty${num}Role`}
                  value={formData[`internalFaculty${num}Role`]}
                  onChange={handleChange}
                  options={ROLES}
                  required
                  error={errors[`internalFaculty${num}Role`]}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">
        Student Members
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={`studentGroup${num}`}
            className="bg-white p-3 rounded-md border border-gray-200"
          >
            <SelectField
              label={`Name of the ${num === 1 ? "first" : num === 2 ? "second" : num === 3 ? "third" : num === 4 ? "fourth" : "fifth"} student member, if involved`}
              name={`studentMember${num}Status`}
              value={formData[`studentMember${num}Status`]} // Assuming simple Yes/NA or implied by input value existence, but following prompt pattern "Choose an option"
              onChange={handleChange}
              options={YES_NA_OPTIONS} // Or could be direct name input if "Choose an option" implies just picking student.
              // Given the prompt says "Choose an option" -> then "Name of the ... student member", I'll use a wrapper.
            />
            {formData[`studentMember${num}Status`] === "Yes" && (
              <InputField
                label={`Student ${num} Name`}
                name={`studentMember${num}Name`}
                value={formData[`studentMember${num}Name`]}
                onChange={handleChange}
                placeholder={`Student Name ${num}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Step3_EventDetails = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Layout}
      title="Event Information"
      subtitle="Details about the event itself."
    />

    <div className="grid grid-cols-1 gap-4">
      <InputField
        label="Event Name"
        name="eventName"
        value={formData.eventName}
        onChange={handleChange}
        required
        error={errors.eventName}
        placeholder="Full title of the event"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Type of Program"
        name="programType"
        value={formData.programType}
        onChange={handleChange}
        required
        error={errors.programType}
        placeholder="e.g., FDP, Workshop"
      />
      <InputField
        label="Event Type"
        name="eventType"
        value={formData.eventType}
        onChange={handleChange}
        required
        error={errors.eventType}
        placeholder="e.g., Technical, Non-Technical"
      />
      <InputField
        label="Event Category"
        name="eventCategory"
        value={formData.eventCategory}
        onChange={handleChange}
        required
        error={errors.eventCategory}
        placeholder="Category"
      />
      <InputField
        label="Event Organizer"
        name="eventOrganizer"
        value={formData.eventOrganizer}
        onChange={handleChange}
        required
        error={errors.eventOrganizer}
        placeholder="Organizer Name/Body"
      />
    </div>

    <TextAreaField
      label="Event Description"
      name="eventDescription"
      value={formData.eventDescription}
      onChange={handleChange}
      required
      error={errors.eventDescription}
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SelectField
        label="Event Mode"
        name="eventMode"
        value={formData.eventMode}
        onChange={handleChange}
        options={EVENT_MODES}
        required
        error={errors.eventMode}
      />
      <SelectField
        label="Event Level"
        name="eventLevel"
        value={formData.eventLevel}
        onChange={handleChange}
        options={EVENT_LEVELS}
        required
        error={errors.eventLevel}
      />
      <InputField
        label="Event Duration (Days)"
        name="eventDuration"
        type="number"
        value={formData.eventDuration}
        onChange={handleChange}
        required
        error={errors.eventDuration}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Start Date"
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        required
        error={errors.startDate}
      />
      <InputField
        label="End Date"
        name="endDate"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        required
        error={errors.endDate}
      />
    </div>

    <InputField
      label="Jointly Organized With"
      name="jointlyOrganizedWith"
      value={formData.jointlyOrganizedWith}
      onChange={handleChange}
      placeholder="Partner Organization (if any)"
    />
  </div>
);

const Step4_Participants = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={Users}
      title="Participant Details"
      subtitle="Count of internal and external participants."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-semibold text-blue-800 mb-3">
          Internal Participants
        </h4>
        <InputField
          label="Students"
          name="internalStudentsCount"
          type="number"
          value={formData.internalStudentsCount}
          onChange={handleChange}
          required
          error={errors.internalStudentsCount}
        />
        <InputField
          label="Faculty"
          name="internalFacultyCount"
          type="number"
          value={formData.internalFacultyCount}
          onChange={handleChange}
          required
          error={errors.internalFacultyCount}
        />
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h4 className="font-semibold text-green-800 mb-3">
          External Participants
        </h4>
        <InputField
          label="Students"
          name="externalStudentsCount"
          type="number"
          value={formData.externalStudentsCount}
          onChange={handleChange}
          required
          error={errors.externalStudentsCount}
        />
        <InputField
          label="Faculty"
          name="externalFacultyCount"
          type="number"
          value={formData.externalFacultyCount}
          onChange={handleChange}
          required
          error={errors.externalFacultyCount}
        />
      </div>
    </div>
  </div>
);

const Step5_Guests = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Briefcase}
        title="Guest Speakers / Resource Persons"
        subtitle="Details of invited guests."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Invited Guest Details?"
          name="hasInvitedGuest"
          value={formData.hasInvitedGuest}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.hasInvitedGuest}
        />
        <SelectField
          label="Resource Person Alumni of BIT?"
          name="isAlumni"
          value={formData.isAlumni}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
          required
          error={errors.isAlumni}
        />
      </div>

      {/* Guest 1 - Always Visible or Conditional? Assuming form expects up to 5 */}
      {[1, 2, 3, 4, 5].map((num) => (
        <div
          key={`guest${num}`}
          className="border rounded-lg p-5 bg-white shadow-sm mt-4"
        >
          <h4 className="font-bold text-gray-700 mb-4 border-b pb-2 flex justify-between">
            <span>Guest Speaker {num}</span>
            {num > 1 && (
              <span className="text-xs text-gray-400 font-normal self-center">
                Optional
              </span>
            )}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Type of Institution"
              name={`guest${num}Type`}
              value={formData[`guest${num}Type`]}
              onChange={handleChange}
              options={INSTITUTION_TYPES}
            />
            <InputField
              label="Name"
              name={`guest${num}Name`}
              value={formData[`guest${num}Name`]}
              onChange={handleChange}
              placeholder="Guest Name"
            />
            <InputField
              label="Designation"
              name={`guest${num}Designation`}
              value={formData[`guest${num}Designation`]}
              onChange={handleChange}
              placeholder="Designation"
            />
            <InputField
              label="Organization Details"
              name={`guest${num}Org`}
              value={formData[`guest${num}Org`]}
              onChange={handleChange}
              placeholder="Organization Name & Address"
            />
            <InputField
              label="Email ID"
              name={`guest${num}Email`}
              type="email"
              value={formData[`guest${num}Email`]}
              onChange={handleChange}
              placeholder="Email"
            />
            <InputField
              label="Contact No"
              name={`guest${num}Contact`}
              type="tel"
              value={formData[`guest${num}Contact`]}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const Step6_Financials = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={DollarSign}
      title="Financial Details"
      subtitle="Revenue and sponsorship information."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Registration Amount (Collected)"
        name="registrationAmount"
        type="number"
        value={formData.registrationAmount}
        onChange={handleChange}
        required
        error={errors.registrationAmount}
      />
      <InputField
        label="Total Sponsored Amount"
        name="sponsoredAmount"
        type="number"
        value={formData.sponsoredAmount}
        onChange={handleChange}
        required
        error={errors.sponsoredAmount}
      />
      <InputField
        label="Amount Received From Management"
        name="managementAmount"
        type="number"
        value={formData.managementAmount}
        onChange={handleChange}
        required
        error={errors.managementAmount}
      />
      <SelectField
        label="Sponsorship from Funding Agency?"
        name="fundingAgencySponsorship"
        value={formData.fundingAgencySponsorship}
        onChange={handleChange}
        options={YES_NO_OPTIONS}
        required
        error={errors.fundingAgencySponsorship}
      />
      <InputField
        label="Total Revenue Generated"
        name="totalRevenue"
        type="number"
        value={formData.totalRevenue}
        onChange={handleChange}
        required
        error={errors.totalRevenue}
      />
    </div>
  </div>
);

const Step7_Proof = ({ formData, handleFileSelect, errors }) => (
  <div className="space-y-6">
    <SectionTitle
      icon={UploadCloud}
      title="Proof Documents"
      subtitle="Upload relevant documents."
    />

    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-4 text-sm text-yellow-800">
      <p className="font-semibold">Required Proofs:</p>
      <ul className="list-disc ml-5 mt-1 space-y-1">
        <li>Approval letter</li>
        <li>Brochure / Poster / Invitation</li>
        <li>Attendance Sheet</li>
        <li>Photos (At least 3)</li>
        <li>Feedback</li>
      </ul>
      <p className="mt-2 text-xs">
        Please combine all into a single PDF if possible, or upload a ZIP file
        (if supported), otherwise upload the main report PDF.
      </p>
    </div>

    <FileUpload
      label="Upload Proof"
      name="proofFile"
      file={formData.proofFile}
      onFileSelect={handleFileSelect}
      required
      error={errors.proofFile}
    />
  </div>
);

const ReviewStep = ({ formData }) => {
  const ReviewItem = ({ label, value }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
      <span className="text-sm text-gray-500 block">{label}</span>
      <span className="text-sm font-medium text-gray-900 block mt-0.5 break-words">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={CheckCircle}
        title="Review & Submit"
        subtitle="Please review all details before submitting."
      />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
          Organizer Info
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReviewItem label="Faculty Name" value={formData.facultyName} />
          <ReviewItem label="Task ID" value={formData.taskId} />
          <ReviewItem label="Role" value={formData.role} />
          <ReviewItem label="Department" value={formData.claimedDepartment} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
          Event Details
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReviewItem label="Event Name" value={formData.eventName} />
          <ReviewItem label="Type" value={formData.eventType} />
          <ReviewItem
            label="Dates"
            value={`${formData.startDate} to ${formData.endDate}`}
          />
          <ReviewItem
            label="Internal Participants"
            value={`Students: ${formData.internalStudentsCount}, Faculty: ${formData.internalFacultyCount}`}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const STEPS = [
  { title: "Basic Info", component: Step1_BasicInfo, icon: User },
  { title: "Committee", component: Step2_Committee, icon: Users },
  { title: "Event Details", component: Step3_EventDetails, icon: Layout },
  { title: "Participants", component: Step4_Participants, icon: Users },
  { title: "Guests", component: Step5_Guests, icon: Briefcase },
  { title: "Financials", component: Step6_Financials, icon: DollarSign },
  { title: "Proof", component: Step7_Proof, icon: UploadCloud },
  { title: "Review", component: ReviewStep, icon: CheckCircle },
];

export default function EventsOrganizedForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1
    facultyName: "",
    taskId: "",
    role: "",
    claimedDepartment: "",
    specialLabsInvolved: "",
    specialLabName: "",
    isIIC: "",
    iicUploadType: "",
    isDeptAssociation: "",
    isRnd: "",
    isTechSociety: "",
    techSocietyName: "",
    isMouOutcome: "",
    mouId: "",
    isIrpOutcome: "",
    irpId: "",
    isCoe: "",
    coeId: "",
    isIndustryLab: "",
    industryLabId: "",

    // Step 2 (Internal/Student handled dynamically)
    internalFaculty1Status: "",
    internalFaculty1Name: "",
    internalFaculty1Role: "",
    internalFaculty2Status: "",
    internalFaculty2Name: "",
    internalFaculty2Role: "",
    internalFaculty3Status: "",
    internalFaculty3Name: "",
    internalFaculty3Role: "",
    internalFaculty4Status: "",
    internalFaculty4Name: "",
    internalFaculty4Role: "",

    studentMember1Status: "",
    studentMember1Name: "",
    studentMember2Status: "",
    studentMember2Name: "",
    studentMember3Status: "",
    studentMember3Name: "",
    studentMember4Status: "",
    studentMember4Name: "",
    studentMember5Status: "",
    studentMember5Name: "",

    // Step 3
    eventName: "",
    programType: "",
    eventType: "",
    eventCategory: "",
    eventOrganizer: "",
    eventDescription: "",
    eventMode: "",
    eventLevel: "",
    eventDuration: "",
    startDate: "",
    endDate: "",
    jointlyOrganizedWith: "",
    // Step 4
    internalStudentsCount: "",
    internalFacultyCount: "",
    externalStudentsCount: "",
    externalFacultyCount: "",
    // Step 5
    hasInvitedGuest: "",
    isAlumni: "",
    guest1Type: "",
    guest1Name: "",
    guest1Designation: "",
    guest1Email: "",
    guest1Contact: "",
    guest1Org: "",
    guest2Type: "",
    guest2Name: "",
    guest2Designation: "",
    guest2Email: "",
    guest2Contact: "",
    guest2Org: "",
    guest3Type: "",
    guest3Name: "",
    guest3Designation: "",
    guest3Email: "",
    guest3Contact: "",
    guest3Org: "",
    guest4Type: "",
    guest4Name: "",
    guest4Designation: "",
    guest4Email: "",
    guest4Contact: "",
    guest4Org: "",
    guest5Type: "",
    guest5Name: "",
    guest5Designation: "",
    guest5Email: "",
    guest5Contact: "",
    guest5Org: "",
    // Step 6
    registrationAmount: "",
    sponsoredAmount: "",
    managementAmount: "",
    fundingAgencySponsorship: "",
    totalRevenue: "",
    // Step 7
    proofFile: null,
  });

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

  const validateStep = (stepIndex) => {
    const newErrors = {};
    const d = formData;

    if (stepIndex === 0) {
      if (!d.facultyName) newErrors.facultyName = "Required";
      if (!d.taskId) newErrors.taskId = "Required";
      if (!d.role) newErrors.role = "Required";
      if (!d.claimedDepartment) newErrors.claimedDepartment = "Required";

      // Dynamic validation
      if (d.specialLabsInvolved === "Yes" && !d.specialLabName)
        newErrors.specialLabName = "Required";
      if (d.isIIC === "Yes" && !d.iicUploadType)
        newErrors.iicUploadType = "Required";
      if (d.isTechSociety === "Yes" && !d.techSocietyName)
        newErrors.techSocietyName = "Required";
      if (d.isMouOutcome === "Yes" && !d.mouId) newErrors.mouId = "Required";
      if (d.isIrpOutcome === "Yes" && !d.irpId) newErrors.irpId = "Required";
      if (d.isCoe === "Yes" && !d.coeId) newErrors.coeId = "Required";
      if (d.isIndustryLab === "Yes" && !d.industryLabId)
        newErrors.industryLabId = "Required";
    }

    if (stepIndex === 1) {
      // Step 2 Committee
      // Validate committee members if status is Yes
      for (let i = 1; i <= 4; i++) {
        if (d[`internalFaculty${i}Status`] === "Yes") {
          if (!d[`internalFaculty${i}Name`])
            newErrors[`internalFaculty${i}Name`] = "Required";
          if (!d[`internalFaculty${i}Role`])
            newErrors[`internalFaculty${i}Role`] = "Required";
        }
      }
      for (let i = 1; i <= 5; i++) {
        if (d[`studentMember${i}Status`] === "Yes") {
          if (!d[`studentMember${i}Name`])
            newErrors[`studentMember${i}Name`] = "Required";
        }
      }
    }

    if (stepIndex === 2) {
      // Step 3
      if (!d.eventName) newErrors.eventName = "Required";
      if (!d.startDate) newErrors.startDate = "Required";
      if (!d.endDate) newErrors.endDate = "Required";
    }
    if (stepIndex === 6) {
      // Step 7
      if (!d.proofFile) newErrors.proofFile = "Proof file is required";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log("Submitting Event Form:", formData);
      navigate("/faculty/uploadview");
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
                Events Organized
              </h1>
              <p className="text-sm text-gray-500">
                Submit details for events organized by you.
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Progress - Horizontal for Desktop */}
        <div className="mb-8 hidden md:block">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-gray-50 px-2"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 
                      ${
                        isCompleted
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : isCurrent
                            ? "bg-white border-indigo-600 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-300"
                      }`}
                  >
                    {isCompleted ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 ${isCurrent ? "text-indigo-600" : "text-gray-500"}`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="md:hidden mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <span className="font-medium text-gray-900">
            {STEPS[currentStep].title}
          </span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 min-h-[400px]">
            <CurrentStepComponent
              formData={formData}
              handleChange={handleChange}
              handleFileSelect={handleFileSelect}
              errors={errors}
            />
          </form>

          {/* Footer Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg border text-sm font-medium transition-colors ${currentStep === 0 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm"}`}
            >
              Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center"
              >
                Next <ArrowLeft size={16} className="ml-2 rotate-180" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 shadow-sm transition-colors flex items-center"
              >
                <Save size={18} className="mr-2" /> Submit Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
