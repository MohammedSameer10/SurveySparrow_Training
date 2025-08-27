import React, { useState, useEffect } from "react";
import { updateUser } from "../services/UpdateUser";
import axiosInstance from "../../../AxiosInstance";
import "../styles/UpdateUser.css";
import { useDispatch } from "react-redux";
import { refreshUser } from "../../../store/userSlice";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    email: "",
    password: "",
    image: null,
  });

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/users/getCurrentUser");
        const user = res.data;
        setFormData({
          username: user.username || "",
          bio: user.bio || ` I am ${user.username}`,
          email: user.email || "",
          password: user.password || "", 
          image: null, 
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });

    try {
      await updateUser(submitData);
      setToast("✅ Profile updated successfully!");
      setTimeout(() => setToast(""), 2000);
      await dispatch(refreshUser()).unwrap();
    } catch (err) {
      console.error(err);
      setToast("❌ Validation failed . use Strong password (Example1) and correct email format(example@gmail.com) ");
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <div className="updateUserContainer">
      {toast && (
        <div style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          background: toast.startsWith("✅") ? "#16a34a" : "#dc2626",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 8,
          zIndex: 1000,
          fontWeight: 600
        }}>{toast}</div>
      )}
      <h2>Update Profile</h2>
      <form className="updateUserForm" onSubmit={handleSubmit}>
        <div className="formRow">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="formRow">
          <label>Bio</label>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="formRow">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="formRow">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        <div className="formRow">
          <label>Choose Image</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <button type="submit" className="submitBtn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
