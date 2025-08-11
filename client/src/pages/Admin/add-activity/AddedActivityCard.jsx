import React from 'react';
import { Calendar, Tag, Users, Hash } from 'lucide-react';

// A helper to format the date nicely
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

export default function AddedActivityCard({ activity }) {
    if (!activity) {
        return null;
    }

    const {
        event_name,
        image_url, // Assuming the API returns a URL for the uploaded image
        domains,
        type,
        deadline,
        team_size,
        event_code
    } = activity;

    const domainList = domains ? domains.split(',').map(d => d.trim()) : [];

    return (
        <div className="bg-white rounded-xl shadow-lg flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Image Section */}
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                {image_url ? (
                    <img src={image_url} alt={`${event_name} poster`} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-500">No Image</span>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {type || 'Event'}
                    </span>
                    {event_code && (
                         <span className="text-xs font-mono text-gray-500 flex items-center">
                            <Hash size={12} className="mr-1" />{event_code}
                         </span>
                    )}
                </div>

                {/* Event Name */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex-grow">
                    {event_name || "Untitled Event"}
                </h3>

                {/* Details Section */}
                <div className="space-y-2.5 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                        <Calendar size={16} className="mr-2.5 text-gray-500 flex-shrink-0" />
                        <span>Deadline: <strong>{formatDate(deadline)}</strong></span>
                    </div>
                    <div className="flex items-center">
                        <Users size={16} className="mr-2.5 text-gray-500 flex-shrink-0" />
                        <span>Team Size: <strong>{team_size || 'N/A'}</strong></span>
                    </div>
                </div>

                {/* Domains/Tags Section */}
                {domainList.length > 0 && (
                     <div className="mt-auto border-t pt-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag size={14} className="text-gray-500" />
                            {domainList.slice(0, 3).map((domain, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                    {domain}
                                </span>
                            ))}
                            {domainList.length > 3 && (
                                <span className="text-xs text-gray-500">+{domainList.length - 3} more</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}