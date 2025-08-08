import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
      document.title = 'RedAid | Blog Details';
    }, []);
  

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://blood-donation-server-iota-flame.vercel.app/api/blogs/${id}`);
        if (response.data.status !== "published") {
          setError("This article is currently unavailable");
        } else {
          setBlog(response.data);
        }
      } catch (err) {
        setError("We couldn't load this article");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading beautiful content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oh no!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/blogs" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
          >
            Explore More Articles
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating Back Button */}
      <div className="fixed top-6 left-6 z-10">
        <Link 
          to="/blogs" 
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
        >
          <svg className="w-6 h-6 text-gray-600 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </Link>
      </div>

      {/* Article Header */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center">
          {blog.categories && blog.categories.length > 0 && (
            <span className="inline-block px-3 py-1 text-sm font-semibold text-teal-600 bg-teal-100 rounded-full mb-4">
              {blog.categories[0]}
            </span>
          )}
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:leading-tight">
            {blog.title}
          </h1>
          <div className="mt-6 flex items-center justify-center space-x-4 text-gray-500">
            <time dateTime={new Date(blog.createdAt).toISOString()} className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {Math.ceil(blog.content.split(' ').length / 200)} min read
            </span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.thumbnailUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div 
          className="prose prose-lg max-w-none"
          style={{
            '--tw-prose-headings': 'var(--tw-color-gray-900)',
            '--tw-prose-body': 'var(--tw-color-gray-700)',
            '--tw-prose-links': 'var(--tw-color-teal-600)',
            '--tw-prose-bold': 'var(--tw-color-gray-900)',
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>

        {/* Article Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link 
              to="/blogs" 
              className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to all articles
            </Link>
            <div className="flex space-x-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-teal-100 transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-teal-100 transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;