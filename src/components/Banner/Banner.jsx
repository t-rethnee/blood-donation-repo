import React from "react";
import { useNavigate } from "react-router";

const Banner = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/register");
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <div className="relative w-full min-h-screen md:h-[32rem] bg-gradient-to-r from-red-900 via-red-700 to-red-800 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-32 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-16 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-20 w-28 h-28 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Geometric Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent transform rotate-45 translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/5 to-transparent transform -rotate-45 -translate-x-24 translate-y-24"></div>
      </div>

      {/* Floating Blood Drops */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-20 w-2 h-2 bg-red-300 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-32 right-40 w-3 h-3 bg-red-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-24 left-1/3 w-2 h-2 bg-red-300 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-3 h-3 bg-red-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-10 h-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-0">
        {/* Left Side - Text Content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          {/* Badge
          <div className="inline-flex items-center justify-center md:justify-start bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white/90 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            রক্তদান করুন, জীবন বাঁচান
          </div> */}

          {/* Main Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              Give Blood,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-pink-200 to-red-100 animate-pulse">
                Save Lives
              </span>
              <span className="text-3xl sm:text-4xl ml-2 animate-pulse">❤️</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-red-100 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Join thousands of heroes making a difference. Your donation can save up to 3 lives and bring hope to families in need.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={handleJoinClick}
              className="group relative bg-white text-red-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center">
                <span className="mr-2 text-xl">🩸</span>
                Join as Donor
              </span>
            </button>

            <button
              onClick={handleSearchClick}
              className="group relative bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center">
                <span className="mr-2 text-xl">🔍</span>
                Find Donors
              </span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center md:justify-start items-center space-x-6 md:space-x-8 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-sm text-red-200 uppercase tracking-wide">Active Donors</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-red-200 uppercase tracking-wide">Lives Saved</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-red-200 uppercase tracking-wide">Emergency</div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Elements */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Main Visual Circle */}
          <div className="relative">
            <div className="w-60 sm:w-72 md:w-80 h-60 sm:h-72 md:h-80 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-36 sm:w-44 md:w-48 h-36 sm:h-44 md:h-48 bg-white/30 rounded-full flex items-center justify-center">
                  <div className="text-6xl sm:text-7xl md:text-8xl animate-pulse">🩸</div>
                </div>
              </div>
            </div>

            {/* Floating Blood Type Pills */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white font-bold animate-bounce">
                A+
              </div>
            </div>
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white font-bold animate-bounce" style={{ animationDelay: '0.5s' }}>
                B+
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white font-bold animate-bounce" style={{ animationDelay: '1s' }}>
                O+
              </div>
            </div>
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white font-bold animate-bounce" style={{ animationDelay: '1.5s' }}>
                AB+
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-red-900 to-transparent"></div>
    </div>
  );
};

export default Banner;
