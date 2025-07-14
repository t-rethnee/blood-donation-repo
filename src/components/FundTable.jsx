import React, { useState } from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <svg
        className="animate-pulse w-16 h-16 text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.5C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="ml-4 text-red-600 font-semibold text-lg">Loading funds...</span>
    </div>
  );
};

const FundTable = ({ funds }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!funds || funds.length === 0) {
    // Show loader if no data yet or empty
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6 bg-white rounded-xl shadow-lg">
        <Loader />
      </div>
    );
  }

  const totalPages = Math.ceil(funds.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentFunds = funds.slice(firstIndex, lastIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Funding History</h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-green-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentFunds.map((fund) => (
              <tr key={fund._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-800">{fund.name || "Unknown"}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{fund.email || "Unknown"}</td>
                <td className="px-6 py-4 text-sm font-medium text-green-600">${fund.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {fund.createdAt ? new Date(fund.createdAt).toLocaleString() : "Unknown Date"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-white font-semibold transition ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white font-semibold transition ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FundTable;
