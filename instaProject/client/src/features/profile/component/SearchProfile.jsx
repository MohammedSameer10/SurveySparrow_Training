import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { searchUsers } from "../services/Profile";
import { followUser, unFollowUser } from "../services/Home"; // <-- use Home.js services
import axiosInstance from "../../../AxiosInstance";
import "../styles/SearchProfile.css";
import { useUser } from "../../../store/UserContext.jsx";

export default function SearchProfile() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState({}); // { [userId]: message }
  const { bumpFollowingCounts } = useUser();
  const searchCooldownRef = useRef(false);
  const followCooldownRef = useRef(new Set());
  const COOLDOWN_MS = 800;

  const handleSearch = async () => {
    if (searchCooldownRef.current) return;
    searchCooldownRef.current = true;
    setTimeout(() => (searchCooldownRef.current = false), COOLDOWN_MS);
    if (!query.trim()) return;
    try {
      const res = await searchUsers({
        searchTerm: query,
        limit: 100,
        page: 1,
      });
      setResults(res.users || []);
    } catch (err) {
      console.error("Error searching profile:", err);
    }
  };

  const handleFollow = async (userId) => {
    try {
      if (followCooldownRef.current.has(userId)) return;
      followCooldownRef.current.add(userId);
      setTimeout(() => followCooldownRef.current.delete(userId), COOLDOWN_MS);
      // optimistic update
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, isFollowing: true } : u)));
      setMessages((prev) => ({ ...prev, [userId]: "Followed" }));
      bumpFollowingCounts(0, 1);
      await followUser(userId);
    } catch (err) {
      console.error("Error following user:", err);
      // rollback on error
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, isFollowing: false } : u)));
      setMessages((prev) => ({ ...prev, [userId]: err?.message || "Failed to follow" }));
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      if (followCooldownRef.current.has(userId)) return;
      followCooldownRef.current.add(userId);
      setTimeout(() => followCooldownRef.current.delete(userId), COOLDOWN_MS);
      // optimistic update
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, isFollowing: false } : u)));
      setMessages((prev) => ({ ...prev, [userId]: "Unfollowed" }));
      bumpFollowingCounts(0, -1);
      await unFollowUser(userId);
    } catch (err) {
      console.error("Error unfollowing user:", err);
      // rollback on error
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, isFollowing: true } : u)));
      setMessages((prev) => ({ ...prev, [userId]: err?.message || "Failed to unfollow" }));
    }
  };

  // take backend base URL from axios instance
  const BASE_URL = axiosInstance.defaults.baseURL;

  return (
    <div className="search-profile-container">
      <div className="search-bar">
        <button onClick={handleSearch} className="search-btn">
          <Search />
        </button>
        <input
          type="text"
          placeholder="Search profile..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="results-list">
        {results.length === 0 ? (
          <p className="no-results">No results found</p>
        ) : (
          results.map((user) => (
            <div key={user.id} className="profile-card">
              <div className="profile-avatar">
                {user.image ? (
                  <img
                    src={`${BASE_URL}${user.image}`} // prepend base url
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
  <button
    className="follow-btn follow"
    onClick={() => handleFollow(user.id)}
  >
    Follow
  </button>
  <button
    className="follow-btn unfollow"
    onClick={() => handleUnfollow(user.id)}
  >
    Unfollow
  </button>
</div>

              {messages[user.id] && (
                <p className="inline-message">{messages[user.id]}</p>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}
