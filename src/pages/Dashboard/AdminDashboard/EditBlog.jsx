import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://blood-donation-server-iota-flame.vercel.app/api/blogs/${id}`);
        const blog = response.data;
        setTitle(blog.title);
        setThumbnailUrl(blog.thumbnailUrl);
        setContent(blog.content);
        setLoading(false);
      } catch (err) {
        setError("Failed to load blog data");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://blood-donation-server-iota-flame.vercel.app/api/blogs/${id}`, {
        title,
        thumbnailUrl,
        content,
      });
      alert("Blog updated successfully!");
      navigate("/dashboard/admin/content-management");
    } catch (err) {
      console.error(err);
      setError("Failed to update blog");
    }
  };

  if (loading) return <p>Loading blog data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Thumbnail URL</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
