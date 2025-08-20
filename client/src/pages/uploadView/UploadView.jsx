import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Upload,
  Check,
  Edit,
  Trash2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Modal from "@mui/material/Modal";

import { useNavigate } from "react-router-dom";

export default function UploadView() {
  const [expandedItem, setExpandedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [uploads, setUploads] = useState([
    {
      id: 1,
      title: "Online Voting System",
      description: "Secure web app for elections with voter authentication",
      type: "Project",
      complexity: "T2",
      status: "Verified",
      ashId: "ASH20231234",
      uploadDate: "07/05/2025",
      projectNo: 1,
    },
    {
      id: 2,
      title: "Expense Tracker App",
      description: "Tracks income/expenses. Includes graphs and analytics",
      type: "Project",
      complexity: "T2",
      status: "Verified",
      ashId: "ASH20231234",
      uploadDate: "07/05/2025",
      projectNo: 2,
    },
    {
      id: 3,
      title: "E-Learning Portal",
      description: "LMS with user login, course upload, and quiz module",
      type: "Project",
      complexity: "T1",
      status: "Verified",
      ashId: "ASH20231234",
      uploadDate: "07/05/2025",
      projectNo: 3,
    },
    {
      id: 4,
      title: "Health Monitoring Wearable",
      description: "Tracks vitals and alerts via mobile app",
      type: "Project",
      complexity: "T1",
      status: "Verified",
      ashId: "ASH20231234",
      uploadDate: "07/05/2025",
      projectNo: 4,
    },
    {
      id: 5,
      title: "Data Science Professional Certificate",
      description: "IBM on Coursera",
      type: "Certificate",
      complexity: "NA",
      status: "Verified",
      ashId: "ASH20231234",
      uploadDate: "07/05/2025",
      CertificateNo: 1,
    },
    {
      id: 6,
      title: "JavaScript Algorithms and Data Structures",
      description: "freeCodeCamp",
      type: "Certificate",
      complexity: "NA",
      status: "Pending",
      ashId: "ASH20231234",
      uploadDate: "07/05/2025",
      CertificateNo: 2,
    },
  ]);

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
      case "Seminar / Workshop":
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

  const DocumentUploadModal = ({ open, handleClose }) => {
    const [selectedType, setSelectedType] = useState("");

    const items = [
      { label: "Project", desc: "Upload your academic or personal projects" },
      { label: "Patent", desc: "Upload your patent documents and details" },
      { label: "Seminar / Workshop", desc: "Upload seminar or workshop attendance proofs" },
      { label: "Internship", desc: "Share your internship experience and certificates" },
      { label: "Paper Presentation", desc: "Share your research papers and presentations" },
      { label: "Certificate", desc: "Upload achievement certificates and awards" },
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open-dot">
                <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
                <circle cx="14" cy="15" r="1"/>
              </svg>
            </div>
          );
        case "Patent":
        return (
          <div className={iconWrapperStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook-text">
              <path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/>
              <rect width="16" height="20" x="4" y="2" rx="2"/>
              <path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/>
            </svg>
          </div>
        );
      case "Seminar / Workshop":
        return (
          <div className={iconWrapperStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
              <path d="M12 7v14"/>
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
            </svg>
          </div>
        );
      case "Internship":
        return (
          <div className={iconWrapperStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-no-axes-column">
              <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
            </svg>
          </div>
        );
      case "Paper Presentation":
        return (
          <div className={iconWrapperStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallpaper">
              <circle cx="8" cy="9" r="2"/>
              <path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"/>
              <path d="M8 21h8"/><path d="M12 17v4"/>
            </svg>
          </div>
        );
      case "Certificate":
        return (
          <div className={iconWrapperStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award">
              <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/>
              <circle cx="12" cy="8" r="6"/>
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
              Choose the appropriate category for your document to ensure proper processing and validation
            </p>
          </div>

          {/* Scrollable content area */}
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
                      <p className="font-medium text-sm text-gray-800">{item.label}</p>
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
                  handleNavigateToForm(selectedType); // Call navigation function
                  handleClose(); // Then close the modal
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

  return (
    <>
      <DocumentUploadModal open={open} handleClose={handleClose} />

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
            <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors text-sm md:text-base">
              <span>
                Requested Upload
              </span>
            </button>
            <button
              onClick={handleOpen}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors text-sm md:text-base"
            >
              <span>Upload Document</span>
              <Upload size={18} className="ml-2" />
            </button>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden space-y-3">
            {filteredUploads.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No documents found
              </div>
            ) : (
              filteredUploads.map((upload, index) => (
                <MobileCard
                  key={upload.id}
                  upload={upload}
                  index={index}
                  expandedItem={expandedItem}
                  toggleExpandItem={toggleExpandItem}
                />
              ))
            )}
          </div>

          {/* Tablet and Desktop View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            {filteredUploads.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No documents found
              </div>
            ) : (
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
                      <tr key={upload.id} className="hover:bg-gray-50 transition-colors">
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
                          <div className="flex items-center">
                            {upload.status === "Verified" ? (
                              <>
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full mr-2">
                                  <Check size={12} className="text-green-500" />
                                </span>
                                <span className="text-sm">Verified</span>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-100 rounded-full mr-2">
                                  <AlertCircle size={12} className="text-yellow-500" />
                                </span>
                                <span className="text-sm">Pending</span>
                              </>
                            )}
                          </div>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

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
        onClick={() => toggleExpandItem(upload.id)}
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
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
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