import React from 'react';

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

const ORGANIZER_ROLES = ['Organizer', 'Coordinator', 'Judge', 'Mentor', 'Speaker', 'Host', 'Other'];

const EventOrganizerDetails = ({ formData, handleChange, setFormData, errors }) => {
  const handleDateTypeChange = (e) => {
     setFormData(prev => ({
        ...prev,
        eventDateType: e.target.value,
        // Clear end date if switching back to single day
        endDate: e.target.value === 'single' ? '' : prev.endDate,
      }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Event Title <RequiredAst />
        </label>
        <input
          type="text"
          name="eventTitle"
          id="eventTitle"
          value={formData.eventTitle || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.eventTitle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          placeholder="e.g., Annual Tech Fest, Coding Competition"
          required
        />
        {errors.eventTitle && <p className="mt-1 text-sm text-red-600">{errors.eventTitle}</p>}
      </div>
      <div>
        <label htmlFor="organizerRole" className="block text-sm font-medium text-gray-700 mb-1">
          Role <RequiredAst />
        </label>
        <select
          name="organizerRole"
          id="organizerRole"
          value={formData.organizerRole || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.organizerRole ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          required
        >
          <option value="" disabled>Select your role</option>
          {ORGANIZER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {errors.organizerRole && <p className="mt-1 text-sm text-red-600">{errors.organizerRole}</p>}
      </div>
      <div>
        <label htmlFor="hostOrganization" className="block text-sm font-medium text-gray-700 mb-1">
          Host Organization <RequiredAst />
        </label>
        <input
          type="text"
          name="hostOrganization"
          id="hostOrganization"
          value={formData.hostOrganization || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.hostOrganization ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          placeholder="e.g., Computer Science Department, College Name"
          required
        />
        {errors.hostOrganization && <p className="mt-1 text-sm text-red-600">{errors.hostOrganization}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Dates <RequiredAst /></label>
        <div className="mt-2 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
          <div className="flex items-center">
            <input
              id="singleDay"
              name="eventDateType"
              type="radio"
              value="single"
              checked={formData.eventDateType === 'single'}
              onChange={handleDateTypeChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="singleDay" className="ml-2 block text-sm text-gray-900">
              Single Day
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="dateRange"
              name="eventDateType"
              type="radio"
              value="range"
              checked={formData.eventDateType === 'range'}
              onChange={handleDateTypeChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="dateRange" className="ml-2 block text-sm text-gray-900">
              Date Range
            </label>
          </div>
        </div>
         {errors.eventDateType && <p className="mt-1 text-sm text-red-600">{errors.eventDateType}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
         <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            {formData.eventDateType === 'range' ? 'Start Date' : 'Date'} <RequiredAst />
            </label>
            <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                 max={formData.endDate || new Date().toISOString().split('T')[0]} // Cannot start after end date or today
                className={`mt-1 block w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>
         {formData.eventDateType === 'range' && (
            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date <RequiredAst />
                </label>
                <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    min={formData.startDate} // Cannot end before start date
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                    className={`mt-1 block w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    required={formData.eventDateType === 'range'} // Required only if range is selected
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>
         )}
      </div>
      {errors.dateOrder && <p className="mt-1 text-sm text-red-600">{errors.dateOrder}</p>}
       <div>
            <label htmlFor="certificateLink" className="block text-sm font-medium text-gray-700 mb-1">
            Link to Certificate/Proof (Optional)
            </label>
            <input
            type="url"
            name="certificateLink"
            id="certificateLink"
            value={formData.certificateLink || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://"
            />
      </div>
    </div>
  );
};

export default EventOrganizerDetails;