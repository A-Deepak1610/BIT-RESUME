import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Reusable Department Dropdown Component
 * Fetches departments from backend API and renders a select dropdown
 *
 * @param {Object} props
 * @param {string} props.name - Input name attribute
 * @param {string} props.id - Input id attribute (defaults to name if not provided)
 * @param {string} props.value - Current selected value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.className - Additional CSS classes for the select element
 * @param {boolean} props.disabled - Whether the dropdown is disabled
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.placeholder - Placeholder text for first option (default: "Select Department")
 * @param {string} props.error - Error state for styling
 */
export default function DepartmentDropdown({
  name,
  id,
  value,
  onChange,
  className = "",
  disabled = false,
  required = false,
  placeholder = "Select Department",
  error = false,
}) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/departments`, {
          withCredentials: true,
        });
        if (response.data.success && response.data.departments) {
          setDepartments(response.data.departments);
        } else {
          setFetchError("Failed to load departments");
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        setFetchError("Failed to load departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const baseClassName = `block w-full px-3 py-2 border ${
    error ? "border-red-500" : "border-gray-300"
  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;

  const finalClassName = className || baseClassName;

  if (loading) {
    return (
      <select name={name} id={id || name} disabled className={finalClassName}>
        <option value="">Loading departments...</option>
      </select>
    );
  }

  if (fetchError) {
    return (
      <select
        name={name}
        id={id || name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={finalClassName}
      >
        <option value="">{placeholder}</option>
        <option value="" disabled>
          Error loading departments
        </option>
      </select>
    );
  }

  return (
    <select
      name={name}
      id={id || name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={finalClassName}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {departments.map((dept) => (
        <option key={dept.id} value={dept.department_name}>
          {dept.department_name}
        </option>
      ))}
    </select>
  );
}
