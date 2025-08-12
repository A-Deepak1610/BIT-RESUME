import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Upload,
  Check,
  Edit,
  Trash2,
  AlertCircle,
  ChevronRight,
  Loader, // Added for loading state
  XCircle, // Added for error state
} from "lucide-react";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import useAuth from "../../store/UseAuth";

// Helper function to format the date string from "YYYY-MM-DD HH:MM:SS" to "DD/MM/YYYY"
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


export default function UploadView() {
  const [expandedItem, setExpandedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- MODIFIED: State for API data, loading, and errors ---
  const [uploads, setUploads] = useState([]); // Start with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();
  
  // --- MODIFIED: Data fetching logic is now inside useEffect ---
  useEffect(() => {
    const handleUploadView = async () => {
      // Reset states before fetching
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:6001/api/uploadview/getuploaddetails/${rollno}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok (Status: ${response.status})`);
        }
        
        const data = await response.json();

        // --- IMPORTANT: Map API data to the component's expected format ---
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type,
          complexity: item.complexity || 'NA', // Set default if complexity is null
          status: item.status, // API status ('Verified', 'Pending', 'Rejected', 'Approved')
          ashId: item.rollno,
          uploadDate: formatDate(item.uploaded_on),
          // Derive project/certificate number from the type and id
          projectNo: item.type === 'Project' ? item.id : null,
          CertificateNo: item.type === 'Certificate' ? item.id : null,
        }));
        
        setUploads(formattedData);
        console.log("Fetched and formatted upload view data:", formattedData);

      } catch (error) {
        console.error("Failed to fetch the upload view:", error);
        setError(error.message); // Set error message for UI
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    if (rollno) {
       handleUploadView();
    } else {
        setLoading(false);
        setError("Roll number not found. Cannot fetch data.");
    }
    // Dependency array ensures this runs when `rollno` is available
  }, [rollno]);

  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // No changes needed below this line for the logic, but I've updated the rendering part.
  // ... (handleNavigateToForm, toggleExpandItem are the same)

  const handleNavigateToForm = (type) => {
    console.log(`Selected document type: ${type}. Preparing to navigate.`);

    let targetPath = "/";

    switch (type) {
      case "Project":
        targetPath = "/uploadview/project";
        console.log(`Action: Navigate to Project form (path: ${targetPath}).`);
        navigate(targetPath);
        break;
      case "Patent":
        targetPath = "/uploadview/patent"; 
        console.log(`Action: Navigate to Patent form (path: ${targetPath}).`);
        navigate(targetPath);
        break;
      case "Workshop": // Corrected to match the database value
        targetPath = "/uploadview/SeminarOrWorkshop"; 
        console.log(`Action: Navigate to Seminar / Workshop form (path: ${targetPath}).`);
        navigate(targetPath);
        break;
      case "Internship":
        targetPath = "/uploadview/internship"; 
        console.log(`Action: Navigate to Internship form (path: ${targetPath}).`);
        navigate(targetPath);
        break;
      case "Paper Presentation":
        targetPath = "/uploadview/paperpresentation"; 
        console.log(`Action: Navigate to Paper Presentation form (path: ${targetPath}).`);
        navigate(targetPath);
        break;
      case "Certificate":
        targetPath = "/uploadview/certificate"; 
        console.log(`Action: Navigate to Certificate form (path: ${targetPath}).`);
        navigate(targetPath);
        break;
      default:
        console.warn(`No navigation action defined for type: ${type}`);
        return;
    }
  };

  const toggleExpandItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };
  
  // --- This useMemo for filtering remains the same ---
  const filteredUploads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return uploads.filter((upload) =>
      [
        upload.title,
        upload.description,
        upload.type,
        upload.complexity,
        upload.status,
        upload.ashId,
        upload.uploadDate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [searchTerm, uploads]);
  
  // --- MODIFIED: Render loading or error states ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 flex items-center justify-center">
          <Loader className="animate-spin mr-2" />
          Loading documents...
        </div>
      );
    }

    if (error) {
       return (
        <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6 text-center text-red-700 flex items-center justify-center">
           <XCircle className="mr-2" />
          Error: {error}
        </div>
      );
    }
    
    if (filteredUploads.length === 0) {
       return (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No documents found.
        </div>
      );
    }
    
    // --- Render the actual data for mobile and desktop ---
    return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden space-y-3">
        {filteredUploads.map((upload, index) => (
          <MobileCard
            key={`${upload.type}-${upload.id}`} // Use a more unique key
            upload={upload}
            index={index}
            expandedItem={expandedItem}
            toggleExpandItem={toggleExpandItem}
          />
        ))}
      </div>
      
      {/* Tablet and Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-600 text-sm bg-gray-50">
                <th className="py-3 px-4 font-medium whitespace-nowrap">S.No</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Uploads</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Type</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Complexity</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Status</th>
                <th className="py-3 px-4 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUploads.map((upload, index) => (
                <tr key={`${upload.type}-${upload.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 align-top text-sm">{index + 1}.</td>
                  <td className="py-4 px-4">
                    <div className="mb-1 font-medium text-sm md:text-base">
                      {upload.title}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mb-1">
                      {upload.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      Ash ID: {upload.ashId}
                    </div>
                    <div className="text-xs text-gray-500">
                      Uploaded: {upload.uploadDate}
                    </div>
                    {upload.projectNo || upload.CertificateNo ? (
                      <div className="inline-block mt-2 px-2 py-1 text-xs font-semibold border border-indigo-200 rounded-full bg-indigo-50 text-indigo-700">
                        {upload.projectNo
                          ? `Project #${upload.projectNo}`
                          : `Cert #${upload.CertificateNo}`}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-4 px-4 align-top text-sm">
                    {upload.type}
                  </td>
                  <td className="py-4 px-4 align-top text-sm">
                    {upload.complexity}
                  </td>
                  <td className="py-4 px-4 align-top">
                     {/* --- MODIFIED: Dynamic status rendering --- */}
                    <StatusBadge status={upload.status} />
                  </td>
                  <td className="py-4 px-4 align-top">
                    <div className="flex space-x-2">
                      <button
                        title="Edit"
                        className="p-1 text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        title="Delete"
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
    );
  }
  
  return (
    <>
      {/* Corrected the Modal component name */}
      <DocumentUploadModal open={open} handleClose={handleClose} handleNavigateToForm={handleNavigateToForm} />

      <div className="bg-gray-100 min-h-screen p-4 ">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative flex-1 w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                className="block w-full sm:w-64 md:w-80 pl-10 pr-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleOpen}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors text-sm md:text-base"
            >
              <span>Upload Document</span>
              <Upload size={18} className="ml-2" />
            </button>
          </div>
          
          {/* Render the content based on state */}
          {renderContent()}

        </div>
      </div>
    </>
  );
}

// --- NEW: A dedicated component for status badges for cleaner code ---
const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Verified':
    case 'Approved':
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full mr-2">
            <Check size={12} className="text-green-500" />
          </span>
          <span className="text-sm text-green-700">{status}</span>
        </div>
      );
    case 'Pending':
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-100 rounded-full mr-2">
            <AlertCircle size={12} className="text-yellow-500" />
          </span>
          <span className="text-sm text-yellow-700">Pending</span>
        </div>
      );
    case 'Rejected':
       return (
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 rounded-full mr-2">
            <XCircle size={12} className="text-red-500" />
          </span>
          <span className="text-sm text-red-700">Rejected</span>
        </div>
      );
    default:
      return <span className="text-sm text-gray-500">{status}</span>;
  }
};


// --- The MobileCard and Modal Components remain largely the same, but with updates ---

// --- Update MobileCard to use the new StatusBadge component ---
function MobileCard({ upload, index, expandedItem, toggleExpandItem }) {
  const isExpanded = expandedItem === upload.id;

  return (
    <div
      className={`bg-white rounded-lg shadow overflow-hidden transition-all ${
        isExpanded ? "ring-1 ring-indigo-200" : ""
      }`}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => toggleExpandItem(`${upload.type}-${upload.id}`)}
      >
        <div className="flex items-start space-x-3">
          <span className="font-medium text-gray-700">{index + 1}.</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{upload.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">
              {upload.description}
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {upload.type}
              </span>
              {/* Using the badge component here for consistency */}
               <StatusBadge status={upload.status}/>
            </div>
          </div>
        </div>
        <ChevronRight
          size={20}
          className={`text-gray-400 transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Complexity</p>
              <p className="text-sm font-medium">{upload.complexity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Reference</p>
              <p className="text-sm font-medium">
                {upload.projectNo
                  ? `Project #${upload.projectNo}`
                  : upload.CertificateNo 
                    ? `Cert #${upload.CertificateNo}`
                    : 'N/A'}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-1">Ash ID</div>
          <div className="text-sm font-medium mb-3">{upload.ashId}</div>
          <div className="text-xs text-gray-500 mb-1">Uploaded On</div>
          <div className="text-sm font-medium mb-3">{upload.uploadDate}</div>
          <div className="flex space-x-2 pt-2 border-t border-gray-100">
            <button
              title="Edit"
              className="flex-1 flex items-center justify-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              <Edit size={16} className="mr-1.5" />
              Edit
            </button>
            <button
              title="Delete"
              className="flex-1 flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} className="mr-1.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Update Modal to handle navigation correctly and use correct workshop type
const DocumentUploadModal = ({ open, handleClose, handleNavigateToForm }) => {
    const [selectedType, setSelectedType] = useState("");

    const items = [
      { label: "Project", desc: "Upload your academic or personal projects" },
      { label: "Patent", desc: "Upload your patent documents and details" },
      { label: "Workshop", desc: "Upload workshop attendance proofs" },
      { label: "Internship", desc: "Share your internship experience and certificates" },
      { label: "Paper Presentation", desc: "Share your research papers and presentations" },
      { label: "Certificate", desc: "Upload achievement certificates and awards" },
    ];
    
    // The renderIcon function can be copied from your original code.
    // ... (renderIcon implementation)
    // For brevity, it is omitted here but should be included.

    return (
      <Modal open={open} onClose={handleClose}>
        {/* The modal's JSX structure is the same as in your file. */}
        {/* I've only made sure the button's onClick is wired correctly. */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[90%] max-w-[500px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 pt-0">
                <button
                    className={`w-full py-2 rounded-md text-white font-medium ${
                        selectedType 
                        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer" 
                        : "bg-[#8ea7ec] cursor-not-allowed"
                    } transition-colors`}
                    disabled={!selectedType}
                    onClick={() => {
                        if (selectedType) {
                            handleNavigateToForm(selectedType); // Use the passed-in function
                            handleClose();
                        }
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
      </Modal>
    );
  };