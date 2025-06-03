import React from 'react';
import { FileText, Info } from 'lucide-react'; // <-- Import the missing icons here


const PLATFORMS = [
  'Udemy', 'Coursera', 'edX', 'LinkedIn Learning', 'Pluralsight', 'Udacity', 'NPTEL', 'Swayam', 'Other',
];

const OnlineCourseDetails = ({
  formData,
  handleChange,
  errors,
  handleFileSelect,
  setFormError,
  InputField,
  SelectField,
  FileUploadField,
  RequiredAst,
  SectionHeader,
}) => {
  return (
    <div className="space-y-6">
      <SectionHeader title="Online Course Information" icon={FileText} />

      <InputField
        id="certificateTitle"
        name="certificateTitle"
        label="Certificate Title"
        value={formData.certificateTitle || ''}
        onChange={handleChange}
        error={errors.certificateTitle}
        placeholder="e.g., Machine Learning A-Z"
        required
      />

      <InputField
        id="issueDate"
        name="issueDate"
        label="Issue Date"
        type="date"
        value={formData.issueDate || ''}
        onChange={handleChange}
        error={errors.issueDate}
        max={new Date().toISOString().split("T")[0]}
        required
        className="appearance-none"
      />

      <FileUploadField
        id="certificateFileOnlineCourse"
        name="certificateFile"
        label="Upload Certificate File"
        selectedFile={formData.certificateFile}
        onFileSelect={handleFileSelect}
        error={errors.certificateFile}
        helperText="PDF, PNG, JPG up to 5MB. This will be stored as certificate_pdf."
        required
        setFormError={setFormError}
        py="py-6"
      />
      {formData.existingFileId && !formData.certificateFile && (
          <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
            {/* Using FileText icon directly, so it must be imported */}
            <FileText size={16} className="mr-2 flex-shrink-0 text-green-600" aria-hidden="true" />
            <span className="font-medium mr-2 text-green-700">
              Current file: {formData.existingFileName || 'Previously uploaded file'}. Replace by uploading a new one.
            </span>
          </div>
        )}

      <div className="pt-6 border-t border-gray-200 space-y-6">
        {/* Using the SectionHeader prop, which itself might use an icon passed from parent */}
        {/* The icon prop here is the actual Icon component */}
        <SectionHeader title="Course Details" icon={Info} />
        <SelectField
          id="platform"
          name="platform"
          label="Platform"
          value={formData.platform || ''}
          onChange={handleChange}
          error={errors.platform}
          required
        >
          <option value="" disabled>Select platform</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </SelectField>

        <InputField
          id="courseLink"
          name="courseLink"
          label="Course Link"
          type="url"
          value={formData.courseLink || ''}
          onChange={handleChange}
          error={errors.courseLink}
          placeholder="https://example.com/course-details"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            id="startDate"
            name="startDate"
            label="Start Date"
            type="date"
            value={formData.startDate || ''}
            onChange={handleChange}
            error={errors.startDate}
            max={formData.endDate || new Date().toISOString().split("T")[0]}
            required
            className="appearance-none"
          />
          <InputField
            id="endDate"
            name="endDate"
            label="End Date"
            type="date"
            value={formData.endDate || ''}
            onChange={handleChange}
            error={errors.endDate}
            min={formData.startDate || undefined}
            max={new Date().toISOString().split("T")[0]}
            required
            className="appearance-none"
          />
        </div>
        {errors.dateOrder && <p className="mt-1 text-sm text-red-600">{errors.dateOrder}</p>}
      </div>
    </div>
  );
};

export default OnlineCourseDetails;