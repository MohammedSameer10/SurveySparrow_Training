import React, { useState } from "react";
import "./PostCard.css";

const PostCard = ({ post, onLike, onFollow }) => {
  const [feedback, setFeedback] = useState(""); // Feedback message

  const handleLike = () => {
    onLike(post.id);
    setFeedback("You liked this post ❤️");
    setTimeout(() => setFeedback(""), 1500); // hide after 1.5s
  };

  const handleFollow = () => {
    onFollow(post.userId);
    setFeedback("You followed this user 🎉");
    setTimeout(() => setFeedback(""), 1500); // hide after 1.5s
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        {post.profileImage && (
          <img
            src={`http://localhost:8080${post.profileImage}`}
            alt="profile"
            className="post-avatar"
          />
        )}
        <div className="post-user-info">
          <h4>{post.username || "Unknown User"}</h4>
          <span>
            {new Date(post.createdAt).toLocaleDateString()}{" "}
            {new Date(post.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <button
          className="follow-btn"
          onClick={handleFollow}
          disabled={post.followed}
        >
          {post.followed ? "Followed" : "Follow"}
        </button>
      </div>

      {/* Caption */}
      {post.caption && <p className="post-caption">{post.caption}</p>}

      {/* Image */}
      {post.imagePath && (
        <img
          src={`http://localhost:8080${post.imagePath}`}
          alt="post"
          className="post-image"
        />
      )}

      {/* Actions */}
      <div className="post-footer">
        <button
          onClick={!post.likedByCurrentUser ? handleLike : undefined}
          disabled={post.likedByCurrentUser}
          className={post.likedByCurrentUser ? "liked" : ""}
        >
          👍
        </button>
        <span>{post.likeCount || 0}</span>
      </div>

      {/* Feedback Message */}
      {feedback && <div className="post-feedback">{feedback}</div>}
    </div>
  );
};

export default PostCard;
