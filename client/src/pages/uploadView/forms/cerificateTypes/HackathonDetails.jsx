import React from 'react';
import { FileText, Award } from 'lucide-react';

const WIN_RESULTS = ['Winner', 'Runner-up', 'Top 5', 'Top 10', 'Participation Only', 'Other'];

const HackathonDetails = (props) => {
  const {
    formData,
    handleChange,
    errors,
    InputField,
    SelectField,
    FileUploadField,
    RequiredAst,
    SectionHeader,
    handleFileSelect,
    setFormError,
  } = props;

  return (
    <div className="space-y-6">
      <SectionHeader title="Hackathon / Competition Specifics" icon={Award} />
      <InputField
        id="hackathonEventTitle"
        name="eventTitle"
        label="Event Name"
        value={formData.eventTitle || ''}
        onChange={handleChange}
        error={errors.eventTitle}
        placeholder="e.g., Smart India Hackathon 2023"
        required
      />
      <InputField
        id="hackathonEventCode"
        name="eventCode"
        label="Event Code"
        value={formData.eventCode || ''}
        onChange={handleChange}
        error={errors.eventCode}
        placeholder="e.g., SIH2023, EVT123" // Removed (Optional)
        required // Added required prop
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Participation Type <RequiredAst />
        </label>
        <div className="mt-2 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
          <div className="flex items-center">
            <input
              id="hackathonIndividual"
              name="participationType"
              type="radio"
              value="Individual"
              checked={formData.participationType === 'Individual'}
              onChange={handleChange}
              className="focus:ring-primary h-4 w-4 text-primary-dark border-gray-300"
              required
            />
            <label htmlFor="hackathonIndividual" className="ml-2 block text-sm text-gray-900">
              Individual
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="hackathonTeam"
              name="participationType"
              type="radio"
              value="Team"
              checked={formData.participationType === 'Team'}
              onChange={handleChange}
              className="focus:ring-primary h-4 w-4 text-primary-dark border-gray-300"
              required
            />
            <label htmlFor="hackathonTeam" className="ml-2 block text-sm text-gray-900">
              Team
            </label>
          </div>
        </div>
        {errors.participationType && <p className="mt-1 text-sm text-red-600">{errors.participationType}</p>}
      </div>

      {formData.participationType === 'Team' && (
        <InputField
          id="hackathonTeamId"
          name="teamId"
          label="Team ID / Name"
          value={formData.teamId || ''}
          onChange={handleChange}
          error={errors.teamId}
          placeholder="Enter your Team ID or Name"
          required
        />
      )}

      <SelectField
        id="hackathonWinResult"
        name="winResult"
        label="Result / Achievement"
        value={formData.winResult || ''}
        onChange={handleChange}
        error={errors.winResult}
        required
      >
        <option value="" disabled>Select result</option>
        {WIN_RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
      </SelectField>
      
      <FileUploadField
        id="certificateFileHackathon"
        name="certificateFile"
        label="Upload Certificate File"
        selectedFile={formData.certificateFile}
        onFileSelect={handleFileSelect}
        error={errors.certificateFile}
        helperText="PDF, PNG, JPG up to 5MB."
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

export default HackathonDetails;