import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ITEMS_PER_PAGE = 5;

const VolunteerBloodDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/volunteer/donation-requests", {
        params: { status: statusFilter !== "all" ? statusFilter : undefined },
      });
      setRequests(res.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load donation requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      const body = { status: newStatus };
      if (newStatus === "inprogress") {
        if (!user?.name || !user?.email) {
          toast.error("Donor info missing for updating status.");
          setUpdatingId(null);
          return;
        }
        body.donorName = user.name;
        body.donorEmail = user.email;
      }

      await axiosSecure.patch(`/donation-requests/${id}/status`, body);

      Swal.fire({
        title: "Success!",
        text: "Status updated successfully",
        icon: "success",
        confirmButtonColor: "#d33",
      });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? {
                ...req,
                status: newStatus,
                donorName: body.donorName || null,
                donorEmail: body.donorEmail || null,
              }
            : req
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || authLoading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-red-600 font-semibold text-lg">Loading requests...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-red-600">Blood Donation Requests</h2>

      {/* Status filter */}
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="statusFilter" className="font-medium text-gray-700">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-red-500 text-white uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="p-3">Recipient</th>
              <th className="p-3">Blood Group</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((req, idx) => (
                <tr key={req._id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-3">{req.recipientName}</td>
                  <td className="px-4 py-3 font-semibold">{req.bloodGroup}</td>
                  <td className="px-4 py-3">
                    {req.donationDate
                      ? new Date(req.donationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 capitalize">{req.status}</td>
                  <td className="px-4 py-3">
                    {["done", "canceled"].includes(req.status) ? (
                      <span className="text-gray-400 italic">No changes allowed</span>
                    ) : user?.role === "volunteer" ? (
                      updatingId === req._id ? (
                        <span className="italic text-gray-400">Updating...</span>
                      ) : (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) handleStatusChange(req._id, val);
                            e.target.value = "";
                          }}
                          className="border border-gray-300 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          <option value="" disabled>
                            Change Status
                          </option>
                          {req.status === "pending" && (
                            <option value="inprogress">Start Progress</option>
                          )}
                          {req.status === "inprogress" && (
                            <>
                              <option value="done">Mark Done</option>
                              <option value="canceled">Cancel</option>
                            </>
                          )}
                        </select>
                      )
                    ) : (
                      <span className="text-gray-400 italic">Volunteers only</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-gray-500 italic">
                  No donation requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white shadow"
            }`}
          >
            <ArrowLeft size={16} />
            Prev
          </button>
          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white shadow"
            }`}
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VolunteerBloodDonationRequests;
