import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FiUser, 
  FiMapPin, 
  FiCalendar, 
  FiClock, 
  FiDroplet,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";

const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/api/donation-requests/by-donor/${user.email}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setRequests(res.data);
          } else {
            console.error("API returned non-array data:", res.data);
            setRequests([]); 
          }
        })
        .catch((err) => {
          console.error(err);
          setRequests([]);
        });
    }
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const result = await axios.patch(
        `http://localhost:5000/api/donation-requests/status/${id}`, 
        { status }
      );
      if (result.data.modifiedCount > 0) {
        Swal.fire({
          title: "Updated!",
          text: `Status updated to ${status}`,
          icon: "success",
          confirmButtonColor: "#10B981",
          background: "#f8fafc"
        });
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
        confirmButtonColor: "#EF4444",
        background: "#f8fafc"
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the donation request permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      background: "#f8fafc"
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(
          `http://localhost:5000/api/donation-requests/${id}`
        );
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "The request has been removed.",
            icon: "success",
            confirmButtonColor: "#10B981",
            background: "#f8fafc"
          });
          setRequests(prev => prev.filter(r => r._id !== id));
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete request",
          icon: "error",
          confirmButtonColor: "#EF4444",
          background: "#f8fafc"
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status?.toLowerCase()) {
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'inprogress':
        return <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>;
      case 'done':
        return <span className={`${base} bg-green-100 text-green-800`}>Completed</span>;
      case 'canceled':
        return <span className={`${base} bg-gray-100 text-gray-800`}>Canceled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-red-50 text-red-700 border border-red-200',
      'A-': 'bg-red-100 text-red-800 border border-red-300',
      'B+': 'bg-blue-50 text-blue-700 border border-blue-200',
      'B-': 'bg-blue-100 text-blue-800 border border-blue-300',
      'O+': 'bg-green-50 text-green-700 border border-green-200',
      'O-': 'bg-green-100 text-green-800 border border-green-300',
      'AB+': 'bg-purple-50 text-purple-700 border border-purple-200',
      'AB-': 'bg-purple-100 text-purple-800 border border-purple-300',
    };
    return colors[bloodGroup] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">
          <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Welcome, {user?.displayName || "Donor"}!
          </span>
        </h1>
        <p className="text-gray-600 mt-1">
          Here are your recent blood donation activities
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Recent Donation Requests
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-red-50 via-red-100 to-red-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[120px]">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-red-500 w-4 h-4" />
                      <span>Recipient</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[120px]">
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="text-red-500 w-4 h-4" />
                      <span>Location</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[100px]">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-red-500 w-4 h-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[80px]">
                    <div className="flex items-center space-x-2">
                      <FiClock className="text-red-500 w-4 h-4" />
                      <span>Time</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[100px]">
                    <div className="flex items-center space-x-2">
                      <FiDroplet className="text-red-500 w-4 h-4" />
                      <span>Blood Group</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[100px]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[150px]">
                    Donor Info
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[200px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {requests.slice(0, 3).map((req) => {
                  const status = req.status?.toLowerCase();
                  const showDonorInfo = status === "inprogress" && req.donorName && req.donorEmail;

                  return (
                    <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {req.recipientName}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {req.recipientUpazila}, {req.recipientDistrict}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {new Date(req.donationDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {req.donationTime}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`${getBloodGroupColor(req.bloodGroup)} px-2 py-1 rounded-full text-xs font-medium`}>
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {showDonorInfo ? (
                          <div className="text-sm text-gray-700">
                            <div className="font-medium">{req.requesterName}</div>
                            <div className="text-gray-500 text-xs">{req.requesterEmail}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Link
                            to={`/dashboard/donation-requests/${req._id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <FiEye className="mr-1 w-3 h-3" />
                            View
                          </Link>
                          {status !== "done" && (
  <Link
    to={`/dashboard/edit-donation-request/${req._id}`}
    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none"
  >
    <FiEdit2 className="mr-1 w-3 h-3" />
    Edit
  </Link>
)}

                          <button
                            onClick={() => handleDelete(req._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                          >
                            <FiTrash2 className="mr-1 w-3 h-3" />
                            Delete
                          </button>

                          {status === "inprogress" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(req._id, "done")}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none"
                              >
                                <FiCheckCircle className="mr-1 w-3 h-3" />
                                Mark Done
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req._id, "canceled")}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                              >
                                <FiXCircle className="mr-1 w-3 h-3" />
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 text-right border-t border-gray-100">
            <Link
              to="/dashboard/my-donation-requests"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              View All Requests
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="mx-auto h-24 w-24 text-red-400 mb-4 flex items-center justify-center">
            <FiDroplet className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No donation requests found</h3>
          <p className="mt-2 text-gray-500">You haven't made any donation requests yet.</p>
          <Link
            to="/dashboard/create-donation-request"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            Create New Request
          </Link>
        </div>
      )}
    </div>
  );
};

export default DonorHome;