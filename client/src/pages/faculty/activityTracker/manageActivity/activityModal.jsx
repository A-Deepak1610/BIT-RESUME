import React, { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { X, FileText, Calendar, MapPin, Briefcase, AlertTriangle, UserCheck, Eye } from 'lucide-react';
import axios from 'axios';


// --- Constants ---
const activityTypes = ["Survey", "Workshop", "Meeting", "Sessions"];
const years = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];
const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "All Departments"];
const publishingDepartments = [
    "Department of Student Affairs",
    "Training and Placement Cell",
    "Computer Science Department",
    "Electrical Engineering Department",
    "Mechanical Engineering Department",
    "Civil Engineering Department",
    "Alumni Association"
];


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


// --- Helper Component for Displaying Errors ---
const ErrorDisplay = ({ message }) => {
    if (!message) return null;
    return (
        <p className="mt-1.5 flex items-center text-sm text-red-600">
            <AlertTriangle size={14} className="mr-1.5" />
            {message}
        </p>
    );
};


export default function CreateActivityModal({ open, handleClose }) {
    const [activity_title, setActivityTitle] = useState('');
    const [activity_type, setActivityType] = useState('');
    const [publishingDepartment, setPublishingDepartment] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [linkorlocation, setLinkOrLocation] = useState('');
    const [year_type, setYearType] = useState('');
    const [target_dept, setTargetDept] = useState('All Departments');
    const [specific_rollno, setSpecificRollno] = useState('');
    const [host, setHost] = useState('');
    const [session_with, setSessionWith] = useState('');
    const [errors, setErrors] = useState({});


    const clearError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };


    const validateForm = () => {
        const newErrors = {};
        if (!activity_title.trim()) newErrors.activity_title = 'Activity Title is required.';
        if (!publishingDepartment) newErrors.publishingDepartment = 'Publishing Department is required.';
        if (!activity_type) newErrors.activity_type = 'Activity Type is required.';


        // --- Validation logic based on activity type ---
        if (activity_type === 'Sessions' || activity_type === 'Meeting') {
            if (!start_date) newErrors.start_date = 'Date is required.';
            if (!fromTime) newErrors.fromTime = 'From Time is required.';
            if (!toTime) newErrors.toTime = 'To Time is required.';
            if (fromTime && toTime && toTime <= fromTime) {
                newErrors.toTime = 'To Time must be after From Time.';
            }
        } else { // For Survey and Workshop
            if (!start_date) newErrors.start_date = 'Start Date is required.';
            if (!end_date) newErrors.end_date = 'End Date is required.';
            if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
                newErrors.end_date = 'End Date cannot be before Start Date.';
            }
        }
        if ((activity_type === "Workshop" || activity_type === "Meeting") && !host.trim()) {
            newErrors.host = 'Host is required for Workshops and Meetings.';
        }
        if (activity_type === "Sessions" && !session_with.trim()) {
            newErrors.session_with = 'Session with is required for Sessions.';
        }
        if (!description.trim()) newErrors.description = 'Description is required.';
        if (!linkorlocation.trim()) newErrors.linkorlocation = 'Location or Link is required.';


        if (activity_type && activity_type !== "Sessions" && !year_type) {
            newErrors.year_type = 'Target Year is required.';
        }
        if (activity_type === "Sessions" && !specific_rollno.trim()) {
            newErrors.specific_rollno = 'Student roll numbers are required for Sessions.';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        const isForAllStudents = year_type === "All Years" && target_dept === "All Departments";


        const formData = new FormData();
        formData.append('activity_title', activity_title.trim());
        formData.append('activity_type', activity_type);
        formData.append('publishingDepartment', publishingDepartment);
        formData.append('description', description.trim());
        formData.append('linkorlocation', linkorlocation.trim());


        // --- ✨ REFINED DATA HANDLING LOGIC ---
        if (activity_type === 'Sessions' || activity_type === 'Meeting') {
            // For meetings/sessions, send the single date and the separate times
            formData.append('date_of_meeting', start_date); // The single date selected
            formData.append('start_time', fromTime); // e.g., "10:00"
            formData.append('end_time', toTime); // e.g., "11:00"
        } else {
            // For surveys/workshops, send the start and end dates
            formData.append('start_date', start_date);
            formData.append('end_date', end_date);
        }


        if (activity_type === "Workshop" || activity_type === "Meeting") {
            formData.append('host', host.trim());
        }


        if (activity_type === "Sessions") {
            formData.append('session_with', session_with.trim());
            // Use a more specific field name for clarity
            formData.append('specific_rollno', specific_rollno.trim());
        } else {
            // This block correctly handles Survey, Workshop, AND Meeting
            formData.append('year_type', year_type);
            formData.append('target_dept', target_dept);
            formData.append('all_students', isForAllStudents);
        }
        
        console.log("--- Sending Data to Backend ---");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        console.log("-----------------------------");
        const API_URL = 'http://localhost:6001/api/manageactivities/createActivity';
        try {
            const response = await axios.post(API_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Activity created successfully:', response.data);
            handleClose(); // Close modal on success
        } catch (error) {
            const errorMessage = error.response
                ? (error.response.data.message || JSON.stringify(error.response.data))
                : error.message;
            console.error('Error creating activity:', error.response ? error.response.data : error.message);
            setErrors({ submit: `Failed to create activity: ${errorMessage}` });
        }
    };


    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" id="activity-form" onSubmit={handleSubmit} noValidate>
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <div className="flex items-center gap-3">
                        <FileText className="text-indigo-600" size={28} />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Create New Activity</h2>
                    </div>
                    <IconButton onClick={handleClose} size="small">
                        <X className="text-gray-500 hover:text-gray-700" />
                    </IconButton>
                </div>


                <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
                    {errors.submit && <ErrorDisplay message={errors.submit} />}
                    <section className="mb-6 sm:mb-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="activity_title" className="block text-sm font-medium text-gray-600 mb-1">Activity Title *</label>
                                <input
                                    type="text"
                                    id="activity_title"
                                    value={activity_title}
                                    onChange={(e) => { setActivityTitle(e.target.value); clearError('activity_title'); }}
                                    placeholder="Enter activity title"
                                    className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.activity_title ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <ErrorDisplay message={errors.activity_title} />
                            </div>
                            <div>
                                <label htmlFor="activity_type" className="block text-sm font-medium text-gray-600 mb-1">Activity Type *</label>
                                <select
                                    id="activity_type"
                                    value={activity_type}
                                    onChange={(e) => {
                                        setActivityType(e.target.value);
                                        // Reset all dependent fields
                                        setHost('');
                                        setSessionWith('');
                                        setSpecificRollno('');
                                        setYearType('');
                                        setStartDate('');
                                        setEndDate('');
                                        setFromTime('');
                                        setToTime('');
                                        setErrors({}); // Clear all errors on type change
                                    }}
                                    className={`w-full p-2.5 border rounded-md shadow-sm text-sm bg-white ${errors.activity_type ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="" disabled>Select type</option>
                                    {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                                <ErrorDisplay message={errors.activity_type} />
                            </div>
                        </div>


                        <div className="mt-4 sm:mt-6">
                            <label htmlFor="publishing_department" className="block text-sm font-medium text-gray-600 mb-1">
                                <Briefcase size={16} className="inline mr-1.5 mb-0.5" />
                                Publishing Department *
                            </label>
                            <select
                                id="publishing_department"
                                value={publishingDepartment}
                                onChange={(e) => { setPublishingDepartment(e.target.value); clearError('publishingDepartment'); }}
                                className={`w-full p-2.5 border rounded-md shadow-sm text-sm bg-white ${errors.publishingDepartment ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="" disabled>Select publishing department</option>
                                {publishingDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                            <ErrorDisplay message={errors.publishingDepartment} />
                        </div>


                        {(activity_type === "Workshop" || activity_type === "Meeting") && (
                            <div className="mt-4 sm:mt-6">
                                <label htmlFor="host" className="block text-sm font-medium text-gray-600 mb-1">Host *</label>
                                <input
                                    type="text"
                                    id="host"
                                    value={host}
                                    onChange={(e) => { setHost(e.target.value); clearError('host'); }}
                                    placeholder="Enter the host's name or department"
                                    className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.host ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <ErrorDisplay message={errors.host} />
                            </div>
                        )}


                        {activity_type === "Sessions" && (
                            <div className="mt-4 sm:mt-6">
                                <label htmlFor="session_with" className="block text-sm font-medium text-gray-600 mb-1">With whom is the Session? *</label>
                                <input
                                    type="text"
                                    id="session_with"
                                    value={session_with}
                                    onChange={(e) => { setSessionWith(e.target.value); clearError('session_with'); }}
                                    placeholder="e.g., Principal, HOD"
                                    className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.session_with ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <ErrorDisplay message={errors.session_with} />
                            </div>
                        )}


                        <div className="mt-4 sm:mt-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Description *</label>
                            <textarea
                                id="description"
                                rows="4"
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); clearError('description'); }}
                                placeholder="Describe the activity, its purpose, and what participants can expect..."
                                className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <ErrorDisplay message={errors.description} />
                        </div>
                    </section>


                    <section className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="text-indigo-600" size={22} />
                            <h3 className="text-lg font-medium text-gray-700">Schedule & Location</h3>
                        </div>


                        {(activity_type === 'Sessions' || activity_type === 'Meeting') ? (
                            <>
                                <div className="mb-4 sm:mb-6">
                                    <label htmlFor="session_date" className="block text-sm font-medium text-gray-600 mb-1">Date *</label>
                                    <input
                                        type="date"
                                        id="session_date"
                                        name="session_date"
                                        value={start_date} // Still use start_date state for the single date
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            clearError('start_date');
                                        }}
                                        className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorDisplay message={errors.start_date} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="from_time" className="block text-sm font-medium text-gray-600 mb-1">From Time *</label>
                                        <input
                                            type="time"
                                            id="from_time"
                                            value={fromTime}
                                            onChange={(e) => { setFromTime(e.target.value); clearError('fromTime'); }}
                                            className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.fromTime ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        <ErrorDisplay message={errors.fromTime} />
                                    </div>
                                    <div>
                                        <label htmlFor="to_time" className="block text-sm font-medium text-gray-600 mb-1">To Time *</label>
                                        <input
                                            type="time"
                                            id="to_time"
                                            value={toTime}
                                            onChange={(e) => { setToTime(e.target.value); clearError('toTime'); }}
                                            className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.toTime ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        <ErrorDisplay message={errors.toTime} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-600 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={start_date}
                                        onChange={(e) => { setStartDate(e.target.value); clearError('start_date'); }}
                                        className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorDisplay message={errors.start_date} />
                                </div>
                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-600 mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={end_date}
                                        onChange={(e) => { setEndDate(e.target.value); clearError('end_date'); }}
                                        className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorDisplay message={errors.end_date} />
                                </div>
                            </div>
                        )}


                        <div className="mt-4 sm:mt-6">
                            <label htmlFor="linkorlocation" className="block text-sm font-medium text-gray-600 mb-1">
                                <MapPin size={16} className="inline mr-1.5 mb-0.5" />
                                Location or Link *
                            </label>
                            <input
                                type="text"
                                id="linkorlocation"
                                value={linkorlocation}
                                onChange={(e) => { setLinkOrLocation(e.target.value); clearError('linkorlocation'); }}
                                placeholder="e.g., Auditorium A, or Zoom link"
                                className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.linkorlocation ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <ErrorDisplay message={errors.linkorlocation} />
                        </div>
                    </section>


                    {activity_type && (
                        <section className="mb-6 sm:mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <UserCheck className="text-indigo-600" size={22} />
                                <h3 className="text-lg font-medium text-gray-700">Audience *</h3>
                            </div>
                            {activity_type === "Sessions" ? (
                                <div className="mt-4 sm:mt-6">
                                    <label htmlFor="specific_rollno" className="block text-sm font-medium text-gray-600 mb-1">Student Roll Numbers *</label>
                                    <input
                                        type="text"
                                        id="specific_rollno"
                                        value={specific_rollno}
                                        onChange={(e) => { setSpecificRollno(e.target.value); clearError('specific_rollno') }}
                                        placeholder="Enter comma-separated roll numbers"
                                        className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${errors.specific_rollno ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorDisplay message={errors.specific_rollno} />
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs text-gray-500 mb-4">Select who can view and respond to this activity.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="year_type" className="block text-sm font-medium text-gray-600 mb-1">Target Year *</label>
                                            <select
                                                id="year_type"
                                                value={year_type}
                                                onChange={(e) => { setYearType(e.target.value); clearError('year_type'); }}
                                                className={`w-full p-2.5 border rounded-md shadow-sm text-sm bg-white ${errors.year_type ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="" disabled>Select year</option>
                                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                                            </select>
                                            <ErrorDisplay message={errors.year_type} />
                                        </div>
                                        <div>
                                            <label htmlFor="target_dept" className="block text-sm font-medium text-gray-600 mb-1">Target Department</label>
                                            <select
                                                id="target_dept"
                                                value={target_dept}
                                                onChange={(e) => setTargetDept(e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm text-sm bg-white"
                                            >
                                                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    )}
                </div>


                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t bg-slate-50">
                    <button type="button" onClick={handleClose} className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" form="activity-form" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md">
                        <Eye size={18} />
                        <span>Publish Activity</span>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}