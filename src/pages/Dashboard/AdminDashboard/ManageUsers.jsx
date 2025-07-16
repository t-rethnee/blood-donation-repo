import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { MoreVertical } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); 
  const usersPerPage = 10;

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://blood-donation-server-iota-flame.vercel.app/api/users${
          statusFilter !== "all" ? `?status=${statusFilter}` : ""
        }`
      );
      const userList = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://blood-donation-server-iota-flame.vercel.app/api/users/${id}/status`,
        { status: newStatus }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.patch(
        `https://blood-donation-server-iota-flame.vercel.app/api/users/${id}/role`,
        { role: newRole }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage All Users</h2>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
          className="border p-2 rounded-md"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-red-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead className="bg-red-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Avatar</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user) => {
                  const avatarSrc =
                    user.avatar && user.avatar.trim() !== ""
                      ? user.avatar
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=random`;

                  return (
                    <tr key={user._id} className="border-t">
                      <td className="p-3">
                        <img
                          src={avatarSrc}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3 capitalize">{user.status}</td>
                      <td className="p-3">
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-5 h-5" />
                          </MenuButton>
                          <MenuItems className="absolute right-0 z-10 mt-2 w-44 origin-top-right bg-white border rounded-md shadow-lg">
                            {user.status === "active" ? (
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(user._id, "blocked")
                                    }
                                    className={`${
                                      active ? "bg-red-100" : ""
                                    } w-full px-4 py-2 text-left`}
                                  >
                                    Block
                                  </button>
                                )}
                              </MenuItem>
                            ) : (
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(user._id, "active")
                                    }
                                    className={`${
                                      active ? "bg-green-100" : ""
                                    } w-full px-4 py-2 text-left`}
                                  >
                                    Unblock
                                  </button>
                                )}
                              </MenuItem>
                            )}

                            {user.role !== "volunteer" && (
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleRoleChange(user._id, "volunteer")
                                    }
                                    className={`${
                                      active ? "bg-blue-100" : ""
                                    } w-full px-4 py-2 text-left`}
                                  >
                                    Make Volunteer
                                  </button>
                                )}
                              </MenuItem>
                            )}

                            {user.role !== "admin" && (
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleRoleChange(user._id, "admin")
                                    }
                                    className={`${
                                      active ? "bg-purple-100" : ""
                                    } w-full px-4 py-2 text-left`}
                                  >
                                    Make Admin
                                  </button>
                                )}
                              </MenuItem>
                            )}
                          </MenuItems>
                        </Menu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-red-100 text-red-600 border"
              }`}
            >
              « Prev
            </button>

            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`transition-all duration-300 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                    isActive
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105 shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-red-100 text-red-600 border"
              }`}
            >
              Next »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
