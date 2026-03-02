import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../store/UseAuth";
import {
  ArrowLeft,
  Save,
  User,
  Building2,
} from "lucide-react";

const RequiredAst = () => <span className="text-red-500 ml-0.5">*</span>;

// All societies in a single list with numbering
const societies = [
  "1. IEEE OCEANIC ENGINEERING SOCIETY (OES)",
  "2. ISHRAE",
  "3. IAENG SOCIETY OF INTERNET COMPUTING AND WEB SERVICES",
  "4. INTERNATIONAL ASSOCIATION OF ENGINEERS",
  "5. INTERNATIONAL ASSOCIATION OF ENGINEERS (IAENG)",
  "6. INTERNATIONAL ASSOCIATION OF ENGINEERS - AIML",
  "7. SYSTEM SOCIETY OF INDIA (SSI)",
  "8. ANALYTICAL VIDHYA",
  "9. BVERSITY INDIA",
  "10. BIOTECH RESEARCH SOCIETY OF INDIA",
  "11. ASSOCIATION OF FOOD SCIENTISTS & TECHNOLOGISTS (INDIA)",
  "12. AMERICAL SOCIETY OF CIVIL ENGINEERS",
  "13. COMPUTER SCIENCE TEACHERS ASSOCIATION",
  "14. THE INDIAN SOCIETY OF HEATING, REFRIGERATING AND AIR CONDITIONING ENGINEERS",
  "15. SOCIETY OF AUTOMOBILE ENGINEERING INDIA",
  "16. THE INDIAN SOCIETY OF HEATING, REFIGERATING AND AIR CONDITIONING ENGINEERS",
  "17. BVERSITY",
  "18. IAENG",
  "19. TEXTILE ASSOCIATION OF INDIA (TAI) - TXT",
  "20. THE INSTITUTION OF ENGINEERS (INDIA) (IE(I)) - TXT",
  "21. INTERNATIONAL SOCIETY OF AUTOMATION (ISA)",
  "22. ROBOTIC SOCIETY OF INDIA (RSI)",
  "23. INDIAN WELDING SOCIETY (IWS)",
  "24. MARINE TECHNOLOGY SOCIETY (MTS)",
  "25. INTERNATIONAL ASSOCIATION OF ENGINEERS (IAENG) - IT",
  "26. INSTITUTE FOR ENGINEERING RESEARCH AND PUBLICATION (IFERP) - IT",
  "27. HACKEREARTH CHAPTER",
  "28. INTERNATIONAL ASSOCIATION OF ENGINEERS (IAENG) - ISE",
  "29. TEXTILE ASSOCIATION OF INDIA (TAI) - FT",
  "30. THE INSTITUTION OF ENGINEERS (INDIA) (IE(I)) - FT",
  "31. UNIVERSAL SOCIETY OF FOOD AND NUTRITION (USFN)",
  "32. ASSOCIATION OF FOOD SCIENTISTS AND TECHNOLOGISTS INDIA (AFSTI) - FD",
  "33. AUTOMATIC CONTROL & DYNAMIC OPTIMIZATION SOCIETY (ACDOS)",
  "34. INTERNATIONAL ASSOCIATION OF ENGINEERS (IAENG) - EIE",
  "35. IEEE WOMEN IN ENGINEERING (IEEE_WIE)",
  "36. IEEE STUDENT BRANCH (IEEE_SB)",
  "37. IETE STUDENTS FORUM (ISF)",
  "38. IEEE INDUSTRIAL ELECTRONIC SOCIETY (IEEE_IES)",
  "39. INDIAN SOCIETY OF SYSTEMS FOR SCIENCES AND ENGINEERING (ISSSE)",
  "40. IACSIT SOFTWARE ENGINEERING SOCIETY",
  "41. COMPUTER SOCIETY OF INDIA (CSI)",
  "42. SYSTEMS SOCIETY OF INDIA (SSI)",
  "43. CODECHEF BIT CHAPTER",
  "44. COMPUTER SCIENCE TEACHER ASSOCIATION (CSTA)",
  "45. INDIAN CONCRETE INSTITUTE (ICI)",
  "46. IGS COIMBATORE CHAPTER",
  "47. AMERICAN SOCIETY OF CIVIL ENGINEERS (ASCE)",
  "48. THE BIOTECH RESEARCH SOCIETY, INDIA (BRSI)",
  "49. INSTITUTE FOR ENGINEERING RESEARCH AND PUBLICATION (IFERP) - BT",
  "50. FORCE BIOMEDICAL SOCIETY",
  "51. BIOMEDICAL ENGINEERING SOCIETY OF INDIA (BMESI)",
  "52. IMPERIAL SOCIETY OF INNOVATIVE ENGINEERS (ISIE)",
  "53. SOCIETY FOR SMART E-MOBILITY",
  "54. ANALYTICS VIDHYA",
  "55. KAGGLE COMMUNITIES",
  "56. IAENG SOCIETY OF ARTIFICIAL INTELLIGENCE",
  "57. ASSOCIATION OF FOOD SCIENTISTS AND TECHNOLOGISTS INDIA (AFSTI) - AGRI",
  "58. INDIAN SOCIETY OF AGRICULTURAL ENGINEERS (ISAE)",
  "59. SOCIETY OF AUTOMOTIVE ENGINEERS INDIA (SAEINDIA)",
  "60. AERONAUTICAL SOCIETY OF INDIA (AESI)",
];

const statusOptions = [
  "Active",
  "Non-Active",
];

export default function TechnicalSocietiesForm() {
  const navigate = useNavigate();
  const { name: userName } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    society: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  // Auto-fill faculty name from logged-in user
  useEffect(() => {
    if (userName) {
      setFormData((prev) => ({ ...prev, name: userName }));
    }
  }, [userName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.society) {
      newErrors.society = "Please select a society";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        // Prepare form-urlencoded body
        const formBody = Object.entries(formData)
          .map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value))
          .join("&");
        const response = await fetch(`${API_URL}api/owi/technicalSocieties`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody,
          credentials: "include",
        });
        if (response.ok) {
          console.log("Form submitted successfully");
          navigate("/faculty/outside-world-interaction");
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(`Failed to submit form: ${errorData.error || errorData.details || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert(`Error submitting form: ${error.message || "Unknown error"}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Full Width at Top */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Technical Societies Details
            </h1>
            <p className="text-sm text-gray-500">
              Add Technical Society membership details
            </p>
          </div>
        </div>
      </div>

      {/* Form Card - Centered */}
      <div className="max-w-4xl mx-auto">

        {/* Form Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Faculty Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Faculty Information
              </h3>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name <RequiredAst />
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Society Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Society Details
              </h3>
              <div>
                <label
                  htmlFor="society"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Society <RequiredAst />
                </label>
                <select
                  name="society"
                  id="society"
                  value={formData.society}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 h-10 border ${
                    errors.society ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  <option value="">Select a society</option>
                  {societies.map((society) => (
                    <option key={society} value={society}>
                      {society}
                    </option>
                  ))}
                </select>
                {errors.society && (
                  <p className="mt-1 text-sm text-red-600">{errors.society}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status <RequiredAst />
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 h-10 border ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 flex items-center justify-end space-x-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

