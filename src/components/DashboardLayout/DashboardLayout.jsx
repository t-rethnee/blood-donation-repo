import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider"; // AuthContext ঠিক এই পাথে ইম্পোর্ট করো
import { 
  FiHome, FiUser, FiPlusCircle, FiList, 
  FiUsers, FiClipboard, FiEdit2, FiMenu, FiX,
  FiDroplet, FiCalendar, FiFileText, FiSettings,
  FiBell, FiSearch
} from "react-icons/fi";

const DashboardLayout = () => {
const { user: authUser, loading, firebaseUser } = useContext(AuthContext);
 // Firebase auth ইউজার ও লোডিং নিলাম
  const [user, setUser] = useState(null); // Backend থেকে সম্পূর্ণ ইউজার ডাটা
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
  if (!authUser?.email || !firebaseUser) {
    setUser(null);
    return;
  }

  async function fetchUser() {
    try {
      const token = await firebaseUser.getIdToken();
      console.log("Firebase ID Token:", token);

      const res = await fetch(`https://blood-donation-server-iota-flame.vercel.app/api/users/${authUser.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user data");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  }

  fetchUser();
}, [authUser, firebaseUser]);



  // Auth state loading হলে spinner দেখাও
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center text-gray-600">
          Loading your session...
        </div>
      </div>
    );
  }

  
  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // backend থেকে user data না এলে লোডিং দেখাও
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center animate-pulse">
              <FiDroplet className="text-white text-3xl animate-bounce" />
            </div>
            <div className="absolute -inset-2 border-4 border-red-200 rounded-full animate-ping opacity-75"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // NavItem component same as before
  const NavItem = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center p-3 rounded-lg transition-all duration-300 transform hover:translate-x-1 ${
          isActive
            ? "bg-white/10 text-white border-l-4 border-white font-medium"
            : "text-white/80 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className={`mr-3 text-xl ${isActive ? "text-white" : "text-white/70"}`} />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <FiSearch className="text-xl" />
          </button>
          <button className="relative">
            <FiBell className="text-xl" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full border-2 border-red-700"></span>
          </button>
        </div>
      </header>

      {/* Search Bar (Mobile) */}
      {searchOpen && (
        <div className="md:hidden p-3 bg-white shadow-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`${mobileMenuOpen ? 'fixed inset-y-0 z-20' : 'hidden'} md:relative md:flex flex-col w-64 h-full bg-gradient-to-b from-red-700 to-red-800 text-white shadow-xl`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <FiDroplet className="text-2xl" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 flex items-center space-x-3 border-b border-white/10">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-red-700"></span>
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-white/70 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {user.role === "donor" && (
            <>
              <NavItem to="/dashboard" icon={FiHome}>Dashboard Home</NavItem>
              <NavItem to="/dashboard/profile" icon={FiUser}>My Profile</NavItem>
              <NavItem to="/dashboard/create-donation-request" icon={FiPlusCircle}>
                Create Request
              </NavItem>
              <NavItem to="/dashboard/my-donation-requests" icon={FiList}>
                My Donations Requests
              </NavItem>
            </>
          )}

          {user.role === "admin" && (
            <>
              <NavItem to="/dashboard/admin" icon={FiHome}>Admin Panel</NavItem>
              <NavItem to="/dashboard/admin/profile" icon={FiUser}>My Profile</NavItem>
              <NavItem to="/dashboard/admin/users" icon={FiUsers}>Users</NavItem>
              <NavItem to="/dashboard/admin/donation-requests" icon={FiDroplet}>
                Donations
              </NavItem>
              <NavItem to="/dashboard/admin/content-management" icon={FiFileText}>Content</NavItem>
            </>
          )}

          {user.role === "volunteer" && (
            <>
              <NavItem to="/dashboard" icon={FiHome}>Volunteer Hub</NavItem>
              <NavItem to="/dashboard/all-blood-donation-request" icon={FiClipboard}>
                Requests
              </NavItem>
              <NavItem to="/dashboard/content-management" icon={FiEdit2}>
                Content
              </NavItem>
              <NavItem to="/dashboard/profile" icon={FiUser}>
      My Profile
    </NavItem>
            </>
          )}
        </nav>

        {/* Back to Home Button */}
        <div className="p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <FiHome className="text-lg" />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-4 bg-white border-b">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <FiBell className="text-xl text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="text-gray-700 font-medium">{user.name}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
