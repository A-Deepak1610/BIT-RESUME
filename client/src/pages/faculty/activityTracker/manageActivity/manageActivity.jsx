import React, { useState, useMemo, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import { Search, PlusCircle, AlertTriangle, Loader2 } from "lucide-react";
import CreateActivityModal from "./activityModal";
import axios from 'axios';

export default function ManageActivity() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = `${import.meta.env.VITE_API_URL}api/manageactivities/receiveActivities`;
    useEffect(() => {
        const fetchActivities = async () => {
            console.log("fetchActivities called");
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(API_URL, { withCredentials: true });
                console.log("API Response Data:", response.data);
                const fetchedData = Array.isArray(response.data) ? response.data : [];
                setActivities(fetchedData);
                if (!Array.isArray(response.data)) {
                    console.warn("API did not return an array. Received:", response.data);
                }
            } catch (err) {
                console.error("Error fetching activities:", err);
                setError(err.message || "Failed to fetch activities. Please try again.");
                setActivities([]); // Set to empty array on error
            } finally {
                setLoading(false);
                console.log("fetchActivities finished, loading set to false");
            }
        };

        fetchActivities();
    }, [API_URL]);

    const filteredActivities = useMemo(() => {
        if (!activities || activities.length === 0) return []; // Ensure activities is an array and not empty
        if (!searchTerm) {
            return activities;
        }
        return activities.filter(activity =>
            (activity.activity_title && activity.activity_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (activity.activity_type && activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, activities]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    // Callback to refresh activities after one is created/updated
    const refreshActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            const fetchedData = Array.isArray(response.data) ? response.data : [];
            setActivities(fetchedData);
        } catch (err) {
            console.error("Error refreshing activities:", err);
            setError(err.message || "Failed to refresh activities.");
        } finally {
            setLoading(false);
        }
    };


    console.log("Render states: Loading:", loading, "Error:", error, "Activities count:", activities?.length, "Filtered count:", filteredActivities?.length);

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
                            className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                               text-sm placeholder-gray-500 shadow-sm"
                            placeholder="Search by title, type, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 ease-in-out cursor-pointer"
                    >
                        <PlusCircle size={18} />
                        <span>Create Activity</span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="ml-3 text-gray-600">Loading activities...</p>
                </div>
            )}

            {error && !loading && (
                <div className="col-span-full text-center py-10 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow p-6">
                    <AlertTriangle size={40} className="mx-auto mb-3" />
                    <p className="text-lg font-medium">Error loading activities.</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {filteredActivities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
                            {filteredActivities.map((activity, index) => {
                                console.log("Mapping activity:", activity, "with key:", activity.activity_id || activity.activity_title || `activity-${index}`);
                                return (
                                    <ActivityCard
                                        key={activity.activity_id || activity.activity_title || `activity-${index}`} // Corrected template literal for index fallback
                                        activity={activity}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="col-span-full text-center py-10 bg-white rounded-xl shadow">
                            <Search size={40} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 text-lg font-medium">No activities found.</p>
                            {searchTerm && <p className="text-gray-500 text-sm">Try adjusting your search term or create a new activity.</p>}
                            {!searchTerm && <p className="text-gray-500 text-sm">Create a new activity to get started.</p>}
                        </div>
                    )}
                </>
            )}
            {/* Pass refreshActivities to modal if it handles creation and needs to trigger a refresh */}
            <CreateActivityModal 
                open={isModalOpen} 
                handleClose={handleCloseModal} 
                onActivityCreated={refreshActivities} /* Example: pass refresh function */
            />
        </div>
    );
}