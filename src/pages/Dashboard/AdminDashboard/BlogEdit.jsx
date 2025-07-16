import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://blood-donation-server-iota-flame.vercel.app/api/blogs/${id}`);
        const blog = response.data;
        setTitle(blog.title);
        setThumbnailUrl(blog.thumbnailUrl);
        setContent(blog.content);
      } catch (error) {
        alert("Failed to load blog data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and Content cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.patch(`https://blood-donation-server-iota-flame.vercel.app/api/blogs/${id}`, {
        title,
        thumbnailUrl,
        content,
      });
      alert("Blog updated successfully!");
      navigate("/dashboard/content-management");
    } catch (error) {
      alert("Failed to update blog. Try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading blog data...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Thumbnail Image URL (optional upload logic can be added here) */}
        <div>
          <label className="block mb-1 font-semibold">Thumbnail URL</label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail Preview"
              className="w-48 mt-2 rounded"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={{
              readonly: false,
              height: 400,
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-2 rounded text-white ${
            submitting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {submitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogEdit;
