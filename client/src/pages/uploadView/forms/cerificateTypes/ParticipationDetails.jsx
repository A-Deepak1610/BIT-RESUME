import React from 'react';

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
    <div className="space-y-6">
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
          placeholder="e.g., Blood Donation Camp, Technical Workshop"
          required
        />
        {errors.activity_type && <p className="mt-1 text-sm text-red-600">{errors.activity_type}</p>}
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
          placeholder="e.g., 2 hours, 1 day, 3 weeks"
          required
        />
        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
      </div>

      <div>
        <label htmlFor="locationParticipation" className="block text-sm font-medium text-gray-700 mb-1">
          Location of Activity / Event <RequiredAst />
        </label>
        <input
          type="text"
          name="location"
          id="locationParticipation"
          value={formData.location || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
          placeholder="e.g., College Auditorium, City Hall"
          required
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      <FileUploadField
        id="certificateFileParticipation"
        name="certificateFile"
        label="Upload Certificate/Proof File"
        selectedFile={formData.certificateFile}
        onFileSelect={handleFileSelect}
        error={errors.certificateFile}
        helperText="PDF, PNG, JPG up to 5MB. Required."
        required
        setFormError={setFormError}
        py="py-6"
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
  );
};
export default ParticipationDetails;