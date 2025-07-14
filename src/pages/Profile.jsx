import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit2, FiSave, FiUser, FiMail, FiMapPin, FiDroplet } from "react-icons/fi";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "https://i.ibb.co/2nJpM6v/default-avatar.png");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    district: "",
    upazila: "",
    bloodGroup: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  // Fetch districts and upazilas from JSON files
  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Failed to load districts:", err));

    fetch("/data/Upazilas.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(data))
      .catch((err) => console.error("Failed to load upazilas:", err));
  }, []);

  // Load user data from backend
  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/api/users/${user.email}`)
        .then((res) => {
          const backendAvatar = res.data.avatar;
          setAvatarUrl(backendAvatar || user.photoURL || "https://i.ibb.co/2nJpM6v/default-avatar.png");

          const data = {
            name: res.data.name || "",
            email: res.data.email || user.email,
            district: res.data.district || "",
            upazila: res.data.upazila || "",
            bloodGroup: res.data.bloodGroup || "",
          };
          setFormData(data);
          setOriginalData(data);
        })
        .catch((err) => {
          console.error("Failed to load user data:", err);
          setFormData((prev) => ({ ...prev, email: user.email }));
          setAvatarUrl(user.photoURL || "https://i.ibb.co/2nJpM6v/default-avatar.png");
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleEdit = () => {
    setIsEditing(true);
    Swal.fire({
      icon: "info",
      title: "Edit Mode Activated",
      text: "You can now update your profile",
      showConfirmButton: false,
      timer: 1500,
      background: '#f8fafc',
      iconColor: '#6366f1'
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user.email}`, formData);
      setOriginalData(formData);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        showConfirmButton: false,
        timer: 1500,
        background: '#f8fafc',
        iconColor: '#10b981'
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Please try again",
        background: '#f8fafc',
        iconColor: '#ef4444'
      });
    }
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-red-50 text-red-700 border-red-200',
      'A-': 'bg-red-100 text-red-800 border-red-300',
      'B+': 'bg-blue-50 text-blue-700 border-blue-200',
      'B-': 'bg-blue-100 text-blue-800 border-blue-300',
      'O+': 'bg-green-50 text-green-700 border-green-200',
      'O-': 'bg-green-100 text-green-800 border-green-300',
      'AB+': 'bg-purple-50 text-purple-700 border-purple-200',
      'AB-': 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[bloodGroup] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Profile Information</h1>
          {!isEditing ? (
            <button onClick={handleEdit} className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
              <FiEdit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button onClick={handleSave} disabled={!isChanged} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${isChanged ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"}`}>
              <FiSave className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-white shadow-md object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://i.ibb.co/2nJpM6v/default-avatar.png";
                }}
              />
            </div>
            {formData.bloodGroup && (
              <div className={`${getBloodGroupColor(formData.bloodGroup)} px-4 py-1.5 rounded-full font-medium border flex items-center space-x-2`}>
                <FiDroplet className="w-4 h-4" />
                <span>{formData.bloodGroup}</span>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                <input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'} text-gray-800`} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input value={formData.email} disabled className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800" />
              </div>
            </div>

            {/* District & Upazila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* District */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">District</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                  <select name="district" value={formData.district} onChange={handleChange} disabled={!isEditing} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'} text-gray-800`}>
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upazila */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-600">Upazila</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                  <select name="upazila" value={formData.upazila} onChange={handleChange} disabled={!isEditing} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'} text-gray-800`}>
                    <option value="">Select Upazila</option>
                    {upazilas.map((u) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">Blood Group</label>
              <div className="relative">
                <FiDroplet className="absolute left-3 top-3.5 text-gray-400" />
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditing} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'} text-gray-800`}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
