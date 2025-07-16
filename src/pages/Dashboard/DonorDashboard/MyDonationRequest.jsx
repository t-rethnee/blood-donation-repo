import React, { useContext } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  FiXCircle,
} from "react-icons/fi";

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch function for React Query
  const fetchDonationRequests = async () => {
    if (!user?.email) return [];
    const res = await axios.get(
      `https://blood-donation-server-iota-flame.vercel.app/api/donation-requests/by-donor/${user.email}`
    );
    if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.error("API returned non-array data:", res.data);
      return [];
    }
  };

  // Use React Query to fetch requests
 const {
  data: requests = [],
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["donationRequests", user?.email],
  queryFn: fetchDonationRequests,
  enabled: !!user?.email,
});


  // Handle status update
  const handleStatusUpdate = async (id, status) => {
    try {
      const result = await axios.patch(
        `https://blood-donation-server-iota-flame.vercel.app/api/donation-requests/status/${id}`,
        { status }
      );
      if (result.data.modifiedCount > 0) {
        Swal.fire({
          title: "Updated!",
          text: `Status updated to ${status}`,
          icon: "success",
          confirmButtonColor: "#10B981",
          background: "#f8fafc",
        });

        // Update React Query cache after status change
        queryClient.setQueryData(["donationRequests", user.email], (old) =>
          old.map((r) => (r._id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
        confirmButtonColor: "#EF4444",
        background: "#f8fafc",
      });
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the donation request permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      background: "#f8fafc",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(
          `https://blood-donation-server-iota-flame.vercel.app/api/donation-requests/${id}`
        );
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "The request has been removed.",
            icon: "success",
            confirmButtonColor: "#10B981",
            background: "#f8fafc",
          });

          // Update React Query cache after deletion
          queryClient.setQueryData(["donationRequests", user.email], (old) =>
            old.filter((r) => r._id !== id)
          );
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete request",
          icon: "error",
          confirmButtonColor: "#EF4444",
          background: "#f8fafc",
        });
      }
    }
  };

  // Your helper functions unchanged
  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>
        );
      case "inprogress":
        return (
          <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>
        );
      case "done":
        return (
          <span className={`${base} bg-green-100 text-green-800`}>Completed</span>
        );
      case "canceled":
        return (
          <span className={`${base} bg-gray-100 text-gray-800`}>Canceled</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>
        );
    }
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      "A+": "bg-red-50 text-red-700 border border-red-200",
      "A-": "bg-red-100 text-red-800 border border-red-300",
      "B+": "bg-blue-50 text-blue-700 border border-blue-200",
      "B-": "bg-blue-100 text-blue-800 border border-blue-300",
      "O+": "bg-green-50 text-green-700 border border-green-200",
      "O-": "bg-green-100 text-green-800 border border-green-300",
      "AB+": "bg-purple-50 text-purple-700 border border-purple-200",
      "AB-": "bg-purple-100 text-purple-800 border border-purple-300",
    };
    return colors[bloodGroup] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  // Loading and error states
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading donation requests...</p>;
  }
  if (isError) {
    return (
      <p className="text-center text-red-500">
        Error loading donation requests: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Donation Requests</h1>

      {requests.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
                  <th className="px-4 py-3 text-right text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[250px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.slice(0, 3).map((request) => (
                  <tr key={request._id} className="hover:bg-red-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {request.recipientName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {request.recipientDistrict}, {request.recipientUpazila}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {request.time}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${getBloodGroupColor(
                          request.bloodGroup
                        )}`}
                      >
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {request.status === "inprogress" ? (
                        <div>
                          <p>{request.donorName}</p>
                          <p>{request.donorEmail}</p>
                          <p>{request.donorPhone}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">-</p>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right space-x-2 flex justify-end items-center">
                      {/* Status buttons - disable if done or canceled */}
                      {["pending", "inprogress"].includes(request.status?.toLowerCase()) && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Completed"
                            onClick={() => handleStatusUpdate(request._id, "done")}
                          >
                            <FiCheckCircle size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Cancel Request"
                            onClick={() => handleStatusUpdate(request._id, "canceled")}
                          >
                            <FiXCircle size={18} />
                          </button>
                        </>
                      )}

                      <Link
                        to={`/dashboard/donation-requests/${request._id}`}
                        title="View Details"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEye size={18} />
                      </Link>

                      {["pending", "inprogress"].includes(request.status?.toLowerCase()) && (
                        <Link
                          to={`/dashboard/edit-donation-request/${request._id}`}
                          title="Edit Request"
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                      )}

                     {["pending", "inprogress", "done", "canceled"].includes(request.status?.toLowerCase()) && (
  <button
    onClick={() => handleDelete(request._id)}
    title="Delete Request"
    className="text-red-600 hover:text-red-800"
  >
    <FiTrash2 size={18} />
  </button>
)}


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
            <Link
              to="/dashboard/donation-requests"
              className="text-red-600 font-semibold hover:underline"
            >
              View My All Requests
            </Link>
          </div> */}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You have no donation requests yet.
        </p>
      )}
    </div>
  );
};

export default MyDonationRequests;
