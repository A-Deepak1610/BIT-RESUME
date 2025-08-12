import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { useMemo } from 'react';
import useAuth from '../../../store/UseAuth';
import {
    ChevronLeft, Loader2, X, Check, CheckCircle,
    FileText, Target, CalendarDays, Cpu, Users, Lightbulb, Info, PlusCircle, Trash2,
    Paperclip, Link as LinkIcon, Award, Video, HelpCircle, MessageSquare, Briefcase, Github,
    UploadCloud,
} from 'lucide-react';


const DEBUG_MODE = true;


const TECHNOLOGIES = [
    'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Ruby on Rails',
    'PHP', 'Laravel', 'WordPress', 'Python', 'Java', 'C#', 'C++', 'JavaScript', 'TypeScript', 'Swift', 'Kotlin',
    'Go', 'Rust', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'
];


const DEPARTMENTS = [
    'Select Department', 'Computer Science & Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Electrical & Electronics Engineering', 'Information Technology', 'Artificial Intelligence & Data Science', 'Other'
];


const MAX_TEAM_MEMBERS = 7;
const MIN_TEAM_MEMBERS = 1;


const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;


// Validation functions (unchanged)
const validateStep1 = (formData) => {
    const errors = {};
    if (!formData.projectTitle?.trim()) errors.projectTitle = 'Project title is required.';
    if (!formData.projectAbstract?.trim()) errors.projectAbstract = 'Abstract/Summary is required.';
    else if (formData.projectAbstract.trim().split(/\s+/).length < 100 || formData.projectAbstract.trim().split(/\s+/).length > 500) {
        errors.projectAbstract = 'Abstract must be between 100 and 200 words.';
    }
    return errors;
};


const validateStep2 = (formData) => {
    const errors = {};
    if (!formData.problemStatement?.trim()) errors.problemStatement = 'Problem statement is required.';
    if (!formData.projectObjective?.trim()) errors.projectObjective = 'Project objective is required.';
    return errors;
};


const validateStep3 = (formData) => {
    const errors = {};
    if (!formData.startDate) errors.startDate = 'Start date is required.';
    if (!formData.endDate) errors.endDate = 'End date is required.';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
        errors.endDate = 'End date cannot be before start date.';
    }
    return errors;
};


const validateStep4 = (formData) => {
    const errors = {};
    if (!formData.projectType) errors.projectType = 'Project type is required.';
    if (formData.projectType === 'Team') {
        if (formData.teamMembers.length < MIN_TEAM_MEMBERS || formData.teamMembers.length > MAX_TEAM_MEMBERS) {
            errors.teamMembersCount = `Team projects must have between ${MIN_TEAM_MEMBERS} and ${MAX_TEAM_MEMBERS} members.`;
        }
        formData.teamMembers.forEach((member, index) => {
            if (!member.name?.trim()) errors[`teamMemberName_${index}`] = `Member ${index + 1} name is required.`;
            if (!member.rollNumber?.trim()) errors[`teamMemberRoll_${index}`] = `Member ${index + 1} roll number is required.`;
            if (!member.department || member.department === 'Select Department') errors[`teamMemberDept_${index}`] = `Member ${index + 1} department is required.`;
        });
    }
    return errors;
};


const validateStep5 = (formData) => {
    const errors = {};
    if (!formData.githubLink?.trim()) {
        errors.githubLink = 'GitHub link is required.';
    } else {
        try {
            new URL(formData.githubLink);
            if (!formData.githubLink.startsWith('http://') && !formData.githubLink.startsWith('https://')) {
                errors.githubLink = 'GitHub link must start with http:// or https://.';
            }
        } catch (_) {
            errors.githubLink = 'Please enter a valid URL for GitHub link.';
        }
    }
    if (!formData.demoVideoFile) {
        errors.demoVideoFile = 'Demo video is required.';
    }
    return errors;
};




// --- Child Components (ProjectStep1_Overview, etc. remain unchanged) ---


const ProjectStep1_Overview = ({ formData, handleChange, errors }) => {
    const wordCount = useMemo(() => {
        return formData.projectAbstract?.trim().split(/\s+/).filter(word => word.length > 0).length || 0;
    }, [formData.projectAbstract]);


    return (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Project Overview</h2>
            </div>
            <div>
                <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title of the Project <RequiredAst />
                </label>
                <input
                    type="text"
                    name="projectTitle"
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.projectTitle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter the project title"
                />
                {errors.projectTitle && <p className="mt-1 text-sm text-red-600">{errors.projectTitle}</p>}
            </div>
            <div>
                <label htmlFor="projectAbstract" className="block text-sm font-medium text-gray-700 mb-1">
                    Abstract / Summary <RequiredAst />
                </label>
                <textarea
                    name="projectAbstract"
                    id="projectAbstract"
                    rows={6}
                    value={formData.projectAbstract}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.projectAbstract ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Provide a short overview of the project idea (100-500 words)"
                />
                <div className="flex justify-between mt-1">
                    {errors.projectAbstract && <p className="text-sm text-red-600">{errors.projectAbstract}</p>}
                    <p className="text-xs text-gray-500 ml-auto">{wordCount} word{wordCount !== 1 ? 's' : ''}</p>
                </div>
                <p className="mt-1 text-xs text-gray-500">A concise summary of your project in 100-500 words.</p>
            </div>
        </div>
    );
};


const ProjectStep2_ProblemObjective = ({ formData, handleChange, errors }) => (
    <div className="space-y-6">
        <div className="flex items-center mb-4">
            <Target className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Problem & Objective</h2>
        </div>
        <div>
            <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-1">
                Problem Statement <RequiredAst />
            </label>
            <textarea
                name="problemStatement"
                id="problemStatement"
                rows={4}
                value={formData.problemStatement}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.problemStatement ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Clearly describe the problem you're solving"
            />
            {errors.problemStatement && <p className="mt-1 text-sm text-red-600">{errors.problemStatement}</p>}
            <p className="mt-1 text-xs text-gray-500">Define the problem or challenge that your project aims to address.</p>
        </div>
        <div>
            <label htmlFor="projectObjective" className="block text-sm font-medium text-gray-700 mb-1">
                Objective <RequiredAst />
            </label>
            <textarea
                name="projectObjective"
                id="projectObjective"
                rows={4}
                value={formData.projectObjective}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.projectObjective ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Define the goal or mission of the project"
            />
            {errors.projectObjective && <p className="mt-1 text-sm text-red-600">{errors.projectObjective}</p>}
            <p className="mt-1 text-xs text-gray-500">What do you aim to achieve through this project?</p>
        </div>
    </div>
);


const ProjectStep3_TimelineTech = ({ formData, handleChange, setFormData, errors }) => {
    const [techInput, setTechInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const techInputContainerRef = useRef(null);


    const handleTechInputChange = (e) => {
        const value = e.target.value;
        setTechInput(value);
        setShowSuggestions(value.length > 0);
    };


    const handleSelectTech = (tech) => {
        if (!formData.techStack.includes(tech)) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, tech]
            }));
        }
        setTechInput('');
        setShowSuggestions(false);
    };


    const handleRemoveTech = (techToRemove) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter(tech => tech !== techToRemove)
        }));
    };


    const filteredSuggestions = TECHNOLOGIES.filter(
        tech => !formData.techStack.includes(tech) &&
            tech.toLowerCase().includes(techInput.toLowerCase())
    ).slice(0, 7);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (techInputContainerRef.current && !techInputContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <CalendarDays className="h-6 w-6 text-indigo-600 mr-2" />
                <Cpu className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Timeline & Tech</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        max={formData.endDate || undefined}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <RequiredAst />
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || undefined}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
            </div>
            <div ref={techInputContainerRef}>
                <label htmlFor="techStackInput" className="block text-sm font-medium text-gray-700 mb-1">
                    Technology Stack 
                </label>
                {formData.techStack.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                        {formData.techStack.map(tech => (
                            <span
                                key={tech}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                                {tech}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTech(tech)}
                                    className="ml-1.5 flex-shrink-0 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                                    aria-label={`Remove ${tech}`}
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <div className="relative">
                    <input
                        type="text"
                        id="techStackInput"
                        value={techInput}
                        onChange={handleTechInputChange}
                        onFocus={() => techInput.length > 0 && setShowSuggestions(true)}
                        placeholder="Type to search technologies..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoComplete="off"
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                            {filteredSuggestions.map(tech => (
                                <li
                                    key={tech}
                                    onClick={() => handleSelectTech(tech)}
                                    className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                                >
                                    {tech}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Select the technologies you plan to use. Type to search and click to add.</p>
            </div>
        </div>
    );
};


const ProjectStep4_TeamInfo = ({ formData, setFormData, errors }) => {
    const handleProjectTypeChange = (e) => {
        const newType = e.target.value;
        setFormData(prev => {
            let newTeamMembers = [...prev.teamMembers];
            if (newType === 'Individual') {
                newTeamMembers = newTeamMembers.length > 0
                    ? [{ ...newTeamMembers[0] }]
                    : [{ name: '', rollNumber: '', department: 'Select Department' }];
            } else if (newType === 'Team') {
                if (newTeamMembers.length === 0) {
                    newTeamMembers = [{ name: '', rollNumber: '', department: 'Select Department' }];
                }
            }
            return { ...prev, projectType: newType, teamMembers: newTeamMembers };
        });
    };


    const handleTeamMemberChange = (index, field, value) => {
        setFormData(prev => {
            const newTeamMembers = [...prev.teamMembers];
            newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
            return { ...prev, teamMembers: newTeamMembers };
        });
    };


    const addTeamMember = () => {
        if (formData.teamMembers.length < MAX_TEAM_MEMBERS) {
            setFormData(prev => ({
                ...prev,
                teamMembers: [...prev.teamMembers, { name: '', rollNumber: '', department: 'Select Department' }]
            }));
        }
    };


    const removeTeamMember = (index) => {
        if (formData.projectType === 'Team' && formData.teamMembers.length > MIN_TEAM_MEMBERS) {
            setFormData(prev => ({
                ...prev,
                teamMembers: prev.teamMembers.filter((_, i) => i !== index)
            }));
        } else if (DEBUG_MODE) {
            console.warn("Cannot remove member. Condition not met for removal.");
        }
    };


    const canAddMember = formData.projectType === 'Team' && formData.teamMembers.length < MAX_TEAM_MEMBERS;


    return (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Team Info</h2>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Individual or Team Project?<RequiredAst /></label>
                <div className="mt-2 flex space-x-4">
                    <label className="inline-flex items-center">
                        <input type="radio" name="projectType" value="Individual" checked={formData.projectType === 'Individual'} onChange={handleProjectTypeChange} className="form-radio h-4 w-4 text-indigo-600" />
                        <span className="ml-2 text-sm text-gray-700">Individual</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" name="projectType" value="Team" checked={formData.projectType === 'Team'} onChange={handleProjectTypeChange} className="form-radio h-4 w-4 text-indigo-600" />
                        <span className="ml-2 text-sm text-gray-700">Team</span>
                    </label>
                </div>
                {errors.projectType && <p className="mt-1 text-sm text-red-600">{errors.projectType}</p>}
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {formData.projectType === 'Individual' ? 'Individual Project Confirmation' : 'Team Members'} <RequiredAst />
                    </label>
                    {formData.projectType === 'Team' && (
                        <button
                            type="button"
                            onClick={addTeamMember}
                            disabled={!canAddMember}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            <PlusCircle size={16} className="mr-1.5" /> Add Member
                        </button>
                    )}
                </div>
                {formData.projectType === 'Team' && errors.teamMembersCount && (
                    <p className="mt-1 mb-2 text-sm text-red-600">{errors.teamMembersCount}</p>
                )}
                <p className="mb-3 text-xs text-gray-500">
                    {formData.projectType === 'Individual'
                        ? "You have selected an Individual project. Specific member details are not required in this section."
                        : `For Team projects, add between ${MIN_TEAM_MEMBERS} and ${MAX_TEAM_MEMBERS} members (including yourself if applicable).`}
                </p>
                {formData.projectType === 'Team' && (
                    <div className="space-y-4">
                        {formData.teamMembers.map((member, index) => (
                            <div key={index} className="p-3 md:p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50 relative">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3">Member {index + 1}</h4>
                                {formData.teamMembers.length > MIN_TEAM_MEMBERS && (
                                    <button
                                        type="button"
                                        onClick={() => removeTeamMember(index)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                        aria-label="Remove member"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                    <div>
                                        <label htmlFor={`memberName_${index}`} className="block text-xs font-medium text-gray-600 mb-0.5">Full Name</label>
                                        <input type="text" id={`memberName_${index}`} value={member.name} onChange={e => handleTeamMemberChange(index, 'name', e.target.value)} placeholder="Full Name" className={`mt-0.5 block w-full px-2.5 py-1.5 border ${errors[`teamMemberName_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500`} />
                                        {errors[`teamMemberName_${index}`] && <p className="mt-0.5 text-xs text-red-600">{errors[`teamMemberName_${index}`]}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor={`memberRoll_${index}`} className="block text-xs font-medium text-gray-600 mb-0.5">Roll Number</label>
                                        <input type="text" id={`memberRoll_${index}`} value={member.rollNumber} onChange={e => handleTeamMemberChange(index, 'rollNumber', e.target.value)} placeholder="Roll Number" className={`mt-0.5 block w-full px-2.5 py-1.5 border ${errors[`teamMemberRoll_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500`} />
                                        {errors[`teamMemberRoll_${index}`] && <p className="mt-0.5 text-xs text-red-600">{errors[`teamMemberRoll_${index}`]}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor={`memberDept_${index}`} className="block text-xs font-medium text-gray-600 mb-0.5">Department</label>
                                        <select id={`memberDept_${index}`} value={member.department} onChange={e => handleTeamMemberChange(index, 'department', e.target.value)} className={`mt-0.5 block w-full px-2.5 py-1.5 border ${errors[`teamMemberDept_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500`}>
                                            {DEPARTMENTS.map(dept => <option key={dept} value={dept} disabled={dept === 'Select Department'}>{dept}</option>)}
                                        </select>
                                        {errors[`teamMemberDept_${index}`] && <p className="mt-0.5 text-xs text-red-600">{errors[`teamMemberDept_${index}`]}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const ProjectStep5_SupportingInfo = ({ formData, handleChange, setFormData, errors, setErrors: setGlobalErrors }) => {
    const [demoVideoDragActive, setDemoVideoDragActive] = useState(false);
    const [reportPdfDragActive, setReportPdfDragActive] = useState(false);


    const handleFileSelectOrDrop = (file, fieldName) => {
        if (file) {
            setGlobalErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
            setFormData(prev => ({ ...prev, [fieldName]: file }));
        }
    };


    const handleGenericFileChange = (e, fieldName) => {
        handleFileSelectOrDrop(e.target.files?.[0], fieldName);
        if (e.target) e.target.value = null;
    };


    const handleGenericDrag = (e, setActive) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setActive(true);
        } else if (e.type === "dragleave") {
            setActive(false);
        }
    };


    const handleGenericDrop = (e, fieldName, setActive) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelectOrDrop(e.dataTransfer.files[0], fieldName);
        }
    };


    const clearFile = (fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: null }));
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <Paperclip className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Supporting Information</h2>
            </div>
            <p className="text-sm text-gray-500 -mt-2 mb-4">Provide additional links and information.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Link <RequiredAst />
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Github className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="url"
                            name="githubLink"
                            id="githubLink"
                            value={formData.githubLink}
                            onChange={handleChange}
                            className={`block w-full pl-10 px-3 py-2 border ${errors.githubLink ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="https://github.com/user/repo"
                        />
                    </div>
                    {errors.githubLink && <p className="mt-1 text-sm text-red-600">{errors.githubLink}</p>}
                </div>
                <div>
                    <label htmlFor="demoVideoFile" className="block text-sm font-medium text-gray-700 mb-1">
                        Demo Video <RequiredAst />
                    </label>
                    <div
                        className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${errors.demoVideoFile ? 'border-red-500' : demoVideoDragActive ? 'border-indigo-500' : 'border-gray-300'} border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors`}
                        onClick={() => document.getElementById('demoVideoFileInput').click()}
                        onDragEnter={(e) => handleGenericDrag(e, setDemoVideoDragActive)}
                        onDragLeave={(e) => handleGenericDrag(e, setDemoVideoDragActive)}
                        onDragOver={(e) => handleGenericDrag(e, setDemoVideoDragActive)}
                        onDrop={(e) => handleGenericDrop(e, 'demoVideoFile', setDemoVideoDragActive)}
                    >
                        <div className="space-y-1 text-center">
                            <UploadCloud className={`mx-auto h-12 w-12 ${demoVideoDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="demoVideoFileInput" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a video</span>
                                    <input id="demoVideoFileInput" name="demoVideoFile" type="file" className="sr-only" onChange={(e) => handleGenericFileChange(e, 'demoVideoFile')} accept="video/*,.mkv" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">MP4, MOV, AVI, WEBM, MKV etc.</p>
                        </div>
                    </div>
                    {formData.demoVideoFile && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                            <Video size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                            <span className="font-medium mr-2 truncate max-w-[150px] sm:max-w-[200px]">{formData.demoVideoFile.name}</span>
                            <span className="text-gray-500 text-xs whitespace-nowrap">({(formData.demoVideoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button
                                type="button"
                                onClick={() => clearFile('demoVideoFile')}
                                className="ml-auto text-red-500 hover:text-red-700"
                                aria-label="Remove video"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    {errors.demoVideoFile && <p className="mt-1 text-sm text-red-600">{errors.demoVideoFile}</p>}
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="reportPdfFile" className="block text-sm font-medium text-gray-700 mb-1">
                        Report PDF (Optional)
                    </label>
                    <div
                        className={`mt-1 flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 ${errors.reportPdfFile ? 'border-red-500' : reportPdfDragActive ? 'border-indigo-500' : 'border-gray-300'} border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors`}
                        onClick={() => document.getElementById('reportPdfFileInput').click()}
                        onDragEnter={(e) => handleGenericDrag(e, setReportPdfDragActive)}
                        onDragLeave={(e) => handleGenericDrag(e, setReportPdfDragActive)}
                        onDragOver={(e) => handleGenericDrag(e, setReportPdfDragActive)}
                        onDrop={(e) => handleGenericDrop(e, 'reportPdfFile', setReportPdfDragActive)}
                    >
                        <div className="space-y-1 text-center">
                            <UploadCloud className={`mx-auto h-12 w-12 ${reportPdfDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="reportPdfFileInput" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a PDF</span>
                                    <input id="reportPdfFileInput" name="reportPdfFile" type="file" className="sr-only" onChange={(e) => handleGenericFileChange(e, 'reportPdfFile')} accept=".pdf" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF only</p>
                        </div>
                    </div>
                    {formData.reportPdfFile && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                            <FileText size={16} className="mr-2 flex-shrink-0 text-indigo-600" />
                            <span className="font-medium mr-2 truncate max-w-[150px] sm:max-w-[200px]">{formData.reportPdfFile.name}</span>
                            <span className="text-gray-500 text-xs whitespace-nowrap">({(formData.reportPdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            <button
                                type="button"
                                onClick={() => clearFile('reportPdfFile')}
                                className="ml-auto text-red-500 hover:text-red-700"
                                aria-label="Remove PDF"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    {errors.reportPdfFile && <p className="mt-1 text-sm text-red-600">{errors.reportPdfFile}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="awardsWon" className="block text-sm font-medium text-gray-700 mb-1">
                    Awards Won (if any)
                </label>
                <textarea
                    name="awardsWon"
                    id="awardsWon"
                    rows={3}
                    value={formData.awardsWon}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="List any awards this project or its members have received."
                />
            </div>
            <div>
                <label htmlFor="changesFromIdea" className="block text-sm font-medium text-gray-700 mb-1">
                    Changes from Initial Idea (if any)
                </label>
                <textarea
                    name="changesFromIdea"
                    id="changesFromIdea"
                    rows={3}
                    value={formData.changesFromIdea}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Describe any significant changes or pivots from the original project concept discussed."
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Consulted Mentor/Faculty?</span>
                    <div className="mt-2 flex space-x-4">
                        <label className="inline-flex items-center">
                            <input type="radio" name="consultedMentor" value="true" checked={formData.consultedMentor === true} onChange={(e) => handleChange({ target: { name: 'consultedMentor', value: true, type: 'radio' } })} className="form-radio h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" name="consultedMentor" value="false" checked={formData.consultedMentor === false} onChange={(e) => handleChange({ target: { name: 'consultedMentor', value: false, type: 'radio' } })} className="form-radio h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                    </div>
                </div>
                <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Presented Externally?</span>
                    <div className="mt-2 flex space-x-4">
                        <label className="inline-flex items-center">
                            <input type="radio" name="presentedExternally" value="true" checked={formData.presentedExternally === true} onChange={(e) => handleChange({ target: { name: 'presentedExternally', value: true, type: 'radio' } })} className="form-radio h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" name="presentedExternally" value="false" checked={formData.presentedExternally === false} onChange={(e) => handleChange({ target: { name: 'presentedExternally', value: false, type: 'radio' } })} className="form-radio h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ProjectStep6_Review = ({ formData }) => {
    const DetailItem = ({ label, value, isBoolean = false, isFile = false }) => (
        <div>
            <strong className="text-sm text-gray-600 block mb-0.5">{label}:</strong>
            <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
                {isBoolean ? (value ? 'Yes' : (value === false ? 'No' : 'N/A'))
                    : isFile ? (value ? `${value.name} (${(value.size / 1024 / 1024).toFixed(2)} MB)` : 'N/A')
                        : (value || 'N/A')}
            </p>
        </div>
    );


    return (
        <div className="space-y-8">
            <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Review Project Details</h2>
            </div>
            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <FileText size={20} className="mr-2 text-indigo-500" /> Project Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailItem label="Project Title" value={formData.projectTitle} />
                    <div className="md:col-span-2">
                        <DetailItem label="Abstract / Summary" value={formData.projectAbstract} />
                    </div>
                </div>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <Target size={20} className="mr-2 text-indigo-500" /> Problem & Objective
                </h3>
                <div className="grid grid-cols-1 gap-y-4">
                    <DetailItem label="Problem Statement" value={formData.problemStatement} />
                    <DetailItem label="Project Objective" value={formData.projectObjective} />
                </div>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <CalendarDays size={20} className="mr-2 text-indigo-500" /> Timeline & Tech
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailItem label="Start Date" value={formData.startDate ? new Date(formData.startDate + 'T00:00:00').toLocaleDateString() : 'N/A'} />
                    <DetailItem label="End Date" value={formData.endDate ? new Date(formData.endDate + 'T00:00:00').toLocaleDateString() : 'N/A'} />
                    <div className="md:col-span-2">
                        <DetailItem label="Technology Stack" value={formData.techStack.length > 0 ? formData.techStack.join(', ') : 'N/A'} />
                    </div>
                </div>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <Users size={20} className="mr-2 text-indigo-500" /> Team Info
                </h3>
                <DetailItem label="Project Type" value={formData.projectType} />
                {formData.projectType === 'Individual' && formData.teamMembers.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">This is an individual project. Member details below reflect the sole participant (if any details were entered or preserved).</p>
                )}
                {formData.teamMembers.map((member, index) => (
                    <div key={index} className="mt-3 pt-3 border-t border-gray-100 first:border-t-0 first:pt-0">
                        <p className="text-sm font-medium text-gray-700 mb-1.5">
                            {formData.projectType === 'Individual' ? 'Participant Details' : `Member ${index + 1}:`}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 pl-4">
                            <DetailItem label="Name" value={member.name} />
                            <DetailItem label="Roll Number" value={member.rollNumber} />
                            <DetailItem label="Department" value={member.department !== 'Select Department' ? member.department : 'N/A'} />
                        </div>
                    </div>
                ))}
            </section>
            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <Paperclip size={20} className="mr-2 text-indigo-500" /> Supporting Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailItem label="GitHub Link" value={formData.githubLink} />
                    <DetailItem label="Demo Video" value={formData.demoVideoFile} isFile={true} />
                    <DetailItem label="Report PDF" value={formData.reportPdfFile} isFile={true} />
                    <DetailItem label="Consulted Mentor/Faculty" value={formData.consultedMentor} isBoolean={true} />
                    <DetailItem label="Presented Externally" value={formData.presentedExternally} isBoolean={true} />
                    <div className="md:col-span-2">
                        <DetailItem label="Awards Won" value={formData.awardsWon} />
                    </div>
                    <div className="md:col-span-2">
                        <DetailItem label="Changes from Initial Idea" value={formData.changesFromIdea} />
                    </div>
                </div>
            </section>
        </div>
    );
};


const STEP_CONFIG = [
    { title: 'Overview', validate: validateStep1, icon: FileText },
    { title: 'Problem & Objective', validate: validateStep2, icon: Target },
    { title: 'Timeline & Tech', validate: validateStep3, icon: CalendarDays },
    { title: 'Team Info', validate: validateStep4, icon: Users },
    { title: 'Supporting Info', validate: validateStep5, icon: Paperclip },
    { title: 'Review', icon: Info },
];


const Project = ({ onBack, initialData = {} }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // CORRECT: Call the hook inside the component and destructure the needed value.
    const { rollno } = useAuth();


    const [formData, setFormData] = useState({
        projectTitle: initialData.projectTitle || '',
        projectAbstract: initialData.projectAbstract || '',
        problemStatement: initialData.problemStatement || '',
        projectObjective: initialData.projectObjective || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        techStack: initialData.techStack || [],
        projectType: initialData.projectType || 'Individual',
        teamMembers: initialData.teamMembers && initialData.teamMembers.length > 0
            ? initialData.teamMembers
            : [{ name: '', rollNumber: '', department: 'Select Department' }],
        consultedMentor: initialData.consultedMentor ?? false,
        githubLink: initialData.githubLink || '',
        reportPdfFile: initialData.reportPdfFile || null,
        demoVideoFile: initialData.demoVideoFile || null,
        presentedExternally: initialData.presentedExternally ?? false,
        awardsWon: initialData.awardsWon || '',
        changesFromIdea: initialData.changesFromIdea || '',
    });


    useEffect(() => {
        setFormData(prev => {
            let newTeamMembers = [...prev.teamMembers];
            if (prev.projectType === 'Individual') {
                if (newTeamMembers.length > 1) newTeamMembers = [{ ...newTeamMembers[0] }];
                else if (newTeamMembers.length === 0) newTeamMembers = [{ name: '', rollNumber: '', department: 'Select Department' }];
            } else if (prev.projectType === 'Team') {
                if (newTeamMembers.length === 0) newTeamMembers = [{ name: '', rollNumber: '', department: 'Select Department' }];
            }
            return {
                ...prev,
                teamMembers: newTeamMembers,
                consultedMentor: prev.consultedMentor ?? false,
                presentedExternally: prev.presentedExternally ?? false,
            };
        });
    }, [formData.projectType]);


    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            if (name === 'startDate' || name === 'endDate') delete newErrors.endDate;
            return newErrors;
        });


        let processedValue = value;
        if (type === 'radio') {
            if (value === 'true') processedValue = true;
            else if (value === 'false') processedValue = false;
        } else if (type === 'checkbox') {
            processedValue = checked;
        }


        setFormData(prev => ({ ...prev, [name]: processedValue }));
    }, []);


    const validateCurrentStep = useCallback(() => {
        let stepErrors = {};
        const currentStepConfig = STEP_CONFIG[currentStep];
        if (currentStepConfig?.validate) {
            stepErrors = currentStepConfig.validate(formData);
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    }, [currentStep, formData]);


    const nextStep = useCallback(() => {
        if (!validateCurrentStep()) return;
        setCurrentStep(prev => Math.min(prev + 1, STEP_CONFIG.length - 1));
        window.scrollTo(0, 0);
    }, [validateCurrentStep]);


    const prevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
        window.scrollTo(0, 0);
        setErrors({});
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});


        if (currentStep !== STEP_CONFIG.length - 1) {
            if (DEBUG_MODE) console.log("Attempted submit from non-review step. Current step:", currentStep);
            setIsSubmitting(false);
            return;
        }


        let allValid = true;
        let firstErrorStep = -1;
        let combinedErrors = {};


        for (let i = 0; i < STEP_CONFIG.length - 1; i++) {
            if (STEP_CONFIG[i].validate) {
                const stepErrors = STEP_CONFIG[i].validate(formData);
                if (Object.keys(stepErrors).length > 0) {
                    allValid = false;
                    combinedErrors = { ...combinedErrors, ...stepErrors };
                    if (firstErrorStep === -1) firstErrorStep = i;
                }
            }
        }


        if (!allValid) {
            setErrors(combinedErrors);
            if (firstErrorStep !== -1) setCurrentStep(firstErrorStep);
            window.scrollTo(0, 0);
            setIsSubmitting(false);
            return;
        }


        const payload = new FormData();


        // CORRECT: Use the variable from the hook call inside the component.
        payload.append('submitter_roll_no', rollno || '');
        payload.append('title_idea', formData.projectTitle.trim());
        payload.append('problem_statement', formData.problemStatement.trim());
        payload.append('objective', formData.projectObjective.trim());
        payload.append('start_time', formData.startDate);
        payload.append('end_time', formData.endDate);
        payload.append('tech_stack', JSON.stringify(formData.techStack));
        payload.append('is_team_project', formData.projectType === 'Team' ? 'true' : 'false');
        payload.append('team_members', JSON.stringify(formData.teamMembers));
        payload.append('consulted_mentor', formData.consultedMentor ? 'true' : 'false');
        payload.append('github_link', formData.githubLink.trim());
        payload.append('presented_externally', formData.presentedExternally ? 'true' : 'false');
        payload.append('awards_won', formData.awardsWon.trim());
        payload.append('changes_from_idea', formData.changesFromIdea.trim());
        payload.append('project_abstract', formData.projectAbstract.trim());


        if (formData.reportPdfFile instanceof File) {
            payload.append('report_pdf', formData.reportPdfFile, formData.reportPdfFile.name);
        }
        if (formData.demoVideoFile instanceof File) {
            payload.append('demo_video', formData.demoVideoFile, formData.demoVideoFile.name);
        }


        if (DEBUG_MODE) {
            console.log('[DEBUG] Submitting payload (snake_case):');
            for (let [key, value] of payload.entries()) {
                console.log(key, value instanceof File ? `${value.name} (File)` : value);
            }
        }


        try {
            const response = await axios.post('http://localhost:6001/api/projects', payload, {
                withCredentials: true,
            });
            if (DEBUG_MODE) console.log('Project submission successful:', response.data);
            setSubmitSuccess(true);
            window.scrollTo(0, 0);
        } catch (error) {
            let errorMessage = 'Upload failed. Please try again.';
            if (axios.isAxiosError(error)) {
                console.error('Axios submission error:', error.response?.data || error.message);
                if (error.response?.data) {
                    errorMessage = typeof error.response.data === 'string'
                        ? error.response.data
                        : error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
                } else {
                    errorMessage = error.message;
                }
            } else {
                console.error('Non-Axios submission error:', error);
                errorMessage = error.message || 'An unexpected error occurred.';
            }
            setErrors({ submit: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };


    const resetForm = () => {
        setFormData({
            projectTitle: '', projectAbstract: '', problemStatement: '', projectObjective: '',
            startDate: '', endDate: '', techStack: [],
            projectType: 'Individual',
            teamMembers: [{ name: '', rollNumber: '', department: 'Select Department' }],
            consultedMentor: false,
            githubLink: '',
            reportPdfFile: null,
            demoVideoFile: null,
            presentedExternally: false, awardsWon: '', changesFromIdea: '',
        });
        setCurrentStep(0);
        setSubmitSuccess(false);
        setErrors({});
        setIsSubmitting(false);
        window.scrollTo(0, 0);
    };


    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <ProjectStep1_Overview formData={formData} handleChange={handleChange} errors={errors} />;
            case 1: return <ProjectStep2_ProblemObjective formData={formData} handleChange={handleChange} errors={errors} />;
            case 2: return <ProjectStep3_TimelineTech formData={formData} handleChange={handleChange} setFormData={setFormData} errors={errors} />;
            case 3: return <ProjectStep4_TeamInfo formData={formData} setFormData={setFormData} errors={errors} />;
            case 4: return <ProjectStep5_SupportingInfo formData={formData} handleChange={handleChange} setFormData={setFormData} errors={errors} setErrors={setErrors} />;
            case 5: return <ProjectStep6_Review formData={formData} />;
            default: return null;
        }
    };


    if (submitSuccess) {
        return (
            <div className="max-w-3xl mx-auto bg-white py-10 px-4 sm:px-6 lg:px-8 mt-4 text-center rounded-lg shadow-xl">
                <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-6 ring-4 ring-green-200">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Project Request Submitted!</h2>
                <p className="text-gray-600 mb-8 text-lg">Your project proposal has been successfully submitted for review.</p>
                {errors.submit && <p className="my-4 text-md text-red-600 bg-red-50 p-3 rounded-md">{errors.submit}</p>}
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={resetForm}
                        className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Another Request
                    </button>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Dashboard
                        </button>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-3xl mx-auto bg-white py-4 md:py-8 px-4 sm:px-6 lg:px-10 mt-2 md:mt-4 rounded-lg shadow-xl">
            <div className="flex items-center mb-8 border-b pb-5 border-gray-200">
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-gray-900">Project Proposal Request</h1>
                    <p className="mt-1.5 text-sm text-gray-500">Fill in the details to submit your project idea for approval.</p>
                </div>
            </div>
            <div className="mb-6 px-2 pt-2">
                <div className="md:hidden mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {STEP_CONFIG[currentStep].title}
                    </h2>
                </div>
                <nav aria-label="Progress" className="hidden md:block">
                    <ol role="list" className="flex items-center">
                        {STEP_CONFIG.map((step, stepIdx) => (
                            <li key={step.title} className={`relative ${stepIdx !== STEP_CONFIG.length - 1 ? 'pr-8 sm:pr-10 md:pr-12' : ''} flex-1`}>
                                {stepIdx < currentStep ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-1 w-full bg-indigo-600" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setCurrentStep(stepIdx); setErrors({}); }}
                                            className="relative w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Check className="w-6 h-6 text-white" aria-hidden="true" />
                                            <span className="sr-only">{step.title} - Completed</span>
                                            <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-medium text-indigo-600 truncate">{step.title}</span>
                                        </button>
                                    </>
                                ) : stepIdx === currentStep ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-1 w-full bg-gray-200" />
                                        </div>
                                        <div
                                            className="relative w-10 h-10 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full ring-2 ring-indigo-300"
                                            aria-current="step"
                                        >
                                            {step.icon && <step.icon className="w-5 h-5 text-indigo-600" aria-hidden="true" />}
                                            <span className="sr-only">{step.title} - Current</span>
                                            <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-bold text-indigo-600 truncate">{step.title}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-1 w-full bg-gray-200" />
                                        </div>
                                        <div className="group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full cursor-not-allowed">
                                            {step.icon && <step.icon className="w-5 h-5 text-gray-400" aria-hidden="true" />}
                                            <span className="absolute -bottom-7 text-center w-max max-w-[100px] text-xs font-medium text-gray-500 truncate">{step.title}</span>
                                            <span className="sr-only">{step.title} - Upcoming</span>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
            <div className="bg-white ">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="min-h-[400px] px-1.5 mt-10">
                        {renderStepContent()}
                        {errors.submit && (
                            <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4">
                                {errors.submit}
                            </p>
                        )}
                    </div>
                    <div className="mt-3 pt-6 flex justify-between items-center border-t border-gray-200 px-1.5">
                        {currentStep > 0 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={isSubmitting}
                                className="px-7 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}
                        {currentStep < STEP_CONFIG.length - 1 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center px-7 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:bg-indigo-400"
                                onClick={handleSubmit}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? 'Submitting...' : 'Create Request'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};


export default Project;