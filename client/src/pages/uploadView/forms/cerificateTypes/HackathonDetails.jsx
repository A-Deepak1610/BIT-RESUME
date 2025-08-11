import React from 'react';
// Assuming these icons are used by your SectionHeader component
import { Award, Info, Upload } from 'lucide-react';


const HackathonDetails = ({
    formData,
    handleChange,
    errors,
    handleFileSelect,
    setFormError,
    InputField,
    SelectField,
    FileUploadField,
    RequiredAst, // RequiredAst is used by InputField/SelectField internally
    SectionHeader,
    FileText // Assuming this might be needed for the file upload part
}) => (
    <div className="space-y-6">
        <div>
            <SectionHeader title="Event Information" icon={Info} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                <InputField id="hackathonEventTitle" name="eventTitle" label="Event Name" value={formData.eventTitle || ''} onChange={handleChange} error={errors.eventTitle} required placeholder="e.g., Smart India Hackathon" />
                <InputField id="eventCode" name="eventCode" label="Event Code" value={formData.eventCode || ''} onChange={handleChange} error={errors.eventCode} required placeholder="e.g., SIH2023" />
            </div>
            <div className="mt-1">
                <InputField id="hackathonSummary" name="summary" label="Event Summary (max 15 words)" value={formData.summary || ''} onChange={handleChange} error={errors.summary} required placeholder="A brief one-line summary of the event's theme." />
            </div>
            <div className="mt-1">
              <InputField id="linkedinLink" name="linkedinLink" label="LinkedIn Post URL" type="url" value={formData.linkedinLink || ''} onChange={handleChange} error={errors.linkedinLink} required placeholder="https://www.linkedin.com/in/your-profile" />
            </div>
        </div>


        <div>
            <SectionHeader title="Participation Details" icon={Award} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                <SelectField id="participationType" name="participationType" label="Participation Type" value={formData.participationType || ''} onChange={handleChange} error={errors.participationType} required>
                    <option value="">Select a type...</option>
                    <option value="Individual">Individual</option>
                    <option value="Team">Team</option>
                </SelectField>


                {formData.participationType === 'Team' && (
                    <InputField id="teamId" name="teamId" label="Team ID / Name" value={formData.teamId || ''} onChange={handleChange} error={errors.teamId} required={formData.participationType === 'Team'} placeholder="e.g., Team Innovate" />
                )}


                 <SelectField id="winResult" name="winResult" label="Result / Achievement" value={formData.winResult || ''} onChange={handleChange} error={errors.winResult} required>
                    <option value="">Select result...</option>
                    <option value="Winner">Winner</option>
                    <option value="Runner-up">Runner-up</option>
                    <option value="Finalist">Finalist</option>
                    <option value="Participant">Participant</option>
                </SelectField>


                {/* --- NEW FIELD ADDED HERE --- */}
                <InputField
                    id="issueDate"
                    name="issueDate" // This is the name sent to the backend
                    label="Issue Date"
                    type="date"
                    value={formData.issueDate || ''}
                    onChange={handleChange}
                    error={errors.issueDate}
                    required
                />
            </div>
        </div>


         <div>
            <SectionHeader title="Proof of Participation/Win" icon={Upload} />
            <FileUploadField
                id="certificateFile-hackathon"
                name="certificateFile"
                label="Upload Certificate/Proof"
                onFileSelect={handleFileSelect}
                selectedFile={formData.certificateFile}
                error={errors.certificateFile}
                required
                setFormError={setFormError}
                existingFileName={formData.existingFileName}
            />
        </div>
    </div>
);


export default HackathonDetails;