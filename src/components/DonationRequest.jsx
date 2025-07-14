import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiEye, 
  FiMapPin, 
  FiCalendar, 
  FiClock, 
  FiDroplet,
  FiUser,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock as FiPending
} from "react-icons/fi";

const DonationRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/donation-requests?status=pending")
      .then((res) => {
        setRequests(res.data.donationRequests);
      })
      .catch((err) => {
        console.error("Error fetching pending requests:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleView = (id) => {
    navigate(`/dashboard/donation-requests/${id}`);
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800 border-red-200',
      'A-': 'bg-red-50 text-red-600 border-red-100',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B-': 'bg-blue-50 text-blue-600 border-blue-100',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
      'AB-': 'bg-purple-50 text-purple-600 border-purple-100',
      'O+': 'bg-green-100 text-green-800 border-green-200',
      'O-': 'bg-green-50 text-green-600 border-green-100',
    };
    return colors[bloodGroup] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'urgent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <FiAlertTriangle className="mr-1" /> Urgent
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <FiPending className="mr-1" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-red-100 rounded-full mb-4 flex items-center justify-center">
            <FiDroplet className="text-red-500 text-xl" />
          </div>
          <p className="text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blood Donation Requests</h2>
          <p className="mt-2 text-gray-600">
            {requests.length} {requests.length === 1 ? 'request needs' : 'requests need'} immediate attention
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto h-24 w-24 text-red-400 mb-4 flex items-center justify-center bg-red-50 rounded-full">
            <FiDroplet className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No pending requests</h3>
          <p className="mt-2 text-gray-500">All donation requests have been fulfilled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div 
              key={req._id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                {/* Header with status and blood group */}
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(req.status || 'pending')}
                  <span className={`${getBloodGroupColor(req.bloodGroup)} px-3 py-1 rounded-full text-sm font-medium flex items-center border`}>
                    <FiDroplet className="mr-1.5" /> {req.bloodGroup}
                  </span>
                </div>
                
                {/* Recipient info */}
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3 text-gray-600">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{req.recipientName}</h3>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center py-2 border-t border-b border-gray-100 my-3">
                  <div className="p-2 bg-red-50 rounded-lg mr-3 text-red-500">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{req.recipientUpazila}</p>
                    <p className="text-xs text-gray-500">{req.recipientDistrict}, Bangladesh</p>
                  </div>
                </div>
                
                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-500">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Donation Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(req.donationDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-500">
                      <FiClock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {req.donationTime}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <button
                  onClick={() => handleView(req._id)}
                  className="w-full mt-6 flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  <FiEye className="mr-2" />
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequest;