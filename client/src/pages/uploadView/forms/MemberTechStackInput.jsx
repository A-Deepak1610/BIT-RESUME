import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// This is a self-contained component for handling the tech stack UI for one member.
const MemberTechStackInput = ({ memberIndex, techStack, onTechStackChange, allTechOptions }) => {
    const [techInput, setTechInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const techInputContainerRef = useRef(null);
    const suggestionsListRef = useRef(null);

    const handleTechInputChange = (e) => {
        const value = e.target.value;
        setTechInput(value);
        setShowSuggestions(value.length > 0);
        setHighlightedIndex(-1);
    };

    const addTech = (tech) => {
        const trimmedTech = tech.trim();
        if (trimmedTech && !techStack.find(t => t.toLowerCase() === trimmedTech.toLowerCase())) {
            onTechStackChange(memberIndex, [...techStack, trimmedTech]);
        }
        setTechInput('');
        setShowSuggestions(false);
        setHighlightedIndex(-1);
    };

    const handleRemoveTech = (techToRemove) => {
        onTechStackChange(memberIndex, techStack.filter(tech => tech !== techToRemove));
    };

    const filteredSuggestions = useMemo(() =>
        allTechOptions.filter(
            tech => !(techStack || []).includes(tech) &&
                tech.toLowerCase().includes(techInput.toLowerCase())
        ).slice(0, 5),
        [techInput, techStack, allTechOptions]
    );

    const handleTechKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev + 1) % filteredSuggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
                addTech(filteredSuggestions[highlightedIndex]);
            } else if (techInput.trim()) {
                addTech(techInput);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setHighlightedIndex(-1);
        }
    };
    
    useEffect(() => {
        if (highlightedIndex >= 0 && suggestionsListRef.current) {
            const highlightedElement = suggestionsListRef.current.children[highlightedIndex];
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [highlightedIndex]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (techInputContainerRef.current && !techInputContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={techInputContainerRef} className="md:col-span-3">
            <label htmlFor={`memberTech_${memberIndex}`} className="block text-xs font-medium text-gray-600 mb-0.5">Technology Stack</label>
            {(techStack && techStack.length > 0) && (
                <div className="mb-2 flex flex-wrap gap-1 p-1.5 border border-gray-200 rounded-md bg-white">
                    {techStack.map(tech => (
                        <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {tech}
                            <button type="button" onClick={() => handleRemoveTech(tech)} className="ml-1 flex-shrink-0 text-indigo-500 hover:text-indigo-700 focus:outline-none" aria-label={`Remove ${tech}`}>
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <div className="relative">
                <input
                    type="text"
                    id={`memberTech_${memberIndex}`}
                    value={techInput}
                    onChange={handleTechInputChange}
                    onKeyDown={handleTechKeyDown}
                    onFocus={() => techInput.length > 0 && setShowSuggestions(true)}
                    placeholder="Add technologies for this member..."
                    className="mt-0.5 block w-full px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    autoComplete="off"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul ref={suggestionsListRef} className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-auto">
                        {filteredSuggestions.map((tech, index) => (
                            <li
                                key={tech}
                                onClick={() => addTech(tech)}
                                className={`px-3 py-1.5 text-sm text-gray-700 cursor-pointer ${highlightedIndex === index ? 'bg-indigo-100' : 'hover:bg-indigo-50'}`}
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MemberTechStackInput;