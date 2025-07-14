import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaTint, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Search = () => {
  const [filters, setFilters] = useState({
    bloodGroup: "",
    district: "",
    upazila: ""
  });

  const [results, setResults] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  useEffect(() => {
    // Fetch districts
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Failed to load districts:", err));

    // Fetch upazilas
    fetch("/data/Upazilas.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(data))
      .catch((err) => console.error("Failed to load upazilas:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
  const { bloodGroup, district, upazila } = filters;
  console.log("Filters on Search:", filters);


  // Validation check
  if (!bloodGroup || !district || !upazila) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Search",
      text: "Please select blood group, district, and upazila before searching.",
      confirmButtonColor: "#d33"
    });
    return;
  }

  try {
    const response = await fetch(
  `http://localhost:5000/api/donors?bloodGroup=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(district)}&upazila=${encodeURIComponent(upazila)}`
);

    const data = await response.json();

    if (data.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Donors Found",
        text: "No donors match the selected criteria. Please try again with different filters.",
        confirmButtonColor: "#3085d6"
      });
    }

    setResults(data);
  } catch (error) {
    console.error("Error fetching donor data:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while fetching donor data.",
      confirmButtonColor: "#d33"
    });
    setResults([]);
  }
};



  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Find Blood Donors</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {/* Blood Group */}
        <select
          name="bloodGroup"
          value={filters.bloodGroup}
          onChange={handleChange}
          className="p-3 border rounded"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        {/* District */}
        <select
          name="district"
          value={filters.district}
          onChange={handleChange}
          className="p-3 border rounded"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.id} value={district.name}>{district.name}</option>
          ))}
        </select>

        {/* Upazila */}
        <select
          name="upazila"
          value={filters.upazila}
          onChange={handleChange}
          className="p-3 border rounded"
        >
          <option value="">Select Upazila</option>
          {upazilas.map((upazila) => (
            <option key={upazila.id} value={upazila.name}>{upazila.name}</option>
          ))}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {results.length > 0 ? (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {results.map((donor) => (
      <div
        key={donor._id}
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5 flex flex-col items-center text-center"
      >
        <img
          src={donor.avatar}
          alt={donor.name}
          className="w-24 h-24 rounded-full border-4 border-red-500 object-cover mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{donor.name}</h3>
        <p className="text-red-600 font-bold flex items-center justify-center gap-1 mb-2">
          <FaTint /> {donor.bloodGroup}
        </p>
        <p className="text-gray-600 flex items-center justify-center gap-1">
          <FaMapMarkerAlt /> {donor.upazila}, {donor.district}
        </p>
        <p className="text-gray-500 mt-2 flex items-center justify-center gap-1 text-sm break-all">
          <FaEnvelope /> {donor.email}
        </p>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-gray-500 mt-8">No donors found. Please search.</p>
)}
    </div>
  );
};

export default Search;
