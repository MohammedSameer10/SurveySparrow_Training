import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getFollowers,
  getFollowing,
  followUser,
  unFollowUser,
} from "../services/Home";
import "../styles/FollowPage.css";

const BASE_URL = "http://localhost:8080";

export default function FollowPage() {
  const location = useLocation();
  const { type } = location.state || {}; // "followers" or "following"

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        if (type === "followers") {
          data = await getFollowers();
          setUsers(
            data.map((f) => ({
              ...f.FollowerUser,
              isFollowing: true, // followers are already following you
            }))
          );
        } else {
          data = await getFollowing();
          setUsers(
            data.map((f) => ({
              ...f.FollowingUser,
              isFollowing: true, // you follow them
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching", err);
      }
    };
    fetchData();
  }, [type]);

  const handleFollow = async (id, username) => {
    try {
      await followUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isFollowing: true } : u))
      );
      setMessage(`✅ You followed ${username}`);
    } catch (err) {
      console.log(err);
      setMessage("❌ Failed to follow. Try again.", );
    }
  };

  const handleUnfollow = async (id, username) => {
    try {
      await unFollowUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isFollowing: false } : u))
      );
      setMessage(`🚫 You unfollowed ${username}`);
    } catch (err) {
       console.log(err);
      setMessage("❌ Failed to unfollow. Try again.");
    }
  };

  return (
    <div className="follow-page">
      <h2>{type === "followers" ? "Followers" : "Following"}</h2>

      {message && <div className="status-message">{message}</div>}

      {users.length === 0 ? (
        <p>No {type} found.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="profile-card">
            <div className="profile-avatar">
              {user.image ? (
                <img
                  src={`${BASE_URL}${user.image}`}
                  alt={user.username}
                  className="avatar-img"
                />
              ) : (
                <span className="avatar-placeholder">
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="profile-info">
              <p className="profile-username">{user.username}</p>
              <p className="profile-bio">{user.bio || "No bio available"}</p>
            </div>
            <div className="profile-action">
              {user.isFollowing ? (
                <button
                  className="action-btn unfollow"
                  onClick={() => handleUnfollow(user.id, user.username)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="action-btn follow"
                  onClick={() => handleFollow(user.id, user.username)}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
