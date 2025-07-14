import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import {
  Heart,
  Menu,
  X,
  Bell,
  BookOpen,
  DollarSign,
  LogIn,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logoutUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  const avatarUrl =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=random`;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-red-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white fill-current" />
            </div>
            <Link to="/" className="text-2xl font-bold text-red-600">
              RedAid
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium"
            >
              <Heart className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/donation-requests"
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium"
            >
              <Bell className="h-4 w-4" />
              <span>Donation Requests</span>
            </Link>
            <Link
              to="/blogs"
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium"
            >
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </Link>
            <Link
              to="/funding"
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium"
            >
              <DollarSign className="h-4 w-4" />
              <span>Funding</span>
            </Link>

            {!user ? (
              <button
                onClick={goToLogin}
                className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition duration-300"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 hover:text-red-600 transition focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-red-400"
                  />
                  <span className="text-gray-700 font-medium">
                    {user.displayName || "User"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white bg-opacity-30 backdrop-blur-md border border-red-300 rounded-xl shadow-lg z-50
                    animate-fade-in-up
                    "
                    style={{ animationDuration: "200ms" }}
                  >
                    <Link
                      to={user?.role === "admin" ? "/dashboard/admin" : "/dashboard"}
                      className="flex items-center gap-2 px-5 py-3 text-gray-800 hover:bg-red-50 rounded-lg transition font-semibold"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5 text-red-600" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-5 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-red-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/donation-requests"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="h-4 w-4" />
                <span>Donation Requests</span>
              </Link>
              <Link
                to="/blogs"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>
              <Link
                to="/funding"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <DollarSign className="h-4 w-4" />
                <span>Funding</span>
              </Link>

              {!user ? (
                <button
                  onClick={() => {
                    goToLogin();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600 block px-3 py-2 rounded-md text-base font-medium mt-2 w-full"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              ) : (
                <>
                  <div className="flex items-center space-x-3 px-3 py-3">
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-red-400"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={user?.role === "admin" ? "/dashboard/admin" : "/dashboard"}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(5px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation-name: fade-in-up;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
