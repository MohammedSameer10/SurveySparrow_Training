// features/profile/component/UpdateUser.jsx
import React, { useState, useEffect } from "react";
import { updateUser } from "../services/UpdateUser";
import axiosInstance from "../../../AxiosInstance";
import "../styles/UpdateUser.css";

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    email: "",
    password: "",
    image: null,
  });

  // ✅ Prefill user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/users/getCurrentUser");
        const user = res.data;
        setFormData({
          username: user.username || "",
          bio: user.bio || "",
          email: user.email || "",
          password: "", // leave empty for security
          image: null, // don't prefill file
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

    // ✅ Debug: log FormData contents
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await updateUser(submitData);
      alert("Profile updated successfully!");
      console.log("Updated user:", res);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error updating profile");
    }
  };

  return (
    <div className="updateUserContainer">
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
