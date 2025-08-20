import React, { useState, useEffect, useCallback } from 'react';

// --- Icon Imports ---
import { Search, User, GraduationCap } from 'lucide-react';
import { Modal, Box, Typography, Button as MuiButton, List, ListItem, ListItemText, Divider, IconButton, Paper, Chip } from '@mui/material';
import { Close as CloseIcon, School as SchoolIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';

// --- Child Component Imports ---
import SelectedDetail from './selectedDetail';
import AddUsersModal from './AddUsersModal';
import axios from 'axios';


const SemesterControlModal = () => {
    const [open, setOpen] = useState(false);
    const [semesterData, setSemesterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchSemesterData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:6001/api/handlesem", {
                withCredentials: true,
            });
            setSemesterData(response.data);
        } catch (err) {
            setError("Failed to fetch semester data.");
            console.error("Error fetching semester data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        fetchSemesterData(); // Fetch data when the modal is opened
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleAdvanceSemester = async (batch, currentSem) => {
        if (!window.confirm(`Are you sure you want to advance the semester for batch ${batch}?`)) {
            return;
        }

        if (currentSem >= 8) {
            alert(`Batch ${batch} has already completed all semesters.`);
            return;
        }

        try {
            const newSem = currentSem + 1;
            await axios.put("http://localhost:6001/api/updatesem", {
                batch: batch,
                sem: newSem
            }, {
                withCredentials: true,
            });

            // Refresh the data after a successful update
            fetchSemesterData();
        } catch (err) {
            alert(`Error advancing semester for batch ${batch}.`);
            console.error("Error advancing semester:", err);
        }
    };


    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: 'none',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
        outline: 'none'
    };

    const renderSemesterList = () => {
        if (loading) return <Typography>Loading...</Typography>;
        if (error) return <Typography color="error">{error}</Typography>;
        if (semesterData.length === 0) return <Typography>No semester data found.</Typography>;

        return (
            <List sx={{ width: '100%' }}>
                {semesterData.map((data) => {
                    const isMaxSem = data.sem >= 8;
                    return (
                        <ListItem
                            key={data.batch}
                            secondaryAction={
                                <MuiButton
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={() => handleAdvanceSemester(data.batch, data.sem)}
                                    disabled={isMaxSem}
                                    endIcon={<ChevronRightIcon />}
                                >
                                    Advance
                                </MuiButton>
                            }
                            disablePadding
                            sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: '8px' }}
                        >
                            <ListItemText
                                primary={`Batch ${data.batch}`}
                                secondary={
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        Current Status: <Chip label={isMaxSem ? "Graduated" : `Sem - ${data.sem}`} color={isMaxSem ? "success" : "primary"} size="small" />
                                    </Typography>
                                }
                            />
                        </ListItem>
                    );
                })}
            </List>
        );
    };

    return (
        <div>
            <button
                onClick={handleOpen}
                className="bg-primary text-white py-2.5 px-6 rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-200 flex items-center justify-center space-x-2"
            >
                <SchoolIcon fontSize="small" />
                <span>Change Semester</span>
            </button>

            <Modal open={open} onClose={handleClose}>
                <Paper sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="h2">Batch Semester Management</Typography>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {renderSemesterList()}
                </Paper>
            </Modal>
        </div>
    );
};


// ===================================================================================
//  Main Addusers Component
// ===================================================================================
export default function Addusers() {
    // ... (The rest of your Addusers component remains the same) ...
    const [activeTab, setActiveTab] = useState("student");
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSelectedUser(null);
        try {
            const response = await axios.get(`/api/admin/addusers?role=${activeTab}`);
            const data = response.data;
            if (Array.isArray(data)) {
                setUsers(data);
                setFilteredUsers(data);
            } else {
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (err) {
            setError(`Failed to fetch ${activeTab}s. Please try again later.`);
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = Array.isArray(users) ? users.filter(user =>
            (user.user_name?.toLowerCase().includes(lowercasedFilter)) ||
            (user.user_email?.toLowerCase().includes(lowercasedFilter)) ||
            (user.rollno?.toLowerCase().includes(lowercasedFilter)) ||
            (user.department?.toLowerCase().includes(lowercasedFilter))
        ) : [];
        setFilteredUsers(filteredData);
    }, [searchTerm, users]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSearchTerm("");
        setSelectedUser(null);
    };

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (rollno) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`/api/admin/users/${rollno}`);
                fetchUsers();
            } catch (err) {
                alert("Error: Could not delete user.");
            }
        }
    };

    const handleModalClose = (shouldRefresh) => {
        setIsModalOpen(false);
        setEditingUser(null);
        if (shouldRefresh) fetchUsers();
    };

    const TabButton = ({ label, value, icon: Icon }) => (
        <button
            onClick={() => handleTabClick(value)}
            className={`py-3 px-6 font-medium text-sm focus:outline-none -mb-px border-b-2 flex items-center space-x-2 ${activeTab === value ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    const renderContent = () => {
        if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
        if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
        if (filteredUsers.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <div className="text-gray-400 mb-4 inline-block">{activeTab === 'faculty' ? <User size={48} /> : <GraduationCap size={48} />}</div>
                    <p className="text-gray-600 text-lg font-medium">No {activeTab}s Found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search or add a new user.</p>
                </div>
            );
        }
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"><div className="p-4 sm:p-6"><ul className="space-y-3">
                {filteredUsers.map((user) => (
                    <li key={user.id} onClick={() => setSelectedUser(user)} className={`p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer ${selectedUser?.id === user.id ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200' : ''}`} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSelectedUser(user); }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center mb-1 sm:mb-0"><span className="font-medium text-gray-800">{user.user_name}</span></div>
                            <div className="flex items-center text-sm text-gray-500"><span>ID: {user.rollno}</span></div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">{user.user_email}</div>
                    </li>
                ))}
            </ul></div></div>
        );
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen py-6 md:py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px space-x-1">
                                <TabButton label="Students" value="student" icon={GraduationCap} />
                                <TabButton label="Faculty" value="faculty" icon={User} />
                            </nav>
                        </div>
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <SemesterControlModal />
                            <button
                                onClick={handleOpenAddModal}
                                className="bg-primary text-white py-2.5 px-6 rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-200 flex items-center justify-center space-x-2"
                            >
                                <span>+ Add {activeTab === 'faculty' ? 'Faculty' : 'Student'}</span>
                            </button>
                        </div>
                    </div>
                    <div className="mb-8"><div className="relative flex-grow w-full md:max-w-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="text-gray-400" size={18} /></div>
                        <input type="text" className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-white shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder={`Search ${activeTab}s...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div></div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3">{renderContent()}</div>
                        <div className="lg:w-1/3">
                            <SelectedDetail selectedUser={selectedUser} userType={activeTab} onEdit={handleOpenEditModal} onDelete={handleDeleteUser} />
                        </div>
                    </div>
                </div>
            </div>
            <AddUsersModal open={isModalOpen} onClose={handleModalClose} userType={activeTab} initialData={editingUser} />
        </>
    );
}