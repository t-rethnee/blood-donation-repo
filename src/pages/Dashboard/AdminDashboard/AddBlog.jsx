import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";

const IMAGEBB_API_KEY = import.meta.env.VITE_image_upload_key; // apnar ImageBB API key

const AddBlog = () => {
  const navigate = useNavigate();
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      await Swal.fire("Error", "Failed to upload image. Try again.", "error");
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      await Swal.fire("Warning", "Please enter a title.", "warning");
      return;
    }
    if (!thumbnailUrl) {
      await Swal.fire("Warning", "Please upload a thumbnail image.", "warning");
      return;
    }
    if (!content.trim()) {
      await Swal.fire("Warning", "Please enter blog content.", "warning");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post("https://blood-donation-server-iota-flame.vercel.app/api/blogs", {
        title,
        thumbnailUrl,
        content,
        status: "draft", 
      });

      await Swal.fire("Success", "Blog created successfully!", "success");
      navigate("/dashboard/admin/content-management");
    } catch (error) {
      await Swal.fire("Error", "Failed to create blog. Try again.", "error");
      console.error("Blog creation error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>
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

        {/* Thumbnail Image Upload */}
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

        {/* Blog Content (Rich Text Editor) */}
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
          disabled={uploading || submitting}
          className={`px-6 py-2 rounded text-white ${
            uploading || submitting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {submitting ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
