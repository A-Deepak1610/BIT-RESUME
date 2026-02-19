import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { X, User, Mail, Hash, Phone, GraduationCap, Briefcase, AlertTriangle, Book, Star, ShieldCheck } from 'lucide-react';
import axios from 'axios';

// --- Reusable Helper Components ---
const ErrorDisplay = ({ message }) => {
    if (!message) return null;
    return (
        <p className="mt-1.5 flex items-center text-sm text-red-600">
            <AlertTriangle size={14} className="mr-1.5" />
            {message}
        </p>
    );
};

const FormInput = ({ id, label, value, onChange, error, icon: Icon, placeholder, type = "text" }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
            <Icon size={16} className="inline mr-2 mb-0.5" />
            {label} *
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        <ErrorDisplay message={error} />
    </div>
);

const FormSelect = ({ id, label, value, onChange, error, icon: Icon, options }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
            <Icon size={16} className="inline mr-2 mb-0.5" />
            {label} *
        </label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className={`w-full p-2.5 border rounded-md shadow-sm text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
            <option value="">Select {label}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <ErrorDisplay message={error} />
    </div>
);

// --- Modal Style ---
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '12px',
    overflow: 'hidden',
};

// --- Initial Form State ---
const initialFormState = {
    name: '',
    email: '',
    rollno: '',
    facultyId: '',
    department: '',
    mobile: '',
    role: '',
    year: '',
    mentorId: ''
};

const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'admin', label: 'Admin' }
];

export default function AddUsersModal({ open, onClose }) {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    // Effect to reset form when modal opens
    useEffect(() => {
        if (open) {
            setFormData(initialFormState);
            setErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@bitsathy\.ac\.in$/;

        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'BITSathy Mail ID is required.';
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Email must be a valid @bitsathy.ac.in address.';
        }
        if (!formData.role) newErrors.role = 'Role is required.';
        if (!formData.department.trim()) newErrors.department = 'Department is required.';
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required.';
        } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.mobile)) {
             newErrors.mobile = 'Please enter a valid mobile number (e.g., +919876543210).';
        }

        // Role-specific validation
        if (formData.role === 'student') {
            if (!formData.rollno.trim()) newErrors.rollno = 'Roll number is required.';
            if (!formData.year.trim()) newErrors.year = 'Year is required.';
            if (!formData.mentorId.trim()) newErrors.mentorId = 'Mentor ID is required.';
        } else if (formData.role === 'faculty' || formData.role === 'admin') {
            if (!formData.facultyId.trim()) newErrors.facultyId = 'Faculty ID is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Prepare payload based on role
        const payload = {
            name: formData.name,
            email: formData.email,
            department: formData.department,
            mobile: formData.mobile,
            role: formData.role,
        };

        if (formData.role === 'student') {
            payload.rollno = formData.rollno;
            payload.year = formData.year;
            payload.mentorId = formData.mentorId;
        } else {
            payload.facultyId = formData.facultyId;
        }
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(`${API_URL}api/addusers`, payload);
            console.log('API Response:', response.data);
            alert(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} added successfully!`);
            onClose(); // Close modal on success
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.error || 'Failed to add user. Please try again.';
            setErrors({ submit: errorMessage });
        }
    };

    const isStudent = formData.role === 'student';
    const isFacultyOrAdmin = formData.role === 'faculty' || formData.role === 'admin';

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style} component="form" id="add-user-form" onSubmit={handleSubmit} noValidate>
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <div className="flex items-center gap-3">
                        <User className="text-indigo-600" size={28} />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            Add New User
                        </h2>
                    </div>
                    <IconButton onClick={onClose} size="small">
                        <X className="text-gray-500 hover:text-gray-700" />
                    </IconButton>
                </div>
                {/* Body with Form */}
                <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                    {errors.submit && <ErrorDisplay message={errors.submit} />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Role Selection - Full Width */}
                        <div className="md:col-span-2">
                            <FormSelect 
                                id="role" 
                                label="Role" 
                                value={formData.role} 
                                onChange={handleChange} 
                                error={errors.role} 
                                icon={ShieldCheck} 
                                options={roleOptions}
                            />
                        </div>

                        {/* Common Fields */}
                        <FormInput id="name" label="Name" value={formData.name} onChange={handleChange} error={errors.name} icon={User} placeholder="Enter full name" />
                        <FormInput id="email" label="BITSathy Mail ID" value={formData.email} onChange={handleChange} error={errors.email} icon={Mail} placeholder="user@bitsathy.ac.in" />
                        <FormInput id="department" label="Department" value={formData.department} onChange={handleChange} error={errors.department} icon={Briefcase} placeholder="e.g., Computer Science" />
                        <FormInput id="mobile" label="Mobile No" value={formData.mobile} onChange={handleChange} error={errors.mobile} icon={Phone} placeholder="+91..." />
                        
                        {/* Student-Specific Fields */}
                        {isStudent && (
                            <>
                                <FormInput id="rollno" label="Roll No" value={formData.rollno} onChange={handleChange} error={errors.rollno} icon={Hash} placeholder="e.g., BIT2021001" />
                                <FormInput id="year" label="Year" value={formData.year} onChange={handleChange} error={errors.year} icon={Book} placeholder="e.g., 3rd Year" />
                                <FormInput id="mentorId" label="Mentor ID" value={formData.mentorId} onChange={handleChange} error={errors.mentorId} icon={Star} placeholder="Enter mentor's faculty ID" />
                            </>
                        )}

                        {/* Faculty/Admin-Specific Fields */}
                        {isFacultyOrAdmin && (
                             <FormInput id="facultyId" label="Faculty ID" value={formData.facultyId} onChange={handleChange} error={errors.facultyId} icon={Hash} placeholder="e.g., F2015001" />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t bg-slate-50">
                    <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" form="add-user-form" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md">
                        Add User
                    </button>
                </div>
            </Box>
        </Modal>
    );
}