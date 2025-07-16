import React, { useContext } from "react";
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
  FiXCircle,
} from "react-icons/fi";

import { useQuery } from "@tanstack/react-query";

const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // React Query fetcher function
  const fetchRequests = async () => {
    if (!user?.email) return [];
    const response = await axios.get(
      `https://blood-donation-server-iota-flame.vercel.app/api/donation-requests/by-donor/${user.email}`
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("API returned non-array data:", response.data);
      return [];
    }
  };

  // useQuery with v5 syntax - pass a single object with keys: queryKey, queryFn, enabled
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["donationRequests", user?.email],
    queryFn: fetchRequests,
    enabled: !!user?.email,
  });

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
        refetch();
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
          refetch();
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

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500 font-semibold">
        Loading your donation requests...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        Error loading donation requests.
      </div>
    );
  }

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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-700 uppercase tracking-wider min-w-[140px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.slice(0, 3).map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {req.recipientName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {req.recipientDistrict}, {req.recipientUpazila}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {req.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {req.time}
                    </td>
                    <td
                      className={`px-3 py-1 text-center text-sm font-semibold rounded-md ${getBloodGroupColor(
                        req.bloodGroup
                      )}`}
                    >
                      {req.bloodGroup}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                      {/* Action buttons */}
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit-donation-request/${req._id}`)
                        }
                        title="Edit Request"
                        className="p-1 rounded hover:bg-gray-200 text-gray-700"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(req._id)}
                        title="Delete Request"
                        className="p-1 rounded hover:bg-red-100 text-red-600"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/dashboard/donation-requests/${req._id}`)
                        }
                        title="View Details"
                        className="p-1 rounded hover:bg-gray-200 text-gray-700"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>

                      {/* For in-progress status, allow marking done or canceled */}
                      {req.status?.toLowerCase() === "inprogress" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(req._id, "done")}
                            title="Mark as Done"
                            className="p-1 rounded hover:bg-green-100 text-green-600"
                          >
                            <FiCheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id, "canceled")}
                            title="Cancel Request"
                            className="p-1 rounded hover:bg-gray-200 text-gray-500"
                          >
                            <FiXCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-100 text-right">
            <Link
              to="/dashboard/my-donation-requests"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              View My All Requests
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-16">
          <p>You have not submitted any donation requests yet.</p>
          <Link
            to="/dashboard/donation-requests/create"
            className="mt-4 inline-block px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Create Your First Donation Request
          </Link>
        </div>
      )}
    </div>
  );
};

export default DonorHome;
