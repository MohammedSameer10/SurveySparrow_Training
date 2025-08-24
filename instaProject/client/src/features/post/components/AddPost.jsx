import { useState } from "react";
import { addPost } from "../services/Post";  // ✅ import service
import "../styles/AddPost.css";

export default function AddPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption || !image) return;

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);

      await addPost(formData);  // ✅ use service instead of axios directly

      setCaption("");
      setImage(null);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  return (
    <div className="addpost-container">
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

      {showToast && (
        <div className="toast-success">✅ Your post has been added!</div>
      )}
    </div>
  );
}
