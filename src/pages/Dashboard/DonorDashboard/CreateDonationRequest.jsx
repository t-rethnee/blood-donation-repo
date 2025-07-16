import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  // ✅ Fetch user status using React Query
  const { data: userStatus, isLoading } = useQuery({
    queryKey: ["userStatus", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `https://blood-donation-server-iota-flame.vercel.app/api/users/${user.email}`
      );
      return res.data.status; // expected: 'active' or 'blocked'
    },
  });

  // ✅ Fetch district & upazila data
  useEffect(() => {
    fetch("/data/districts.json")
      .then(res => res.json())
      .then(districtData => {
        setDistricts(districtData.map(d => d.name));
        return fetch("/data/Upazilas.json");
      })
      .then(res2 => res2.json())
      .then(upazilaData => {
        setAllUpazilas(upazilaData.map(u => u.name).sort());
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "recipientDistrict") {
      setFormData((prev) => ({
        ...prev,
        recipientDistrict: value,
        recipientUpazila: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      requesterName: user.displayName,
      requesterEmail: user.email,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      const res = await axios.post(
        "https://blood-donation-server-iota-flame.vercel.app/api/donation-requests",
        requestData
      );
      if (res.data.insertedId) {
        Swal.fire(
          "Success!",
          "Donation request submitted successfully.",
          "success"
        );
        setFormData({
          recipientName: "",
          recipientDistrict: "",
          recipientUpazila: "",
          hospitalName: "",
          fullAddress: "",
          bloodGroup: "",
          donationDate: "",
          donationTime: "",
          requestMessage: "",
        });
      }
    } catch (error) {
      console.error("Error submitting donation request:", error);
      Swal.fire("Error", "Failed to submit donation request.", "error");
    }
  };

  // ✅ Loading while checking user status
  if (isLoading) {
    return (
      <div className="text-center py-8 text-lg font-medium text-gray-600">
        Checking user access...
      </div>
    );
  }

  // ✅ Blocked user view
  if (userStatus === "blocked") {
    return (
      <div className="max-w-xl mx-auto text-center mt-10 p-6 bg-red-50 border border-red-200 rounded shadow text-red-700">
        <h2 className="text-2xl font-bold mb-2">Access Denied ❌</h2>
        <p>Your account is currently <strong>blocked</strong> and you are not allowed to create donation requests.</p>
        <p className="mt-2">Please contact the administrator if you believe this is a mistake.</p>
      </div>
    );
  }

  // ✅ Main form
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-4">
      <h2 className="text-2xl font-bold mb-4">Create Donation Request</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label>Requester Name</label>
          <input
            value={user.displayName}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Requester Email</label>
          <input
            value={user.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Recipient Name</label>
          <input
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Recipient District</label>
          <select
            name="recipientDistrict"
            value={formData.recipientDistrict}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select District</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Recipient Upazila</label>
          <select
            name="recipientUpazila"
            value={formData.recipientUpazila}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Upazila</option>
            {allUpazilas.map((upa) => (
              <option key={upa} value={upa}>
                {upa}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Hospital Name</label>
          <input
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Full Address</label>
          <input
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Donation Date</label>
          <input
            type="date"
            name="donationDate"
            value={formData.donationDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Donation Time</label>
          <input
            type="time"
            name="donationTime"
            value={formData.donationTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label>Request Message</label>
          <textarea
            name="requestMessage"
            value={formData.requestMessage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
