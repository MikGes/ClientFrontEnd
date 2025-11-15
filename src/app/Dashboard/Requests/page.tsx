// app/requests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaCouch, FaPhone, FaEnvelope, FaCalendar, FaClock, FaTrash, FaClipboard, FaEye } from 'react-icons/fa';

// Types based on your API response
interface OrderedFurniture {
    _id: string;
    furniture_name: string;
    furniture_type: string;
    furniture_price: number;
}

interface OrderedBy {
    _id: string;
    fullname: string;
    email: string;
}

interface ApiRequest {
    _id: string;
    orderedBy: OrderedBy;
    ordered_furniture: OrderedFurniture;
    phoneNumber?: string;
    createdAt?: string; // assuming you have this field
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<ApiRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(null);

    // Fetch real data from your API
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('https://back-thrumming-star-8653.fly.dev/admin/getrequests', {
                    credentials: 'include',

                }); // Adjust to your endpoint
                if (!response.ok) throw new Error('Failed to fetch requests');
                const data = await response.json();
                console.log(data)
                setRequests(data.data || []);
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError('Failed to load requests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const openEditModal = (request: ApiRequest) => {
        setSelectedRequest(request);
        setIsEditModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedRequest(null);
        document.body.style.overflow = 'auto';
    };

    // Format date/time from ISO string
    const formatDateTime = (dateString?: string) => {
        if (!dateString) return { date: 'N/A', time: 'N/A' };
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-amber-900">Customer Requests</h1>
                    <p className="text-amber-700 mt-2">Manage furniture order requests</p>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
                <table className="min-w-full divide-y divide-amber-100">
                    <thead className="bg-amber-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Customer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Requested Item
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Contact
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-100">
                        {requests.map((request) => {
                            const { date, time } = formatDateTime(request.createdAt);
                            return (
                                <tr key={request._id} className="hover:bg-amber-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="bg-amber-100 p-2 rounded-lg mr-3">
                                                <FaUser className="text-amber-700" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-amber-900">{request.orderedBy?.email}</div>
                                                <div className="text-amber-700 text-sm">{request.ordered_furniture.furniture_type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="bg-amber-100 p-2 rounded-lg mr-3">
                                                <FaCouch className="text-amber-700" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-amber-900">{request.ordered_furniture.furniture_name}</div>
                                                <div className="text-amber-700 text-sm">{request.ordered_furniture.furniture_price} Birr</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-amber-700">
                                        <div className="flex items-center mb-1">
                                            <FaEnvelope className="mr-2 text-amber-600 flex-shrink-0" />
                                            <span className="truncate">{request.orderedBy?.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FaPhone className="mr-2 text-amber-600 flex-shrink-0" />
                                            <span>{request.phoneNumber || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-amber-700">
                                        <div className="flex items-center">
                                            <FaCalendar className="mr-2 text-amber-600 flex-shrink-0" />
                                            <span>{date}</span>
                                        </div>
                                        <div className="flex items-center text-sm mt-1">
                                            <FaClock className="mr-2 text-amber-600 flex-shrink-0" />
                                            <span>{time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(request)}
                                            className="text-amber-700 hover:text-amber-900 mr-3"
                                            aria-label="Edit request"
                                        >
                                            <FaEye />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900" aria-label="Delete request">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {requests.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-amber-500 mb-2">
                            <FaClipboard className="text-4xl mx-auto" />
                        </div>
                        <p className="text-amber-700">No requests found</p>
                    </div>
                )}
            </div>

            {/* Edit Request Modal (Simplified) */}
            {isEditModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-amber-200 flex justify-between items-center p-6">
                            <h2 className="text-2xl font-bold text-amber-900">Request Details</h2>
                            <button
                                onClick={closeEditModal}
                                className="text-amber-700 hover:text-amber-900"
                                aria-label="Close modal"
                            >
                                X
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                                        <FaUser className="mr-2" /> Customer
                                    </h3>
                                    <div className="space-y-2">

                                        <div>
                                            <span className="text-amber-700 font-medium">Email:</span>
                                            <span className="ml-2">{selectedRequest.orderedBy?.email}</span>
                                        </div>
                                        {selectedRequest.phoneNumber && (
                                            <div>
                                                <span className="text-amber-700 font-medium">Phone:</span>
                                                <span className="ml-2">{selectedRequest.phoneNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                                        <FaCouch className="mr-2" /> Furniture
                                    </h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-amber-700 font-medium">Name:</span>
                                            <span className="ml-2">{selectedRequest.ordered_furniture.furniture_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-amber-700 font-medium">Type:</span>
                                            <span className="ml-2">{selectedRequest.ordered_furniture.furniture_type}</span>
                                        </div>
                                        <div>
                                            <span className="text-amber-700 font-medium">Price:</span>
                                            <span className="ml-2">{selectedRequest.ordered_furniture.furniture_price} Birr</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    onClick={closeEditModal}
                                    className="px-6 py-2 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 font-medium"
                                >
                                    Close
                                </button>
                                {/* <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center">
                                    <FaTrash className="mr-2" />
                                    Delete Request
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}