import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const VolunteerProfile = () => {
  const { user, firebaseUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    district: "",
    upazila: "",
    bloodGroup: "",
  });


  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  console.log("JWT:", localStorage.getItem("access-token")); // should show the token
}, []);

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/users/${user.email}`);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        avatar: res.data.avatar || "",
        district: res.data.district || "",
        upazila: res.data.upazila || "",
        bloodGroup: res.data.bloodGroup || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (user?.email && firebaseUser) {
    fetchProfile();
  }
}, [user?.email, firebaseUser, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // পরিবর্তন তখনই করবেন যখন isEditing true
    if (isEditing) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await axiosSecure.patch(`/users/${user.email}`, {
        name: formData.name,
        avatar: formData.avatar,
        district: formData.district,
        upazila: formData.upazila,
        bloodGroup: formData.bloodGroup,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-lg font-medium">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-red-600">My Profile</h2>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <img
          src={formData.avatar || "https://i.ibb.co/rpG7ZnP/avatar-placeholder.png"}
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-red-400 object-cover"
        />
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            disabled={!isEditing}
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              isEditing ? "border-red-400" : "border-gray-300"
            } rounded-md shadow-sm`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email (not editable)</label>
          <input
            type="email"
            name="email"
            disabled
            value={formData.email}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Avatar URL</label>
          <input
            type="text"
            name="avatar"
            disabled={!isEditing}
            value={formData.avatar}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              isEditing ? "border-red-400" : "border-gray-300"
            } rounded-md shadow-sm`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">District</label>
          <input
            type="text"
            name="district"
            disabled={!isEditing}
            value={formData.district}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              isEditing ? "border-red-400" : "border-gray-300"
            } rounded-md shadow-sm`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Upazila</label>
          <input
            type="text"
            name="upazila"
            disabled={!isEditing}
            value={formData.upazila}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              isEditing ? "border-red-400" : "border-gray-300"
            } rounded-md shadow-sm`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Blood Group</label>
          <select
            name="bloodGroup"
            disabled={!isEditing}
            value={formData.bloodGroup}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              isEditing ? "border-red-400" : "border-gray-300"
            } rounded-md shadow-sm`}
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
      </form>
    </div>
  );
};

export default VolunteerProfile;
