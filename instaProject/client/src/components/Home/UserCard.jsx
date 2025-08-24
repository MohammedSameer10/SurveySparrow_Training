import React from "react";
import "./UserCard.css";

const UserCard = ({ user, onFollow }) => {
  return (
    <div className="user-card">
      <div>
        <h3>{user.username}</h3>
        <p>{user.email}</p>
      </div>
      {onFollow && (
        <button className="follow-btn" onClick={() => onFollow(user._id)}>
          Follow
        </button>
      )}
    </div>
  );
};

export default UserCard;
