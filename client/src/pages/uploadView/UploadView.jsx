import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Upload,
  Check,
  Trash2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../store/UseAuth";

// A reusable dropdown component for filtering
const FilterDropdown = ({ value, onChange, options, label }) => (
  <div className="relative w-full sm:w-auto">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none block w-full bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
      aria-label={label}
    >
      <option value="All">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <ChevronDown size={18} />
    </div>
  </div>
);

export default function UploadView() {
  const [expandedItem, setExpandedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ type: "All", status: "All" });

  // State for MUI Delete Dialog and Snackbar
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { rollno } = useAuth();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // Fetch logic remains the same
    const fetchUploads = async () => {
      if (!rollno) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:6001/api/uploadview/getuploaddetails`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const typeCounters = {};
        const formattedData = data.map((item) => {
          typeCounters[item.type] = (typeCounters[item.type] || 0) + 1;
          const date = new Date(item.uploaded_on);
          const formattedDate = `${String(date.getDate()).padStart(
            2,
            "0"
          )}/${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}/${date.getFullYear()}`;
          const displayType =
            item.type === "Workshop" ? "Seminar / Workshop" : item.type;
          const newItem = {
            ...item,
            uniqueId: `${displayType}-${item.id}`,
            ashId: item.rollno,
            uploadDate: formattedDate,
            complexity: item.complexity || "NA",
            type: displayType,
            originalType: item.type, // Keep original type for API calls
          };
          if (item.type === "Project")
            newItem.projectNo = typeCounters[item.type];
          if (item.type === "Certificate")
            newItem.CertificateNo = typeCounters[item.type];
          return newItem;
        });
        setUploads(formattedData);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, [rollno]);

  const handleFilterChange = (e, filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: e.target.value }));
  };

  // --- Delete Logic with Confirmation Dialog ---

  // Step 1: Open the confirmation dialog
  const handleOpenDeleteDialog = (id, displayType, subType, originalType) => {
    setItemToDelete({
      id,
      displayType,
      subType,
      originalType: originalType || displayType,
    });
    setDeleteConfirmOpen(true);
  };

  // Step 2: Close the confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Step 3: Confirm deletion and make the API call
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const { id, displayType, subType, originalType } = itemToDelete;
    // Use originalType for API call (backend expects original type like "Workshop", not "Seminar / Workshop")
    const apiType =
      originalType === "Seminar / Workshop" ? "Workshop" : originalType;
    const payload = {
      id,
      type: apiType,
      subType: apiType === "Certificate" ? subType : undefined,
    };

    try {
      const response = await fetch(
        "http://localhost:6001/api/uploadview/deleteupload",
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed on the server.");
      }

      // Use displayType for filtering since uniqueId uses displayType
      setUploads((prevUploads) =>
        prevUploads.filter(
          (upload) => upload.uniqueId !== `${displayType}-${id}`
        )
      );
      setNotification({
        open: true,
        message: "Item deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to delete document:", error);
      setNotification({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    } finally {
      handleCloseDeleteDialog(); // Close the dialog regardless of outcome
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // --- End of Delete Logic ---

  const handleNavigateToForm = (type) => {
    // Navigation logic remains the same
    let targetPath = "/";
    switch (type) {
      case "Project":
        targetPath = "/uploadview/project";
        break;
      case "Patent":
        targetPath = "/uploadview/patent";
        break;
      case "Seminar / Workshop":
        targetPath = "/uploadview/SeminarOrWorkshop";
        break;
      case "Internship":
        targetPath = "/uploadview/internship";
        break;
      case "Paper Presentation":
        targetPath = "/uploadview/paperpresentation";
        break;
      case "Certificate":
        targetPath = "/uploadview/certificate";
        break;
      default:
        console.warn(`No navigation action defined for type: ${type}`);
        return;
    }
    navigate(targetPath);
  };

  const toggleExpandItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };
  const filteredUploads = useMemo(() => {
    // Filtering logic remains the same
    const term = searchTerm.toLowerCase();

    return uploads.filter((upload) => {
      const typeMatch = filters.type === "All" || upload.type === filters.type;
      const statusMatch =
        filters.status === "All" || upload.status === filters.status;
      const searchMatch =
        !term ||
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
          .includes(term);

      return typeMatch && statusMatch && searchMatch;
    });
  }, [searchTerm, uploads, filters]);

  const uniqueTypes = useMemo(
    () => [...new Set(uploads.map((u) => u.type))].sort(),
    [uploads]
  );
  const statusOptions = ["Verified", "Pending", "Rejected"];

  const DocumentUploadModal = ({ open, handleClose }) => {
    // Modal component remains the same
    const [selectedType, setSelectedType] = useState("");
    const items = [
      { label: "Project", desc: "Upload your academic or personal projects" },
      { label: "Patent", desc: "Upload your patent documents and details" },
      {
        label: "Seminar / Workshop",
        desc: "Upload seminar or workshop attendance proofs",
      },
      {
        label: "Internship",
        desc: "Share your internship experience and certificates",
      },
      {
        label: "Paper Presentation",
        desc: "Share your research papers and presentations",
      },
      {
        label: "Certificate",
        desc: "Upload achievement certificates and awards",
      },
    ];

    const renderIcon = (label, selected) => {
      const iconWrapperStyle = `p-2 rounded-[50%] transition-colors ${
        selected
          ? "bg-[#265ee1] text-white"
          : "bg-[#f3f4f6] text-black group-hover:bg-[#e5edfd]"
      }`;

      switch (label) {
        case "Project":
          return (
            <div className={iconWrapperStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-folder-open-dot"
              >
                <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
                <circle cx="14" cy="15" r="1" />
              </svg>
            </div>
          );
        case "Patent":
          return (
            <div className={iconWrapperStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-notebook-text"
              >
                <path d="M2 6h4" />
                <path d="M2 10h4" />
                <path d="M2 14h4" />
                <path d="M2 18h4" />
                <rect width="16" height="20" x="4" y="2" rx="2" />
                <path d="M9.5 8h5" />
                <path d="M9.5 12H16" />
                <path d="M9.5 16H14" />
              </svg>
            </div>
          );
        case "Seminar / Workshop":
          return (
            <div className={iconWrapperStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-book-open"
              >
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
              </svg>
            </div>
          );
        case "Internship":
          return (
            <div className={iconWrapperStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chart-no-axes-column"
              >
                <line x1="18" x2="18" y1="20" y2="10" />
                <line x1="12" x2="12" y1="20" y2="4" />
                <line x1="6" x2="6" y1="20" y2="14" />
              </svg>
            </div>
          );
        case "Paper Presentation":
          return (
            <div className={iconWrapperStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-wallpaper"
              >
                <circle cx="8" cy="9" r="2" />
                <path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </div>
          );
        case "Certificate":
          return (
            <div className={iconWrapperStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-award"
              >
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                <circle cx="12" cy="8" r="6" />
              </svg>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <Modal open={open} onClose={handleClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[90%] max-w-[500px] max-h-[90vh] flex flex-col">
          <div className="bg-[#e2eefe] rounded-t-lg p-6 pb-4">
            <div className="flex justify-center mb-2">
              <div className="px-4 py-1 rounded-[15px] bg-[#dbeafe]">
                <p className="text-center text-lg font-semibold text-[#3371ea]">
                  Document Upload
                </p>
              </div>
            </div>
            <h2 className="text-center text-xl font-bold text-[#3371ea] mb-2">
              Select the type of work you're uploading
            </h2>
            <p className="text-center text-xs text-gray-500">
              Choose the appropriate category for your document to ensure proper
              processing and validation
            </p>
          </div>

          <div className="p-6 pt-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`group border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                    selectedType === item.label
                      ? "border-blue-500 bg-blue-50 shadow-md hover:scale-105 "
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm hover:scale-105 hover:bg-[#eff6ff]"
                  }`}
                  onClick={() => setSelectedType(item.label)}
                >
                  <div className="flex flex-row gap-3 items-center">
                    {renderIcon(item.label, selectedType === item.label)}
                    <div className="flex flex-col">
                      <p className="font-medium text-sm text-gray-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  handleNavigateToForm(selectedType);
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          Loading documents...
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center p-10 bg-white rounded-lg shadow text-red-600">
          Error: {error}
        </div>
      );
    }
    if (!loading && !error && filteredUploads.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No documents match your criteria.
        </div>
      );
    }

    return (
      <>
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {filteredUploads.map((upload, index) => (
            <MobileCard
              key={upload.uniqueId}
              upload={upload}
              index={index}
              expandedItem={expandedItem}
              toggleExpandItem={toggleExpandItem}
              handleDelete={handleOpenDeleteDialog} // Pass the dialog-opening function
            />
          ))}
        </div>

        {/* Tablet and Desktop View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full  border-collapse">
              <thead>
                <tr className="text-left text-gray-600 text-sm bg-gray-50">
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    S.No
                  </th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Uploads
                  </th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Type
                  </th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Complexity
                  </th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUploads.map((upload, index) => (
                  <tr
                    key={upload.uniqueId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 align-top text-sm">
                      {index + 1}.
                    </td>
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
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          {upload.status === "Verified" ? (
                            <>
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full mr-2">
                                <Check size={12} className="text-green-500" />
                              </span>
                              <span className="text-sm">Verified</span>
                            </>
                          ) : upload.status === "Pending" ? (
                            <>
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-100 rounded-full mr-2">
                                <AlertCircle
                                  size={12}
                                  className="text-yellow-500"
                                />
                              </span>
                              <span className="text-sm">Pending</span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 rounded-full mr-2">
                                <AlertCircle
                                  size={12}
                                  className="text-red-500"
                                />
                              </span>
                              <span className="text-sm">Rejected</span>
                            </>
                          )}
                        </div>
                        {upload.faculty_remarks &&
                          upload.status !== "Pending" && (
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 max-w-[200px]">
                              <span className="font-medium text-gray-700">
                                Remarks:{" "}
                              </span>
                              {upload.faculty_remarks}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleOpenDeleteDialog(
                              upload.id,
                              upload.type,
                              upload["SUb-type"],
                              upload.originalType
                            )
                          }
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
  };

  return (
    <div className="p-5">
      <DocumentUploadModal open={open} handleClose={handleClose} />

      {/* --- Confirmation Dialog and Notification Snackbar --- */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this item? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      {/* --- End of Dialog and Snackbar --- */}

      <div className="bg-gray-100 min-h-screen p-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base border border-gray-200 shadow-sm"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:flex-none">
              <FilterDropdown
                value={filters.type}
                onChange={(e) => handleFilterChange(e, "type")}
                options={uniqueTypes}
                label="All Types"
              />
              <FilterDropdown
                value={filters.status}
                onChange={(e) => handleFilterChange(e, "status")}
                options={statusOptions}
                label="All Statuses"
              />
            </div>

            <button
              onClick={handleOpen}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white outline-indigo-600 text-indigo-600 font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors text-sm md:text-base"
            >
              <span>Upload Document</span>
              <Upload size={18} className="ml-2" />
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// MobileCard remains unchanged but now receives the correct delete handler
function MobileCard({
  upload,
  index,
  expandedItem,
  toggleExpandItem,
  handleDelete,
}) {
  const isExpanded = expandedItem === upload.uniqueId;

  return (
    <div
      className={`bg-white rounded-lg shadow overflow-hidden transition-all ${
        isExpanded ? "ring-1 ring-indigo-200" : ""
      }`}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => toggleExpandItem(upload.uniqueId)}
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
              {upload.status === "Verified" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              ) : upload.status === "Pending" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Rejected
                </span>
              )}
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
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-1">Ash ID</div>
          <div className="text-sm font-medium mb-3">{upload.ashId}</div>
          <div className="text-xs text-gray-500 mb-1">Uploaded On</div>
          <div className="text-sm font-medium mb-3">{upload.uploadDate}</div>
          {upload.faculty_remarks && upload.status !== "Pending" && (
            <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Faculty Remarks</p>
              <p className="text-sm text-gray-700">{upload.faculty_remarks}</p>
            </div>
          )}
          <div className="flex space-x-2 pt-2 border-t border-gray-100">
            <button
              onClick={() =>
                handleDelete(
                  upload.id,
                  upload.type,
                  upload["SUb-type"],
                  upload.originalType
                )
              }
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
