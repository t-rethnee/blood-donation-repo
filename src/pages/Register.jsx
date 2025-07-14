import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [districtsData, setDistrictsData] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);

  const navigate = useNavigate();
  const { createUser, updateUserProfile } = useContext(AuthContext);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then(setDistrictsData)
      .catch((err) => console.error("Error loading districts:", err));

    fetch("/data/Upazilas.json")
      .then((res) => res.json())
      .then(setUpazilasData)
      .catch((err) => console.error("Error loading upazilas:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadAvatarToImageBB = async () => {
    if (!avatarFile) return "";
    const apiKey = import.meta.env.VITE_image_upload_key;
    const formData = new FormData();
    formData.append("image", avatarFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Image upload error:", error);
      return "";
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const {
      email,
      name,
      bloodGroup,
      district,
      upazila,
      password,
      confirmPassword,
    } = formData;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const result = await createUser(email, password);
      const avatarUrl = await uploadAvatarToImageBB();
      const finalAvatar =
        avatarUrl || "https://i.ibb.co/2nJpM6v/default-avatar.png";

      await updateUserProfile({
        displayName: name,
        photoURL: finalAvatar,
      });

      const userInfo = {
        uid: result.user.uid,
        email,
        name,
        bloodGroup,
        district,
        upazila,
        role: "donor",
        status: "active",
        avatar: finalAvatar,
      };

      await axios.post("http://localhost:5000/api/register", userInfo);

      Swal.fire({
        title: "Registration Successful!",
        text: "Please continue.",
        icon: "success",
        confirmButtonColor: "#d33",
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl sm:px-10">
      <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center">
        Register as Donor
      </h2>

      <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-red-400 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-red-400 outline-none"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-red-400 outline-none md:col-span-2"
        />

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-red-400 outline-none"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-red-400 outline-none"
        >
          <option value="">Select District</option>
          {districtsData.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="upazila"
          value={formData.upazila}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-red-400 outline-none"
        >
          <option value="">Select Upazila</option>
          {upazilasData.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Password Field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10 focus:ring-2 focus:ring-red-400 outline-none"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10 focus:ring-2 focus:ring-red-400 outline-none"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm md:col-span-2">{error}</p>
        )}

        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 md:col-span-2"
        >
          Register
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-red-600 underline hover:text-red-800">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
