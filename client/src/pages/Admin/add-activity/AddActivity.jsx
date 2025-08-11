import React, { useState, useMemo, useEffect } from "react";
import AddedActivityCard from "./AddedActivityCard";
import { Search, PlusCircle, AlertTriangle, Loader2 } from "lucide-react";
import AddActivityModal from "./AddActivityModal";
// import axios from 'axios';

// Dummy data to be used instead of fetching from the backend
const dummyActivities = [
    {
        id: 1,
        event_code: "EVT001",
        event_name: "Tech Conference 2025",
        description: "An annual conference about the latest in technology and innovation.",
        domains: "Technology, Innovation",
        type: "Conference"
    },
    {
        id: 2,
        event_code: "EVT002",
        event_name: "Art & Design Workshop",
        description: "A hands-on workshop for creative minds to explore new design techniques.",
        domains: "Art, Design",
        type: "Workshop"
    },
    {
        id: 3,
        event_code: "EVT003",
        event_name: "Community Marathon",
        description: "A 5k run to support local charities and promote a healthy lifestyle.",
        domains: "Health, Community",
        type: "Sports"
    },
    {
        id: 4,
        event_code: "EVT004",
        event_name: "Music Festival",
        description: "A weekend-long festival featuring various artists from around the world.",
        domains: "Music, Entertainment",
        type: "Festival"
    },
    {
        id: 5,
        event_code: "EVT005",
        event_name: "Startup Pitch Night",
        description: "An evening for entrepreneurs to pitch their ideas to investors.",
        domains: "Business, Startups",
        type: "Networking"
    }
];

export default function AddActivity() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [loading, setLoading] = useState(false); // Set loading to false as we are using dummy data
    const [error, setError] = useState(null);
    // const API_URL = `http://localhost:6001/api/addedactivities`;

    // const fetchActivities = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await axios.get(API_URL, { withCredentials: true });
    //         const fetchedData = Array.isArray(response.data) ? response.data : [];
    //         setActivities(fetchedData);
    //     } catch (err) {
    //         console.error("Error fetching activities:", err);
    //         setError(err.message || "Failed to fetch activities. Please try again.");
    //         setActivities([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect to set dummy data on component mount
    useEffect(() => {
        setActivities(dummyActivities);
        setLoading(false);
    }, []);

    const fetchActivities = () => {
        // This function can be used to re-set the dummy data or for other purposes if needed
        setActivities(dummyActivities);
    };

    const filteredActivities = useMemo(() => {
        if (!activities) return [];
        if (!searchTerm) return activities;
        
        return activities.filter(activity =>
            (activity.event_name && activity.event_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (activity.domains && activity.domains.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (activity.type && activity.type.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, activities]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-slate-100 min-h-screen">
            <div className="mb-6 sm:mb-8 p-4 bg-white rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500 shadow-sm"
                            placeholder="Search by event name, domain, type, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 ease-in-out cursor-pointer"
                    >
                        <PlusCircle size={18} />
                        <span>Add New Event</span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="ml-3 text-gray-600">Loading Events...</p>
                </div>
            )}

            {error && !loading && (
                <div className="col-span-full text-center py-10 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow p-6">
                    <AlertTriangle size={40} className="mx-auto mb-3" />
                    <p className="text-lg font-medium">Error loading events.</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {!loading && !error && (
                <>
                    {filteredActivities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                            {filteredActivities.map((activity) => (
                                <AddedActivityCard
                                    key={activity.id || activity.event_code} 
                                    activity={activity}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-xl shadow">
                            <Search size={40} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 text-lg font-medium">No Events Found</p>
                            {searchTerm ? 
                                <p className="text-gray-500 text-sm">Try adjusting your search term.</p> : 
                                <p className="text-gray-500 text-sm">Click 'Add New Event' to get started.</p>
                            }
                        </div>
                    )}
                </>
            )}

            <AddActivityModal 
                open={isModalOpen} 
                handleClose={handleCloseModal} 
                onActivityCreated={fetchActivities} 
            />
        </div>
    );
}