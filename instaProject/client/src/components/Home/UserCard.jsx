import React from "react";
import "./UserCard.css";

const UserCard = ({ user, onFollow }) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <img
          src={user.profilePic || "https://via.placeholder.com/40"}
          alt={user.username}
          className="user-avatar"
        />
        <span className="user-name">{user.username}</span>
      </div>
      <button className="follow-btn" onClick={() => onFollow(user._id)}>
        Follow
      </button>
    </div>
  );
};

export default UserCard;
