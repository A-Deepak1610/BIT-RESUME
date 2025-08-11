import React from 'react';


// A simple component for section headers to keep the JSX clean
const SectionHeader = ({ title }) => (
    <h3 className="text-lg leading-6 font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
      {title}
    </h3>
);


const ParticipationDetails = ({
  formData,
  handleChange,
  errors,
  handleFileSelect,
  setFormError,
  FileUploadField,
  RequiredAst,
  FileText
}) => {
  return (
    <div className="space-y-8">
      {/* Section 1: Activity Details */}
      <div>
        <SectionHeader title="Activity Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
         
          {/* Activity / Event Name */}
          <div>
            <label htmlFor="activity_typeParticipation" className="block text-sm font-medium text-gray-700 mb-1">
              Activity / Event Name <RequiredAst />
            </label>
            <input
              type="text"
              name="activity_type"
              id="activity_typeParticipation"
              value={formData.activity_type || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.activity_type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="e.g., CodeClub Workshop Volunteer"
              required
            />
            {errors.activity_type && <p className="mt-1 text-sm text-red-600">{errors.activity_type}</p>}
          </div>


          {/* Location Field */}
          <div>
            <label htmlFor="locationParticipation" className="block text-sm font-medium text-gray-700 mb-1">
              Location <RequiredAst />
            </label>
            <input
              type="text"
              name="location"
              id="locationParticipation"
              value={formData.location || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="e.g., University Auditorium"
              required
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>


          {/* Duration Field */}
          <div>
            <label htmlFor="durationParticipation" className="block text-sm font-medium text-gray-700 mb-1">
              Duration <RequiredAst />
            </label>
            <input
              type="text"
              name="duration"
              id="durationParticipation"
              value={formData.duration || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="e.g., 3 Days, 1 Semester"
              required
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
          </div>
         
          {/* --- FIX: UPDATED FIELD --- */}
          {/* Issue Date Field */}
          <div>
            <label htmlFor="issueDateParticipation" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Activity/Issue <RequiredAst />
            </label>
            <input
              type="date"
              name="issueDate" // <<< FIX: Standardized name to issueDate
              id="issueDateParticipation" // <<< FIX: Matched ID
              value={formData.issueDate || ''} // <<< FIX: Changed to issueDate
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.issueDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              required
            />
            {errors.issueDate && <p className="mt-1 text-sm text-red-600">{errors.issueDate}</p>}
          </div>
        </div>


        {/* Summary Field (Full Width) */}
        <div className="mt-4">
            <label htmlFor="summaryParticipation" className="block text-sm font-medium text-gray-700 mb-1">
              Summary of Role/Activity (max 25 words) <RequiredAst />
            </label>
            <input
              type="text"
              name="summary"
              id="summaryParticipation"
              value={formData.summary || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.summary ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="Describe your key responsibilities or the nature of the event."
              required
            />
            {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary}</p>}
        </div>


        {/* LinkedIn Post URL Field (Full Width) */}
        <div className="mt-4">
            <label htmlFor="linkedinLinkParticipation" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Post URL <RequiredAst />
            </label>
            <input
              type="url"
              name="linkedinLink"
              id="linkedinLinkParticipation"
              value={formData.linkedinLink || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.linkedinLink ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              placeholder="https://www.linkedin.com/feed/update/urn:li:activity:..."
              required
            />
            {errors.linkedinLink && <p className="mt-1 text-sm text-red-600">{errors.linkedinLink}</p>}
        </div>
      </div>


      {/* Section 2: Proof of Participation */}
      <div>
        <SectionHeader title="Proof of Participation" />
        <FileUploadField
          id="certificateFile-participation"
          name="certificateFile"
          label="Upload Proof/Certificate"
          selectedFile={formData.certificateFile}
          onFileSelect={handleFileSelect}
          error={errors.certificateFile}
          helperText="PDF, PNG, JPG up to 5MB. This is required."
          required
          setFormError={setFormError}
          existingFileName={formData.existingFileName}
        />
       
        {formData.existingFileId && !formData.certificateFile && !errors.certificateFile && (
          <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-200">
            <FileText size={16} className="mr-2 flex-shrink-0 text-green-600" aria-hidden="true" />
            <span className="font-medium mr-2 text-green-700">
              Current file: {formData.existingFileName || 'Previously uploaded file'}. Replace by uploading a new one.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


export default ParticipationDetails;