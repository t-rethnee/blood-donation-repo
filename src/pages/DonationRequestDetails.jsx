import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";
import {
  FiUser,
  FiDroplet,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiHome,
  FiMessageSquare,
  FiAlertCircle,
  FiCheck,
  FiX
} from "react-icons/fi";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`https://blood-donation-server-iota-flame.vercel.app/api/donation-requests/${id}`)
      .then((res) => setRequest(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDonateClick = () => {
    setShowModal(true);
  };

  const handleConfirmDonation = async () => {
    try {
      const updateData = {
        status: "inprogress",
        donorName: user.displayName || user.name,
        donorEmail: user.email,
      };

      const res = await axios.put(
        `https://blood-donation-server-iota-flame.vercel.app/api/donation-requests/${id}`,
        updateData
      );

      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        Swal.fire({
          title: "Success!",
          text: "Donation confirmed!",
          icon: "success",
          confirmButtonColor: "#ef4444",
        });
        setRequest((prev) => ({ ...prev, ...updateData, status: "inprogress" }));
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to confirm donation",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (!request) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (request.status?.toLowerCase()) {
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <FiAlertCircle className="mr-1.5" /> Pending
          </span>
        );
      case 'inprogress':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <FiClock className="mr-1.5" /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <FiCheck className="mr-1.5" /> Completed
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {request.status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <FiDroplet className="mr-2" /> Donation Request Details
          </h1>
          <div className="mt-2 flex items-center">
            {getStatusBadge()}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg text-red-600 mr-4">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Recipient</h3>
                  <p className="text-lg font-semibold text-gray-900">{request.recipientName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-4">
                  <FiHome className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Hospital</h3>
                  <p className="text-lg font-semibold text-gray-900">{request.hospitalName}</p>
                  <p className="text-sm text-gray-600 mt-1">{request.fullAddress}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mr-4">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {request.recipientUpazila}, {request.recipientDistrict}
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg text-green-600 mr-4">
                  <FiDroplet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Blood Group</h3>
                  <p className="text-lg font-semibold text-gray-900">{request.bloodGroup}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mr-4">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Donation Date</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(request.donationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-4">
                  <FiClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Donation Time</h3>
                  <p className="text-lg font-semibold text-gray-900">{request.donationTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional message */}
          {request.requestMessage && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-gray-500 mb-2">
                <FiMessageSquare className="mr-2" />
                <h3 className="font-medium">Additional Message</h3>
              </div>
              <p className="text-gray-700">{request.requestMessage}</p>
            </div>
          )}

          {/* Donor Info */}
          {request.status === "inprogress" && request.donorName && request.donorEmail && (
            <div className="mt-6 bg-green-50 rounded-lg p-4">
              <div className="flex items-center text-green-600 mb-2">
                <FiUser className="mr-2" />
                <h3 className="font-medium">Donor Info</h3>
              </div>
              <p className="text-gray-800"><strong>Name:</strong> {request.donorName}</p>
              <p className="text-gray-800"><strong>Email:</strong> {request.donorEmail}</p>
            </div>
          )}

          {/* Action Button */}
          {request.status === "pending" && (
            <div className="mt-8 text-center">
              <button
                onClick={handleDonateClick}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 inline-flex items-center"
              >
                <FiDroplet className="mr-2" /> I Want to Donate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-red-500 p-4 text-white">
              <h3 className="text-xl font-semibold flex items-center">
                <FiAlertCircle className="mr-2" /> Confirm Donation
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name</label>
                  <div className="flex items-center bg-gray-100 rounded-lg p-3">
                    <FiUser className="text-gray-500 mr-2" />
                    <span>{user.displayName || user.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donor Email</label>
                  <div className="flex items-center bg-gray-100 rounded-lg p-3">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>{user.email}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  By confirming, you agree that you will donate blood for this request.
                </p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FiX className="mr-1.5" /> Cancel
                </button>
                <button
                  onClick={handleConfirmDonation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
                >
                  <FiCheck className="mr-1.5" /> Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;
