import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react";

const IMAGEBB_API_KEY = import.meta.env.VITE_image_upload_key; // ImageBB API key

const VolunteerAddBlog = () => {
  const navigate = useNavigate();
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Image upload handler
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`,
        formData
      );
      setThumbnailUrl(response.data.data.url);
    } catch (error) {
      alert("Failed to upload image. Try again.");
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!thumbnailUrl) {
      alert("Please upload a thumbnail image.");
      return;
    }
    if (!content.trim()) {
      alert("Please enter blog content.");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/blogs", {
        title,
        thumbnailUrl,
        content,
        status: "draft", // default to draft
        // optionally add a field to mark this blog as volunteer created, if backend supports
      });
      alert("Blog created successfully!");
      navigate("/dashboard/content-management");
    } catch (error) {
      alert("Failed to create blog. Try again.");
      console.error("Blog creation error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Blog (Volunteer)</h1>
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

        {/* Thumbnail Upload */}
        <div>
          <label className="block mb-1 font-semibold">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            disabled={uploading}
            className="mb-2"
          />
          {uploading && <p>Uploading image...</p>}
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail Preview"
              className="w-48 mt-2 rounded"
            />
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={{ readonly: false, height: 400 }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || submitting}
          className={`px-6 py-2 rounded text-white ${
            uploading || submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default VolunteerAddBlog;
