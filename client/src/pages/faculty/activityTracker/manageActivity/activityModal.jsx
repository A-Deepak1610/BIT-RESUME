import React, { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { X, FileText, Calendar, MapPin, Users, Eye } from 'lucide-react';
import axios from 'axios';

const activityTypes = ["Survey", "Workshop", "Seminar", "Meeting", "Event", "Sessions"];
const years = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];
const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "All Departments"];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '700px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '12px',
    overflow: 'hidden',
};

export default function CreateActivityModal({ open, handleClose }) {
    const [activity_title, setActivityTitle] = useState('');
    const [activity_type, setActivityType] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [linkorlocation, setLinkOrLocation] = useState('');
    const [year_type, setYearType] = useState('');
    const [target_dept, setTargetDept] = useState('All Departments');
    const [specific_rollno, setSpecificRollno] = useState('');

    const handleSubmit = async () => {
        // Basic Validations
        if (!activity_title.trim()) {
            alert('Activity Title is required.');
            return;
        }
        if (!activity_type) {
            alert('Activity Type is required.');
            return;
        }
        if (!description.trim()) {
            alert('Description is required.');
            return;
        }
        if (!start_date) {
            alert('Start Date is required.');
            return;
        }
        if (!end_date) {
            alert('End Date is required.');
            return;
        }
        if (new Date(end_date) < new Date(start_date)) {
            alert('End Date cannot be before Start Date.');
            return;
        }

        if (activity_type) {
            if (!year_type) {
                alert('Target Year is required when an Activity Type is selected.');
                return;
            }
        }

        const final_specific_rollno = (activity_type === "Sessions" && specific_rollno.trim()) ? specific_rollno.trim() : null;
        const isForAllStudents = year_type === "All Years" && target_dept === "All Departments";

        // Create FormData object
        const formData = new FormData();

        // Append fields to formData
        // Note: FormData will convert null values to the string "null".
        // If your backend expects absent fields for null, you'd need conditional appends.
        formData.append('activity_title', activity_title.trim());
        formData.append('activity_type', activity_type);
        formData.append('description', description.trim());
        formData.append('start_date', start_date);
        formData.append('end_date', end_date);

        if (linkorlocation.trim()) {
            formData.append('linkorlocation', linkorlocation.trim());
        }
        // If you must send null as a field if empty:
        // formData.append('linkorlocation', linkorlocation.trim() || null); // This might send "null" string

        formData.append('year_type', year_type);
        formData.append('target_dept', target_dept);

        if (final_specific_rollno) {
            formData.append('specific_rollno', final_specific_rollno);
        }
        // If you must send null as a field if empty:
        // formData.append('specific_rollno', final_specific_rollno); // This might send "null" string

        formData.append('all_students', isForAllStudents ? '1' : '0'); // FormData converts numbers to strings

        // For debugging: Log FormData entries
        // Note: Direct console.log(formData) won't show entries. You need to iterate.
        console.log("FormData entries to be sent:");
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
        }

        const API_URL = 'http://localhost:6001/api/manageactivities/createActivity';

        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Activity created successfully:', response.data);

            setActivityTitle('');
            setActivityType('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setLinkOrLocation('');
            setYearType('');
            setTargetDept('All Departments');
            setSpecificRollno('');

            handleClose();
        } catch (error) {
            const errorMessage = error.response
                ? (error.response.data.message || JSON.stringify(error.response.data))
                : error.message;
            console.error('Error creating activity:', error.response ? error.response.data : error.message);
            console.error('Full error object:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            }
            alert(`Error creating activity: ${errorMessage}`);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-activity-modal-title"
            aria-describedby="create-activity-modal-description"
        >
            <Box sx={style}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FileText className="text-indigo-600" size={28} />
                        <h2 id="create-activity-modal-title" className="text-xl sm:text-2xl font-semibold text-gray-800">
                            Create New Activity
                        </h2>
                    </div>
                    <IconButton onClick={handleClose} size="small">
                        <X className="text-gray-500 hover:text-gray-700" />
                    </IconButton>
                </div>

                <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
                    <section className="mb-6 sm:mb-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="activity_title" className="block text-sm font-medium text-gray-600 mb-1">Activity Title *</label>
                                <input
                                    type="text"
                                    id="activity_title"
                                    value={activity_title}
                                    onChange={(e) => setActivityTitle(e.target.value)}
                                    placeholder="Enter activity title"
                                    className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="activity_type" className="block text-sm font-medium text-gray-600 mb-1">Activity Type *</label>
                                <select
                                    id="activity_type"
                                    value={activity_type}
                                    onChange={(e) => {
                                        setActivityType(e.target.value);
                                        if (e.target.value !== "Sessions") {
                                            setSpecificRollno('');
                                        }
                                    }}
                                    className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                                >
                                    <option value="" disabled>Select type</option>
                                    {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Description *</label>
                            <textarea
                                id="description"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the activity, its purpose, and what participants can expect..."
                                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                    </section>

                    <section className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="text-indigo-600" size={22} />
                            <h3 className="text-lg font-medium text-gray-700">Schedule & Location</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-600 mb-1">Start Date *</label>
                                <input
                                    type="date"
                                    id="start_date"
                                    value={start_date}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-600 mb-1">End Date *</label>
                                <input
                                    type="date"
                                    id="end_date"
                                    value={end_date}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-6">
                            <label htmlFor="linkorlocation" className="block text-sm font-medium text-gray-600 mb-1">
                                <MapPin size={16} className="inline mr-1.5 mb-0.5 text-gray-500" />
                                Location or Link (Optional)
                            </label>
                            <input
                                type="text"
                                id="linkorlocation"
                                value={linkorlocation}
                                onChange={(e) => setLinkOrLocation(e.target.value)}
                                placeholder="e.g., Auditorium A, Conference Room, or Zoom link"
                                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                    </section>

                    {activity_type && (
                        <section className="mb-6 sm:mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="text-indigo-600" size={22} />
                                <h3 className="text-lg font-medium text-gray-700">Visibility Rules *</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Select who can view and respond to this activity. `year_type` is mandatory.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="year_type" className="block text-sm font-medium text-gray-600 mb-1">Target Year (year_type) *</label>
                                    <select
                                        id="year_type"
                                        value={year_type}
                                        onChange={(e) => setYearType(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                                    >
                                        <option value="" disabled>Select year</option>
                                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="target_dept" className="block text-sm font-medium text-gray-600 mb-1">Target Department (target_dept) (Optional)</label>
                                    <select
                                        id="target_dept"
                                        value={target_dept}
                                        onChange={(e) => setTargetDept(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                                    >
                                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                </div>
                            </div>

                            {activity_type === "Sessions" && (
                                <div className="mt-4 sm:mt-6">
                                    <label htmlFor="specific_rollno" className="block text-sm font-medium text-gray-600 mb-1">
                                        Specific Roll Numbers (specific_rollno) (Optional for Sessions)
                                    </label>
                                    <input
                                        type="text"
                                        id="specific_rollno"
                                        value={specific_rollno}
                                        onChange={(e) => setSpecificRollno(e.target.value)}
                                        placeholder="Enter comma-separated roll numbers"
                                        className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        If provided for a Session, this list will further refine the audience.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-slate-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
                    >
                        <Eye size={18} />
                        <span>Publish Activity</span>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}