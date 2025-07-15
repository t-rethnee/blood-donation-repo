import React, { useState, useContext } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../provider/AuthProvider";

const limit = 10;

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  inprogress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
};

const fetchRequests = async ({ queryKey }) => {
  const [_key, { status, page }] = queryKey;
  const params = {
    status: status === "all" ? undefined : status,
    page,
    limit,
  };
  const res = await axios.get("http://localhost:5000/api/donation-requests", { params });
  return res.data;
};

const AllDonationRequests = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // React Query useQuery with new single object syntax
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["donationRequests", { status: statusFilter, page: currentPage }],
    queryFn: fetchRequests,
    enabled: !authLoading,
    keepPreviousData: true,
  });

  // React Query useMutation with new single object syntax
  const mutation = useMutation({
    mutationFn: ({ id, newStatus }) =>
      axios.patch(`http://localhost:5000/api/donation-requests/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donationRequests"] });
    },
    onError: (err) => {
      console.error("Failed to update status:", err);
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-16 h-16 border-4 border-dashed border-red-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Error fetching donation requests: {error.message}
      </div>
    );
  }

  const donationRequests = data?.donationRequests || [];
  const totalPages = data?.totalPages || 1;

  const handleStatusChange = (id, newStatus) => {
    mutation.mutate({ id, newStatus });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Blood Donation Requests
          <span className="block w-20 h-1 bg-red-500 mt-2"></span>
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-red-50 to-red-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Recipient
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Blood Group
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Status
                </th>
                {user?.role === "volunteer" && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donationRequests.length > 0 ? (
                donationRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                          {req.recipientName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {req.recipientName}
                          </div>
                          <div className="text-sm text-gray-500">{req.recipientPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{req.recipientUpazila}</div>
                      <div className="text-sm text-gray-500">{req.recipientDistrict}</div>
                    </td>
                    <td className="px-6 py-4">
                      {req.donationDate ? new Date(req.donationDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4">{req.donationTime || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full capitalize ${
                          statusColors[req.status.toLowerCase()] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    {user?.role === "volunteer" && (
                      <td className="px-6 py-4">
                        {["done", "canceled"].includes(req.status.toLowerCase()) ? (
                          <span className="text-gray-400 text-sm">No action</span>
                        ) : (
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusChange(req._id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md"
                          >
                            <option value="" disabled>
                              Update Status
                            </option>
                            {req.status.toLowerCase() === "pending" && (
                              <option value="inprogress">Start Progress</option>
                            )}
                            {req.status.toLowerCase() === "inprogress" && (
                              <>
                                <option value="done">Mark as Done</option>
                                <option value="canceled">Cancel</option>
                              </>
                            )}
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={user?.role === "volunteer" ? 7 : 6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No donation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 text-sm rounded-md ${
                currentPage === i + 1
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllDonationRequests;
