import React, { useState } from "react";
import "./PostCard.css";
import { Heart } from "lucide-react";

const PostCard = ({ post, onLike, onUnlike, onFollow, onUnfollow, unfollowMode = false }) => {
  const [feedback, setFeedback] = useState(""); // Feedback message

  const handleLike = () => {
    onLike && onLike(post.id);
    setFeedback("You liked this post");
    setTimeout(() => setFeedback(""), 1500);
  };

  const handleHandleUnlike = () => {
    onUnlike && onUnlike(post.id);
    setFeedback("You removed your like");
    setTimeout(() => setFeedback(""), 1500);
  };

  const handleHandleFollow = () => {
    onFollow && onFollow(post.userId);
    setFeedback("You followed this user 🎉");
    setTimeout(() => setFeedback(""), 1500);
  };

  const handleHandleUnfollow = () => {
    onUnfollow && onUnfollow(post.userId);
    setFeedback("You unfollowed this user");
    setTimeout(() => setFeedback(""), 1500);
  };

  const showUnfollow = !!onUnfollow || unfollowMode;

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
            {new Date(post.createdAt).toLocaleDateString()} {" "}
            {new Date(post.createdAt).toLocaleTimeString()}
          </span>
        </div>
        {!post.isOwnPost && (
          showUnfollow ? (
            <button className="follow-btn" onClick={handleHandleUnfollow} disabled={!onUnfollow}>Unfollow</button>
          ) : (
            <button
              className="follow-btn"
              onClick={handleHandleFollow}
              disabled={!onFollow || post.followed}
            >
              {post.followed ? "Followed" : "Follow"}
            </button>
          )
        )}

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
        <div className="left-actions">
          <button
            onClick={post.likedByCurrentUser ? handleHandleUnlike : handleLike}
            className={post.likedByCurrentUser ? "liked" : ""}
            aria-label={post.likedByCurrentUser ? "Unlike" : "Like"}
          >
            <Heart fill={post.likedByCurrentUser ? "#e0245e" : "none"} color={post.likedByCurrentUser ? "#e0245e" : "currentColor"} />
          </button>
          <span>{post.likes ?? post.likeCount ?? 0}</span>
        </div>

        {post.isOwnPost && (
          <div className="right-actions">
            {/* Placeholders for edit/delete buttons from parent layout */}
          </div>
        )}
      </div>

      {/* Feedback Message */}
      {feedback && <div className="post-feedback">{feedback}</div>}
    </div>
  );
};

export default PostCard;
