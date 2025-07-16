import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../provider/AuthProvider";


import { FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";

// Custom Blood Drop Loader
const BloodDropLoader = () => {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="animate-bounce">
        <svg
          className="w-16 h-16 text-red-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C12 2 5 10 5 14.5C5 18.09 8.13 21 12 21C15.87 21 19 18.09 19 14.5C19 10 12 2 12 2Z" />
        </svg>
      </div>
    </div>
  );
};

const VolunteerDashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    users: 0,
    funds: 0,
    donations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, fundRes, donationRes] = await Promise.all([
          axios.get("https://blood-donation-server-iota-flame.vercel.app/api/admin/stats/donors-count"),
          axios.get("https://blood-donation-server-iota-flame.vercel.app/api/admin/stats/funds/simple-sum"),
          axios.get("https://blood-donation-server-iota-flame.vercel.app/api/admin/stats/donation-requests"),
        ]);

        setStats({
          users: userRes.data.count || 0,
          funds: fundRes.data.total || 0,
          donations: donationRes.data.count || 0,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load stats", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <BloodDropLoader />;

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-red-600 mb-2">
          Welcome, {user?.displayName || user?.email || "Volunteer"} 🙌
        </h2>
        <p className="text-gray-600 text-sm">
          Here's your dashboard overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition">
          <FaUsers className="text-4xl text-blue-600" />
          <div>
            <h3 className="text-2xl font-bold">{stats.users}</h3>
            <p className="text-gray-600">Total Donors</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition">
          <FaHandHoldingUsd className="text-4xl text-green-600" />
          <div>
            <h3 className="text-2xl font-bold">${stats.funds}</h3>
            <p className="text-gray-600">Total Funding</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition">
          <FaTint className="text-4xl text-red-600" />
          <div>
            <h3 className="text-2xl font-bold">{stats.donations}</h3>
            <p className="text-gray-600">Blood Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboardHome;
