// components/Spinner.jsx
import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-red-400 animate-spin"></div>
        <div className="absolute inset-3 rounded-full border-4 border-solid border-white"></div>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-red-600 font-semibold">Loading</span>
      </div>
    </div>
  );
};

export default Spinner;
