import React from 'react';
import { Info, Upload } from 'lucide-react';


// A predefined list of common platforms for better user experience
const PLATFORMS = [
  'Coursera',
  'Udemy',
  'edX',
  'LinkedIn Learning',
  'Pluralsight',
  'Udacity',
  'NPTEL',
  'Swayam',
  'Great Learning',
  'Simplilearn',
  'Skillshare',
  'FutureLearn',
  'Other'
];


const OnlineCourseDetails = ({
    formData,
    handleChange,
    errors,
    handleFileSelect,
    setFormError,
    InputField,
    SelectField, // Using SelectField for Platform
    FileUploadField,
    SectionHeader
}) => {
  // Defensive check to prevent errors if formData is not yet available
  if (!formData) {
    return null;
  }


  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title="Course & Issuer Information" icon={Info} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-4">
          <InputField
            id="certificateTitle"
            name="certificateTitle"
            label="Certificate Title / Course Name"
            value={formData.certificateTitle || ''}
            onChange={handleChange}
            error={errors.certificateTitle}
            required
            placeholder="e.g., Python for Everybody"
          />
         
          {/* Using a SelectField for Platform is better for standardized data */}
          <SelectField
            id="platform"
            name="platform"
            label="Platform"
            value={formData.platform || ''}
            onChange={handleChange}
            error={errors.platform}
            required
          >
            <option value="" disabled>Select a platform...</option>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </SelectField>


          <InputField
            id="issuedBy"
            name="issuedBy"
            label="Issuing Organization"
            value={formData.issuedBy || ''}
            onChange={handleChange}
            error={errors.issuedBy}
            required
            placeholder="e.g., University of Michigan"
          />


          <InputField
            id="issueDate"
            name="issueDate"
            label="Issue Date"
            type="date"
            value={formData.issueDate || ''}
            onChange={handleChange}
            error={errors.issueDate}
            required
          />


          <InputField
            id="courseLink"
            name="courseLink"
            label="Course Link"
            type="url"
            value={formData.courseLink || ''}
            onChange={handleChange}
            error={errors.courseLink}
            required
            placeholder="https://www.coursera.org/learn/python"
          />


          <InputField
            id="credentialId"
            name="credentialId"
            label="Credential ID (Optional)"
            value={formData.credentialId || ''}
            onChange={handleChange}
            error={errors.credentialId}
            placeholder="e.g., ABC-123-XYZ"
            helperText="Enter the unique ID from your certificate if available."
          />


          {/* This field spans the full width on the next line */}
          <div className="md:col-span-2">
            <InputField
              id="linkedinLink"
              name="linkedinLink"
              label="LinkedIn Post URL"
              type="url"
              value={formData.linkedinLink || ''}
              onChange={handleChange}
              error={errors.linkedinLink}
              required
              placeholder="https://www.linkedin.com/posts/your-activity-link"
            />
          </div>
        </div>
      </div>


      <div>
        <SectionHeader title="Course Duration" icon={Info} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-4">
          <InputField
            id="startDate"
            name="startDate"
            label="Start Date"
            type="date"
            value={formData.startDate || ''}
            onChange={handleChange}
            error={errors.startDate}
            required
          />
          <InputField
            id="endDate"
            name="endDate"
            label="End Date"
            type="date"
            value={formData.endDate || ''}
            onChange={handleChange}
            error={errors.endDate}
            required
          />
          {errors.dateOrder && <p className="mt-1 text-sm text-red-600 md:col-span-2">{errors.dateOrder}</p>}
        </div>
      </div>


      <div>
        <SectionHeader title="Proof of Completion" icon={Upload} />
        <div className="mt-4">
          <FileUploadField
            id="certificateFile-online-course"
            name="certificateFile"
            label="Upload Certificate"
            onFileSelect={handleFileSelect}
            selectedFile={formData.certificateFile}
            error={errors.certificateFile}
            required
            setFormError={setFormError}
            existingFileName={formData.existingFileName}
          />
        </div>
      </div>
    </div>
  );
};


export default OnlineCourseDetails;