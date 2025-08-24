import { useState } from "react";
import { Search } from "lucide-react";
import { searchUsers } from "../services/Profile";
import { followUser, unFollowUser } from "../services/Home"; // <-- use Home.js services
import axiosInstance from "../../../AxiosInstance";
import "../styles/SearchProfile.css";

export default function SearchProfile() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
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
      await followUser(userId); // service call
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: true } : u
        )
      );
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
        console.log("handle follow called")
      await unFollowUser(userId); // service call
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: false } : u
        )
      );
    } catch (err) {
      console.error("Error unfollowing user:", err);
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

            </div>
          ))
        )}
      </div>
    </div>
  );
}
