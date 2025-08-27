import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPost } from "../services/Post";  // ✅ import service
import "../styles/AddPost.css";

export default function AddPost({ onSuccess }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !image) {
      setErrorToast("⚠️ Please enter a caption or choose an image.");
      setTimeout(() => setErrorToast(""), 2500);
      return;
    }

    try {
      const formData = new FormData();
      if (caption) formData.append("caption", caption);
      if (image) formData.append("image", image);

      const res = await addPost(formData);  // ✅ use service instead of axios directly

      setCaption("");
      setImage(null);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 2600);

      if (onSuccess) {
        onSuccess(res);
      }
      // Redirect to home and show the new post at top
      navigate('/home', {
        replace: true,
        state: {
          newPost: {
            id: res?.id,
            caption: res?.caption ?? caption ?? "",
            imagePath: res?.image ?? null,
            createdAt: new Date().toISOString()
          },
          toast: '✅ Your post has been added!'
        }
      });
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  return (
    <div className="addpost-container">
      {/* Top-centered toast area */}
      <div className="toast-container">
        {errorToast && (
          <div className="toast-error">{errorToast}</div>
        )}
        {showToast && (
          <div className="toast-success">✅ Your post has been added!</div>
        )}
      </div>

      <form className="addpost-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Add New Post</h2>
        <input
          type="text"
          placeholder="Enter caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="form-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="form-input"
        />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
