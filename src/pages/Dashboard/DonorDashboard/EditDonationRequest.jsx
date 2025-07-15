import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchDonationRequest = async (id) => {
  const res = await axios.get(`http://localhost:5000/api/donation-requests/${id}`);
  return res.data;
};

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch donation request data using React Query v5 syntax
  const {
    data: requestData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["donationRequest", id],
    queryFn: () => fetchDonationRequest(id),
    // refetchOnWindowFocus: false, // optional
  });

  // Local state for form inputs, initialized once data is fetched
  const [formState, setFormState] = useState(null);

  // Sync local formState when requestData loads
  React.useEffect(() => {
    if (requestData) {
      setFormState(requestData);
    }
  }, [requestData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/donation-requests/${id}`,
        formState
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Donation request updated successfully", "success");
        // Invalidate the query so data is fresh next time
        queryClient.invalidateQueries({ queryKey: ["donationRequest", id] });
        navigate("/dashboard/my-donation-requests");
      } else {
        Swal.fire("No Changes", "No updates were made", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update donation request", "error");
    }
  };

  if (isLoading || !formState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        Error loading donation request: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Edit Donation Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formState.recipientName || ""}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Recipient District</label>
            <input
              type="text"
              name="recipientDistrict"
              value={formState.recipientDistrict || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Recipient Upazila</label>
            <input
              type="text"
              name="recipientUpazila"
              value={formState.recipientUpazila || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={formState.hospitalName || ""}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="donationDate"
              value={formState.donationDate || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              name="donationTime"
              value={formState.donationTime || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            value={formState.bloodGroup || ""}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A−">A−</option>
            <option value="B+">B+</option>
            <option value="B−">B−</option>
            <option value="AB+">AB+</option>
            <option value="AB−">AB−</option>
            <option value="O+">O+</option>
            <option value="O−">O−</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            name="requestMessage"
            value={formState.requestMessage || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
        >
          Update Donation Request
        </button>
      </form>
    </div>
  );
};

export default EditDonationRequest;
