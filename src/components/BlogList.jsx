import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");


  useEffect(() => {
      document.title = 'RedAid | Blog';
    }, []);
  
  useEffect(() => {
    const fetchPublishedBlogs = async () => {
      try {
        const response = await axios.get("https://blood-donation-server-iota-flame.vercel.app/api/blogs", {
          params: { status: "published" },
        });
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedBlogs();
  }, []);

  const categories = ["all", ...new Set(blogs.flatMap(blog => blog.categories || []))];

  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        (blog.categories && blog.categories.includes(selectedCategory));
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 bg-indigo-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Explore Our Blog
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover the latest articles and insights
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Cards */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
              >
                {blog.thumbnailUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                      <time dateTime={new Date(blog.createdAt).toISOString()}>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      {blog.categories && blog.categories.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{blog.categories[0]}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      <Link
                        to={`/blogs/${blog._id}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {blog.title}
                      </Link>
                    </h2>
                    <div
                      className="prose prose-sm text-gray-500 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 200) }}
                    />
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                      Read more
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>

                    {/* Social Share Buttons */}
                    <div className="flex gap-2 items-center">
                      <FacebookShareButton
                        url={`https://yourdomain.com/blogs/${blog._id}`}
                        quote={blog.title}
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={`https://yourdomain.com/blogs/${blog._id}`}
                        title={blog.title}
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <WhatsappShareButton
                        url={`https://yourdomain.com/blogs/${blog._id}`}
                        title={blog.title}
                        separator=":: "
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
