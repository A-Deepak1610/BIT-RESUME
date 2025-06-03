import React from 'react';

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

const CustomDetails = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="certificateDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Certificate Description <RequiredAst />
        </label>
        <textarea
          name="certificateDescription"
          id="certificateDescription"
          rows={4}
          value={formData.certificateDescription || ''}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.certificateDescription ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          placeholder="Describe the achievement or certification"
          required
        />
        {errors.certificateDescription && <p className="mt-1 text-sm text-red-600">{errors.certificateDescription}</p>}
      </div>
      <div>
        <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
          Context
        </label>
        <textarea
          name="context"
          id="context"
          rows={4}
          value={formData.context || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Add any additional details about your certificate"
        />
      </div>
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

export default CustomDetails;