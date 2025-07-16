import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FiEdit2, FiSave } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

const AdminProfile = () => {
  const { user, firebaseUser } = useContext(AuthContext);

  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    district: "",
    upazila: "",
    bloodGroup: "",
  });
  const [hasChanged, setHasChanged] = useState(false);
  const originalData = useRef({});

  const fetchAdminData = async () => {
    if (!firebaseUser) {
      throw new Error("No authenticated Firebase user");
    }
    const token = await firebaseUser.getIdToken();

    const res = await axios.get(
      `https://blood-donation-server-iota-flame.vercel.app/api/users/${user.email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const {
    data: adminData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminData", user?.email],
    queryFn: fetchAdminData,
    enabled: !!user?.email && !!firebaseUser,
    onSuccess: (userData) => {
      setFormData({
        name: userData.name || "",
        avatar: userData.avatar || "",
        district: userData.district || "",
        upazila: userData.upazila || "",
        bloodGroup: userData.bloodGroup || "",
      });
      originalData.current = {
        name: userData.name || "",
        avatar: userData.avatar || "",
        district: userData.district || "",
        upazila: userData.upazila || "",
        bloodGroup: userData.bloodGroup || "",
      };
      setHasChanged(false);
    },
  });

  // Early return for loading, error and no data states
  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading profile...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading profile: {error.message || "Unknown error"}
      </div>
    );
  }

  if (!adminData) {
    return <div className="p-6 text-center text-gray-600">No profile data found.</div>;
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      const changed = Object.keys(newData).some(
        (key) => newData[key] !== originalData.current[key]
      );
      setHasChanged(changed);
      return newData;
    });
  };

  const handleEditClick = () => {
    setEditable(true);
    Swal.fire({
      icon: "info",
      title: "Edit mode activated",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleUpdate = async () => {
    try {
      if (!firebaseUser) throw new Error("No authenticated Firebase user");

      const token = await firebaseUser.getIdToken();

      await axios.put(
        `https://blood-donation-server-iota-flame.vercel.app/api/users/${user.email}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      originalData.current = { ...formData };
      setEditable(false);
      setHasChanged(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Admin Profile
        </h2>
        {!editable ? (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base"
          >
            <FiEdit2 size={18} /> Edit
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            disabled={!hasChanged}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition text-sm sm:text-base
              ${hasChanged
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-green-300 text-white cursor-not-allowed"
              }`}
          >
            <FiSave size={18} /> Save Changes
          </button>
        )}
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        {/* Avatar */}
        <div className="col-span-1 sm:col-span-2 flex justify-center mb-4 sm:mb-8">
          <img
            src={formData.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-blue-500 object-cover shadow-md"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled={!editable}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base
              ${editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
          />
        </div>

        {/* Email (non-editable) */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg bg-gray-100 cursor-not-allowed text-gray-600 text-sm sm:text-base"
          />
        </div>

        {/* District */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            disabled={!editable}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base
              ${editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
          />
        </div>

        {/* Upazila */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">Upazila</label>
          <input
            type="text"
            name="upazila"
            value={formData.upazila}
            disabled={!editable}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base
              ${editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            disabled={!editable}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base
              ${editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
          >
            <option value="">Select</option>
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

        {/* Avatar URL */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">Avatar URL</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            disabled={!editable}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base
              ${editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
