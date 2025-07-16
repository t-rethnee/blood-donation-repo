import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../provider/AuthProvider";

const VolunteerContentManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://blood-donation-server-iota-flame.vercel.app/api/blogs", {
        params: {
          status: statusFilter,
          page,
          limit,
        },
      });
      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-200 to-pink-200 rounded-full mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Blog Dashboard</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
          </div>
          <button
            onClick={() => navigate("/dashboard/volunteer/blogs/add-blog")}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center hover:scale-105 transform"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Blog
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Blogs</option>
                  <option value="draft">Drafts</option>
                  <option value="published">Published</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {blogs.length} of {totalPages * limit} blogs
              </span>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No blogs found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {statusFilter === "all"
                ? "There are no blogs available."
                : `There are no ${statusFilter} blogs.`}
            </p>
            <button
              onClick={() => navigate("/dashboard/volunteer/blogs/add-blog")}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md hover:shadow-md transition-all"
            >
              Create New Blog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-red-100"
              >
                {/* Blog Thumbnail */}
                <div className="relative h-48 overflow-hidden group">
                  {blog.thumbnailUrl ? (
                    <img
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No thumbnail</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{blog.content}</p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-start">
                      <button
                        onClick={() => navigate(`/dashboard/volunteer/blogs/edit-blog/${blog._id}`)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-full"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerContentManagement;
